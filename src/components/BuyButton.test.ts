import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import BuyButton from './BuyButton.astro';

test('z URL renderuje aktywny link do Allegro', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(BuyButton, {
    props: { url: 'https://allegro.pl/oferta/x' },
  });
  expect(html).toContain('href="https://allegro.pl/oferta/x"');
  expect(html).toContain('target="_blank"');
  expect(html).toContain('KUP');
});

test('bez URL renderuje nieaktywny stan „Wkrótce"', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(BuyButton, { props: { url: '' } });
  expect(html).toContain('aria-disabled="true"');
  expect(html).toContain('Wkrótce w sprzedaży');
  expect(html).not.toContain('<a ');
});
