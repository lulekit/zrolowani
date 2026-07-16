import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Studio from './Studio.astro';

test('o nas: Netictech i Hubert Gliński', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Studio);
  expect(html).toContain('Netictech');
  expect(html).toContain('Hubert');
});
