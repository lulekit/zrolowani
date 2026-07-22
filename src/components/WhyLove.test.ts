import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import WhyLove from './WhyLove.astro';

test('dlaczego pokochasz: nagłówek, treść i zdjęcie znajomych', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(WhyLove);
  expect(html).toContain('Dlaczego pokochasz tę grę?');
  expect(html).toContain('nowej perspektywy');
  expect(html).toContain('210 kart');
  expect(html).toContain('alt="Znajomi grający w Zrolowani przy stole"');
});
