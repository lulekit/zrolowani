# PRD — Strona gry „Zrolowani" + sprzedaż online

**Wersja:** 1.0
**Data:** 2026-07-16
**Autor:** zespół projektowy
**Status:** szkic do akceptacji

---

## 1. Cel i kontekst

„Zrolowani" to imprezowa gra planszowa (2–6 graczy, 20–60 min, 14+), wyprodukowana przez **Netictech S.A.** (Plac Andersa 7, 61-894 Poznań) we współpracy z pomysłodawcą **Hubertem Glińskim**.

Cel projektu: stworzyć **prostą, nowoczesną i przyciągającą uwagę stronę promującą grę**, a następnie — jako osobny, większy zakres prac — **umożliwić sprzedaż bezpośrednią** z integracją bramki płatności.

Projekt świadomie dzielimy na **dwie fazy**, bo różnią się nakładem pracy, ryzykiem i wymaganiami hostingowymi.

---

## 2. Zakres

### Faza 1 — Strona promocyjna (onepage)

Statyczna, szybka strona prezentująca grę. Może działać na hostingu statycznym. Bez backendu.

### Faza 2 — Sprzedaż bezpośrednia + płatności

Formularz zamówienia, integracja z Przelewy24, backend zamówień, webhooki, maile transakcyjne, panel obsługi zamówień, dokumenty prawne. Wymaga środowiska z obsługą API i bazy danych.

**Nie w zakresie (świadomie pomijamy):**

- Koszyk i wielotowarowe zamówienia (sprzedajemy 1 produkt o stałej cenie).
- Konta użytkowników / logowanie klientów.
- Zaawansowany panel e-commerce (magazyn, rabaty, warianty).
- Integracja z zewnętrznym marketplace (Allegro) — traktowana jako niezależny kanał.

---

## 3. Grupa docelowa

Osoby szukające lekkiej gry imprezowej na spotkania ze znajomymi (studenci, młodzi dorośli, 14+), kupujący prezenty, sklepy/hurtownie jako potencjalny kanał B2B (kontakt).

---

## 4. Wymagania funkcjonalne — Faza 1 (strona promocyjna)

Układ **onepage** z nawigacją kotwicową (bez sztywnego podziału Home / Produkty / O nas / Kontakt).

| #    | Sekcja            | Treść                                                                                                                               |
| ---- | ----------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| F1.1 | Hero              | Logo „Zrolowani", slogan „Prezydent, superbohater, a może kosmonauta?", zdjęcie pudełka, CTA „KUP" (Faza 2) / „Dowiedz się więcej". |
| F1.2 | Krótki opis gry   | Opis z materiałów + dane: 2–6 graczy, 20–60 min, 14+.                                                                               |
| F1.3 | Co wyróżnia grę   | Przystępne zasady, regrywalność, humor, zachęca do dyskusji, szybka rozgrywka.                                                      |
| F1.4 | Jak grać / Zasady | 6 kroków z ikonami/zdjęciami (wg konceptu strony).                                                                                  |
| F1.5 | Instrukcja wideo  | Osadzony/link do YouTube + link do instrukcji PDF.                                                                                  |
| F1.6 | Zawartość pudełka | 210 kart, 36 tabliczek, 100 żetonów, instrukcja, 2 mazaki ścieralne, plansza.                                                       |
| F1.7 | Galeria           | Zdjęcia produktowe i lifestyle (elementy, plansza, ludzie grający).                                                                 |
| F1.8 | O nas / Producent | Netictech S.A. + Hubert Gliński.                                                                                                    |
| F1.9 | Stopka            | Dane producenta, linki do dokumentów prawnych (Faza 2), kontakt.                                                                    |

Wymagania jakościowe strony: RWD (mobile-first), szybkie ładowanie, spójna kosmiczno-fioletowa identyfikacja wizualna z materiałów, minimum JS.

---

## 5. Wymagania funkcjonalne — Faza 2 (sprzedaż + płatności)

