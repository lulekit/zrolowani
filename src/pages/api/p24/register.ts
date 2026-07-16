import type { APIRoute } from 'astro';

// Endpoint na żądanie (Worker), nie prerenderowany.
export const prerender = false;

// M4: walidacja formularza -> zapis zamówienia (status 'new') w D1 ->
// registerTransaction() -> zwrócenie redirectUrl na formatkę P24.
export const POST: APIRoute = async ({ locals }) => {
  const _env = locals.runtime.env; // dostęp do DB i sekretów P24
  return new Response(
    JSON.stringify({ ok: false, message: 'Rejestracja płatności — do implementacji (M4)' }),
    { status: 501, headers: { 'Content-Type': 'application/json' } },
  );
};
