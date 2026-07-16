# Specyfikacja projektowa — Onepage promocyjny „Zrolowani" (M2, Faza 1)

**Data:** 2026-07-16
**Status:** do akceptacji
**Kontekst:** Faza 1 z [`PRD.md`](../../../PRD.md) — strona wyłącznie promocyjna, bez backendu. Sprzedaż (Przelewy24, D1, maile) to Faza 2 i jest poza zakresem tego dokumentu.

---

## 1. Cel

Prosta, nowoczesna, przyciągająca uwagę strona **onepage** promująca imprezową grę planszową „Zrolowani". Główny cel konwersji: przejście do zakupu (przycisk **„KUP"** → zewnętrzna oferta Allegro). Drugorzędnie: zrozumienie gry (o co chodzi, jak grać, co w pudełku).

## 2. Kierunek wizualny — „Kosmiczna impreza" (wyczyszczona)

Wybrany kierunek: **A**, w wersji dopracowanej po feedbacku (mniej gradientów, więcej przejrzystości, brak „tandetnych" efektów).

**Zasady stylu:**
- **Rytm ciemne/jasne**: ciemne kosmiczne „klamry" (nawigacja+hero, CTA końcowy, stopka) + jasne, czytelne sekcje treści w środku (biel i delikatna lawenda).
- **Jeden dominujący akcent: bursztyn** (`#F4B43F`) — podtytuł, przyciski, etykiety sekcji.
- **Gradienty tylko jako subtelna poświata** w hero i CTA (radialna, granat→prawie czerń). Nigdzie „gradientowej zupy".
- **Płaskie przyciski** (zaokrąglone rogi, wypełnienie bursztynem; brak twardych cieni 3D).
- **Kolorowe obręcze** (fiolet/żółty/czerwony/zielony/niebieski/pomarańczowy) występują **wyłącznie** przy numerach 6 kroków — bo tam są autentyczne (żetony w grze naprawdę tak wyglądają), nie jako ozdoba globalna.
- **Zdjęcia produktu na jasnym tle** — to one budują „premium", nie tło.

**Paleta (robocza, do dostrojenia w implementacji):**
| Token | Hex | Użycie |
|-------|-----|--------|
| `brand-950` | `#0B0616` | ciemne tło (hero, CTA, stopka) |
| `brand-900` | `#120A24` | ciemne karty/panele |
| `brand-800` | `#241046` | poświata gradientu |
| `brand-700` | `#5A189A` / `#7B2CBF` | fiolet akcentowy, etykiety na jasnym |
| `accent` | `#F4B43F` | bursztyn — CTA, podtytuł, etykiety |
| `paper` | `#FFFFFF` | jasne sekcje |
| `paper-lav` | `#F6F3FC` | jasne sekcje naprzemienne |
| ring 1–6 | `#7B2CBF`,`#F4B43F`,`#FF5C7A`,`#33D17A`,`#35A7FF`,`#FF9F45` | obręcze kroków |

## 3. Typografia

- **Nagłówki i UI:** **Montserrat** (600/800/900). Waga 900 dla mocnych nagłówków; spójna z krojem sloganu z materiałów.
- **Treść:** **Inter** (400/500/600).
- **Self-hosting** obu fontów (np. przez Fontsource / pliki lokalne) — bez zewnętrznego CDN (zgodność z Cloudflare/CSP, wydajność, RODO). Podzbiór `latin-ext` dla polskich znaków.
- **Logo „Zrolowani"** i **slogan** „Prezydent, superbohater, a może kosmonauta?" pozostają **grafikami** z `docs/` (`Zrolowani napis.png`, `Podtytuł- napis.png`) — pixel-perfect, brak zależności od fontu. Preferowany format docelowy: SVG/WebP z fallbackiem PNG.

## 4. Układ i sekcje (kolejność onepage)

Nawigacja kotwicowa. Sekcje:

1. **Nawigacja** — przezroczysta nad hero, przykleja się (sticky) po przewinięciu na ciemne tło. Logo (grafika) + kotwice: Gra · Zasady · Pudełko + przycisk **„KUP"** (bursztyn). Na mobile: hamburger.
2. **Hero (ciemny)** — logo (grafika), **slogan jako grafika, powiększony, obrócony ~ −3°**, krótki lead, **„KUP"** (primary) + „Jak grać" (ghost, scroll do sekcji zasad). Pod spodem pasek faktów: **2–6 graczy · 20–60 min · 14+**. Subtelne gwiazdy, delikatna animacja (patrz §6).
3. **O co chodzi (jasny)** — nagłówek + krótki opis (z `Tekst do strony.pdf`) + zdjęcie „pudełko i elementy".
4. **Dlaczego pokochasz (jasny, lawendowy)** — 5 wyróżników jako karty: przystępne zasady, regrywalność, humor, zachęca do dyskusji, szybka rozgrywka.
5. **Jak grać — 6 kroków (jasny)** — lista/siatka kroków z numerami w kolorowych obręczach + ikonami/zdjęciami z `docs/1–6.png`. Pod spodem przycisk **„Instrukcja wideo / PDF"** w stanie **„wkrótce"** (placeholder — linki nie istnieją jeszcze).
6. **Co w pudełku (jasny)** — siatka zawartości: 210 kart · 36 tabliczek · 100 żetonów · plansza · instrukcja · 2 mazaki ścieralne. Zdjęcie „elementy"/„plansza".
7. **Galeria (jasny, lawendowy)** — 3–6 zdjęć: plansza, elementy, zdjęcia lifestyle (roześmiani znajomi). Lekki lightbox opcjonalnie (nice-to-have).
8. **O nas (jasny)** — krótka notka: Netictech S.A. + Hubert Gliński (z `Tekst do strony.pdf`).

Rytm tła jest jednoznaczny: sekcje 1–2 ciemne (klamra otwarcia), sekcje 3–8 jasne (naprzemiennie biel / lawenda), sekcje 9–10 ciemne (klamra zamknięcia).
9. **CTA końcowy (ciemny)** — „Gotowy na imprezę?" + duży **„KUP"**.
10. **Stopka (ciemna)** — dane producenta (Netictech S.A., Plac Andersa 7, 61-894 Poznań) + linki do stron prawnych (istnieją jako stuby: Regulamin, Polityka prywatności, Odstąpienie, Zwroty) + kontakt.

## 5. Zachowanie CTA „KUP" (Faza 1)

- Docelowo: **link zewnętrzny do oferty Allegro** (`target="_blank" rel="noopener"`).
- URL **jeszcze nie istnieje** → sterowany jedną zmienną/stałą konfiguracyjną (np. `ALLEGRO_URL`).
  - Jeśli URL nieustawiony: przycisk pokazuje stan **„Wkrótce w sprzedaży"** (nieaktywny/disabled), by nie prowadzić donikąd.
  - Po ustawieniu URL: przycisk staje się aktywnym linkiem — bez zmian w kodzie sekcji.

## 6. Interakcje i animacje (lekko, „minimum JS")

- Delikatne pojawianie sekcji przy scrollu (fade/parallax gwiazd) — CSS + `IntersectionObserver`, z poszanowaniem `prefers-reduced-motion`.
- Sticky nav ze zmianą tła po przewinięciu.
- Hover na kartach/CTA.
- Bez ciężkich bibliotek animacji; brak blokowania renderu.

## 7. Responsywność

- **Mobile-first.** Breakpointy Tailwind (sm/md/lg).
- Hero: skalowanie logo/sloganu; slogan zachowuje skos, ale zmniejsza kąt/rozmiar na wąskich ekranach jeśli łamanie wygląda źle.
- Siatki (wyróżniki, pudełko, galeria) zwijają się do 1 kolumny na mobile.
- Nawigacja: hamburger < md.

## 8. Dostępność i jakość

- Kontrast tekstu ≥ WCAG AA (szczególnie bursztyn na ciemnym / na jasnym — do weryfikacji, ewentualnie ciemniejszy wariant bursztynu na białym).
- `alt` dla wszystkich zdjęć; slogan-grafika z `alt` = pełny tekst sloganu.
- Nawigacja klawiaturą, widoczny focus.
- SEO: `<title>`, meta description, Open Graph (obraz = pudełko/hero), dane strukturalne `Product`, `sitemap.xml`, `lang="pl"`.
- Cel Lighthouse (mobile) ≥ 90.

## 9. Komponenty (Astro)

Podział na komponenty w `src/components/`:
`Nav.astro`, `Hero.astro`, `FactsBar.astro`, `About.astro` (o co chodzi), `Features.astro`, `HowToPlay.astro`, `BoxContents.astro`, `Gallery.astro`, `Studio.astro` (o nas), `FinalCta.astro`, `Footer.astro`, plus `BuyButton.astro` (reużywalny „KUP" z logiką stanu z §5) i `SectionLabel.astro`.
`index.astro` składa je w całość; `Layout.astro` dostaje self-hostowane fonty i globalne tokeny.

Zasoby graficzne przenosimy z `docs/` do `src/assets/` (optymalizacja przez `astro:assets`), z ASCII-owymi nazwami plików (bez polskich znaków).

## 10. Poza zakresem (M2)

- Sprzedaż, formularz zamówienia, płatności, maile, panel — Faza 2.
- Treść stron prawnych (pozostają stubami do M6).
- Wersja EN (docelowo możliwa; teraz tylko PL).
- Realny film wideo i PDF instrukcji (placeholdery „wkrótce").

## 11. Do ustalenia (nie blokuje startu M2)

- URL oferty Allegro (do podpięcia pod „KUP").
- Finalne odcienie palety i kontrast bursztynu na bieli.
- Ostateczny zestaw zdjęć do galerii.
- Link do wideo (YouTube) i PDF instrukcji, gdy powstaną.
