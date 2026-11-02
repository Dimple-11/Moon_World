import React, { useEffect, useRef, useState, useCallback } from 'react';
import { CharacterAnimator } from '../animations/characterAnimation';

export default function InteractiveCharacter({
  className = '',
  onFrameUpdate,
  containerRef,
  idleFrame = 0
}) {
  const canvasRef = useRef(null);
  const wrapperRef = useRef(null);
  const animatorRef = useRef(null);
  const [isReady, setIsReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);

  // Defer the (heavy) atlas download until the character is near the viewport.
  // The poster below stays visible in the meantime so there is never an empty gap.
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Initialize Animator once the character is close to the viewport
  useEffect(() => {
    if (!shouldLoad || !canvasRef.current) return;

    const animator = new CharacterAnimator({
      canvas: canvasRef.current,
      metadataUrl: '/assets/dimpuru/metadata.json',
      lerpFactor: 0.085, // Silky smooth response without abrupt jump
      idleFrame,
      onReady: () => {
        setIsReady(true);
      },
      onError: (err) => {
        console.error('Character loading error:', err);
        setHasError(true);
      },
      onFrameChange: (f) => {
        if (onFrameUpdate) {
          onFrameUpdate(f);
        }
      }
    });

    animatorRef.current = animator;
    animator.init();

    return () => {
      animator.destroy();
      animatorRef.current = null;
    };
  }, [shouldLoad, idleFrame, onFrameUpdate]);

  // Handle pointer tracking relative to containerRef (full hero) or wrapper
  const handlePointerMove = useCallback((e) => {
    if (!animatorRef.current) return;

    const targetElement = containerRef?.current || canvasRef.current?.parentElement;
    if (!targetElement) return;

    const rect = targetElement.getBoundingClientRect();
    if (rect.width <= 0) return;

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const normalizedX = (clientX - rect.left) / rect.width;

    animatorRef.current.setNormalizedCursor(normalizedX);
  }, [containerRef]);

  const handlePointerLeave = useCallback(() => {
    if (!animatorRef.current) return;
    animatorRef.current.setHover(false);
  }, []);

  const handlePointerEnter = useCallback(() => {
    if (!animatorRef.current) return;
    animatorRef.current.setHover(true);
  }, []);

  // Attach listeners to containerRef
  useEffect(() => {
    const targetElement = containerRef?.current;
    if (!targetElement) return;

    targetElement.addEventListener('mousemove', handlePointerMove, { passive: true });
    targetElement.addEventListener('mouseenter', handlePointerEnter);
    targetElement.addEventListener('mouseleave', handlePointerLeave);

    // Touch support for mobile dragging/scrubbing
    targetElement.addEventListener('touchmove', handlePointerMove, { passive: true });
    targetElement.addEventListener('touchend', handlePointerLeave);

    return () => {
      targetElement.removeEventListener('mousemove', handlePointerMove);
      targetElement.removeEventListener('mouseenter', handlePointerEnter);
      targetElement.removeEventListener('mouseleave', handlePointerLeave);
      targetElement.removeEventListener('touchmove', handlePointerMove);
      targetElement.removeEventListener('touchend', handlePointerLeave);
    };
  }, [containerRef, handlePointerMove, handlePointerEnter, handlePointerLeave]);

  return (
    <div
      ref={wrapperRef}
      className={`interactive-character-wrapper ${className}`}
      onMouseMove={!containerRef ? handlePointerMove : undefined}
      onMouseEnter={!containerRef ? handlePointerEnter : undefined}
      onMouseLeave={!containerRef ? handlePointerLeave : undefined}
      onTouchMove={!containerRef ? handlePointerMove : undefined}
      onTouchEnd={!containerRef ? handlePointerLeave : undefined}
    >
      {/* Full-bleed responsive Canvas */}
      <canvas
        ref={canvasRef}
        className={`character-canvas ${isReady ? 'is-visible' : 'is-hidden'}`}
        aria-label="Interactive character Dimpuru"
        role="img"
      />

      {/* Seamless instant poster fallback while initial atlas decodes */}
      {!isReady && !hasError && (
        <div className="character-poster-skeleton">
          <img
            src="/assets/dimpuru/poster.webp"
            alt="Dimpuru character"
            className="character-poster-img"
            decoding="async"
          />
        </div>
      )}

      {/* Error fallback */}
      {hasError && (
        <div className="character-error-fallback">
          <img
            src="/assets/dimpuru/poster.webp"
            alt="Dimpuru character static view"
            className="character-poster-img"
          />
        </div>
      )}
    </div>
  );
}
