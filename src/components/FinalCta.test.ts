import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import FinalCta from './FinalCta.astro';

test('cta końcowy: nagłówek zachęty', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(FinalCta);
  expect(html).toContain('Gotowy na imprezę?');
});
