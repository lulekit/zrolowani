import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import BoxContents from './BoxContents.astro';

test('pudełko: kotwica #pudelko i pełna zawartość', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(BoxContents);
  expect(html).toContain('id="pudelko"');
  for (const t of ['210', 'kart', '36', 'tabliczek', '100', 'żetonów', 'plansza', 'mazaki']) {
    expect(html).toContain(t);
  }
});
