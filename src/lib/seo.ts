import { SITE_URL } from './site';

export interface Meta {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
}

const DEFAULT_TITLE = 'Zrolowani — imprezowa gra planszowa';
const DEFAULT_DESC =
  'Prezydent, superbohater, a może kosmonauta? Zrolowani to szybka, imprezowa gra, w której dopasowujesz znajomych do zwariowanych ról.';

export function buildMeta(o: {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
}): Meta {
  const title = o.title ? `${o.title} — Zrolowani` : DEFAULT_TITLE;
  const path = o.path ?? '/';
  const canonical = `${SITE_URL}${path === '/' ? '/' : path}`;
  return {
    title,
    description: o.description ?? DEFAULT_DESC,
    canonical,
    ogImage: o.ogImage ?? `${SITE_URL}/og.jpg`,
  };
}
