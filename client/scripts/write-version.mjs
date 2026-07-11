import { execSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const rootDir = resolve(scriptDir, "..");
const publicDir = resolve(rootDir, "public");
const versionFile = resolve(publicDir, "version.json");

let version = process.env.BUILD_VERSION;

if (!version) {
  try {
    version = execSync("git rev-parse --short HEAD", {
      cwd: rootDir,
      encoding: "utf8",
    }).trim();
  } catch {
    version = `local-${Date.now()}`;
  }
}

mkdirSync(publicDir, { recursive: true });
writeFileSync(versionFile, JSON.stringify({ version }, null, 2));
