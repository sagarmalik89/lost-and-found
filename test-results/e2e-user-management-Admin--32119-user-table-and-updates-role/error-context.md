# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\user-management.spec.ts >> Admin User Management >> loads user table and updates role
- Location: e2e\user-management.spec.ts:15:7

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[name="email"]')

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - navigation [ref=e2]:
    - generic [ref=e3]:
      - img "Logo" [ref=e4]
      - text: Saraswati Inter College
    - list [ref=e5]:
      - listitem [ref=e6]:
        - link " Home" [ref=e7] [cursor=pointer]:
          - /url: "#hero"
          - generic [ref=e8]: 
          - text: Home
      - listitem [ref=e9]:
        - link " About Us" [ref=e10] [cursor=pointer]:
          - /url: "#about"
          - generic [ref=e11]: 
          - text: About Us
      - listitem [ref=e12]:
        - link "school Admission" [ref=e13] [cursor=pointer]:
          - /url: "#admission"
          - generic [ref=e14]: school
          - text: Admission
      - listitem [ref=e15]:
        - link " Gallery" [ref=e16] [cursor=pointer]:
          - /url: "#gallery"
          - generic [ref=e17]: 
          - text: Gallery
      - listitem [ref=e18]:
        - link " Contact Us" [ref=e19] [cursor=pointer]:
          - /url: "#contact"
          - generic [ref=e20]: 
          - text: Contact Us
    - generic [ref=e21]: ☰
  - generic [ref=e22]:
    - img "Campus" [ref=e23]
    - generic [ref=e24]:
      - heading "Welcome to Malik Computer Center" [level=1] [ref=e25]
      - paragraph [ref=e26]: Where tomorrow's leaders are shaped today.
      - link "Calculate Tuition" [ref=e27] [cursor=pointer]:
        - /url: "#tuition"
  - generic [ref=e28]:
    - heading "About Us" [level=2] [ref=e29]
    - paragraph [ref=e30]: Horizon Academy is an elite institution dedicated to fostering excellence in academics, arts, and athletics. Our state‑of‑the‑art facilities and world‑class faculty empower students to achieve their fullest potential.
    - img "Principal" [ref=e31]
    - paragraph [ref=e32]: Dr. Maya Patel – Principal
  - generic [ref=e33]:
    - heading "Tuition Calculator" [level=2] [ref=e34]
    - generic [ref=e35]:
      - text: "Number of Semesters:"
      - spinbutton "Number of Semesters:" [ref=e36]: "1"
      - text: "Fee per Semester (₹):"
      - spinbutton "Fee per Semester (₹):" [ref=e37]: "50000"
      - text: "Discount (%):"
      - spinbutton "Discount (%):" [ref=e38]: "0"
      - button "Calculate" [ref=e39]
      - paragraph
  - generic [ref=e40]:
    - heading "Admission" [level=2] [ref=e41]
    - paragraph [ref=e42]: Explore our admission process, requirements, and how to apply.
  - generic [ref=e43]:
    - heading "Campus Gallery" [level=2] [ref=e44]
    - generic [ref=e45]:
      - link "Library" [ref=e46] [cursor=pointer]:
        - /url: assets/gallery/gallery-1.png
        - img "Library" [ref=e47]
      - link "Science Lab" [ref=e48] [cursor=pointer]:
        - /url: assets/gallery/gallery-2.png
        - img "Science Lab" [ref=e49]
      - link "Sports Field" [ref=e50] [cursor=pointer]:
        - /url: assets/gallery/gallery-3.png
        - img "Sports Field" [ref=e51]
      - link "Arts Studio" [ref=e52] [cursor=pointer]:
        - /url: assets/gallery/gallery-4.png
        - img "Arts Studio" [ref=e53]
  - generic [ref=e54]:
    - heading "Contact Us" [level=2] [ref=e55]
    - generic [ref=e56]:
      - textbox "Your Name" [ref=e57]
      - textbox "Your Email" [ref=e58]
      - textbox "Your Message" [ref=e59]
      - button "Send Message" [ref=e60]
    - generic [ref=e61]:
      - paragraph [ref=e62]: "Phone: 9927572668"
      - paragraph [ref=e63]: "Address: Daurala, Meerut"
  - contentinfo [ref=e64]:
    - paragraph [ref=e65]: © 2026 Malik Computer Center. All rights reserved.
```

# Test source

```ts
  1  | // e2e/user-management.spec.ts
  2  | import { test, expect, type Page } from '@playwright/test';
  3  | 
  4  | test.describe('Admin User Management', () => {
  5  |   test.beforeEach(async ({ page }: { page: Page }) => {
  6  |     // Assume the dev server is running locally
  7  |     await page.goto('http://localhost:3000/api/auth/signin');
  8  |     // Sign in as an admin – replace with real credentials or mock auth in dev env
> 9  |     await page.fill('input[name="email"]', process.env.ADMIN_EMAIL ?? 'admin@example.com');
     |                ^ Error: page.fill: Test timeout of 30000ms exceeded.
  10 |     await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD ?? 'adminpass');
  11 |     await page.click('button[type="submit"]');
  12 |     await page.waitForURL('**/admin/dashboard');
  13 |   });
  14 | 
  15 |   test('loads user table and updates role', async ({ page }: { page: Page }) => {
  16 |     await page.waitForSelector('text=Manage Users');
  17 |     // Wait for at least one row to appear
  18 |     const firstRow = page.locator('table tbody tr').first();
  19 |     await expect(firstRow).toBeVisible();
  20 | 
  21 |     // Open role dropdown for the first user
  22 |     const roleSelect = firstRow.locator('select');
  23 |     await roleSelect.selectOption('MODERATOR');
  24 | 
  25 |     // Wait for toast indicating success
  26 |     await expect(page.locator('text=Success')).toBeVisible();
  27 |     // Verify the dropdown value changed
  28 |     await expect(roleSelect).toHaveValue('MODERATOR');
  29 |   });
  30 | });
  31 | 
```