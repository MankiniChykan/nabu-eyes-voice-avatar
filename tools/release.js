// tools/release.js
// npm run release -- 0.0.3
import { execSync } from "node:child_process";
import fs from "node:fs";

const inputVersion = process.argv[2];
if (!inputVersion) {
  console.error("❌  Provide a version: npm run release -- x.y.z");
  process.exit(1);
}

const normalizedVersion = inputVersion.startsWith("v")
  ? inputVersion.slice(1)
  : inputVersion;
if (!normalizedVersion) {
  console.error("❌  Invalid version supplied");
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const current = pkg.version?.trim();

if (current !== normalizedVersion) {
  try {
    execSync(`npm version ${normalizedVersion} --no-git-tag-version`, {
      stdio: "inherit",
    });
  } catch (e) {
    console.error("❌  npm version failed:", e.message || e);
    process.exit(1);
  }
} else {
  console.log("ℹ️  package.json already at target version, skipping bump");
}

// Advance CHANGELOG (create section if missing) and re-seed Unreleased
execSync(
  `node ./tools/update-changelog.js --version ${normalizedVersion} --write`,
  { stdio: "inherit" },
);

// Sanity checks for HACS/release assets (built earlier by your build step)
const assets = [
  "dist/nabu-eyes-dashboard-card.js",
  "dist/nabu-eyes-dashboard-card.js.gz",
];
for (const a of assets) {
  if (!fs.existsSync(a)) {
    console.error(`❌  Missing required asset: ${a}`);
    process.exit(1);
  }
}

const tagVersion = inputVersion.startsWith("v")
  ? inputVersion
  : `v${normalizedVersion}`;
console.log(tagVersion);
console.log(`✅  Release version set to ${normalizedVersion}`);
