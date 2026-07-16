import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import Hero from './Hero.astro';

test('hero: slogan jako grafika z pełnym alt, CTA i fakty', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(Hero);
  expect(html).toContain('alt="Prezydent, superbohater, a może kosmonauta?"');
  expect(html).toContain('href="#zasady"');
  expect(html).toContain('2–6 graczy');
  expect(html).toContain('20–60 min');
  expect(html).toContain('14+');
  expect(html).toContain('id="top"');
});
