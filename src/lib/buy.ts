export interface BuyState {
  enabled: boolean;
  href: string | null;
  label: string;
}

export function resolveBuy(url: string | null | undefined): BuyState {
  const clean = (url ?? '').trim();
  if (!clean) return { enabled: false, href: null, label: 'Wkrótce w sprzedaży' };
  return { enabled: true, href: clean, label: 'KUP' };
}
