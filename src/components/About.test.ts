import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import About from './About.astro';

test('about: nagłówek, opis i kotwica #gra', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(About);
  expect(html).toContain('id="gra"');
  expect(html).toContain('Zgadnij, jak zagłosuje większość');
  expect(html).toContain('tajnym głosowaniu');
  expect(html).toContain('alt="Pudełko gry Zrolowani"');
});
