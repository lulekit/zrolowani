import { expect, test } from 'vitest';
import { resolveBuy } from './buy';

test('pusty URL ⇒ nieaktywny, etykieta „Wkrótce w sprzedaży"', () => {
  expect(resolveBuy('')).toEqual({ enabled: false, href: null, label: 'Wkrótce w sprzedaży' });
  expect(resolveBuy(undefined)).toEqual({
    enabled: false,
    href: null,
    label: 'Wkrótce w sprzedaży',
  });
  expect(resolveBuy('   ')).toEqual({ enabled: false, href: null, label: 'Wkrótce w sprzedaży' });
});

test('podany URL ⇒ aktywny link, etykieta „KUP", przycięte białe znaki', () => {
  expect(resolveBuy('  https://allegro.pl/oferta/x  ')).toEqual({
    enabled: true,
    href: 'https://allegro.pl/oferta/x',
    label: 'KUP',
  });
});
