const { test, expect } = require('@playwright/test');

/**
 * B2B Dashboard Regression — Playwright Automation Suite
 * Author: Muhammad Mehboob — QA Engineer
 * Contact: mdmehboobqaengineer@gmail.com
 *
 * Note: These tests run against SauceDemo (https://www.saucedemo.com) as a
 * publicly available UI proxy that mirrors real-world SaaS dashboard patterns.
 * The test IDs (DASH-AUTO-*) correspond to the highest-regression-risk flows
 * from the full 120+ manual test case suite.
 *
 * Covers:
 *   - Authentication flows (8 cases)
 *   - Dashboard data loading & filter behaviour (6 cases)
 *   - User management CRUD flows (6 cases)
 *   - Export trigger & download validation (4 cases)
 *   - Role-based route access (4 cases)
 */

const BASE_URL = 'https://www.saucedemo.com';
const ADMIN = { user: 'standard_user', pass: 'secret_sauce' };
const MANAGER = { user: 'problem_user', pass: 'secret_sauce' };
const VIEWER = { user: 'performance_glitch_user', pass: 'secret_sauce' };
const LOCKED = { user: 'locked_out_user', pass: 'secret_sauce' };

async function login(page, creds = ADMIN) {
  await page.goto(BASE_URL);
  await page.fill('#user-name', creds.user);
  await page.fill('#password', creds.pass);
  await page.click('#login-button');
}

// ============================================================
// SECTION 1: Authentication Flows (8 automated cases)
// ============================================================

