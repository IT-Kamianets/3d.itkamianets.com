#!/usr/bin/env node
// Pins the engine packages of every game in the workspace to release tags, in Packages/manifest.json and
// Packages/packages-lock.json, and adds the engine packages a pinned version needs that a game does not list yet.
//
//   node tools/engine/pin-packages.mjs --workspace .. --latest
//   node tools/engine/pin-packages.mjs --workspace .. --pin com.itkamianets.3d-unity-save@0.2.0
//   node tools/engine/pin-packages.mjs --workspace .. --latest --games arena.temnorid.com,master.temnorid.com --dry-run
//
// --latest     every engine package to its highest vX.Y.Z tag
// --pin n@v    one package to vV (repeatable); other packages stay where they are
// --games      comma-separated game folders (default: every folder with an engine package in its manifest)
// --dry-run    show what would change, write nothing
//
// Engine packages are the git packages of github.com/IT-Kamianets and the temnorid-* packages of github.com/WebArtWork.
// Needs git and network access to GitHub. After it runs, open each game in Unity once (or let CI do it) and commit the
// manifest and the lock file together.

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const args = process.argv.slice(2);
const option = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const workspace = resolve(option('--workspace') ?? '..');
const latest = args.includes('--latest');
const dryRun = args.includes('--dry-run');
const pins = new Map();
args.forEach((a, i) => {
  if (a === '--pin') {
    const [name, version] = (args[i + 1] ?? '').split('@');
    if (!name || !/^\d+\.\d+\.\d+$/.test(version ?? '')) fail(`--pin needs name@x.y.z, got "${args[i + 1]}"`);
    pins.set(name, version);
  }
});
if (!latest && pins.size === 0) fail('say --latest or --pin name@x.y.z');

function fail(message) {
  console.error(`pin-packages: ${message}`);
  process.exit(1);
}

