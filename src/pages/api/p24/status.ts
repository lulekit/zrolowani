import type { APIRoute } from 'astro';

// Webhook powiadomień serwerowych P24 (urlStatus). Nie prerenderowany.
export const prerender = false;

// M4: odczyt notyfikacji -> isNotificationValid() -> verifyTransaction() ->
// aktualizacja zamówienia na 'paid' w D1 -> maile (Resend).
// Księgowanie opieramy WYŁĄCZNIE na tym webhooku, nie na powrocie klienta.
export const POST: APIRoute = async ({ locals }) => {
  const _env = locals.runtime.env;
  return new Response(null, { status: 200 }); // P24 oczekuje 200 OK
};
