import { readFileSync, existsSync } from 'node:fs';
import assert from 'node:assert/strict';
const required = ['README.md', 'AGENTS.md', 'docs/mvp.md', 'docs/master-plan.md',
  'docs/contracts.md', 'docs/mvp-development-plan-1.1.md', 'docs/setup-status.md'];
for (const file of required) {
  assert(existsSync(file), `Missing ${file}`);
  const body = readFileSync(file, 'utf8');
  assert(body.trim().length > 100, `Empty or incomplete ${file}`);
  for (const match of body.matchAll(/\]\(([^)]+\.md)(?:#[^)]*)?\)/g)) {
    const resolved = new URL(match[1], new URL(file, `file://${process.cwd().replaceAll('\\', '/')}/`));
    assert(existsSync(resolved), `Broken document link ${file}: ${match[1]}`);
  }
}
const plan = readFileSync('docs/mvp-development-plan-1.1.md', 'utf8');
for (const marker of ['mastery-v1', '9788414407639', '9788414407622', '9781380049957',
  '9788414408087', '9788414408254', 'MVP-02-profile-rewards', 'MVP-03-picture-selection']) {
  assert(plan.includes(marker), `Missing plan requirement ${marker}`);
}
console.log('Repository documents and local Markdown links validated. This documentation check does not validate application behavior.');
