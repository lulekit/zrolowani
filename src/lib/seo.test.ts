import { expect, test } from 'vitest';
import { buildMeta } from './seo';

test('buildMeta: domyślny tytuł i kanoniczny URL głównej', () => {
  const m = buildMeta({});
  expect(m.title).toBe('Zrolowani — imprezowa gra planszowa');
  expect(m.canonical).toBe('https://zrolowani.pl/');
  expect(m.ogImage).toBe('https://zrolowani.pl/og.jpg');
});

test('buildMeta: tytuł sekcji z sufiksem marki i kanoniczny URL ścieżki', () => {
  const m = buildMeta({ title: 'Regulamin', path: '/regulamin' });
  expect(m.title).toBe('Regulamin — Zrolowani');
  expect(m.canonical).toBe('https://zrolowani.pl/regulamin');
});
