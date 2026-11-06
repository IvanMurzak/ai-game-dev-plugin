#!/usr/bin/env node
// build-openai-zip.mjs: validates plugins/ai-game-dev/ against the OpenAI plugin-directory rules
// and packs it into dist/ai-game-dev-openai-<version>.zip (plugin.json at the ZIP root), ready to
// upload in the OpenAI Plugins dashboard.
//
//   node scripts/build-openai-zip.mjs --check                   # validate only, write nothing
//   node scripts/build-openai-zip.mjs --demo-url <https URL>    # validate and build the ZIP
//
// The repo keeps a placeholder in review.demo_recording_url until the demo is recorded. The build
// refuses to run while the packaged value is not an HTTPS URL; --demo-url writes the URL into the
// packaged copy of plugin.json only (the repo file is left as is).
//
// Limits follow https://developers.openai.com/apps-sdk/deploy/submission. Dependency-free (Node 18+, ESM).

import { readFileSync, writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { deflateRawSync } from 'node:zlib';

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const pluginRoot = join(repoRoot, 'plugins', 'ai-game-dev');
const PLUGIN_SCHEMA = 'https://agent-plugins.org/schemas/1.0.0/plugin.schema.json';
const MCP_SCHEMA = 'https://agent-plugins.org/schemas/1.0.0/mcp.schema.json';
const JUNK_FILES = new Set(['.DS_Store', 'Thumbs.db', 'desktop.ini']);
const FORBIDDEN_KEYS = new Set(['test_credentials', 'reviewer_instructions', 'clientSecret', 'apps', 'hooks']);
const SECRET_PATTERNS = [
  /-----BEGIN [A-Z ]*PRIVATE KEY-----/,
  /\bsk-[A-Za-z0-9_-]{20,}/,
  /\bgh[pousr]_[A-Za-z0-9]{20,}/,
  /\bBearer\s+[A-Za-z0-9._~+/-]{20,}/,
  /\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\./, // JWT
];

// ---------- arguments ----------

const args = process.argv.slice(2);
const checkOnly = args.includes('--check');
const demoUrlIndex = args.indexOf('--demo-url');
const demoUrlArg = demoUrlIndex >= 0 ? args[demoUrlIndex + 1] : undefined;
if (demoUrlIndex >= 0 && (!demoUrlArg || demoUrlArg.startsWith('--'))) fail('--demo-url needs a value');
const known = new Set(['--check', '--demo-url', demoUrlArg]);
const unknown = args.filter((a) => !known.has(a));
if (unknown.length) fail(`unknown argument(s): ${unknown.join(' ')}`);

function fail(message) {
  console.error(`[openai-zip] ${message}`);
  process.exit(1);
}

// ---------- validation helpers ----------

const errors = [];
const warnings = [];
const error = (m) => errors.push(m);

function text(value, field, max, { required = true } = {}) {
  if (value === undefined || value === null) {
    if (required) error(`${field} is required`);
    return;
  }
  if (typeof value !== 'string' || value.trim() === '') return error(`${field} must be a non-empty string`);
  if (value.length > max) error(`${field} is ${value.length} characters (max ${max})`);
}

function httpsUrl(value, field, max = 1024) {
  text(value, field, max);
  if (typeof value !== 'string') return;
  let url;
  try {
    url = new URL(value);
  } catch {
    return error(`${field} is not a URL: ${value}`);
  }
  if (url.protocol !== 'https:') error(`${field} must use https: ${value}`);
  if (url.username || url.password) error(`${field} must not embed credentials`);
}

// Relative "./" path inside the plugin root that exists; returns the absolute path or undefined.
function pluginPath(value, field) {
  if (typeof value !== 'string' || !value.startsWith('./')) return error(`${field} must start with "./"`);
  const abs = resolve(pluginRoot, value);
  if (!abs.startsWith(pluginRoot + sep)) return error(`${field} points outside the plugin: ${value}`);
  if (!existsSync(abs)) return error(`${field} does not exist: ${value}`);
  return abs;
}

function pngIcon(value, field) {
  const abs = pluginPath(value, field);
  if (!abs) return;
  const png = readFileSync(abs);
  if (png.length > 5 * 1024 * 1024) error(`${field} is larger than 5 MiB`);
  if (png.length < 24 || png.toString('latin1', 1, 4) !== 'PNG') {
    return error(`${field} must be a PNG (this script only checks PNG icons): ${value}`);
  }
  const width = png.readUInt32BE(16);
  const height = png.readUInt32BE(20);
  if (width !== height) error(`${field} must be square, got ${width}x${height}`);
  if (width < 48 || width > 4096) error(`${field} must be 48..4096 px, got ${width}`);
}

// WCAG contrast ratio of a #RRGGBB color against white.
function contrastWithWhite(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 1.05 / (0.2126 * r + 0.7152 * g + 0.0722 * b + 0.05);
}

function walkKeys(value, path, visit) {
  if (Array.isArray(value)) value.forEach((v, i) => walkKeys(v, `${path}[${i}]`, visit));
  else if (value && typeof value === 'object') {
    for (const [k, v] of Object.entries(value)) {
      visit(k, `${path}.${k}`);
      walkKeys(v, `${path}.${k}`, visit);
    }
  }
}

function listFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) return listFiles(abs);
    return JUNK_FILES.has(entry.name) ? [] : [abs];
  });
}

