/**
 * Builds the deployed site: the Vite app at the root, the Expo app under /next.
 *
 * The two live side by side on purpose. The Expo app is the one being kept -
 * it holds all 40 Figma frames - but the Vite app is what is in production
 * today, so /next is a place to verify the Expo build on the real deployment
 * before /app is handed over to it. When that happens this script keeps
 * working; only the destination changes.
 *
 * Runs on Vercel (Linux) and locally on Windows, so everything here is Node
 * rather than shell.
 */
import { execFileSync, execSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const viteOut = join(root, 'apps/pwa/dist');
const expoOut = join(root, 'apps/mobile/dist');
const mountedAt = join(viteOut, 'next');

/**
 * npm is a .cmd on Windows, and Node refuses to spawn one without a shell
 * (EINVAL). Vercel builds on Linux, where the plain binary is correct.
 */
const isWindows = process.platform === 'win32';

function run(label, args) {
  process.stdout.write(`\n── ${label}\n`);
  if (isWindows) {
    // Passing an args array alongside shell:true is deprecated (the args are
    // concatenated, not escaped). These are fixed literals, but the single
    // command string is the form Node actually wants.
    execSync(`npm ${args.join(' ')}`, { cwd: root, stdio: 'inherit' });
  } else {
    execFileSync('npm', args, { cwd: root, stdio: 'inherit' });
  }
}

run('landing + current app (Vite)', ['run', 'build', '-w', 'comuta-pwa']);
run('app screens (Expo web export)', ['run', 'export:web', '-w', 'comuta-mobile']);

if (!existsSync(expoOut)) throw new Error(`Expo export produced nothing at ${expoOut}`);
if (!existsSync(viteOut)) throw new Error(`Vite build produced nothing at ${viteOut}`);

rmSync(mountedAt, { recursive: true, force: true });
mkdirSync(mountedAt, { recursive: true });
cpSync(expoOut, mountedAt, { recursive: true });

/*
 * expo-router exports every route twice: once at its real path and once under
 * the group directory, so /login also exists as /(auth)/login. Those are real
 * crawlable URLs with brackets in them and nothing links to them. Drop them.
 */
const groups = readdirSync(mountedAt, { withFileTypes: true }).filter(
  (e) => e.isDirectory() && e.name.startsWith('(') && e.name.endsWith(')'),
);
for (const g of groups) rmSync(join(mountedAt, g.name), { recursive: true, force: true });

const pages = readdirSync(mountedAt).filter((f) => f.endsWith('.html'));

/* /next is a staging mount, not something search engines should index. */
const robotsPath = join(viteOut, 'robots.txt');
if (existsSync(robotsPath)) {
  const robots = readFileSync(robotsPath, 'utf8');
  if (!robots.includes('Disallow: /next')) {
    writeFileSync(
      robotsPath,
      robots.replace(/^(User-agent: \*\r?\n)/m, '$1Disallow: /next\n'),
      'utf8',
    );
  }
}

process.stdout.write(
  `\n── done\n` +
    `   /        Vite app (landing + current /app screens)\n` +
    `   /next    Expo app, ${pages.length} routes, ${groups.length} duplicate group dirs removed\n`,
);