test.describe('DASH-AUTO: Authentication Flows', () => {

  test('DASH-AUTO-001 | Valid admin login succeeds and reaches dashboard', async ({ page }) => {
    await login(page, ADMIN);
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
    await expect(page.locator('.title')).toBeVisible();
  });

  test('DASH-AUTO-002 | Invalid credentials — wrong password shows error', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.fill('#user-name', ADMIN.user);
    await page.fill('#password', 'wrongpassword');
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page).not.toHaveURL(`${BASE_URL}/inventory.html`);
  });

  test('DASH-AUTO-003 | Invalid credentials — wrong username shows error', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.fill('#user-name', 'nonexistent_admin');
    await page.fill('#password', ADMIN.pass);
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('DASH-AUTO-004 | Locked account cannot log in', async ({ page }) => {
    await login(page, LOCKED);
    await expect(page.locator('[data-test="error"]')).toContainText('locked out');
    await expect(page).not.toHaveURL(`${BASE_URL}/inventory.html`);
  });

  test('DASH-AUTO-005 | Logout clears session — protected route inaccessible after logout', async ({ page }) => {
    await login(page, ADMIN);
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link');
    await expect(page).toHaveURL(BASE_URL + '/');
    await page.goto(`${BASE_URL}/inventory.html`);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('DASH-AUTO-006 | Browser back after logout does not restore session', async ({ page }) => {
    await login(page, ADMIN);
    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link');
    await page.goBack();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('DASH-AUTO-007 | Session persists on page refresh', async ({ page }) => {
    await login(page, ADMIN);
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
    await page.reload();
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('DASH-AUTO-008 | Unauthenticated direct access to protected route redirects', async ({ page }) => {
    await page.goto(`${BASE_URL}/inventory.html`);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('#login-button')).toBeVisible();
  });

});

// ============================================================
// SECTION 2: Dashboard Data Loading & Filter Behaviour (6 cases)
// ============================================================

test.describe('DASH-AUTO: Dashboard Data & Filters', () => {

  test.beforeEach(async ({ page }) => {
    await login(page, ADMIN);
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  });

  test('DASH-AUTO-009 | Dashboard inventory loads all products on login', async ({ page }) => {
    const items = page.locator('.inventory_item');
    await expect(items).toHaveCount(6);
  });

  test('DASH-AUTO-010 | Sort filter changes displayed data correctly', async ({ page }) => {
    await page.selectOption('.product_sort_container', 'hilo');
    const prices = page.locator('.inventory_item_price');
    const first = await prices.first().textContent();
    const last = await prices.last().textContent();
    const firstVal = parseFloat(first.replace('$', ''));
    const lastVal = parseFloat(last.replace('$', ''));
    expect(firstVal).toBeGreaterThanOrEqual(lastVal);
  });

  test('DASH-AUTO-011 | Sort A-Z returns products in alphabetical order', async ({ page }) => {
    await page.selectOption('.product_sort_container', 'az');
    const names = page.locator('.inventory_item_name');
    const first = await names.first().textContent();
    const last = await names.last().textContent();
    expect(first.localeCompare(last)).toBeLessThan(0);
  });

  test('DASH-AUTO-012 | Sort Z-A returns products in reverse alphabetical order', async ({ page }) => {
    await page.selectOption('.product_sort_container', 'za');
    const names = page.locator('.inventory_item_name');
    const first = await names.first().textContent();
    const last = await names.last().textContent();
    expect(first.localeCompare(last)).toBeGreaterThan(0);
  });

  test('DASH-AUTO-013 | Price low to high sort is numerically correct', async ({ page }) => {
    await page.selectOption('.product_sort_container', 'lohi');
    const prices = page.locator('.inventory_item_price');
    const allPrices = [];
    const count = await prices.count();
    for (let i = 0; i < count; i++) {
      const text = await prices.nth(i).textContent();
      allPrices.push(parseFloat(text.replace('$', '')));
    }
    for (let i = 0; i < allPrices.length - 1; i++) {
      expect(allPrices[i]).toBeLessThanOrEqual(allPrices[i + 1]);
    }
  });

  test('DASH-AUTO-014 | Dashboard loads within acceptable performance threshold', async ({ page }) => {
    const start = Date.now();
    await page.goto(`${BASE_URL}/inventory.html`);
    await page.waitForSelector('.inventory_list');
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(8000);
  });

});

// ============================================================
// SECTION 3: User Management CRUD (6 cases)
// ============================================================

test.describe('DASH-AUTO: User Management CRUD', () => {

  test.beforeEach(async ({ page }) => {
    await login(page, ADMIN);
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  });

  test('DASH-AUTO-015 | Admin can add item to cart (create action)', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('DASH-AUTO-016 | Admin can remove item from cart (delete action)', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('DASH-AUTO-017 | Cart reflects correct item count after multiple additions', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('3');
  });

  test('DASH-AUTO-018 | Cart page shows correct items and prices', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
    await expect(page.locator('.inventory_item_price')).toHaveText('$29.99');
  });

  test('DASH-AUTO-019 | Reset app state clears all cart items (bulk delete)', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
    await page.click('#react-burger-menu-btn');
    await page.click('#reset_sidebar_link');
    await page.click('#react-burger-close-btn');
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('DASH-AUTO-020 | Cart items persist after navigating away and back', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="continue-shopping"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

});

// ============================================================
// SECTION 4: Export Trigger & Download Validation (4 cases)
// ============================================================

test.describe('DASH-AUTO: Export & Data Validation', () => {

  test.beforeEach(async ({ page }) => {
    await login(page, ADMIN);
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  });

  test('DASH-AUTO-021 | Checkout export — step one form fields are present', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();
    await expect(page.locator('[data-test="lastName"]')).toBeVisible();
    await expect(page.locator('[data-test="postalCode"]')).toBeVisible();
  });

  test('DASH-AUTO-022 | Order summary values match added item prices', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('.summary_subtotal_label')).toContainText('$29.99');
  });

  test('DASH-AUTO-023 | Order total equals subtotal plus tax', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    const subtotalText = await page.locator('.summary_subtotal_label').textContent();
    const taxText = await page.locator('.summary_tax_label').textContent();
    const totalText = await page.locator('.summary_total_label').textContent();
    const subtotal = parseFloat(subtotalText.replace(/[^0-9.]/g, ''));
    const tax = parseFloat(taxText.replace(/[^0-9.]/g, ''));
    const total = parseFloat(totalText.replace(/[^0-9.]/g, ''));
    expect(Math.abs((subtotal + tax) - total)).toBeLessThan(0.01);
  });

  test('DASH-AUTO-024 | Completed order confirmation shows expected data', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="finish"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-complete.html`);
    await expect(page.locator('.complete-header')).toContainText('Thank you');
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

});

// ============================================================
// SECTION 5: Role-Based Route Access (4 cases)
// ============================================================

test.describe('DASH-AUTO: Role-Based Access Control', () => {

  test('DASH-AUTO-025 | Admin user sees all navigation items', async ({ page }) => {
    await login(page, ADMIN);
    await page.click('#react-burger-menu-btn');
    await expect(page.locator('#inventory_sidebar_link')).toBeVisible();
    await expect(page.locator('#about_sidebar_link')).toBeVisible();
    await expect(page.locator('#logout_sidebar_link')).toBeVisible();
    await expect(page.locator('#reset_sidebar_link')).toBeVisible();
  });

  test('DASH-AUTO-026 | Unauthenticated user cannot access cart page', async ({ page }) => {
    await page.goto(`${BASE_URL}/cart.html`);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await expect(page.locator('#login-button')).toBeVisible();
  });

  test('DASH-AUTO-027 | Unauthenticated user cannot access checkout pages', async ({ page }) => {
    const protectedRoutes = [
      '/checkout-step-one.html',
      '/checkout-step-two.html',
      '/checkout-complete.html',
    ];
    for (const route of protectedRoutes) {
      await page.goto(`${BASE_URL}${route}`);
      await expect(page.locator('[data-test="error"]')).toBeVisible();
    }
  });

  test('DASH-AUTO-028 | Locked user cannot access any protected routes', async ({ page }) => {
    await login(page, LOCKED);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await page.goto(`${BASE_URL}/inventory.html`);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
    await page.goto(`${BASE_URL}/cart.html`);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

});
