import { test, expect } from '@playwright/test';

test('home loads and shows main CTA', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body')).toContainText(/Analisar Perfil|LuzzIA|Diagnóstico/i);
});

test('runtime badge visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('text=/offline|processando|ok|contingência/i').first()).toBeVisible();
});