const ENGINE = /^https:\/\/github\.com\/(IT-Kamianets\/[^/#]+|WebArtWork\/temnorid-[^/#]+?)(\.git)?(#.*)?$/;
const isEngineUrl = (value) => typeof value === 'string' && ENGINE.test(value);
const repoOf = (url) => url.match(ENGINE)[1].replace(/\.git$/, '');
const urlOf = (repo) => `https://github.com/${repo}.git`;

// Where a package lives when a game does not list it yet: the repository is named like the package id's last part.
function guessRepo(name) {
  const short = name.split('.').pop();
  return short.startsWith('temnorid-') ? `WebArtWork/${short}` : `IT-Kamianets/${short}`;
}

const tagCache = new Map();
function tags(repo) {
  if (!tagCache.has(repo)) {
    const out = execFileSync('git', ['ls-remote', '--tags', urlOf(repo)], { encoding: 'utf8' });
    const found = new Map();
    for (const line of out.split('\n')) {
      const m = line.match(/^([0-9a-f]{40})\trefs\/tags\/v(\d+\.\d+\.\d+)(\^\{\})?$/);
      if (!m) continue;
      // An annotated tag lists its commit on the ^{} line: prefer that one.
      if (m[3] || !found.has(m[2])) found.set(m[2], m[1]);
    }
    tagCache.set(repo, found);
  }
  return tagCache.get(repo);
}

const compare = (a, b) => {
  const x = a.split('.').map(Number);
  const y = b.split('.').map(Number);
  for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] - y[i];
  return 0;
};
const highest = (repo) => [...tags(repo).keys()].sort(compare).pop();

const manifestCache = new Map();
async function packageJson(repo, version) {
  const key = `${repo}@${version}`;
  if (!manifestCache.has(key)) {
    const response = await fetch(`https://raw.githubusercontent.com/${repo}/v${version}/package.json`);
    if (!response.ok) fail(`${repo} v${version}: package.json not found (${response.status})`);
    manifestCache.set(key, await response.json());
  }
  return manifestCache.get(key);
}

function games() {
  const only = option('--games')?.split(',').map((s) => s.trim()).filter(Boolean);
  const all = readdirSync(workspace, { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(join(workspace, d.name, 'Packages', 'manifest.json')))
    .map((d) => d.name)
    .filter((name) => {
      const manifest = JSON.parse(readFileSync(join(workspace, name, 'Packages', 'manifest.json'), 'utf8'));
      return Object.values(manifest.dependencies ?? {}).some(isEngineUrl);
    });
  return only ? all.filter((g) => only.includes(g)) : all;
}

function currentVersion(url) {
  const m = url.match(/#v(\d+\.\d+\.\d+)$/);
  return m ? m[1] : undefined;
}

async function pinGame(game) {
  const manifestPath = join(workspace, game, 'Packages', 'manifest.json');
  const lockPath = join(workspace, game, 'Packages', 'packages-lock.json');
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  const deps = manifest.dependencies;
  const wanted = new Map(); // name -> { repo, version, direct }

  for (const [name, value] of Object.entries(deps)) {
    if (!isEngineUrl(value)) continue;
    const repo = repoOf(value);
    const version = pins.get(name) ?? (latest ? highest(repo) : currentVersion(value) ?? highest(repo));
    if (!version) fail(`${game}: ${name} has no release tag yet`);
    wanted.set(name, { repo, version, direct: true });
  }

  // What the pinned versions need, transitively.
  const queue = [...wanted.keys()];
  while (queue.length) {
    const name = queue.shift();
    const { repo, version } = wanted.get(name);
    const pj = await packageJson(repo, version);
    for (const [dep, minimum] of Object.entries(pj.dependencies ?? {})) {
      if (!/^com\.(itkamianets|webartwork)\./.test(dep)) continue;
      const known = wanted.get(dep);
      if (known) {
        if (compare(known.version, minimum) < 0) {
          console.warn(`  ${game}: ${dep} ${known.version} is older than ${name} ${version} needs (${minimum}); moving it up`);
          const repoDep = known.repo;
          const best = [...tags(repoDep).keys()].filter((v) => compare(v, minimum) >= 0).sort(compare)[0];
          if (!best) fail(`${dep} has no tag >= ${minimum}`);
          known.version = best;
          queue.push(dep);
        }
        continue;
      }
      const repoDep = guessRepo(dep);
      const best = [...tags(repoDep).keys()].filter((v) => compare(v, minimum) >= 0).sort(compare).pop();
      if (!best) fail(`${game}: ${name} needs ${dep} ${minimum}, which has no release tag`);
      wanted.set(dep, { repo: repoDep, version: best, direct: false });
      queue.push(dep);
    }
  }

  const changes = [];
  for (const [name, { repo, version }] of wanted) {
    const value = `${urlOf(repo)}#v${version}`;
    if (deps[name] !== value) changes.push(`${name.split('.').pop()} ${currentVersion(deps[name] ?? '') ?? (deps[name] ? 'unpinned' : 'new')} -> v${version}`);
    deps[name] = value;
  }
  manifest.dependencies = Object.fromEntries(Object.entries(deps).sort(([a], [b]) => a.localeCompare(b)));

  // The lock file: the same URLs, the commits the tags point at, and each package's engine dependencies.
  let lock = existsSync(lockPath) ? JSON.parse(readFileSync(lockPath, 'utf8')) : { dependencies: {} };
  for (const [name, { repo, version, direct }] of wanted) {
    const pj = await packageJson(repo, version);
    lock.dependencies[name] = {
      version: `${urlOf(repo)}#v${version}`,
      depth: direct ? 0 : 1,
      source: 'git',
      dependencies: pj.dependencies ?? {},
      hash: tags(repo).get(version),
    };
  }
  lock.dependencies = Object.fromEntries(Object.entries(lock.dependencies).sort(([a], [b]) => a.localeCompare(b)));

  console.log(`${game}: ${changes.length ? changes.join(', ') : 'already pinned'}`);
  if (!dryRun && changes.length) {
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
    writeFileSync(lockPath, JSON.stringify(lock, null, 2) + '\n');
  }
}

for (const game of games()) await pinGame(game);
if (dryRun) console.log('(dry run: nothing written)');