| #    | Wymaganie                                                                                                                                                                        |
| ---- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| F2.1 | Strona `/zamowienie`: formularz kupującego (imię i nazwisko, e-mail, telefon, adres dostawy, ilość, zgody/RODO, akceptacja regulaminu). Bez koszyka — jeden produkt, stała cena. |
| F2.2 | Rejestracja transakcji w Przelewy24 (REST API `transaction/register`) i przekierowanie klienta na `secure.przelewy24.pl/trnRequest/{token}`.                                     |
| F2.3 | Endpoint webhook (`urlStatus`) — asynchroniczne powiadomienie serwerowe od P24. **Księgowanie zamówienia opieramy wyłącznie na webhooku**, nie na powrocie klienta.              |
| F2.4 | Weryfikacja podpisu powiadomienia + potwierdzenie `transaction/verify` przed oznaczeniem „opłacone".                                                                             |
| F2.5 | Strona powrotu (`urlReturn`) — „Dziękujemy za zamówienie" (tylko UX).                                                                                                            |
| F2.6 | Zapis zamówień w bazie (Cloudflare D1) wraz ze statusami.                                                                                                                        |
| F2.7 | Maile transakcyjne (Resend): potwierdzenie złożenia zamówienia + potwierdzenie płatności. Powiadomienie do sprzedawcy o nowym zamówieniu.                                        |
| F2.8 | Panel obsługi zamówień: podgląd listy i zmiana statusów (nowe → opłacone → wysłane → zrealizowane / anulowane). Trasa `/admin` zabezpieczona przez Cloudflare Access.            |
| F2.9 | Obsługa błędów i płatności anulowanych/odrzuconych; testy w sandboksie P24.                                                                                                      |

**Statusy zamówienia:** `new` → `paid` → `shipped` → `completed`; ścieżki poboczne: `cancelled`, `payment_failed`.

**Kanał awaryjny:** ręczny „Generator linku" w panelu P24 do zamówień telefonicznych/mailowych (bez integracji).

---

## 6. Stack technologiczny

| Warstwa            | Technologia                                                  | Uzasadnienie                                                                                                        |
| ------------------ | ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| Framework          | **Astro 7**                                                  | Strona statyczna (SSG) domyślnie; endpointy sprzedaży opt-in przez `prerender = false`. Jeden codebase dla obu faz. |
| Style              | **Tailwind CSS 4** (`@tailwindcss/vite`)                     | Szybkie, nowoczesne UI; konfiguracja w CSS (`@import "tailwindcss"`).                                               |
| Interaktywność     | Astro Islands (minimum JS)                                   | Tylko formularz zamówienia.                                                                                         |
| Hosting            | **Cloudflare Pages/Workers** + adapter `@astrojs/cloudflare` | Globalny CDN, darmowy SSL, niski koszt, serverless.                                                                 |
| Baza danych        | **Cloudflare D1** + **Drizzle ORM**                          | Serverless SQLite, wystarczające dla małego wolumenu; type-safe zapytania i migracje.                               |
| Płatności          | **Przelewy24** (REST API + weryfikacja podpisu)              | Popularna w PL, BLIK/karty/przelewy; integracja bez „node-only" SDK — działa na Workers.                            |
| E-mail             | **Resend**                                                   | Maile transakcyjne (CF nie wysyła maili natywnie).                                                                  |
| Autoryzacja panelu | **Cloudflare Access**                                        | Ochrona `/admin` bez pisania własnego auth.                                                                         |

Wersje bazowe (na dzień utworzenia): astro `^7.1`, @astrojs/cloudflare `^14.1`, tailwindcss/@tailwindcss/vite `^4.3`, drizzle-orm `^0.45`, drizzle-kit `^0.31`, wrangler `^4.11`, resend `^6.17`.

---

## 7. Architektura

```
Przeglądarka
   │
   ├── Strony statyczne (SSG, prerender) ── CDN Cloudflare
   │      hero, opis, zasady, galeria, o nas, strony prawne
   │
   └── /zamowienie ─┐
                    ▼
        Astro endpoint (Worker, prerender=false)
          POST /api/p24/register ──► Przelewy24 (register) ──► token
                    │                                          │
                    └──────── redirect ► secure.przelewy24.pl/trnRequest/{token}
                                                               │
        POST /api/p24/status  ◄──── webhook (notyfikacja) ─────┘
          weryfikacja podpisu → transaction/verify → D1 (paid) → Resend (maile)
```

---

## 8. Model danych (D1 — tabela `orders`)

| Pole             | Typ         | Opis                                                          |
| ---------------- | ----------- | ------------------------------------------------------------- |
| id               | text (uuid) | PK, wewnętrzny identyfikator                                  |
| session_id       | text        | `sessionId` przekazany do P24 (unikalny)                      |
| p24_order_id     | integer     | `orderId` zwrócone przez P24 po weryfikacji                   |
| status           | text        | new / paid / shipped / completed / cancelled / payment_failed |
| amount           | integer     | kwota w groszach                                              |
| currency         | text        | PLN                                                           |
| quantity         | integer     | liczba sztuk                                                  |
| customer_name    | text        | imię i nazwisko                                               |
| email            | text        | e-mail kupującego                                             |
| phone            | text        | telefon                                                       |
| shipping_address | text (JSON) | adres dostawy                                                 |
| created_at       | integer     | timestamp                                                     |
| paid_at          | integer     | timestamp opłacenia                                           |

