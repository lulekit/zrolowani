import { defineConfig } from 'drizzle-kit';

// Generuje migracje SQL do ./migrations, które nakładamy przez
// `wrangler d1 migrations apply`. Do bezpośredniego wglądu w zdalną bazę
// (drizzle-kit studio/push) uzupełnij dbCredentials i użyj driver 'd1-http'.
export default defineConfig({
  dialect: 'sqlite',
  schema: './src/db/schema.ts',
  out: './migrations',
});
