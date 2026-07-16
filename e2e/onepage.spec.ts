import { expect, test } from '@playwright/test';

test('nawigacja kotwicowa przewija do sekcji zasad', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Jak grać' }).click();
  await expect(page.locator('#zasady')).toBeInViewport();
});

test('przycisk KUP jest widoczny (stan „wkrótce" bez URL)', async ({ page }) => {
  await page.goto('/');
  await expect(
    page.getByText('Wkrótce w sprzedaży').filter({ visible: true }).first(),
  ).toBeVisible();
});

test('menu mobilne otwiera się i zamyka po kliknięciu linku', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto('/');
  const menu = page.locator('[data-nav-menu]');
  await expect(menu).toBeHidden();
  await page.locator('[data-nav-toggle]').click();
  await expect(menu).toBeVisible();
  await menu.getByRole('link', { name: 'Pudełko' }).click();
  await expect(menu).toBeHidden();
});