---

## 9. Przepływ płatności Przelewy24 (szczegóły)

1. Klient wypełnia `/zamowienie` → utworzenie rekordu `orders` ze statusem `new` i unikalnym `sessionId`.
2. Worker wywołuje `POST /api/v1/transaction/register` (kwota, waluta, opis, `sessionId`, `urlReturn`, `urlStatus`, dane klienta, podpis SHA-384).
3. Redirect klienta na `https://secure.przelewy24.pl/trnRequest/{token}`.
4. Klient płaci (BLIK/karta/przelew) na formatce P24.
5. P24 wywołuje `urlStatus` (webhook) → weryfikujemy podpis → `POST /api/v1/transaction/verify`.
6. Po pozytywnej weryfikacji: `status = paid`, `paid_at`, wysyłka maili (klient + sprzedawca).
7. Klient wraca na `urlReturn` → strona „Dziękujemy".

Środowiska: **sandbox** (`sandbox.przelewy24.pl`) do testów, produkcja (`secure.przelewy24.pl`). Sekrety: `merchantId`, `posId`, `CRC`, `apiKey` — w zmiennych środowiskowych Cloudflare (nie w repo).

---

## 10. Wymagania prawne (Faza 2)

Wymóg sprzedaży internetowej, niezależny od wybranej bramki:

- Regulamin sprzedaży.
- Polityka prywatności / RODO + zgody w formularzu.
- Informacja o prawie odstąpienia od umowy (14 dni).
- Formularz zwrotu.
- Obowiązek informacyjny o producencie/sprzedawcy w stopce.
- SSL (zapewniony przez Cloudflare).

---

## 11. Wymagania niefunkcjonalne

- **Wydajność:** Lighthouse ≥ 90 (mobile), minimalny JS, optymalizacja obrazów.
- **SEO:** meta tagi, Open Graph, dane strukturalne (Product), `sitemap.xml`.
- **Dostępność:** kontrast, alt-teksty, nawigacja klawiaturą.
- **RODO:** minimalizacja danych, zgody, retencja danych zamówień.
- **Bezpieczeństwo:** sekrety poza repo, weryfikacja podpisów webhooków, HTTPS wymuszony.
- **Język:** polski (docelowo możliwość dodania EN).

---

## 12. Zasoby (z katalogu `docs/`)

- Grafiki: `Zrolowani napis.png`, `Podtytuł- napis.png`, `pudełko.jpg`, `pudełko i elementy.jpg`, `elementy.jpg`, `plansza.jpg`, `gra i dłonie.jpg`, `ludzie grający 2.jpg`, `1–6.png` (kroki zasad), `tekstura/`.
- Teksty: `Tekst do strony.pdf` (opisy, dane, zawartość, „o nas").
- Koncept układu: `Koncept strony.pdf`.

---

## 13. Do ustalenia (otwarte pytania)

- [ ] Cena gry (brutto) i koszt/metoda dostawy (paczkomat InPost / kurier / odbiór?).
- [ ] Domena i adres e-mail nadawcy dla Resend (weryfikacja domeny SPF/DKIM).
- [ ] Czy konto Przelewy24 już istnieje (potrzebne klucze `merchantId`/`posId`/`CRC`/`apiKey`).
- [ ] Link do instrukcji wideo (YouTube) i do instrukcji PDF.
- [ ] Obszar wysyłki (tylko Polska?) i ewentualne progi darmowej dostawy.
- [ ] Dane do faktur / integracja z fakturowaniem (poza zakresem MVP?).

---

## 14. Kamienie milowe

1. **M1 — Scaffold + PRD** ✅ (setup projektu, stack, ten dokument).
2. **M2 — Onepage promocyjny** (Faza 1): pełna strona z treścią i grafikami, wdrożenie na Cloudflare Pages.
3. **M3 — Backend zamówień** (Faza 2): D1 + schemat, formularz `/zamowienie`, model danych.
4. **M4 — Integracja Przelewy24** (sandbox): register + webhook + verify.
5. **M5 — Maile + panel admina**: Resend + `/admin` za Cloudflare Access.
6. **M6 — Dokumenty prawne + testy E2E** i przejście na produkcję P24.
