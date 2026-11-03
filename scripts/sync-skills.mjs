#!/usr/bin/env node
// sync-skills.mjs — single source of truth for the engine runbooks.
//
// The canonical skill body for each engine lives at
//   plugins/<engine>-mcp/skills/<engine>-game-dev/SKILL.md
// That same file is what BOTH agent plugins ship: the Claude Code plugin
// (.claude-plugin/plugin.json) and the Codex plugin (.codex-plugin/plugin.json)
// each reference the plugin's own ./skills/ directory, so the plugin bundles never
// hold a second copy.
//
// This script materializes that canonical body into the repo-native Codex skills
// discovery path so a Codex user working inside a clone of this repo (or anyone who
// prefers the skills-only install over the marketplace) gets the runbook automatically:
//   .agents/skills/<engine>-game-dev/SKILL.md
//
// Modes:
//   node scripts/sync-skills.mjs            # write/refresh the .agents/skills copies
//   node scripts/sync-skills.mjs --check    # verify the copies are in sync; exit 1 on drift
//
// Both modes also check that every version (the 3 entries in .claude-plugin/marketplace.json,
// the 9 plugin.json manifests and gemini-extension.json) is the same, so a release bump can't
// miss a file.
//
// Dependency-free (Node 18+, ESM). Safe to run in CI as a drift guard.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

// One entry per engine skill. `canonical` is the source of truth; each `generated` path is a
// discovery copy that must stay byte-identical to it: `.agents/skills/` for Codex and the
// repo-root `skills/` for the Gemini CLI extension (gemini-extension.json lives at the root).
const ENGINES = ['unreal', 'unity', 'godot'];
const SKILLS = ENGINES.flatMap((engine) => {
  const canonical = join('plugins', `${engine}-mcp`, 'skills', `${engine}-game-dev`, 'SKILL.md');
  return ['.agents/skills', 'skills'].map((root) => ({
    engine,
    canonical,
    generated: join(root, `${engine}-game-dev`, 'SKILL.md'),
  }));
});

const checkMode = process.argv.includes('--check');

function read(relPath) {
  return readFileSync(join(repoRoot, relPath), 'utf8');
}

let drift = 0;
let wrote = 0;

for (const { engine, canonical, generated } of SKILLS) {
  const canonicalAbs = join(repoRoot, canonical);
  if (!existsSync(canonicalAbs)) {
    console.error(`[sync-skills] MISSING canonical source for ${engine}: ${canonical}`);
    drift++;
    continue;
  }
  const source = read(canonical);
  const generatedAbs = join(repoRoot, generated);
  const current = existsSync(generatedAbs) ? read(generated) : null;

  if (checkMode) {
    if (current === null) {
      console.error(`[sync-skills] DRIFT (${engine}): ${generated} is missing.`);
      drift++;
    } else if (current !== source) {
      console.error(`[sync-skills] DRIFT (${engine}): ${generated} differs from ${canonical}.`);
      drift++;
    } else {
      console.log(`[sync-skills] ok    (${engine}): ${generated} in sync.`);
    }
  } else {
    if (current === source) {
      console.log(`[sync-skills] ok    (${engine}): ${generated} already in sync.`);
    } else {
      mkdirSync(dirname(generatedAbs), { recursive: true });
      writeFileSync(generatedAbs, source);
      console.log(`[sync-skills] wrote (${engine}): ${generated}`);
      wrote++;
    }
  }
}

// Plugin versions: one release version shared by every manifest and catalog entry.
const versions = new Map();
const marketplace = JSON.parse(read(join('.claude-plugin', 'marketplace.json'))); // throws (exit 1) if missing
for (const p of marketplace.plugins) versions.set(`.claude-plugin/marketplace.json (${p.name})`, p.version);
for (const engine of ENGINES) {
  for (const dir of ['.claude-plugin', '.codex-plugin', '.cursor-plugin']) {
    const rel = join('plugins', `${engine}-mcp`, dir, 'plugin.json');
    versions.set(rel, JSON.parse(read(rel)).version);
  }
}
versions.set('gemini-extension.json', JSON.parse(read('gemini-extension.json')).version);
const distinct = new Set(versions.values());
if (distinct.size !== 1 || typeof [...distinct][0] !== 'string') {
  console.error('[sync-skills] VERSION MISMATCH: every plugin needs the same "version" string:');
  for (const [file, version] of versions) console.error(`  ${version}  ${file}`);
  drift++;
} else {
  console.log(`[sync-skills] ok    plugin version ${[...versions.values()][0]} in ${versions.size} places.`);
}

if (checkMode) {
  if (drift > 0) {
    console.error(
      `\n[sync-skills] ${drift} problem(s) found. ` +
        `Run \`node scripts/sync-skills.mjs\` to regenerate, then commit.`
    );
    process.exit(1);
  }
  console.log('\n[sync-skills] all skills in sync.');
} else {
  console.log(`\n[sync-skills] done. ${wrote} file(s) written.`);
  if (drift > 0) process.exit(1);
}
