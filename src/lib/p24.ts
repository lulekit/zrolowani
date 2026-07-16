// Helper integracji z Przelewy24 (REST API v1). Działa na Cloudflare Workers
// (Web Crypto + fetch, bez node-only SDK). Do przetestowania w sandboksie (M4).

export interface P24Config {
  merchantId: number;
  posId: number;
  crc: string;
  apiKey: string;
  env: 'sandbox' | 'secure';
}

function baseUrl(env: P24Config['env']): string {
  return env === 'sandbox' ? 'https://sandbox.przelewy24.pl' : 'https://secure.przelewy24.pl';
}

/** Podpis P24 = SHA-384 z JSON-a wybranych pól (kolejność kluczy ma znaczenie). */
async function sign(payload: Record<string, unknown>): Promise<string> {
  const data = new TextEncoder().encode(JSON.stringify(payload));
  const digest = await crypto.subtle.digest('SHA-384', data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

function authHeader(cfg: P24Config): string {
  return 'Basic ' + btoa(`${cfg.posId}:${cfg.apiKey}`);
}

export interface RegisterParams {
  sessionId: string;
  amount: number; // grosze
  description: string;
  email: string;
  urlReturn: string;
  urlStatus: string;
}

/** Rejestruje transakcję i zwraca URL formatki płatności P24. */
export async function registerTransaction(
  cfg: P24Config,
  p: RegisterParams,
): Promise<{ token: string; redirectUrl: string }> {
  const signature = await sign({
    sessionId: p.sessionId,
    merchantId: cfg.merchantId,
    amount: p.amount,
    currency: 'PLN',
    crc: cfg.crc,
  });

  const res = await fetch(`${baseUrl(cfg.env)}/api/v1/transaction/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: authHeader(cfg) },
    body: JSON.stringify({
      merchantId: cfg.merchantId,
      posId: cfg.posId,
      sessionId: p.sessionId,
      amount: p.amount,
      currency: 'PLN',
      description: p.description,
      email: p.email,
      country: 'PL',
      language: 'pl',
      urlReturn: p.urlReturn,
      urlStatus: p.urlStatus,
      sign: signature,
    }),
  });

  if (!res.ok) {
    throw new Error(`P24 register failed: ${res.status} ${await res.text()}`);
  }
  const json = (await res.json()) as { data: { token: string } };
  const token = json.data.token;
  return { token, redirectUrl: `${baseUrl(cfg.env)}/trnRequest/${token}` };
}

export interface NotificationBody {
  merchantId: number;
  posId: number;
  sessionId: string;
  amount: number;
  originAmount: number;
  currency: string;
  orderId: number;
  methodId: number;
  statement: string;
  sign: string;
}

/** Weryfikuje podpis powiadomienia serwerowego (webhook urlStatus). */
export async function isNotificationValid(cfg: P24Config, n: NotificationBody): Promise<boolean> {
  const expected = await sign({
    merchantId: n.merchantId,
    posId: n.posId,
    sessionId: n.sessionId,
    amount: n.amount,
    originAmount: n.originAmount,
    currency: n.currency,
    orderId: n.orderId,
    methodId: n.methodId,
    statement: n.statement,
    crc: cfg.crc,
  });
  return expected === n.sign;
}

/** Potwierdza transakcję po stronie P24 — dopiero to finalizuje płatność. */
export async function verifyTransaction(
  cfg: P24Config,
  p: { sessionId: string; orderId: number; amount: number },
): Promise<boolean> {
  const signature = await sign({
    sessionId: p.sessionId,
    orderId: p.orderId,
    amount: p.amount,
    currency: 'PLN',
    crc: cfg.crc,
  });

  const res = await fetch(`${baseUrl(cfg.env)}/api/v1/transaction/verify`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: authHeader(cfg) },
    body: JSON.stringify({
      merchantId: cfg.merchantId,
      posId: cfg.posId,
      sessionId: p.sessionId,
      amount: p.amount,
      currency: 'PLN',
      orderId: p.orderId,
      sign: signature,
    }),
  });
  if (!res.ok) return false;
  const json = (await res.json()) as { data: { status: string } };
  return json.data.status === 'success';
}

export function p24ConfigFromEnv(env: Env): P24Config {
  return {
    merchantId: Number(env.P24_MERCHANT_ID),
    posId: Number(env.P24_POS_ID),
    crc: env.P24_CRC,
    apiKey: env.P24_API_KEY,
    env: env.P24_ENV,
  };
}
