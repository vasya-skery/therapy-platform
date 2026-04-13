# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> Therapy Platform >> therapist detail page loads
- Location: tests\app.spec.ts:22:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('h1')
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('h1')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]: Терапевта не знайдено
  - alert [ref=e3]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Therapy Platform', () => {
  4  |   test('home page loads', async ({ page }) => {
  5  |     await page.goto('/');
  6  |     await expect(page).toHaveTitle(/OpenYourMind/i);
  7  |     await expect(page.locator('text=OpenYourMind')).toBeVisible();
  8  |   });
  9  | 
  10 |   test('therapists page loads', async ({ page }) => {
  11 |     await page.goto('/therapists');
  12 |     await expect(page.locator('h1:has-text("Знайдіть свого терапевта")')).toBeVisible();
  13 |   });
  14 | 
  15 |   test('therapist list shows therapists', async ({ page }) => {
  16 |     await page.goto('/therapists');
  17 |     await page.waitForTimeout(2000);
  18 |     const cards = page.locator('a[href^="/therapists/"]');
  19 |     await expect(cards.first()).toBeVisible();
  20 |   });
  21 | 
  22 |   test('therapist detail page loads', async ({ page }) => {
  23 |     await page.goto('/therapists/c7a16048-4803-458b-9b01-3b94ed6beba7');
> 24 |     await expect(page.locator('h1')).toBeVisible();
     |                                      ^ Error: expect(locator).toBeVisible() failed
  25 |   });
  26 | 
  27 |   test('auth pages load', async ({ page }) => {
  28 |     await page.goto('/auth/login');
  29 |     await expect(page.locator('input[type="email"]')).toBeVisible();
  30 |     
  31 |     await page.goto('/auth/register');
  32 |     await expect(page.locator('input[type="email"]')).toBeVisible();
  33 |   });
  34 | 
  35 |   test('dashboard redirects to login', async ({ page }) => {
  36 |     await page.goto('/dashboard');
  37 |     await expect(page).toHaveURL(/auth\/login/);
  38 |   });
  39 | 
  40 |   test('no critical console errors', async ({ page }) => {
  41 |     const errors: string[] = [];
  42 |     page.on('console', msg => {
  43 |       if (msg.type() === 'error') {
  44 |         errors.push(msg.text());
  45 |       }
  46 |     });
  47 |     
  48 |     await page.goto('/');
  49 |     await page.goto('/therapists');
  50 |     await page.goto('/auth/login');
  51 |     
  52 |     const criticalErrors = errors.filter(e => 
  53 |       !e.includes('favicon') && 
  54 |       !e.includes('404') &&
  55 |       !e.includes('Failed to load')
  56 |     );
  57 |     
  58 |     expect(criticalErrors).toHaveLength(0);
  59 |   });
  60 | });
```