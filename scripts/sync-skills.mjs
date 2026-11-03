#!/usr/bin/env node
// sync-skills.mjs: keeps every copy in this repo in line with its one source.
//
// - The canonical runbook plugins/<engine>-mcp/skills/<engine>-game-dev/SKILL.md is copied to
//   .agents/skills/ (Codex repo-native skills) and skills/ (the Gemini CLI extension at the root).
// - The root assets/logo.png is copied into each plugin (Cursor needs a logo inside the plugin).
// - Every "version" (catalog entries, plugin manifests, gemini-extension.json) must be the same,
//   and each plugin's root plugin.json (Agent Plugins standard) mirrors its Cursor manifest.
//
//   node scripts/sync-skills.mjs            # write the copies
//   node scripts/sync-skills.mjs --check    # verify only; exit 1 on drift or a version mismatch
//
// Dependency-free (Node 18+, ESM).

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ENGINES = ['unreal', 'unity', 'godot'];
const PLUGIN_MANIFESTS = ['.claude-plugin', '.codex-plugin', '.cursor-plugin', '']; // '' = root plugin.json

// source -> generated copies (byte-identical)
const COPIES = [
  ...ENGINES.map((engine) => ({
    source: join('plugins', `${engine}-mcp`, 'skills', `${engine}-game-dev`, 'SKILL.md'),
    targets: ['.agents/skills', 'skills'].map((root) => join(root, `${engine}-game-dev`, 'SKILL.md')),
  })),
  {
    source: join('assets', 'logo.png'),
    targets: ENGINES.map((engine) => join('plugins', `${engine}-mcp`, 'assets', 'logo.png')),
  },
];

const checkMode = process.argv.includes('--check');
const abs = (rel) => join(repoRoot, rel);
const readJson = (rel) => JSON.parse(readFileSync(abs(rel), 'utf8')); // throws (exit 1) if missing

let problems = 0;
let wrote = 0;

for (const { source, targets } of COPIES) {
  if (!existsSync(abs(source))) {
    console.error(`[sync-skills] MISSING source: ${source}`);
    problems++;
    continue;
  }
  const body = readFileSync(abs(source));
  for (const target of targets) {
    const current = existsSync(abs(target)) ? readFileSync(abs(target)) : null;
    if (current && current.equals(body)) {
      console.log(`[sync-skills] ok    ${target}`);
    } else if (checkMode) {
      console.error(`[sync-skills] DRIFT ${target} ${current ? 'differs from' : 'is missing, source'} ${source}`);
      problems++;
    } else {
      mkdirSync(dirname(abs(target)), { recursive: true });
      writeFileSync(abs(target), body);
      console.log(`[sync-skills] wrote ${target}`);
      wrote++;
    }
  }
}

const versions = new Map();
for (const p of readJson('.claude-plugin/marketplace.json').plugins) {
  versions.set(`.claude-plugin/marketplace.json (${p.name})`, p.version);
}
const SHARED_FIELDS = ['name', 'description', 'author', 'homepage', 'repository', 'license', 'keywords'];
for (const engine of ENGINES) {
  const manifests = {};
  for (const dir of PLUGIN_MANIFESTS) {
    const rel = join('plugins', `${engine}-mcp`, dir, 'plugin.json');
    manifests[dir] = readJson(rel);
    versions.set(rel, manifests[dir].version);
  }
  // The Agent Plugins open-standard manifest (root plugin.json) mirrors the Cursor one.
  for (const field of SHARED_FIELDS) {
    const a = JSON.stringify(manifests['.cursor-plugin'][field]);
    const b = JSON.stringify(manifests[''][field]);
    if (a !== b) {
      console.error(`[sync-skills] FIELD MISMATCH ${engine}-mcp "${field}": plugin.json vs .cursor-plugin/plugin.json`);
      problems++;
    }
  }
}
versions.set('gemini-extension.json', readJson('gemini-extension.json').version);

const distinct = new Set(versions.values());
const [version] = distinct;
if (distinct.size !== 1 || typeof version !== 'string') {
  console.error('[sync-skills] VERSION MISMATCH: every manifest needs the same "version" string:');
  for (const [file, v] of versions) console.error(`  ${v}  ${file}`);
  problems++;
} else {
  console.log(`[sync-skills] ok    version ${version} in ${versions.size} places`);
}

if (problems > 0) {
  console.error(
    `\n[sync-skills] ${problems} problem(s). Run \`node scripts/sync-skills.mjs\` for copies; ` +
      'fix version and field mismatches by hand.'
  );
  process.exit(1);
}
console.log(checkMode ? '\n[sync-skills] all in sync.' : `\n[sync-skills] done. ${wrote} file(s) written.`);
