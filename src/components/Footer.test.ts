import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Footer from './Footer.astro';

test('stopka: dane producenta', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Footer);
  expect(html).toContain('Netictech S.A.');
  expect(html).toContain('Plac Andersa 7');
});

test('stopka: podpis wykonawcy z linkiem do lulek.it', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Footer);
  expect(html).toMatch(/Realizacja: <a[^>]*href="https:\/\/lulek\.it"[^>]*>lulek\.it<\/a>/);
});

test('stopka: linki prawne są ukryte (zakomentowane)', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Footer);
  expect(html).not.toContain('href="/regulamin"');
  expect(html).not.toContain('href="/polityka-prywatnosci"');
  expect(html).not.toContain('href="/odstapienie-od-umowy"');
  expect(html).not.toContain('href="/zwroty"');
});
