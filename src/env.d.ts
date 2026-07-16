/// <reference types="astro/client" />

// Bindings i sekrety dostępne w runtime (Cloudflare). Rozszerzane w miarę
// dodawania kolejnych. Docelowo można wygenerować przez `npm run cf-typegen`.
interface Env {
  DB: import('@cloudflare/workers-types').D1Database;
  // Przelewy24
  P24_MERCHANT_ID: string;
  P24_POS_ID: string;
  P24_CRC: string;
  P24_API_KEY: string;
  P24_ENV: 'sandbox' | 'secure';
  // Resend
  RESEND_API_KEY: string;
  MAIL_FROM: string;
  MAIL_SHOP_NOTIFY: string;
  // Sklep
  ORDER_PRICE_GROSZE: string;
}

type Runtime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends Runtime {}
}
