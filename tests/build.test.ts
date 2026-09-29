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

test('SEO: robots.txt wskazuje sitemapę, a sitemapa zawiera stronę główną', () => {
  const robots = readFileSync('dist/robots.txt', 'utf8');
  expect(robots).toContain('User-agent: *');
  expect(robots).toContain('Sitemap: https://zrolowani.com.pl/sitemap.xml');

  const sitemap = readFileSync('dist/sitemap.xml', 'utf8');
  expect(sitemap).toContain('<loc>https://zrolowani.com.pl/</loc>');
  expect(sitemap).not.toContain('regulamin');
});

test('SEO: strona główna ma JSON-LD, podstrony-szablony mają noindex', () => {
  const home = readFileSync('dist/index.html', 'utf8');
  expect(home).toContain('application/ld+json');
  expect(home).not.toContain('noindex');
  expect(readFileSync('dist/regulamin/index.html', 'utf8')).toContain('noindex');
});

test('SEO: .htaccess przekierowuje http i www na kanoniczny adres', () => {
  const htaccess = readFileSync('dist/.htaccess', 'utf8');
  expect(htaccess).toContain('https://zrolowani.com.pl/$1 [R=301,L]');
});

test('brak zewnętrznego CDN fontów w wyprodukowanym HTML', () => {
  const html = readFileSync('dist/index.html', 'utf8');
  expect(html).not.toContain('fonts.googleapis.com');
  expect(html).not.toContain('fonts.gstatic.com');
});
