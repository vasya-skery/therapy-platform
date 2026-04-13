# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> Therapy Platform >> no critical console errors
- Location: tests\app.spec.ts:40:7

# Error details

```
Error: expect(received).toHaveLength(expected)

Expected length: 0
Received length: 2
Received array:  ["Failed to fetch RSC payload for https://therapy-platform-psi.vercel.app/therapists. Falling back to browser navigation. TypeError: Failed to fetch
    at s (https://therapy-platform-psi.vercel.app/_next/static/chunks/23-954a62256cbf4949.js:1:45242)
    at https://therapy-platform-psi.vercel.app/_next/static/chunks/23-954a62256cbf4949.js:1:58764
    at Object.u [as task] (https://therapy-platform-psi.vercel.app/_next/static/chunks/23-954a62256cbf4949.js:1:31680)
    at c.s (https://therapy-platform-psi.vercel.app/_next/static/chunks/23-954a62256cbf4949.js:1:32385)
    at c.enqueue (https://therapy-platform-psi.vercel.app/_next/static/chunks/23-954a62256cbf4949.js:1:31810)
    at s (https://therapy-platform-psi.vercel.app/_next/static/chunks/23-954a62256cbf4949.js:1:58727)
    at i (https://therapy-platform-psi.vercel.app/_next/static/chunks/23-954a62256cbf4949.js:1:58267)
    at a (https://therapy-platform-psi.vercel.app/_next/static/chunks/23-954a62256cbf4949.js:1:65047)
    at f (https://therapy-platform-psi.vercel.app/_next/static/chunks/23-954a62256cbf4949.js:1:74816)
    at Object.action (https://therapy-platform-psi.vercel.app/_next/static/chunks/23-954a62256cbf4949.js:2:7084)", "Failed to fetch RSC payload for https://therapy-platform-psi.vercel.app/auth/register. Falling back to browser navigation. TypeError: Failed to fetch
    at s (https://therapy-platform-psi.vercel.app/_next/static/chunks/23-954a62256cbf4949.js:1:45242)
    at https://therapy-platform-psi.vercel.app/_next/static/chunks/23-954a62256cbf4949.js:1:58764
    at Object.u [as task] (https://therapy-platform-psi.vercel.app/_next/static/chunks/23-954a62256cbf4949.js:1:31680)
    at c.s (https://therapy-platform-psi.vercel.app/_next/static/chunks/23-954a62256cbf4949.js:1:32385)
    at c.enqueue (https://therapy-platform-psi.vercel.app/_next/static/chunks/23-954a62256cbf4949.js:1:31810)
    at s (https://therapy-platform-psi.vercel.app/_next/static/chunks/23-954a62256cbf4949.js:1:58727)
    at i (https://therapy-platform-psi.vercel.app/_next/static/chunks/23-954a62256cbf4949.js:1:58267)
    at a (https://therapy-platform-psi.vercel.app/_next/static/chunks/23-954a62256cbf4949.js:1:65047)
    at f (https://therapy-platform-psi.vercel.app/_next/static/chunks/23-954a62256cbf4949.js:1:74816)
    at Object.action (https://therapy-platform-psi.vercel.app/_next/static/chunks/23-954a62256cbf4949.js:2:7084)"]
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - heading "Welcome back" [level=1] [ref=e4]
    - paragraph [ref=e5]: Sign in to your account
    - generic [ref=e6]:
      - generic [ref=e7]:
        - generic [ref=e8]: Email
        - textbox "your@email.com" [ref=e9]
      - generic [ref=e10]:
        - generic [ref=e11]: Password
        - textbox "********" [ref=e12]
      - button "Sign In" [ref=e13] [cursor=pointer]
    - paragraph [ref=e14]:
      - text: Don't have an account?
      - link "Create one" [ref=e15] [cursor=pointer]:
        - /url: /auth/register
  - alert [ref=e16]
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
> 58 |     expect(criticalErrors).toHaveLength(0);
     |                            ^ Error: expect(received).toHaveLength(expected)
  59 |   });
  60 | });
```