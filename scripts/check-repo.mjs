// Repo hygiene for a public repository. Fails if private material or secrets are tracked.
import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';

const tracked = execSync('git ls-files', { encoding: 'utf8' }).split('\n').filter(Boolean);
const errors = [];

const forbiddenPaths = [
  /(^|\/)drafts?\//i,
  /(^|\/)private\//i,
  /(^|\/)notes\//i,
  /\.draft\.mdx?$/i,
  /(^|\/)\.env(\..*)?$/,
  /\.(pem|key|p12|pfx)$/i,
];
for (const f of tracked) {
  if (forbiddenPaths.some((re) => re.test(f)) && !/\.env\.example$/.test(f)) errors.push(`private file tracked: ${f}`);
}

const secretPatterns = [
  [/ghp_[A-Za-z0-9]{36}/, 'GitHub token'],
  [/github_pat_[A-Za-z0-9_]{40,}/, 'GitHub token'],
  [/sk-[A-Za-z0-9_-]{20,}/, 'API key'],
  [/AKIA[0-9A-Z]{16}/, 'AWS key'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'private key'],
  [/xox[baprs]-[A-Za-z0-9-]{10,}/, 'Slack token'],
];
for (const f of tracked) {
  if (/\.(png|jpe?g|gif|webp|ico|woff2?)$/i.test(f) || f === 'package-lock.json') continue;
  const s = readFileSync(f, 'utf8');
  for (const [re, label] of secretPatterns) if (re.test(s)) errors.push(`possible ${label} in ${f}`);
}

// Published posts must not be drafts
for (const f of tracked.filter((f) => /^src\/content\/blog\/[^/]+\.mdx?$/.test(f))) {
  if (/^draft:\s*true/m.test(readFileSync(f, 'utf8'))) errors.push(`${f} is marked draft: true but is tracked in the public repo`);
}

if (errors.length) {
  console.error(`check-repo: ${errors.length} problem(s)\n` + errors.map((e) => `  ✗ ${e}`).join('\n'));
  process.exit(1);
}
console.log(`check-repo: ok (${tracked.length} tracked files)`);
