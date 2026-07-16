# Zrolowani

Strona promocyjna gry planszowej „Zrolowani" + sprzedaż online. Szczegóły zakresu i architektury: [`PRD.md`](./PRD.md).

## Stack

Astro 7 · Tailwind CSS 4 · Cloudflare (Pages/Workers + D1) · Drizzle ORM · Przelewy24 · Resend

## Uruchomienie

```bash
npm install
cp .dev.vars.example .dev.vars   # uzupełnij sekrety (Faza 2)
npm run dev
```

## Skrypty

| Skrypt                     | Opis                                                 |
| -------------------------- | ---------------------------------------------------- |
| `npm run dev`              | serwer deweloperski (Astro)                          |
| `npm run build`            | build produkcyjny do `dist/`                         |
| `npm run preview`          | build + lokalny runtime Cloudflare (wrangler)        |
| `npm run cf-typegen`       | generuje typy bindings (`worker-configuration.d.ts`) |
| `npm run db:generate`      | generuje migracje SQL z `src/db/schema.ts`           |
| `npm run db:migrate:local` | nakłada migracje na lokalną D1                       |
| `npm run db:migrate`       | nakłada migracje na zdalną D1                        |

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

1. `npx wrangler d1 create zrolowani-db` → wklej `database_id` do `wrangler.jsonc`.
2. `npm run db:generate && npm run db:migrate` — utworzenie tabel.
3. Sekrety produkcyjne: `npx wrangler secret put P24_MERCHANT_ID` itd.
4. `/admin` chroniony przez Cloudflare Access.
