// Pull-request gate: product changes must come with documentation updates.
// Runs in CI with BASE_SHA (and optional PR_BODY, PR_AUTHOR). Pure logic is exported for tests.
import { execFileSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';

const PRODUCT = /^(src\/(app|features|games|content|types|components)\/|public\/|next\.config\.ts$|package\.json$|scripts\/|\.github\/workflows\/)/;
const TEST_ONLY = /(\.test\.[cm]?[jt]sx?$|^tests\/)/;
const LIVING = ['docs/setup-status.md', 'docs/decisions.md'];
const ASSETS = 'docs/assets.md';
const OPT_OUT = /^\s*Docs-Impact:\s*none\s*[-—:]\s*(\S.{9,})$/im;

export function evaluate({ files, body = '', author = '' }) {
  const changed = new Set(files);
  const product = files.filter((f) => PRODUCT.test(f) && !TEST_ONLY.test(f));
  if (product.length === 0) return { ok: true, reasons: [] };
  if (/^dependabot(\[bot\])?$/i.test(author) && product.every((f) => /^(package(-lock)?\.json|\.github\/workflows\/.*)$/.test(f))) {
    return { ok: true, reasons: [] };
  }
  if (OPT_OUT.test(body)) return { ok: true, reasons: [] };
  const reasons = [];
  if (!LIVING.some((f) => changed.has(f))) {
    reasons.push(`Update ${LIVING.join(' or ')} to record the change.`);
  }
  if (files.some((f) => f.startsWith('public/') && !f.endsWith('README.md')) && !changed.has(ASSETS)) {
    reasons.push(`Register changed artwork or media in ${ASSETS}.`);
  }
  return { ok: reasons.length === 0, reasons, product };
}

function git(...args) {
  return execFileSync('git', args, { encoding: 'utf8' }).trim();
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const base = process.env.BASE_SHA;
  if (!base) {
    console.log('No BASE_SHA set; documentation impact check skipped (pull requests only).');
    process.exit(0);
  }
  const files = git('diff', '--name-only', `${base}...HEAD`).split('\n').filter(Boolean);
  const result = evaluate({ files, body: process.env.PR_BODY ?? '', author: process.env.PR_AUTHOR ?? '' });
  if (result.ok) {
    console.log('Documentation impact check passed.');
  } else {
    console.error('Documentation impact check failed. This pull request changes product files:');
    for (const f of result.product) console.error(`  - ${f}`);
    for (const r of result.reasons) console.error(`* ${r}`);
    console.error('If no documentation is affected, add this line to the pull request description:');
    console.error('  Docs-Impact: none — <reason of at least 10 characters>');
    process.exit(1);
  }
}
