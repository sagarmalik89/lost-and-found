// e2e/user-management.spec.ts
import { test, expect, type Page } from '@playwright/test';

test.describe('Admin User Management', () => {
  test.beforeEach(async ({ page }: { page: Page }) => {
    // Assume the dev server is running locally
    await page.goto('http://localhost:3000/api/auth/signin');
    // Sign in as an admin – replace with real credentials or mock auth in dev env
    await page.fill('input[name="email"]', process.env.ADMIN_EMAIL ?? 'admin@example.com');
    await page.fill('input[name="password"]', process.env.ADMIN_PASSWORD ?? 'adminpass');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin/dashboard');
  });

  test('loads user table and updates role', async ({ page }: { page: Page }) => {
    await page.waitForSelector('text=Manage Users');
    // Wait for at least one row to appear
    const firstRow = page.locator('table tbody tr').first();
    await expect(firstRow).toBeVisible();

    // Open role dropdown for the first user
    const roleSelect = firstRow.locator('select');
    await roleSelect.selectOption('MODERATOR');

    // Wait for toast indicating success
    await expect(page.locator('text=Success')).toBeVisible();
    // Verify the dropdown value changed
    await expect(roleSelect).toHaveValue('MODERATOR');
  });
});