const readJson = (rel) => {
  try {
    return JSON.parse(readFileSync(join(pluginRoot, rel), 'utf8'));
  } catch (e) {
    fail(`cannot read plugins/ai-game-dev/${rel}: ${e.message}`);
  }
};

// ---------- plugin.json ----------

const manifest = readJson('plugin.json');
if (demoUrlArg) manifest.extensions['com.openai'].review.demo_recording_url = demoUrlArg;

if (manifest.$schema !== PLUGIN_SCHEMA) error(`plugin.json $schema must be ${PLUGIN_SCHEMA}`);
text(manifest.name, 'name', 64);
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(manifest.name ?? '')) error('name must be lowercase letters, numbers and single hyphens');
if (!/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(manifest.version ?? '')) error('version must be a semantic version');
text(manifest.description, 'description', 4000);
text(manifest.author?.name, 'author.name', 120);
if (manifest.author?.url) httpsUrl(manifest.author.url, 'author.url', 2048);
if (manifest.homepage) httpsUrl(manifest.homepage, 'homepage', 2048);
walkKeys(manifest, 'plugin.json', (key, path) => {
  if (FORBIDDEN_KEYS.has(key)) error(`${path} is not allowed in a directory submission`);
});

const openai = manifest.extensions?.['com.openai'] ?? {};
const ui = openai.interface ?? {};
text(ui.displayName, 'interface.displayName', 30);
text(ui.shortDescription, 'interface.shortDescription', 30);
text(ui.longDescription, 'interface.longDescription', 4000);
text(ui.developerName, 'interface.developerName', 80);
text(ui.category, 'interface.category', 200);
if (!Array.isArray(ui.capabilities) || ui.capabilities.length > 20) error('interface.capabilities must be an array of at most 20');
else ui.capabilities.forEach((c, i) => text(c, `interface.capabilities[${i}]`, 120));
for (const field of ['websiteURL', 'supportURL', 'privacyPolicyURL', 'termsOfServiceURL']) {
  httpsUrl(ui[field], `interface.${field}`);
}
const prompts = ui.defaultPrompt === undefined ? [] : [ui.defaultPrompt].flat();
if (prompts.length > 3) error('interface.defaultPrompt has more than 3 prompts');
if (new Set(prompts).size !== prompts.length) error('interface.defaultPrompt prompts must be unique');
prompts.forEach((p, i) => {
  text(p, `interface.defaultPrompt[${i}]`, 128);
  if (/@\w/.test(p)) error(`interface.defaultPrompt[${i}] must not @mention an app`);
});
if (ui.brandColor !== undefined) {
  if (!/^#[0-9A-Fa-f]{6}$/.test(ui.brandColor)) error('interface.brandColor must be #RRGGBB');
  else if (contrastWithWhite(ui.brandColor) < 2) error('interface.brandColor needs at least 2:1 contrast against white');
}
for (const field of ['logo', 'composerIcon']) pngIcon(ui[field], `interface.${field}`);
for (const field of ['logoDark', 'composerIconDark']) if (ui[field] !== undefined) pngIcon(ui[field], `interface.${field}`);
if (openai.onboardingSkill !== undefined) pluginPath(openai.onboardingSkill, 'onboardingSkill');

const review = openai.review ?? {};
const positive = review.test_cases?.positive ?? [];
const negative = review.test_cases?.negative ?? [];
if (positive.length !== 5) error(`review.test_cases.positive needs exactly 5 cases, has ${positive.length}`);
if (negative.length !== 3) error(`review.test_cases.negative needs exactly 3 cases, has ${negative.length}`);
positive.forEach((c, i) => {
  for (const f of ['description', 'prompt', 'tools_triggered', 'expected_behavior']) {
    text(c[f], `review.test_cases.positive[${i}].${f}`, 4000);
  }
});
negative.forEach((c, i) => {
  for (const f of ['description', 'prompt']) text(c[f], `review.test_cases.negative[${i}].${f}`, 4000);
});
const demoUrl = review.demo_recording_url;
const demoUrlOk = typeof demoUrl === 'string' && /^https:\/\/[^\s]+$/.test(demoUrl);
if (demoUrlOk) httpsUrl(demoUrl, 'review.demo_recording_url');
else if (checkOnly && !demoUrlArg) warnings.push('review.demo_recording_url is still a placeholder; a build needs --demo-url <https URL>');
else error('review.demo_recording_url is not an HTTPS URL yet; pass --demo-url <https URL> (the recorded demo)');
text(openai.publication?.release_notes, 'publication.release_notes', 4000);

// ---------- mcp.json ----------

const mcp = readJson('mcp.json');
if (mcp.$schema !== MCP_SCHEMA) error(`mcp.json $schema must be ${MCP_SCHEMA}`);
const servers = Object.entries(mcp.mcpServers ?? {});
if (servers.length !== 1) error(`mcp.json must declare exactly one MCP server, has ${servers.length}`);
for (const [name, server] of servers) {
  if (server.type !== 'streamable-http') error(`mcp.json ${name}: type must be "streamable-http"`);
  httpsUrl(server.url, `mcp.json ${name}.url`);
  if (server.headers && Object.keys(server.headers).length) error(`mcp.json ${name}: headers must be empty`);
  const auth = server.extensions?.['com.openai']?.auth;
  if (auth?.type !== 'oauth') error(`mcp.json ${name}: extensions.com.openai.auth.type must be "oauth"`);
  if (auth?.client?.mode === 'dcr' && auth.client.clientId) error(`mcp.json ${name}: a dcr client must not set clientId`);
}
walkKeys(mcp, 'mcp.json', (key, path) => {
  if (FORBIDDEN_KEYS.has(key)) error(`${path} is not allowed in a directory submission`);
});

// ---------- package contents ----------

const files = listFiles(pluginRoot);
const rel = (abs) => relative(pluginRoot, abs).split(sep).join('/');
for (const abs of files) {
  const name = rel(abs);
  if (/^(hooks\/|\.app\.json$|\.codex-plugin\/|\.mcp\.json$)/.test(name)) error(`${name} must not be in the package`);
  if (/\.(md|json|txt|ya?ml|svg)$/i.test(name)) {
    const body = readFileSync(abs, 'utf8');
    if (SECRET_PATTERNS.some((re) => re.test(body))) error(`${name} looks like it contains a secret`);
  }
}
const skillsDir = join(pluginRoot, 'skills');
const skills = existsSync(skillsDir) ? readdirSync(skillsDir).filter((d) => statSync(join(skillsDir, d)).isDirectory()) : [];
if (!skills.length) error('skills/ has no skill folders');
for (const skill of skills) {
  const skillFile = join(skillsDir, skill, 'SKILL.md');
  if (!existsSync(skillFile)) {
    error(`skills/${skill}/SKILL.md is missing`);
    continue;
  }
  const front = /^---\r?\n([\s\S]*?)\r?\n---/.exec(readFileSync(skillFile, 'utf8'))?.[1] ?? '';
  const name = /^name:\s*(.+)$/m.exec(front)?.[1]?.trim();
  if (name !== skill) error(`skills/${skill}/SKILL.md: frontmatter name must be "${skill}"`);
  if (!/^description:\s*\S/m.test(front)) error(`skills/${skill}/SKILL.md: frontmatter description is missing`);
}

// The packaged skills and logo are generated copies; they must match their sources.
const sync = spawnSync(process.execPath, [join(repoRoot, 'scripts', 'sync-skills.mjs'), '--check'], { encoding: 'utf8' });
if (sync.status !== 0) error(`sync-skills --check failed; run node scripts/sync-skills.mjs\n${sync.stderr.trim()}`);

// ---------- report ----------

for (const w of warnings) console.warn(`[openai-zip] warning: ${w}`);
if (errors.length) {
  for (const e of errors) console.error(`[openai-zip] ERROR ${e}`);
  fail(`${errors.length} problem(s); no ZIP written.`);
}
if (checkOnly) {
  console.log(`[openai-zip] plugins/ai-game-dev ${manifest.version} is valid (${files.length} files).`);
  process.exit(0);
}

// ---------- ZIP (deflate, deterministic timestamps) ----------

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
function crc32(buf) {
  let c = 0xffffffff;
  for (const byte of buf) c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

const DOS_TIME = 0; // 00:00:00
const DOS_DATE = ((2026 - 1980) << 9) | (1 << 5) | 1; // 2026-01-01, so the same input gives the same ZIP

const entries = files
  .map((abs) => {
    const name = rel(abs);
    const data = name === 'plugin.json' ? Buffer.from(`${JSON.stringify(manifest, null, 2)}\n`) : readFileSync(abs);
    return { name, data };
  })
  .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));

