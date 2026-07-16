import { execSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { beforeAll, expect, test } from 'vitest';

beforeAll(() => {
  execSync('pnpm build', { stdio: 'inherit' });
}, 180_000);

// @astrojs/cloudflare zawsze dzieli wynik builda na dist/client (statyczne
// assety) i dist/server (worker) — plik strony głównej trafia więc do
// dist/client/index.html, nie do dist/index.html.
test('dist/client/index.html zawiera wszystkie kotwice i kluczowe treści', () => {
  const html = readFileSync('dist/client/index.html', 'utf8');
  expect(html).toContain('id="gra"');
  expect(html).toContain('id="zasady"');
  expect(html).toContain('id="pudelko"');
  expect(html).toContain('alt="Prezydent, superbohater, a może kosmonauta?"');
  expect(html).toContain('Netictech S.A.');
  expect(html).toContain('<html lang="pl"');
  expect(html).toContain('property="og:image"');
});

test('brak zewnętrznego CDN fontów w wyprodukowanym HTML', () => {
  const html = readFileSync('dist/client/index.html', 'utf8');
  expect(html).not.toContain('fonts.googleapis.com');
  expect(html).not.toContain('fonts.gstatic.com');
});
