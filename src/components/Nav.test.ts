import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Nav from './Nav.astro';

test('nav zawiera kotwice sekcji i KUP', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Nav);
  expect(html).toContain('href="#gra"');
  expect(html).toContain('href="#zasady"');
  expect(html).toContain('href="#pudelko"');
  expect(html).toContain('bg-accent'); // BuyButton renderuje się w nawigacji
  expect(html).toContain('Wkrótce w sprzedaży'); // stan przy pustym ALLEGRO_URL
  expect(html).toContain('data-nav-toggle');
});
