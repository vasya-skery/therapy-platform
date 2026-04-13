# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: app.spec.ts >> Therapy Platform >> home page loads
- Location: tests\app.spec.ts:4:7

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: locator('text=OpenYourMind')
Expected: visible
Error: strict mode violation: locator('text=OpenYourMind') resolved to 5 elements:
    1) <a href="/" class="Header_logo__j7oID">OpenYourMind</a> aka getByRole('link', { name: 'OpenYourMind', exact: true })
    2) <h2 class="HowItWorks_title__ZTEiQ">How OpenYourMind works</h2> aka getByRole('heading', { name: 'How OpenYourMind works' })
    3) <h4>OpenYourMind</h4> aka getByRole('heading', { name: 'OpenYourMind', exact: true })
    4) <a href="mailto:hello@openyourmind.app">hello@openyourmind.app</a> aka getByRole('link', { name: 'hello@openyourmind.app' })
    5) <p>© 2024-2025 OpenYourMind</p> aka getByText('© 2024-2025 OpenYourMind')

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for locator('text=OpenYourMind')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - generic [ref=e4]:
      - link "OpenYourMind" [ref=e5] [cursor=pointer]:
        - /url: /
      - navigation [ref=e6]:
        - link "Терапевти" [ref=e7] [cursor=pointer]:
          - /url: /therapists
        - link "Про нас" [ref=e8] [cursor=pointer]:
          - /url: /#about
        - link "FAQ" [ref=e9] [cursor=pointer]:
          - /url: /#faq
      - generic [ref=e10]:
        - link "Увійти" [ref=e11] [cursor=pointer]:
          - /url: /auth/login
        - link "Знайти терапевта" [ref=e12] [cursor=pointer]:
          - /url: /therapists
    - generic [ref=e14]:
      - heading "Free online therapy that opens your mind" [level=1] [ref=e15]:
        - text: Free online therapy
        - text: that opens your mind
      - paragraph [ref=e16]: Find licensed therapists who understand you. Your perfect match in minutes. 100% free.
      - generic [ref=e17]:
        - link "Find a Therapist" [ref=e18] [cursor=pointer]:
          - /url: /therapists
        - link "Get Started Free" [ref=e19] [cursor=pointer]:
          - /url: /auth/register
    - generic [ref=e21]:
      - generic [ref=e22]:
        - generic [ref=e23]: 50,000+
        - text: Sessions provided
      - generic [ref=e24]:
        - generic [ref=e25]: 98%
        - text: Clients report positive changes
      - generic [ref=e26]:
        - generic [ref=e27]: 5 min
        - text: Average matching time
      - generic [ref=e28]:
        - generic [ref=e29]: 500+
        - text: Licensed specialists
    - generic [ref=e31]:
      - heading "How OpenYourMind works" [level=2] [ref=e32]
      - generic [ref=e33]:
        - generic [ref=e34]:
          - generic [ref=e35]:
            - generic [ref=e36]: 🔍
            - generic [ref=e37]: "1"
          - heading "Find the therapist" [level=3] [ref=e38]
          - paragraph [ref=e39]: After a short questionnaire, you will receive a personalized selection of therapists for achieving your goals.
        - generic [ref=e40]:
          - generic [ref=e41]:
            - generic [ref=e42]: 💬
            - generic [ref=e43]: "2"
          - heading "Start your therapy" [level=3] [ref=e44]
          - paragraph [ref=e45]: Connect with your therapist in chat. Ask questions and book a convenient time slot from the calendar.
        - generic [ref=e46]:
          - generic [ref=e47]:
            - generic [ref=e48]: 📅
            - generic [ref=e49]: "3"
          - heading "Book sessions regularly" [level=3] [ref=e50]
          - paragraph [ref=e51]: Easily book available sessions and have therapy at any convenient time that works for you.
      - button "Find a therapist" [ref=e53] [cursor=pointer]
    - generic [ref=e55]:
      - heading "Our team of therapists" [level=2] [ref=e56]
      - generic [ref=e67]:
        - generic [ref=e68]:
          - heading "Licensed providers" [level=3] [ref=e69]
          - paragraph [ref=e70]: All our psychologists and psychotherapists have certificates and pass documents verification process.
        - generic [ref=e71]:
          - heading "Range expertise" [level=3] [ref=e72]
          - paragraph [ref=e73]: Our therapists work with 30+ different specializations and treatment methods.
        - generic [ref=e74]:
          - heading "Your perfect match" [level=3] [ref=e75]
          - paragraph [ref=e76]: Go through our questionnaire and get the best match from more than 500 therapists with our algorithm.
      - button "Find a therapist" [ref=e78] [cursor=pointer]
    - generic [ref=e80]:
      - heading "Our clients' reviews" [level=2] [ref=e81]
      - generic [ref=e82]:
        - generic [ref=e83]:
          - generic [ref=e84]: ★★★★★
          - paragraph [ref=e85]: "\"I am satisfied. I like that the psychologist immediately starts with practical tasks and explains what he wants to achieve.\""
          - text: Sarah M.
        - generic [ref=e86]:
          - generic [ref=e87]: ★★★★★
          - paragraph [ref=e88]: "\"I am very pleased with the work with the specialist. I liked the individual approach, responsiveness, and empathy.\""
          - text: James K.
        - generic [ref=e89]:
          - generic [ref=e90]: ★★★★★
          - paragraph [ref=e91]: "\"I came with an abstract request and Jennifer writes everything down and tries to find out how to help me. The manner of communication is relaxing.\""
          - text: Emily R.
        - generic [ref=e92]:
          - generic [ref=e93]: ★★★★★
          - paragraph [ref=e94]: "\"Kate is a wonderful specialist! Our sessions help me keep my head organized, and I always look forward to the next meeting!\""
          - text: Michael T.
      - button "Find a therapist" [ref=e96] [cursor=pointer]
    - generic [ref=e98]:
      - heading "Topics we help with" [level=2] [ref=e99]
      - generic [ref=e100]:
        - generic [ref=e101]: Depression
        - generic [ref=e102]: Anxiety
        - generic [ref=e103]: Self-esteem
        - generic [ref=e104]: Fatigue
        - generic [ref=e105]: Irritability
        - generic [ref=e106]: Loneliness
        - generic [ref=e107]: Self-determination
        - generic [ref=e108]: OCD
    - generic [ref=e110]:
      - heading "Questions & answers" [level=2] [ref=e111]
      - generic [ref=e112]:
        - generic [ref=e113]:
          - button "How to formulate a request to a psychologist? +" [ref=e114] [cursor=pointer]:
            - text: How to formulate a request to a psychologist?
            - generic [ref=e115]: +
          - paragraph [ref=e116]: "It can be very difficult to identify the root of a problem on your own. Do not worry — a psychotherapist can help formulate your request. Describe the problem's symptomatology: what is bothering you, how it affects your life, and what it might be related to."
        - generic [ref=e117]:
          - button "What is the difference between a psychologist, psychotherapist and psychiatrist? +" [ref=e118] [cursor=pointer]:
            - text: What is the difference between a psychologist, psychotherapist and psychiatrist?
            - generic [ref=e119]: +
          - paragraph [ref=e120]: A psychologist has a college degree in Psychology. A psychotherapist has higher education (MA or PhD) plus post-degree experience. A psychiatrist has a medical degree and can prescribe medication. For most people without pronounced mental disorders, an applied psychologist is sufficient.
        - generic [ref=e121]:
          - button "How can I pay for the session? +" [ref=e122] [cursor=pointer]:
            - text: How can I pay for the session?
            - generic [ref=e123]: +
          - paragraph [ref=e124]: You should make the payment no later than 24 hours before the session using the link in the chat with a specialist. Payment can also be made from foreign banks.
        - generic [ref=e125]:
          - button "How much does a psychotherapy cost? +" [ref=e126] [cursor=pointer]:
            - text: How much does a psychotherapy cost?
            - generic [ref=e127]: +
          - paragraph [ref=e128]: On our platform, there are specialists with prices ranging from $20 to $100 for a 50-minute session. The price depends on the therapist's qualifications and experience.
        - generic [ref=e129]:
          - button "What can I expect in the first session? +" [ref=e130] [cursor=pointer]:
            - text: What can I expect in the first session?
            - generic [ref=e131]: +
          - paragraph [ref=e132]: The first session is an introductory meeting. Your specialist will ask about what brought you to therapy and ask questions about various life events. The duration is usually 50 minutes.
        - generic [ref=e133]:
          - button "Is everything I say in the session confidential? +" [ref=e134] [cursor=pointer]:
            - text: Is everything I say in the session confidential?
            - generic [ref=e135]: +
          - paragraph [ref=e136]: Yes, the communication between you and the specialist takes place directly between you two, without any involvement on our part. Everything that happens during the session is completely confidential.
    - generic [ref=e138]:
      - generic [ref=e139]:
        - heading "More than 500 therapists are ready to help you now" [level=2] [ref=e140]
        - button "Find a therapist" [ref=e141] [cursor=pointer]
      - generic [ref=e142]:
        - generic [ref=e143]:
          - heading "OpenYourMind" [level=4] [ref=e144]
          - link "About" [ref=e145] [cursor=pointer]:
            - /url: /about
          - link "Approaches" [ref=e146] [cursor=pointer]:
            - /url: /approaches
          - link "For Therapists" [ref=e147] [cursor=pointer]:
            - /url: /for-therapists
          - link "FAQ" [ref=e148] [cursor=pointer]:
            - /url: /faq
        - generic [ref=e149]:
          - heading "Legal" [level=4] [ref=e150]
          - link "Terms of Use" [ref=e151] [cursor=pointer]:
            - /url: /terms
          - link "Privacy Policy" [ref=e152] [cursor=pointer]:
            - /url: /privacy
        - generic [ref=e153]:
          - heading "Contact" [level=4] [ref=e154]
          - link "hello@openyourmind.app" [ref=e155] [cursor=pointer]:
            - /url: mailto:hello@openyourmind.app
      - paragraph [ref=e157]: © 2024-2025 OpenYourMind
  - alert [ref=e158]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Therapy Platform', () => {
  4  |   test('home page loads', async ({ page }) => {
  5  |     await page.goto('/');
  6  |     await expect(page).toHaveTitle(/OpenYourMind/i);
> 7  |     await expect(page.locator('text=OpenYourMind')).toBeVisible();
     |                                                     ^ Error: expect(locator).toBeVisible() failed
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
  58 |     expect(criticalErrors).toHaveLength(0);
  59 |   });
  60 | });
```