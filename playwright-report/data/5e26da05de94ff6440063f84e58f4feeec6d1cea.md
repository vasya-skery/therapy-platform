# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> Therapy Platform >> therapist list shows therapists
- Location: tests\app.spec.ts:15:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('a[href^="/therapists/"]').first()
Expected: visible
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('a[href^="/therapists/"]').first()

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - link "OpenYourMind" [ref=e4] [cursor=pointer]:
        - /url: /
      - navigation [ref=e5]:
        - link "Терапевти" [ref=e6] [cursor=pointer]:
          - /url: /therapists
        - link "Увійти" [ref=e7] [cursor=pointer]:
          - /url: /auth/login
    - main [ref=e8]:
      - generic [ref=e9]:
        - heading "Знайдіть свого терапевта" [level=1] [ref=e10]
        - paragraph [ref=e11]: Кваліфіковані спеціалісти готові допомогти
      - generic [ref=e12]:
        - textbox "Пошук за іменем або спеціалізацією..." [ref=e13]
        - generic [ref=e14]:
          - button "Усі" [ref=e15] [cursor=pointer]
          - button [ref=e16] [cursor=pointer]
          - button [ref=e17] [cursor=pointer]
          - button [ref=e18] [cursor=pointer]
          - button [ref=e19] [cursor=pointer]
          - button [ref=e20] [cursor=pointer]
          - button [ref=e21] [cursor=pointer]
          - button [ref=e22] [cursor=pointer]
          - button [ref=e23] [cursor=pointer]
          - button [ref=e24] [cursor=pointer]
          - button [ref=e25] [cursor=pointer]
          - button [ref=e26] [cursor=pointer]
          - button [ref=e27] [cursor=pointer]
      - generic [ref=e28]:
        - paragraph [ref=e29]: Терапевтів не знайдено
        - button "Скинути фільтри" [ref=e30] [cursor=pointer]
  - alert [ref=e31]
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
> 19 |     await expect(cards.first()).toBeVisible();
     |                                 ^ Error: expect(locator).toBeVisible() failed
  20 |   });
  21 | 
  22 |   test('therapist detail page loads', async ({ page }) => {
  23 |     await page.goto('/therapists/c7a16048-4803-458b-9b01-3b94ed6beba7');
  24 |     await expect(page.locator('h1')).toBeVisible();
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