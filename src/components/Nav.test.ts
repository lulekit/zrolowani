import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Nav from './Nav.astro';
import { resolveBuy } from '../lib/buy';
import { ALLEGRO_URL } from '../lib/site';

test('nav zawiera kotwice sekcji i KUP', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Nav);
  expect(html).toContain('href="#gra"');
  expect(html).toContain('href="#zasady"');
  expect(html).toContain('href="#pudelko"');
  expect(html).toContain('bg-accent'); // BuyButton renderuje się w nawigacji
  // Etykieta zależy od konfiguracji ALLEGRO_URL, więc bierzemy ją ze stanu.
  expect(html).toContain(resolveBuy(ALLEGRO_URL).label);
  expect(html).toContain('data-nav-toggle');
});

test('nav: zakładki rozłożone równomiernie, przycisk KUP osobno', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Nav);
  expect(html).toContain('justify-evenly');
});

test('nav: białe kreski przed, między i za zakładkami (dekoracyjne)', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Nav);
  const separators = html.match(/data-nav-sep/g) ?? [];
  expect(separators).toHaveLength(4); // | Gra | Zasady | Pudełko |
});
