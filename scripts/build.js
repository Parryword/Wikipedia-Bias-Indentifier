const fs = require('fs');
const path = require('path');
const esbuild = require('esbuild');

const staticFiles = ['popup.html', 'icons', 'styles']; // adjust as needed

async function buildFor(browser) {
  const distPath = path.join('dist', browser);
  fs.rmSync(distPath, { recursive: true, force: true });
  fs.mkdirSync(distPath, { recursive: true });

  // Bundle content script
  await esbuild.build({
    entryPoints: ['src/content/contentScript.js'],
    bundle: true,
    outfile: path.join(distPath, 'content/contentScript.js'),
    format: 'iife',
    minify: false,
    sourcemap: true
  });

  // Bundle background script
  await esbuild.build({
    entryPoints: ['src/background/background.js'],
    bundle: true,
    outfile: path.join(distPath, 'background/background.js'),
    format: 'iife',
    minify: false,
    sourcemap: true
  });

  // Bundle popup script
  await esbuild.build({
    entryPoints: ['src/popup/popup.js'],
    bundle: true,
    outfile: path.join(distPath, 'popup/popup.js'),
    format: 'iife',
    minify: false,
    sourcemap: true
  });

  // Copy static assets
  staticFiles.forEach(file => {
    const srcPath = path.join('src', file);
    const destPath = path.join(distPath, file);
    if (fs.existsSync(srcPath)) {
      const stat = fs.statSync(srcPath);
      if (stat.isDirectory()) {
        fs.cpSync(srcPath, destPath, { recursive: true });
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  });

  // Copy correct manifest
  fs.copyFileSync(`manifest.${browser}.json`, path.join(distPath, 'manifest.json'));

  console.log(`Built for ${browser}`);
}

(async () => {
  await buildFor('chrome');
  await buildFor('firefox');
})();
