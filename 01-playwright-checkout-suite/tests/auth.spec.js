const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://www.saucedemo.com';
const VALID_USER = 'standard_user';
const VALID_PASS = 'secret_sauce';
const LOCKED_USER = 'locked_out_user';
const PROBLEM_USER = 'problem_user';
const PERF_USER = 'performance_glitch_user';

test.describe('TC-AUTH-001 to TC-AUTH-048 | Authentication & Session', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
  });

  // --- VALID LOGIN ---

  test('TC-AUTH-001 | Valid login with standard_user navigates to inventory', async ({ page }) => {
    await page.fill('#user-name', VALID_USER);
    await page.fill('#password', VALID_PASS);
    await page.click('#login-button');
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  });

  test('TC-AUTH-002 | Inventory page title is visible after login', async ({ page }) => {
    await page.fill('#user-name', VALID_USER);
    await page.fill('#password', VALID_PASS);
    await page.click('#login-button');
    await expect(page.locator('.title')).toHaveText('Products');
  });

  test('TC-AUTH-003 | Login button is clickable and submits form', async ({ page }) => {
    await page.fill('#user-name', VALID_USER);
    await page.fill('#password', VALID_PASS);
    await expect(page.locator('#login-button')).toBeEnabled();
    await page.click('#login-button');
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  });

  test('TC-AUTH-004 | Username field accepts input correctly', async ({ page }) => {
    await page.fill('#user-name', VALID_USER);
    await expect(page.locator('#user-name')).toHaveValue(VALID_USER);
  });

  test('TC-AUTH-005 | Password field masks input', async ({ page }) => {
    await page.fill('#password', VALID_PASS);
    await expect(page.locator('#password')).toHaveAttribute('type', 'password');
  });

  test('TC-AUTH-006 | Login with performance_glitch_user eventually succeeds', async ({ page }) => {
    await page.fill('#user-name', PERF_USER);
    await page.fill('#password', VALID_PASS);
    await page.click('#login-button');
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`, { timeout: 10000 });
  });

  test('TC-AUTH-007 | Login with problem_user navigates to inventory', async ({ page }) => {
    await page.fill('#user-name', PROBLEM_USER);
    await page.fill('#password', VALID_PASS);
    await page.click('#login-button');
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  });

  // --- INVALID LOGIN ---

  test('TC-AUTH-008 | Empty username shows error message', async ({ page }) => {
    await page.fill('#password', VALID_PASS);
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('TC-AUTH-009 | Empty password shows error message', async ({ page }) => {
    await page.fill('#user-name', VALID_USER);
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('TC-AUTH-010 | Both fields empty shows error message', async ({ page }) => {
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toContainText('Username is required');
  });

  test('TC-AUTH-011 | Wrong password shows error message', async ({ page }) => {
    await page.fill('#user-name', VALID_USER);
    await page.fill('#password', 'wrongpassword');
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('TC-AUTH-012 | Wrong username shows error message', async ({ page }) => {
    await page.fill('#user-name', 'nonexistent_user');
    await page.fill('#password', VALID_PASS);
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('TC-AUTH-013 | Wrong username and password shows error', async ({ page }) => {
    await page.fill('#user-name', 'wrong_user');
    await page.fill('#password', 'wrong_pass');
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('TC-AUTH-014 | Error message contains meaningful text', async ({ page }) => {
    await page.fill('#user-name', 'wrong');
    await page.fill('#password', 'wrong');
    await page.click('#login-button');
    const error = page.locator('[data-test="error"]');
    await expect(error).not.toBeEmpty();
  });

  test('TC-AUTH-015 | Error icon appears on username field on failed login', async ({ page }) => {
    await page.click('#login-button');
    await expect(page.locator('.error-message-container')).toBeVisible();
  });

  // --- LOCKED USER ---

  test('TC-AUTH-016 | Locked user sees locked out error message', async ({ page }) => {
    await page.fill('#user-name', LOCKED_USER);
    await page.fill('#password', VALID_PASS);
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toContainText('locked out');
  });

  test('TC-AUTH-017 | Locked user cannot access inventory page', async ({ page }) => {
    await page.fill('#user-name', LOCKED_USER);
    await page.fill('#password', VALID_PASS);
    await page.click('#login-button');
    await expect(page).not.toHaveURL(`${BASE_URL}/inventory.html`);
  });

  test('TC-AUTH-018 | Locked user remains on login page', async ({ page }) => {
    await page.fill('#user-name', LOCKED_USER);
    await page.fill('#password', VALID_PASS);
    await page.click('#login-button');
    await expect(page).toHaveURL(BASE_URL + '/');
  });

  // --- LOGOUT ---

  test('TC-AUTH-019 | Logout redirects to login page', async ({ page }) => {
    await page.fill('#user-name', VALID_USER);
    await page.fill('#password', VALID_PASS);
    await page.click('#login-button');
    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link');
    await expect(page).toHaveURL(BASE_URL + '/');
  });

  test('TC-AUTH-020 | After logout login form is visible', async ({ page }) => {
    await page.fill('#user-name', VALID_USER);
    await page.fill('#password', VALID_PASS);
    await page.click('#login-button');
    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link');
    await expect(page.locator('#login-button')).toBeVisible();
  });

  test('TC-AUTH-021 | After logout username field is empty', async ({ page }) => {
    await page.fill('#user-name', VALID_USER);
    await page.fill('#password', VALID_PASS);
    await page.click('#login-button');
    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link');
    await expect(page.locator('#user-name')).toHaveValue('');
  });

  test('TC-AUTH-022 | After logout password field is empty', async ({ page }) => {
    await page.fill('#user-name', VALID_USER);
    await page.fill('#password', VALID_PASS);
    await page.click('#login-button');
    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link');
    await expect(page.locator('#password')).toHaveValue('');
  });

  // --- SESSION & DIRECT ACCESS ---

  test('TC-AUTH-023 | Unauthenticated direct access to inventory redirects to login', async ({ page }) => {
    await page.goto(`${BASE_URL}/inventory.html`);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('TC-AUTH-024 | Unauthenticated access to cart redirects to login', async ({ page }) => {
    await page.goto(`${BASE_URL}/cart.html`);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('TC-AUTH-025 | Unauthenticated access to checkout redirects to login', async ({ page }) => {
    await page.goto(`${BASE_URL}/checkout-step-one.html`);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('TC-AUTH-026 | Authenticated user cannot see login page content', async ({ page }) => {
    await page.fill('#user-name', VALID_USER);
    await page.fill('#password', VALID_PASS);
    await page.click('#login-button');
    await expect(page.locator('#login-button')).not.toBeVisible();
  });

  // --- UI & ACCESSIBILITY ---

  test('TC-AUTH-027 | Login page has correct page title', async ({ page }) => {
    await expect(page).toHaveTitle(/Swag Labs/);
  });

  test('TC-AUTH-028 | Username placeholder text is visible', async ({ page }) => {
    await expect(page.locator('#user-name')).toHaveAttribute('placeholder', 'Username');
  });

  test('TC-AUTH-029 | Password placeholder text is visible', async ({ page }) => {
    await expect(page.locator('#password')).toHaveAttribute('placeholder', 'Password');
  });

  test('TC-AUTH-030 | Login button has correct text', async ({ page }) => {
    await expect(page.locator('#login-button')).toHaveValue('Login');
  });

  test('TC-AUTH-031 | Logo is visible on login page', async ({ page }) => {
    await expect(page.locator('.login_logo')).toBeVisible();
  });

  test('TC-AUTH-032 | Error message close button dismisses error', async ({ page }) => {
    await page.click('#login-button');
    await page.click('[data-test="error"] button');
    await expect(page.locator('[data-test="error"]')).not.toBeVisible();
  });

  // --- BOUNDARY & EDGE CASES ---

  test('TC-AUTH-033 | Username with spaces is handled', async ({ page }) => {
    await page.fill('#user-name', '  standard_user  ');
    await page.fill('#password', VALID_PASS);
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('TC-AUTH-034 | SQL injection attempt in username field', async ({ page }) => {
    await page.fill('#user-name', "' OR '1'='1");
    await page.fill('#password', VALID_PASS);
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('TC-AUTH-035 | XSS attempt in username field is not executed', async ({ page }) => {
    await page.fill('#user-name', '<script>alert("xss")</script>');
    await page.fill('#password', VALID_PASS);
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('TC-AUTH-036 | Very long username input is handled gracefully', async ({ page }) => {
    await page.fill('#user-name', 'a'.repeat(500));
    await page.fill('#password', VALID_PASS);
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('TC-AUTH-037 | Very long password input is handled gracefully', async ({ page }) => {
    await page.fill('#user-name', VALID_USER);
    await page.fill('#password', 'p'.repeat(500));
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('TC-AUTH-038 | Username field is case sensitive', async ({ page }) => {
    await page.fill('#user-name', 'Standard_User');
    await page.fill('#password', VALID_PASS);
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('TC-AUTH-039 | Password field is case sensitive', async ({ page }) => {
    await page.fill('#user-name', VALID_USER);
    await page.fill('#password', 'Secret_Sauce');
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('TC-AUTH-040 | Special characters in password field are handled', async ({ page }) => {
    await page.fill('#user-name', VALID_USER);
    await page.fill('#password', '!@#$%^&*()');
    await page.click('#login-button');
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  // --- KEYBOARD & FORM BEHAVIOR ---

  test('TC-AUTH-041 | Enter key on password field submits the form', async ({ page }) => {
    await page.fill('#user-name', VALID_USER);
    await page.fill('#password', VALID_PASS);
    await page.press('#password', 'Enter');
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  });

  test('TC-AUTH-042 | Tab key moves focus from username to password', async ({ page }) => {
    await page.click('#user-name');
    await page.keyboard.press('Tab');
    await expect(page.locator('#password')).toBeFocused();
  });

  test('TC-AUTH-043 | Tab from password focuses login button', async ({ page }) => {
    await page.click('#password');
    await page.keyboard.press('Tab');
    await expect(page.locator('#login-button')).toBeFocused();
  });

  // --- NAVIGATION ---

  test('TC-AUTH-044 | Browser back button after logout stays on login page', async ({ page }) => {
    await page.fill('#user-name', VALID_USER);
    await page.fill('#password', VALID_PASS);
    await page.click('#login-button');
    await page.click('#react-burger-menu-btn');
    await page.click('#logout_sidebar_link');
    await page.goBack();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('TC-AUTH-045 | Refresh on inventory page keeps user logged in', async ({ page }) => {
    await page.fill('#user-name', VALID_USER);
    await page.fill('#password', VALID_PASS);
    await page.click('#login-button');
    await page.reload();
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  });

  test('TC-AUTH-046 | Login page loads within acceptable time', async ({ page }) => {
    const start = Date.now();
    await page.goto(BASE_URL);
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(5000);
  });

  test('TC-AUTH-047 | Multiple failed logins do not crash the page', async ({ page }) => {
    for (let i = 0; i < 5; i++) {
      await page.fill('#user-name', 'wrong_user');
      await page.fill('#password', 'wrong_pass');
      await page.click('#login-button');
    }
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('TC-AUTH-048 | Login page is responsive on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(BASE_URL);
    await expect(page.locator('#login-button')).toBeVisible();
    await expect(page.locator('#user-name')).toBeVisible();
  });

});
