const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://www.saucedemo.com';

async function login(page, user = 'standard_user') {
  await page.goto(BASE_URL);
  await page.fill('#user-name', user);
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
}

test.describe('TC-SES-001 to TC-SES-034 | Session & Access Control', () => {

  // --- UNAUTHENTICATED ACCESS ---

  test('TC-SES-001 | Unauthenticated access to inventory shows error', async ({ page }) => {
    await page.goto(`${BASE_URL}/inventory.html`);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('TC-SES-002 | Unauthenticated access to cart shows error', async ({ page }) => {
    await page.goto(`${BASE_URL}/cart.html`);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('TC-SES-003 | Unauthenticated access to checkout step one shows error', async ({ page }) => {
    await page.goto(`${BASE_URL}/checkout-step-one.html`);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('TC-SES-004 | Unauthenticated access to checkout step two shows error', async ({ page }) => {
    await page.goto(`${BASE_URL}/checkout-step-two.html`);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('TC-SES-005 | Unauthenticated access to checkout complete shows error', async ({ page }) => {
    await page.goto(`${BASE_URL}/checkout-complete.html`);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('TC-SES-006 | Unauthenticated access to inventory item page shows error', async ({ page }) => {
    await page.goto(`${BASE_URL}/inventory-item.html?id=4`);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  // --- POST LOGOUT ACCESS ---

  test('TC-SES-007 | After logout inventory page is not accessible', async ({ page }) => {
    await login(page);
    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link');
    await page.goto(`${BASE_URL}/inventory.html`);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('TC-SES-008 | After logout cart page is not accessible', async ({ page }) => {
    await login(page);
    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link');
    await page.goto(`${BASE_URL}/cart.html`);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('TC-SES-009 | After logout browser back does not restore session', async ({ page }) => {
    await login(page);
    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link');
    await page.goBack();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('TC-SES-010 | After logout login form is presented', async ({ page }) => {
    await login(page);
    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link');
    await expect(page.locator('#login-button')).toBeVisible();
  });

  test('TC-SES-011 | After logout username field is cleared', async ({ page }) => {
    await login(page);
    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link');
    await expect(page.locator('#user-name')).toHaveValue('');
  });

  test('TC-SES-012 | After logout password field is cleared', async ({ page }) => {
    await login(page);
    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link');
    await expect(page.locator('#password')).toHaveValue('');
  });

  // --- SESSION PERSISTENCE ---

  test('TC-SES-013 | Page reload maintains authenticated session', async ({ page }) => {
    await login(page);
    await page.reload();
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  });

  test('TC-SES-014 | Cart items persist after page reload', async ({ page }) => {
    await login(page);
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.reload();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('TC-SES-015 | Cart items persist after navigating away and back', async ({ page }) => {
    await login(page);
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="continue-shopping"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('TC-SES-016 | Multiple items persist after page reload', async ({ page }) => {
    await login(page);
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    await page.reload();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('3');
  });

  // --- COOKIE / STORAGE ---

  test('TC-SES-017 | Clearing cookies logs out the user', async ({ page, context }) => {
    await login(page);
    await context.clearCookies();
    await page.reload();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('TC-SES-018 | Session cookie is set after login', async ({ page, context }) => {
    await login(page);
    const cookies = await context.cookies();
    expect(cookies.length).toBeGreaterThan(0);
  });

  // --- LOCKED USER SESSION ---

  test('TC-SES-019 | Locked user cannot establish a session', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.fill('#user-name', 'locked_out_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).not.toHaveURL(`${BASE_URL}/inventory.html`);
  });

  test('TC-SES-020 | Locked user cannot access protected pages directly', async ({ page }) => {
    await page.goto(`${BASE_URL}/inventory.html`);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  // --- PERFORMANCE USER SESSION ---

  test('TC-SES-021 | Performance glitch user can complete full checkout flow', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.fill('#user-name', 'performance_glitch_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`, { timeout: 15000 });
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="finish"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-complete.html`, { timeout: 15000 });
  });

  // --- CONCURRENT SESSION ---

  test('TC-SES-022 | Two browser contexts can be logged in simultaneously', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    await login(page1);
    await login(page2);
    await expect(page1).toHaveURL(`${BASE_URL}/inventory.html`);
    await expect(page2).toHaveURL(`${BASE_URL}/inventory.html`);
    await context1.close();
    await context2.close();
  });

  test('TC-SES-023 | Logging out in one context does not affect another', async ({ browser }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();
    const page1 = await context1.newPage();
    const page2 = await context2.newPage();
    await login(page1);
    await login(page2);
    await page1.click('#react-burger-menu-btn');
    await page1.click('#logout_sidebar_link');
    await page2.reload();
    await expect(page2).toHaveURL(`${BASE_URL}/inventory.html`);
    await context1.close();
    await context2.close();
  });

  // --- RESET APP STATE ---

  test('TC-SES-024 | Reset app state clears all cart items', async ({ page }) => {
    await login(page);
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.click('#react-burger-menu-btn');
    await page.click('#reset_sidebar_link');
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('TC-SES-025 | Reset app state restores Add to cart buttons', async ({ page }) => {
    await login(page);
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.click('#react-burger-menu-btn');
    await page.click('#reset_sidebar_link');
    await page.click('#react-burger-menu-btn');
    await page.click('#react-burger-close-btn');
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).toBeVisible();
  });

  // --- NAVIGATION HISTORY ---

  test('TC-SES-026 | Forward navigation after login works correctly', async ({ page }) => {
    await login(page);
    await page.locator('.shopping_cart_link').click();
    await page.goBack();
    await page.goForward();
    await expect(page).toHaveURL(`${BASE_URL}/cart.html`);
  });

  test('TC-SES-027 | Multiple back navigations stay within authenticated area', async ({ page }) => {
    await login(page);
    await page.locator('.shopping_cart_link').click();
    await page.goBack();
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  });

  // --- SECURITY ---

  test('TC-SES-028 | Session token is not exposed in page URL', async ({ page }) => {
    await login(page);
    const url = page.url();
    expect(url).not.toContain('token=');
    expect(url).not.toContain('session=');
    expect(url).not.toContain('auth=');
  });

  test('TC-SES-029 | Login page is not accessible when already authenticated', async ({ page }) => {
    await login(page);
    await page.goto(BASE_URL);
    await expect(page.locator('#login-button')).not.toBeVisible();
  });

  // --- MENU ACCESS ---

  test('TC-SES-030 | Sidebar menu is accessible after login', async ({ page }) => {
    await login(page);
    await page.click('#react-burger-menu-btn');
    await expect(page.locator('.bm-item-list')).toBeVisible();
  });

  test('TC-SES-031 | Sidebar menu closes with close button', async ({ page }) => {
    await login(page);
    await page.click('#react-burger-menu-btn');
    await page.click('#react-burger-close-btn');
    await expect(page.locator('#logout_sidebar_link')).not.toBeVisible();
  });

  test('TC-SES-032 | All sidebar links are present after login', async ({ page }) => {
    await login(page);
    await page.click('#react-burger-menu-btn');
    await expect(page.locator('#inventory_sidebar_link')).toBeVisible();
    await expect(page.locator('#about_sidebar_link')).toBeVisible();
    await expect(page.locator('#logout_sidebar_link')).toBeVisible();
    await expect(page.locator('#reset_sidebar_link')).toBeVisible();
  });

  test('TC-SES-033 | Logout link in sidebar logs user out', async ({ page }) => {
    await login(page);
    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link');
    await expect(page.locator('#login-button')).toBeVisible();
  });

  test('TC-SES-034 | All items sidebar link navigates to inventory', async ({ page }) => {
    await login(page);
    await page.locator('.shopping_cart_link').click();
    await page.click('#react-burger-menu-btn');
    await page.click('#inventory_sidebar_link');
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  });

});
