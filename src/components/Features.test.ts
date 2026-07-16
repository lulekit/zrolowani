import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Features from './Features.astro';

test('features: 5 wyróżników', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Features);
  for (const t of [
    'Przystępne zasady',
    'Wysoka regrywalność',
    'Humor',
    'Zachęca do dyskusji',
    'Szybka rozgrywka',
  ]) {
    expect(html).toContain(t);
  }
});
