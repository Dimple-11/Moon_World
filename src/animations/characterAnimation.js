/**
 * characterAnimation.js
 * High-performance, production-ready Canvas Sprite Atlas Animator.
 * Supports paginated atlas lookup, 60/120fps LERP interpolation,
 * DPR-aware Retina rendering, smooth idle return, and robust caching.
 */

export class CharacterAnimator {
  constructor({
    canvas,
    metadataUrl = '/assets/dimpuru/metadata.json',
    lerpFactor = 0.09,
    idleFrame = 0,
    onProgress,
    onReady,
    onError,
    onFrameChange
  }) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: true });
    this.metadataUrl = metadataUrl;
    this.lerpFactor = lerpFactor;
    this.idleFrame = idleFrame;
    this.onProgress = onProgress;
    this.onReady = onReady;
    this.onError = onError;
    this.onFrameChange = onFrameChange;

    this.metadata = null;
    this.pages = new Map(); // pageIndex -> HTMLImageElement
    this.pageLoadingPromises = new Map();

    this.currentFrame = idleFrame;
    this.targetFrame = idleFrame;
    this.lastRenderedFrame = -1;
    this.isHovered = false;
    this.isDestroyed = false;
    this.isInitialReady = false;
    this.isAllLoaded = false;
    this.rafId = null;
    this.idlePreloadHandle = null;
    this.nextPageToLoad = 0;

    // Check prefers-reduced-motion
    this.prefersReducedMotion = false;
    if (typeof window !== 'undefined' && window.matchMedia) {
      this.prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    this.handleResize = this.handleResize.bind(this);
    this.tick = this.tick.bind(this);
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
  }

  async init() {
    try {
      // 1. Fetch metadata
      const res = await fetch(this.metadataUrl);
      if (!res.ok) {
        throw new Error(`Failed to load animation metadata: ${res.statusText}`);
      }
      this.metadata = await res.json();

      if (this.metadata.idleFrame !== undefined) {
        this.idleFrame = this.metadata.idleFrame;
      }
      this.currentFrame = this.idleFrame;
      this.targetFrame = this.idleFrame;

      // 2. Preload the initial page containing idleFrame
      const idleFrameMeta = this.metadata.frames[this.idleFrame] || this.metadata.frames[0];
      const initialPageIndex = idleFrameMeta ? idleFrameMeta.pageIndex : 0;

      await this.loadPage(initialPageIndex);

      this.isInitialReady = true;
      this.handleResize();
      this.renderFrame(this.idleFrame);

      if (this.onReady) {
        this.onReady(this.metadata);
      }

      // 3. Start animation loop
      this.startLoop();

      // 4. Preload remaining pages only when the browser is idle and the tab is visible
      this.startIdlePreload();

      // 5. Window resize listener
      window.addEventListener('resize', this.handleResize);
    } catch (err) {
      console.error('CharacterAnimator init error:', err);
      if (this.onError) {
        this.onError(err);
      }
    }
  }

  loadPage(pageIndex) {
    if (this.pages.has(pageIndex)) {
      return Promise.resolve(this.pages.get(pageIndex));
    }
    if (this.pageLoadingPromises.has(pageIndex)) {
      return this.pageLoadingPromises.get(pageIndex);
    }

    const pageMeta = this.metadata.pages[pageIndex];
    if (!pageMeta) {
      return Promise.reject(new Error(`Page metadata not found for index ${pageIndex}`));
    }

    // Ensure leading slash if relative
    let fileUrl = pageMeta.file;
    if (!fileUrl.startsWith('http') && !fileUrl.startsWith('/')) {
      fileUrl = '/' + fileUrl;
    }

    const promise = new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = async () => {
        // Attempt decode if supported for stutter-free paint
        if ('decode' in img) {
          try {
            await img.decode();
          } catch {
            // Ignore decode error fallback
          }
        }
        this.pages.set(pageIndex, img);
        this.pageLoadingPromises.delete(pageIndex);
        resolve(img);
      };
      img.onerror = (e) => {
        this.pageLoadingPromises.delete(pageIndex);
        reject(new Error(`Failed to load atlas page ${fileUrl}`));
      };
      img.src = fileUrl;
    });

    this.pageLoadingPromises.set(pageIndex, promise);
    return promise;
  }

  /**
   * Start loading the remaining atlas pages only when the browser is idle.
   * Loading pauses automatically while the tab is hidden.
   */
  startIdlePreload() {
    if (!this.metadata || !this.metadata.pages) return;
    this.nextPageToLoad = Math.max(this.nextPageToLoad, 0);
    if (typeof document !== 'undefined') {
      document.addEventListener('visibilitychange', this.handleVisibilityChange);
    }
    this.handleVisibilityChange();
  }

  handleVisibilityChange() {
    if (typeof document !== 'undefined' && document.hidden) {
      if (this.idlePreloadHandle !== null) {
        if (typeof window.cancelIdleCallback === 'function') {
          window.cancelIdleCallback(this.idlePreloadHandle);
        } else {
          clearTimeout(this.idlePreloadHandle);
        }
        this.idlePreloadHandle = null;
      }
      return;
    }
    this.queueNextPage();
  }

  queueNextPage() {
    if (this.isDestroyed || this.isAllLoaded || this.idlePreloadHandle !== null) return;
    if (!this.metadata || !this.metadata.pages) return;
    if (typeof document !== 'undefined' && document.hidden) return;

    const totalPages = this.metadata.pages.length;
    while (this.pages.has(this.nextPageToLoad) && this.nextPageToLoad < totalPages) {
      this.nextPageToLoad++;
    }

    if (this.nextPageToLoad >= totalPages) {
      this.isAllLoaded = true;
      return;
    }

    const run = async () => {
      this.idlePreloadHandle = null;
      if (this.isDestroyed || document.hidden) return;

      const pageIndex = this.nextPageToLoad++;
      try {
        await this.loadPage(pageIndex);
        if (this.onProgress) {
          this.onProgress(this.pages.size / totalPages);
        }
      } catch (err) {
        console.warn(`Error loading atlas page ${pageIndex}:`, err);
      }
      this.queueNextPage();
    };

    if (typeof window.requestIdleCallback === 'function') {
      this.idlePreloadHandle = window.requestIdleCallback(run, { timeout: 2500 });
    } else {
      this.idlePreloadHandle = setTimeout(run, 280);
    }
  }

  handleResize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const targetW = Math.round(rect.width * dpr);
    const targetH = Math.round(rect.height * dpr);

    if (this.canvas.width !== targetW || this.canvas.height !== targetH) {
      this.canvas.width = targetW;
      this.canvas.height = targetH;
    }

    // Force redraw current frame on resize
    this.renderFrame(Math.round(this.currentFrame), true);
  }

  /**
   * Update normalized cursor position: 0.0 (left) to 1.0 (right)
   */
  setNormalizedCursor(normX) {
    if (!this.metadata || this.prefersReducedMotion) return;
    const clamped = Math.max(0, Math.min(1, normX));
    this.isHovered = true;
    this.targetFrame = clamped * (this.metadata.totalFrames - 1);
  }

  setHover(isHovered) {
    this.isHovered = isHovered;
    if (!isHovered) {
      // Smoothly return to idle frame
      this.targetFrame = this.idleFrame;
    }
  }

  startLoop() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.tick();
  }

  tick() {
    if (this.isDestroyed) return;

    // Skip painting while the tab is hidden to save battery/CPU
    if (typeof document !== 'undefined' && document.hidden) {
      this.rafId = requestAnimationFrame(this.tick);
      return;
    }

    // LERP calculation: smooth easing towards targetFrame
    const diff = this.targetFrame - this.currentFrame;

    if (Math.abs(diff) > 0.005) {
      this.currentFrame += diff * this.lerpFactor;
    } else {
      this.currentFrame = this.targetFrame;
    }

    const frameToRender = Math.max(
      0,
      Math.min(this.metadata.totalFrames - 1, Math.round(this.currentFrame))
    );

    if (frameToRender !== this.lastRenderedFrame) {
      this.renderFrame(frameToRender);
      if (this.onFrameChange) {
        this.onFrameChange(frameToRender);
      }
    }

    this.rafId = requestAnimationFrame(this.tick);
  }

  renderFrame(frameIndex, force = false) {
    if (!this.ctx || !this.metadata || (!force && frameIndex === this.lastRenderedFrame)) {
      return;
    }

    const frameMeta = this.metadata.frames[frameIndex];
    if (!frameMeta) return;

    const pageImg = this.pages.get(frameMeta.pageIndex);

    // If target page hasn't loaded yet, try to retain last rendered or find nearest loaded
    if (!pageImg) {
      // Background page is still loading; ensure page is requested
      this.loadPage(frameMeta.pageIndex);
      return;
    }

    const { x, y, width: fw, height: fh } = frameMeta;
    const cw = this.canvas.width;
    const ch = this.canvas.height;

    // High quality smoothing
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';

    // Calculate aspect-ratio fit to preserve 16:9 composition without distortion
    const frameAspect = fw / fh;
    const canvasAspect = cw / ch;

    let drawW, drawH, drawX, drawY;

    if (canvasAspect > frameAspect) {
      // Canvas is wider than 16:9 -> fit height, center horizontally
      drawH = ch;
      drawW = ch * frameAspect;
      drawX = (cw - drawW) / 2;
      drawY = 0;
    } else {
      // Canvas is taller or equal -> fit width, center vertically
      drawW = cw;
      drawH = cw / frameAspect;
      drawX = 0;
      drawY = (ch - drawH) / 2;
    }

    // Clear canvas before drawing
    this.ctx.clearRect(0, 0, cw, ch);

    // Fill background with exact matching video pure/off-white tone for seamless blending
    this.ctx.fillStyle = '#fafafa';
    this.ctx.fillRect(0, 0, cw, ch);

    // Draw sprite slice
    this.ctx.drawImage(pageImg, x, y, fw, fh, drawX, drawY, drawW, drawH);

    this.lastRenderedFrame = frameIndex;
  }

  destroy() {
    this.isDestroyed = true;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    if (this.idlePreloadHandle !== null) {
      if (typeof window.cancelIdleCallback === 'function') {
        window.cancelIdleCallback(this.idlePreloadHandle);
      } else {
        clearTimeout(this.idlePreloadHandle);
      }
      this.idlePreloadHandle = null;
    }
    if (typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.handleVisibilityChange);
    }
    window.removeEventListener('resize', this.handleResize);
    this.pages.clear();
    this.pageLoadingPromises.clear();
  }
}
