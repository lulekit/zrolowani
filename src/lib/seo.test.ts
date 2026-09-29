import { expect, test } from 'vitest';
import { buildJsonLd, buildMeta } from './seo';
import { ALLEGRO_URL } from './site';

test('buildMeta: domyślny tytuł i kanoniczny URL głównej', () => {
  const m = buildMeta({});
  expect(m.title).toBe('Zrolowani — imprezowa gra planszowa dla znajomych');
  expect(m.canonical).toBe('https://zrolowani.com.pl/');
  expect(m.ogImage).toBe('https://zrolowani.com.pl/og.jpg');
  expect(m.noindex).toBe(false);
});

test('buildMeta: opis mieści się w limicie wyświetlanym przez Google', () => {
  const m = buildMeta({});
  expect(m.description.length).toBeGreaterThan(120);
  expect(m.description.length).toBeLessThanOrEqual(160);
});

test('buildMeta: tytuł sekcji z sufiksem marki i kanoniczny URL ścieżki', () => {
  const m = buildMeta({ title: 'Regulamin', path: '/regulamin/', noindex: true });
  expect(m.title).toBe('Regulamin — Zrolowani');
  expect(m.canonical).toBe('https://zrolowani.com.pl/regulamin/');
  expect(m.noindex).toBe(true);
});

test('buildJsonLd: organizacja, witryna i produkt powiązane identyfikatorami', () => {
  const ld = buildJsonLd();
  expect(ld['@context']).toBe('https://schema.org');
  const byType = (t: string) =>
    ld['@graph'].find((n) => [n['@type']].flat().includes(t)) as Record<string, unknown>;

  const org = byType('Organization');
  expect(org.name).toBe('Netictech S.A.');

  const site = byType('WebSite');
  expect(site.url).toBe('https://zrolowani.com.pl/');
  expect(site.inLanguage).toBe('pl-PL');

  const product = byType('Product');
  expect(product.name).toBe('Zrolowani');
  expect(product.manufacturer).toEqual({ '@id': org['@id'] });
  expect(product.numberOfPlayers).toMatchObject({ minValue: 2, maxValue: 6 });
});

test('buildJsonLd: oferta z ceną w PLN kieruje do Allegro', () => {
  const product = buildJsonLd()['@graph'].find((n) =>
    [n['@type']].flat().includes('Product'),
  ) as Record<string, unknown>;
  expect(product.offers).toMatchObject({
    '@type': 'Offer',
    url: ALLEGRO_URL,
    price: '119.99',
    priceCurrency: 'PLN',
  });
});
