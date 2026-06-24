/**
 * Copies the VAD model/worklet and onnxruntime-web WASM/JS-bindings
 * files into public/vad/ so Next.js serves them as static assets at
 * a fixed, predictable path (/vad/...), bypassing webpack entirely.
 *
 * Why this is needed: MicVAD's default baseAssetPath/onnxWASMBasePath
 * point at a CDN, which normally works out of the box. In this
 * project, Next's bundler intercepts onnxruntime-web's internal
 * dynamic imports and resolves them to local chunk paths instead
 * (e.g. /_next/static/chunks/ort-wasm-simd-threaded.mjs), which don't
 * exist as real files. Self-hosting under /public sidesteps that.
 *
 * Run manually: node scripts/copy-vad-assets.js
 * Or wire into package.json: "postinstall": "node scripts/copy-vad-assets.js"
 */
const fs = require('fs');
const path = require('path');

const projectRoot = path.resolve(__dirname, '..');
const destDir = path.join(projectRoot, 'public', 'vad');

const vadWebDist = path.join(projectRoot, 'node_modules', '@ricky0123', 'vad-web', 'dist');
const onnxDist = path.join(projectRoot, 'node_modules', 'onnxruntime-web', 'dist');

fs.mkdirSync(destDir, { recursive: true });

function copyFile(srcPath, destDirPath) {
  const fileName = path.basename(srcPath);
  const destPath = path.join(destDirPath, fileName);
  fs.copyFileSync(srcPath, destPath);
  console.log(`  ✓ ${fileName}`);
}

function copyMatching(dir, predicate, destDirPath) {
  if (!fs.existsSync(dir)) {
    console.warn(`  ⚠ source dir not found, skipping: ${dir}`);
    return;
  }
  for (const fileName of fs.readdirSync(dir)) {
    if (predicate(fileName)) {
      copyFile(path.join(dir, fileName), destDirPath);
    }
  }
}

console.log('Copying VAD worklet + model files from @ricky0123/vad-web...');
copyMatching(
  vadWebDist,
  (name) => name === 'vad.worklet.bundle.min.js' || name.endsWith('.onnx'),
  destDir,
);

console.log('Copying onnxruntime-web WASM + JS bindings...');
copyMatching(
  onnxDist,
  (name) => name.endsWith('.wasm') || name.endsWith('.mjs'),
  destDir,
);

console.log(`Done. Assets are in ${path.relative(projectRoot, destDir)}/`);