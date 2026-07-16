# Zrolowani

Strona promocyjna gry planszowej „Zrolowani" + sprzedaż online. Szczegóły zakresu i architektury: [`PRD.md`](./PRD.md).

## Stack

Astro 7 · Tailwind CSS 4 · Cloudflare (Pages/Workers + D1) · Drizzle ORM · Przelewy24 · Resend

## Uruchomienie

Menedżer pakietów: **pnpm** (przez corepack — `corepack enable`).

```bash
pnpm install
cp .dev.vars.example .dev.vars   # uzupełnij sekrety (Faza 2)
pnpm dev
```

## Skrypty

| Skrypt                  | Opis                                                 |
| ----------------------- | ---------------------------------------------------- |
| `pnpm dev`              | serwer deweloperski (Astro)                          |
| `pnpm build`            | build produkcyjny do `dist/`                         |
| `pnpm preview`          | build + lokalny runtime Cloudflare (wrangler)        |
| `pnpm lint`             | ESLint                                               |
| `pnpm format`           | Prettier (zapis)                                     |
| `pnpm cf-typegen`       | generuje typy bindings (`worker-configuration.d.ts`) |
| `pnpm db:generate`      | generuje migracje SQL z `src/db/schema.ts`           |
| `pnpm db:migrate:local` | nakłada migracje na lokalną D1                       |
| `pnpm db:migrate`       | nakłada migracje na zdalną D1                        |
| `pnpm vitest run`       | uruchomia testy (Vitest)                             |

## Testy

Testy jednostkowe (`src/**/*.test.ts`) uruchamiane przez **Vitest** + **Astro Container API**.
`vitest.config.ts` filtruje pluginy dev-servera i adaptera Cloudflare, aby uniknąć crasha podczas startu Vitestu
(bug [`withastro/astro#15847`](https://github.com/withastro/astro/issues/15847)).
Filtr ten nie powinien być usuwany bez uprzedniego sprawdzenia, czy bug został naprawiony.

## Struktura

```
src/
  layouts/Layout.astro       układ bazowy
  pages/
    index.astro              onepage (M2)
    zamowienie.astro         formularz zamówienia (Faza 2)
    regulamin | polityka-prywatnosci | odstapienie-od-umowy | zwroty
    api/p24/register.ts      rejestracja płatności (Faza 2)
    api/p24/status.ts        webhook P24 (Faza 2)
  db/schema.ts               model zamówień (Drizzle/D1)
  lib/p24.ts                 integracja Przelewy24
  lib/email.ts               maile transakcyjne (Resend)
  styles/global.css          Tailwind + tokeny marki
```

## Konfiguracja Cloudflare (Faza 2)

1. `pnpm exec wrangler d1 create zrolowani-db` → wklej `database_id` do `wrangler.jsonc`.
2. `pnpm db:generate && pnpm db:migrate` — utworzenie tabel.
3. Sekrety produkcyjne: `pnpm exec wrangler secret put P24_MERCHANT_ID` itd.
4. `/admin` chroniony przez Cloudflare Access.
