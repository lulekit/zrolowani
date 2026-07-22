import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Gallery from './Gallery.astro';

test('galeria: 4 klikalne zdjęcia + lightbox', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Gallery);
  const items = (html.match(/data-gallery-item/g) ?? []).length;
  expect(items).toBe(4);
  expect(html).toContain('alt="Plansza gry Zrolowani"');
  expect(html).toContain('alt="Znajomi grający w Zrolowani przy stole"');
  expect(html).toContain('data-lightbox');
});
