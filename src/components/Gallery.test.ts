import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Gallery from './Gallery.astro';

test('galeria: 4 zdjęcia z alt', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Gallery);
  const imgCount = (html.match(/<img/g) ?? []).length;
  expect(imgCount).toBe(4);
  expect(html).toContain('alt="Plansza gry Zrolowani"');
  expect(html).toContain('alt="Znajomi grający w Zrolowani przy stole"');
});
