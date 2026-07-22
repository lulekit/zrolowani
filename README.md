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
| `pnpm preview`          | build + podgląd Workera lokalnie (wrangler dev)      |
| `pnpm deploy:cf`        | build + wdrożenie na Cloudflare (wrangler deploy)    |
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

## Wdrożenie (Cloudflare)

Przy `astro build` adapter `@astrojs/cloudflare` generuje config Workera w
`dist/server/wrangler.json` (Worker + statyczne assety z `dist/client`) i tworzy
przekierowanie `.wrangler/deploy/config.json`, dzięki któremu `wrangler deploy`
używa go automatycznie. Root `wrangler.jsonc` to tylko config źródłowy (nazwa,
`compatibility_date`, bindingi Fazy 2) — nie ustawiamy w nim `main`/`assets`.

### Faza 1 — promo (statyczne strony + drobne trasy SSR jako stuby)

```bash
pnpm exec wrangler login        # jednorazowo
pnpm deploy:cf                  # astro build && wrangler deploy
```

> Nazwa `deploy:cf`, bo `pnpm deploy` to wbudowana komenda pnpm (deploy workspace’u).

- Wdraża prerenderowane strony + Workera. D1 jest wyłączone (zakomentowane w
  `wrangler.jsonc`), więc nie blokuje wdrożenia.
- Astro ma włączone sesje na KV (binding `SESSION`). Przy pierwszym `deploy`
  Wrangler poprosi o utworzenie namespace KV (lub utwórz ręcznie:
  `wrangler kv namespace create SESSION` i dodaj `id` do `wrangler.jsonc` w
  `kv_namespaces`). `IMAGES` i `ASSETS` są automatyczne.
- Podgląd lokalny produkcyjnego Workera: `pnpm preview`.

### Faza 2 — sprzedaż (Przelewy24, D1, maile)

1. `pnpm exec wrangler d1 create zrolowani-db` → wklej `database_id` i odkomentuj
   blok `d1_databases` w `wrangler.jsonc`.
2. `pnpm db:generate && pnpm db:migrate` — utworzenie tabel.
3. Sekrety produkcyjne: `pnpm exec wrangler secret put P24_MERCHANT_ID` itd.
4. `pnpm deploy:cf`.
5. `/admin` chroniony przez Cloudflare Access.

> Uwaga: `wrangler deploy` bez `-c` korzysta z automatycznego przekierowania do
> configu Workera. Nie uruchamiaj wranglera bezpośrednio na root `wrangler.jsonc`
> (nie ma tam `main`/`assets`).
