import fs from 'fs';
import path from 'path';

function verify() {
  const metadataPath = path.resolve('dist/assets/dimpuru/metadata.json');
  if (!fs.existsSync(metadataPath)) {
    throw new Error('dist metadata.json missing');
  }

  const meta = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  console.log('Total frames:', meta.totalFrames);
  console.log('Frame resolution:', meta.frameWidth, 'x', meta.frameHeight);
  console.log('Aspect ratio:', meta.aspectRatio);
  console.log('Total pages:', meta.totalPages);

  if (meta.totalFrames !== 145) {
    throw new Error(`Expected 145 frames, got ${meta.totalFrames}`);
  }

  // Verify all page files exist
  for (const page of meta.pages) {
    const pagePath = path.resolve('dist', page.file);
    if (!fs.existsSync(pagePath)) {
      throw new Error(`Missing atlas page file: ${pagePath}`);
    }
    const stat = fs.statSync(pagePath);
    if (stat.size < 1000) {
      throw new Error(`Atlas page ${page.file} is too small: ${stat.size} bytes`);
    }
  }
  console.log('All 17 atlas page files verified on disk!');

  // Verify all 145 frames mapping
  for (let i = 0; i < 145; i++) {
    const f = meta.frames[i];
    if (!f) throw new Error(`Frame ${i} missing in metadata`);
    if (f.index !== i) throw new Error(`Frame index mismatch for ${i}`);
    if (f.width !== 1280 || f.height !== 720) {
      throw new Error(`Invalid frame dimensions for frame ${i}: ${f.width}x${f.height}`);
    }
    const page = meta.pages[f.pageIndex];
    if (!page) throw new Error(`Invalid pageIndex ${f.pageIndex} for frame ${i}`);
    if (f.x < 0 || f.x + f.width > meta.grid.pageWidth) {
      throw new Error(`Frame ${i} x coordinate out of bounds: ${f.x}`);
    }
    if (f.y < 0 || f.y + f.height > meta.grid.pageHeight) {
      throw new Error(`Frame ${i} y coordinate out of bounds: ${f.y}`);
    }
  }
  console.log('All 145 frames coordinate mappings validated with zero errors!');

  // Simulate cursor scrubbing & LERP
  let currentFrame = meta.idleFrame;
  console.log('Initial frame (idle):', currentFrame);
  
  const testNormX = [0.0, 0.25, 0.5, 0.75, 1.0, 0.5, 0.0];
  for (const normX of testNormX) {
    const target = normX * (meta.totalFrames - 1);
    // Simulate 5 ticks of LERP
    for (let t = 0; t < 5; t++) {
      currentFrame += (target - currentFrame) * 0.09;
    }
    const displayFrame = Math.round(currentFrame);
    const frameMeta = meta.frames[displayFrame];
    console.log(`normX: ${normX.toFixed(2)} -> target: ${target.toFixed(1)} -> lerp: ${currentFrame.toFixed(1)} -> frame: ${displayFrame} (page ${frameMeta.pageIndex}, x:${frameMeta.x}, y:${frameMeta.y})`);
  }

  console.log('\nVerification PASSED successfully!');
}

verify();
