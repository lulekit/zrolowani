import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Zamówienia (Faza 2). Migracje: `npm run db:generate` → `npm run db:migrate`.
export const orders = sqliteTable('orders', {
  id: text('id').primaryKey(), // uuid
  sessionId: text('session_id').notNull().unique(), // sessionId przekazany do P24
  p24OrderId: integer('p24_order_id'), // orderId zwrócone przez P24 po weryfikacji
  status: text('status', {
    enum: ['new', 'paid', 'shipped', 'completed', 'cancelled', 'payment_failed'],
  })
    .notNull()
    .default('new'),
  amount: integer('amount').notNull(), // w groszach
  currency: text('currency').notNull().default('PLN'),
  quantity: integer('quantity').notNull().default(1),
  customerName: text('customer_name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  shippingAddress: text('shipping_address', { mode: 'json' }).notNull(), // JSON
  createdAt: integer('created_at').notNull(),
  paidAt: integer('paid_at'),
});

export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
