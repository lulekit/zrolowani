import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Footer from './Footer.astro';

test('stopka: dane producenta i linki prawne', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Footer);
  expect(html).toContain('Netictech S.A.');
  expect(html).toContain('Plac Andersa 7');
  expect(html).toContain('href="/regulamin"');
  expect(html).toContain('href="/polityka-prywatnosci"');
  expect(html).toContain('href="/odstapienie-od-umowy"');
  expect(html).toContain('href="/zwroty"');
});
