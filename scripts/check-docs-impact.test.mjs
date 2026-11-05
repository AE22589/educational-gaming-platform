import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluate } from './check-docs-impact.mjs';

test('docs-only and test-only changes pass', () => {
  assert.equal(evaluate({ files: ['README.md', 'docs/mvp.md'] }).ok, true);
  assert.equal(evaluate({ files: ['src/features/x.test.ts', 'tests/e2e/home.spec.ts'] }).ok, true);
});
test('product change without living docs fails', () => {
  const r = evaluate({ files: ['src/app/page.tsx'] });
  assert.equal(r.ok, false);
  assert.match(r.reasons[0], /setup-status/);
});
test('product change with setup-status or decisions passes', () => {
  assert.equal(evaluate({ files: ['src/app/page.tsx', 'docs/setup-status.md'] }).ok, true);
  assert.equal(evaluate({ files: ['src/app/page.tsx', 'docs/decisions.md'] }).ok, true);
});
test('public changes also require the asset register', () => {
  const r = evaluate({ files: ['public/shop/x.webp', 'docs/setup-status.md'] });
  assert.equal(r.ok, false);
  assert.match(r.reasons.join(' '), /assets\.md/);
  assert.equal(evaluate({ files: ['public/shop/x.webp', 'docs/setup-status.md', 'docs/assets.md'] }).ok, true);
});
test('explicit opt-out with a reason passes, without a reason fails', () => {
  assert.equal(evaluate({ files: ['src/app/page.tsx'], body: 'Docs-Impact: none — internal refactor only' }).ok, true);
  assert.equal(evaluate({ files: ['src/app/page.tsx'], body: 'Docs-Impact: none — ' }).ok, false);
  assert.equal(evaluate({ files: ['src/app/page.tsx'], body: 'Docs-Impact: none — x' }).ok, false);
});
test('dependabot dependency bumps pass, but not source changes', () => {
  assert.equal(evaluate({ files: ['package.json', 'package-lock.json'], author: 'dependabot[bot]' }).ok, true);
  assert.equal(evaluate({ files: ['src/app/page.tsx'], author: 'dependabot[bot]' }).ok, false);
  assert.equal(evaluate({ files: ['package.json'], author: 'someone' }).ok, false);
});
