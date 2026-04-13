import { test, expect } from '@playwright/test';

test.describe('Therapy Platform', () => {
  test('home page loads', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/OpenYourMind/i);
    await expect(page.locator('text=OpenYourMind')).toBeVisible();
  });

  test('therapists page loads', async ({ page }) => {
    await page.goto('/therapists');
    await expect(page.locator('h1:has-text("Знайдіть свого терапевта")')).toBeVisible();
  });

  test('therapist list shows therapists', async ({ page }) => {
    await page.goto('/therapists');
    await page.waitForTimeout(2000);
    const cards = page.locator('a[href^="/therapists/"]');
    await expect(cards.first()).toBeVisible();
  });

  test('therapist detail page loads', async ({ page }) => {
    await page.goto('/therapists/c7a16048-4803-458b-9b01-3b94ed6beba7');
    await expect(page.locator('h1')).toBeVisible();
  });

  test('auth pages load', async ({ page }) => {
    await page.goto('/auth/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    
    await page.goto('/auth/register');
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test('dashboard redirects to login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/auth\/login/);
  });

  test('no critical console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('/');
    await page.goto('/therapists');
    await page.goto('/auth/login');
    
    const criticalErrors = errors.filter(e => 
      !e.includes('favicon') && 
      !e.includes('404') &&
      !e.includes('Failed to load')
    );
    
    expect(criticalErrors).toHaveLength(0);
  });
});