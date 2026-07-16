import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { expect, test } from 'vitest';
import HowToPlay from './HowToPlay.astro';

test('jak grać: kotwica #zasady, 6 kroków, placeholder wideo', async () => {
  const container = await AstroContainer.create();
  const html = await container.renderToString(HowToPlay);
  expect(html).toContain('id="zasady"');
  expect(html).toContain('Wybierz kolor tabliczek');
  expect(html).toContain('Zdobądź punkt');
  expect(html).toContain('wkrótce');
  // 6 numerów kroków
  for (const n of ['>1<', '>2<', '>3<', '>4<', '>5<', '>6<']) {
    expect(html).toContain(n);
  }
});
