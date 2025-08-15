const fs = require('fs');
const path = require('path');

function buildFor(browser) {
  const distPath = path.join('dist', browser);
  fs.rmSync(distPath, { recursive: true, force: true });
  fs.mkdirSync(distPath, { recursive: true });

  // Copy source files
  fs.cpSync('src', distPath, { recursive: true });

  // Copy correct manifest
  fs.copyFileSync(`manifest.${browser}.json`, path.join(distPath, 'manifest.json'));

  console.log(`Built for ${browser}`);
}

buildFor('chrome');
buildFor('firefox');
