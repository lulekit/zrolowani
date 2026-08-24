import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { beforeAll, expect, test } from 'vitest';

beforeAll(() => {
  execSync('pnpm build', { stdio: 'inherit' });
}, 180_000);

// Static build (output: 'static') emits the home page at dist/index.html.
test('dist/index.html zawiera wszystkie kotwice i kluczowe treści', () => {
  const html = readFileSync('dist/index.html', 'utf8');
  expect(html).toContain('id="gra"');
  expect(html).toContain('id="zasady"');
  expect(html).toContain('id="pudelko"');
  expect(html).toContain('alt="Prezydent, superbohater, a może kosmonauta?"');
  expect(html).toContain('Netictech S.A.');
  expect(html).toContain('<html lang="pl"');
  expect(html).toContain('property="og:image"');
});

test('brak zewnętrznego CDN fontów w wyprodukowanym HTML', () => {
  const html = readFileSync('dist/index.html', 'utf8');
  expect(html).not.toContain('fonts.googleapis.com');
  expect(html).not.toContain('fonts.gstatic.com');
});
