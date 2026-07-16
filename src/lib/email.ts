import { Resend } from 'resend';

// Maile transakcyjne przez Resend (Faza 2). Treści do dopracowania w M5.

export async function sendOrderConfirmation(
  env: Env,
  to: string,
  order: { id: string; amount: number },
): Promise<void> {
  const resend = new Resend(env.RESEND_API_KEY);
  await resend.emails.send({
    from: env.MAIL_FROM,
    to,
    subject: 'Potwierdzenie zamówienia — Zrolowani',
    html: `<p>Dziękujemy za zamówienie ${order.id}.</p>`,
  });
}

export async function sendPaymentConfirmation(
  env: Env,
  to: string,
  order: { id: string; amount: number },
): Promise<void> {
  const resend = new Resend(env.RESEND_API_KEY);
  await resend.emails.send({
    from: env.MAIL_FROM,
    to,
    subject: 'Płatność potwierdzona — Zrolowani',
    html: `<p>Potwierdzamy płatność za zamówienie ${order.id}. Wkrótce je wyślemy.</p>`,
  });
}
