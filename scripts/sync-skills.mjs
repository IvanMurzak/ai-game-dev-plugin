#!/usr/bin/env node
// sync-skills.mjs — single source of truth for the engine runbooks.
//
// The canonical skill body for each engine lives at
//   plugins/<engine>/skills/<engine>-game-dev/SKILL.md
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
// Dependency-free (Node 18+, ESM). Safe to run in CI as a drift guard.

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(__dirname, '..');

// One entry per engine skill. `canonical` is the source of truth; `generated` is the
// repo-native Codex discovery copy that must stay byte-identical to it.
const ENGINES = ['unreal', 'unity', 'godot'];
const SKILLS = ENGINES.map((engine) => ({
  engine,
  canonical: join('plugins', engine, 'skills', `${engine}-game-dev`, 'SKILL.md'),
  generated: join('.agents', 'skills', `${engine}-game-dev`, 'SKILL.md'),
}));

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

if (checkMode) {
  if (drift > 0) {
    console.error(
      `\n[sync-skills] ${drift} skill(s) out of sync. ` +
        `Run \`node scripts/sync-skills.mjs\` to regenerate, then commit.`
    );
    process.exit(1);
  }
  console.log('\n[sync-skills] all skills in sync.');
} else {
  console.log(`\n[sync-skills] done. ${wrote} file(s) written.`);
}
