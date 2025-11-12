# overwrite tools/release.js
cat > tools/release.js <<'EOF'
#!/usr/bin/env node
// tools/release.js
// Usage: npm run release -- <version>

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const input = process.argv[2];
if (!input) {
  console.error('❌  Provide a version: npm run release -- x.y.z');
  process.exit(1);
}
const version = input.replace(/^v/, '');

function sh(cmd) {
  console.log('$', cmd);
  execSync(cmd, { stdio: 'inherit' });
}

// bump package.json if needed
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
if ((pkg.version || '').trim() !== version) {
  sh(`npm version ${version} --no-git-tag-version`);
} else {
  console.log('ℹ️  package.json already at target version, skipping bump');
}

// verify build artifacts
const distDir = path.resolve('dist');
const js = path.join(distDir, 'nabu-eyes-dashboard-card.js');
const gz = `${js}.gz`;
if (!fs.existsSync(js) || !fs.existsSync(gz)) {
  console.error('❌  Build output not found. Run "npm run build" first.');
  process.exit(1);
}

// include dist in the release commit (useful for HACS consumers)
try { sh(`git add -f ${js} ${gz}`); } catch {}
try { sh(`git commit -m "build: release ${version}"`); } catch { console.log('ℹ️  Nothing to commit.'); }

// tag + push
try { sh(`git tag -f v${version} -m "v${version}"`); } catch {}
sh('git push --follow-tags');
EOF

chmod +x tools/release.js
git add tools/release.js
git commit -m "fix(release): valid shebang, dedup imports, remove undefined vars"
