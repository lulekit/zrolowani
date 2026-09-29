import { ALLEGRO_URL, PRICE_PLN, SITE_URL } from './site';

export interface Meta {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
  noindex: boolean;
}

const DEFAULT_TITLE = 'Zrolowani — imprezowa gra planszowa dla znajomych';
const DEFAULT_DESC =
  'Zrolowani to imprezowa gra planszowa dla 2–6 osób od 14 lat. Dopasuj znajomych do zwariowanych ról w tajnym głosowaniu — 210 kart i mnóstwo śmiechu.';

export const OG_IMAGE = { path: '/og.jpg', width: 1200, height: 630 };

export function buildMeta(o: {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
  noindex?: boolean;
}): Meta {
  const title = o.title ? `${o.title} — Zrolowani` : DEFAULT_TITLE;
  const path = o.path ?? '/';
  const canonical = `${SITE_URL}${path}`;
  return {
    title,
    description: o.description ?? DEFAULT_DESC,
    canonical,
    ogImage: o.ogImage ?? `${SITE_URL}${OG_IMAGE.path}`,
    noindex: o.noindex ?? false,
  };
}

type JsonLdNode = Record<string, unknown> & { '@type': string | string[] };

/** schema.org graph for the home page: publisher, website and the game itself. */
export function buildJsonLd(): { '@context': string; '@graph': JsonLdNode[] } {
  const orgId = `${SITE_URL}/#organization`;
  const siteId = `${SITE_URL}/#website`;
  const productId = `${SITE_URL}/#product`;

  const product: JsonLdNode = {
    '@type': ['Product', 'Game'],
    '@id': productId,
    name: 'Zrolowani',
    description: DEFAULT_DESC,
    url: `${SITE_URL}/`,
    image: `${SITE_URL}${OG_IMAGE.path}`,
    category: 'Gry planszowe > Gry imprezowe',
    brand: { '@type': 'Brand', name: 'Netictech GAMES' },
    manufacturer: { '@id': orgId },
    numberOfPlayers: { '@type': 'QuantitativeValue', minValue: 2, maxValue: 6 },
    audience: { '@type': 'PeopleAudience', suggestedMinAge: 14 },
    inLanguage: 'pl-PL',
  };

  // Google rejects offers without a price, so the Offer is emitted only once it's configured.
  if (ALLEGRO_URL && PRICE_PLN !== null) {
    product.offers = {
      '@type': 'Offer',
      url: ALLEGRO_URL,
      price: PRICE_PLN.toFixed(2),
      priceCurrency: 'PLN',
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    };
  }

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': orgId,
        name: 'Netictech S.A.',
        alternateName: 'Cybernetic Technologies Netictech S.A.',
        url: `${SITE_URL}/`,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Plac Andersa 7',
          postalCode: '61-894',
          addressLocality: 'Poznań',
          addressCountry: 'PL',
        },
      },
      {
        '@type': 'WebSite',
        '@id': siteId,
        name: 'Zrolowani',
        url: `${SITE_URL}/`,
        inLanguage: 'pl-PL',
        publisher: { '@id': orgId },
      },
      product,
    ],
  };
}