const chunks = [];
const central = [];
let offset = 0;
for (const { name, data } of entries) {
  const nameBuf = Buffer.from(name, 'utf8');
  const packed = deflateRawSync(data, { level: 9 });
  const header = Buffer.alloc(30);
  header.writeUInt32LE(0x04034b50, 0);
  header.writeUInt16LE(20, 4); // version needed
  header.writeUInt16LE(0x0800, 6); // UTF-8 names
  header.writeUInt16LE(8, 8); // deflate
  header.writeUInt16LE(DOS_TIME, 10);
  header.writeUInt16LE(DOS_DATE, 12);
  header.writeUInt32LE(crc32(data), 14);
  header.writeUInt32LE(packed.length, 18);
  header.writeUInt32LE(data.length, 22);
  header.writeUInt16LE(nameBuf.length, 26);
  header.writeUInt16LE(0, 28);

  const entry = Buffer.alloc(46);
  entry.writeUInt32LE(0x02014b50, 0);
  entry.writeUInt16LE(20, 4); // version made by
  header.copy(entry, 6, 4, 30); // version needed .. name length
  entry.writeUInt32LE(offset, 42);
  central.push(entry, nameBuf);

  chunks.push(header, nameBuf, packed);
  offset += header.length + nameBuf.length + packed.length;
}
const centralBuf = Buffer.concat(central);
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0);
end.writeUInt16LE(entries.length, 8);
end.writeUInt16LE(entries.length, 10);
end.writeUInt32LE(centralBuf.length, 12);
end.writeUInt32LE(offset, 16);

const outFile = join(repoRoot, 'dist', `ai-game-dev-openai-${manifest.version}.zip`);
mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, Buffer.concat([...chunks, centralBuf, end]));
console.log(`[openai-zip] wrote ${relative(repoRoot, outFile)} (${entries.length} files):`);
for (const { name } of entries) console.log(`  ${name}`);
