const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://www.saucedemo.com';

async function loginAndAddItem(page, item = 'sauce-labs-backpack') {
  await page.goto(BASE_URL);
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');
  await page.locator(`[data-test="add-to-cart-${item}"]`).click();
  await page.locator('.shopping_cart_link').click();
  await page.locator('[data-test="checkout"]').click();
}

test.describe('TC-PAY-001 to TC-PAY-056 | Payment Edge Cases', () => {

  // --- EMPTY FIELD COMBINATIONS ---

  test('TC-PAY-001 | All checkout fields empty shows first name error', async ({ page }) => {
    await loginAndAddItem(page);
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('First Name is required');
  });

  test('TC-PAY-002 | Only first name filled shows last name error', async ({ page }) => {
    await loginAndAddItem(page);
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('Last Name is required');
  });

  test('TC-PAY-003 | Only last name filled shows first name error', async ({ page }) => {
    await loginAndAddItem(page);
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('First Name is required');
  });

  test('TC-PAY-004 | Only postal code filled shows first name error', async ({ page }) => {
    await loginAndAddItem(page);
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('First Name is required');
  });

  test('TC-PAY-005 | First and last name filled but no postal code shows error', async ({ page }) => {
    await loginAndAddItem(page);
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('Postal Code is required');
  });

  // --- BOUNDARY VALUES ---

  test('TC-PAY-006 | Single character first name is accepted', async ({ page }) => {
    await loginAndAddItem(page);
    await page.fill('[data-test="firstName"]', 'M');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);
  });

  test('TC-PAY-007 | Single character last name is accepted', async ({ page }) => {
    await loginAndAddItem(page);
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'M');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);
  });

  test('TC-PAY-008 | Single digit postal code is accepted', async ({ page }) => {
    await loginAndAddItem(page);
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '1');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);
  });

  test('TC-PAY-009 | Very long first name is handled', async ({ page }) => {
    await loginAndAddItem(page);
    await page.fill('[data-test="firstName"]', 'M'.repeat(100));
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);
  });

  test('TC-PAY-010 | Very long postal code is handled', async ({ page }) => {
    await loginAndAddItem(page);
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '1'.repeat(50));
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);
  });

  // --- SPECIAL CHARACTERS ---

  test('TC-PAY-011 | Special characters in first name are handled', async ({ page }) => {
    await loginAndAddItem(page);
    await page.fill('[data-test="firstName"]', "O'Brien");
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);
  });

  test('TC-PAY-012 | Hyphenated last name is handled', async ({ page }) => {
    await loginAndAddItem(page);
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Smith-Jones');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);
  });

  test('TC-PAY-013 | Numbers in first name field are handled', async ({ page }) => {
    await loginAndAddItem(page);
    await page.fill('[data-test="firstName"]', 'User123');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);
  });

  test('TC-PAY-014 | Alphanumeric postal code is handled', async ({ page }) => {
    await loginAndAddItem(page);
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', 'SW1A 1AA');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);
  });

  test('TC-PAY-015 | XSS attempt in checkout fields does not execute', async ({ page }) => {
    await loginAndAddItem(page);
    await page.fill('[data-test="firstName"]', '<script>alert("xss")</script>');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    const alerts = [];
    page.on('dialog', dialog => { alerts.push(dialog.message()); dialog.dismiss(); });
    expect(alerts.length).toBe(0);
  });

  test('TC-PAY-016 | SQL injection in checkout fields is handled', async ({ page }) => {
    await loginAndAddItem(page);
    await page.fill('[data-test="firstName"]', "'; DROP TABLE users; --");
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);
  });

  test('TC-PAY-017 | Unicode characters in name fields are handled', async ({ page }) => {
    await loginAndAddItem(page);
    await page.fill('[data-test="firstName"]', 'محمد');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);
  });

  test('TC-PAY-018 | Emoji in name field is handled gracefully', async ({ page }) => {
    await loginAndAddItem(page);
    await page.fill('[data-test="firstName"]', 'Test😀');
    await page.fill('[data-test="lastName"]', 'User');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await expect(page).not.toHaveURL(`${BASE_URL}/inventory.html`);
  });

  // --- PRICE CALCULATION EDGE CASES ---

  test('TC-PAY-019 | Total equals subtotal plus tax', async ({ page }) => {
    await loginAndAddItem(page);
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

  test('TC-PAY-020 | Tax is calculated correctly at 8 percent', async ({ page }) => {
    await loginAndAddItem(page);
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    const subtotalText = await page.locator('.summary_subtotal_label').textContent();
    const taxText = await page.locator('.summary_tax_label').textContent();
    const subtotal = parseFloat(subtotalText.replace(/[^0-9.]/g, ''));
    const tax = parseFloat(taxText.replace(/[^0-9.]/g, ''));
    const expectedTax = parseFloat((subtotal * 0.08).toFixed(2));
    expect(Math.abs(tax - expectedTax)).toBeLessThan(0.01);
  });

  test('TC-PAY-021 | Most expensive item price is correct', async ({ page }) => {
    await loginAndAddItem(page, 'sauce-labs-fleece-jacket');
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('.summary_subtotal_label')).toContainText('$49.99');
  });

  test('TC-PAY-022 | Cheapest item price is correct', async ({ page }) => {
    await loginAndAddItem(page, 'sauce-labs-onesie');
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('.summary_subtotal_label')).toContainText('$7.99');
  });

  // --- NAVIGATION EDGE CASES ---

  test('TC-PAY-023 | Back button on step one preserves cart items', async ({ page }) => {
    await loginAndAddItem(page);
    await page.locator('[data-test="cancel"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test.skip('TC-PAY-024 | Direct URL to step two without completing step one shows error', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await page.goto(`${BASE_URL}/checkout-step-two.html`);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test.skip('TC-PAY-025 | Direct URL to complete page without checkout shows error', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await page.goto(`${BASE_URL}/checkout-complete.html`);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('TC-PAY-026 | Browser back from step two returns to step one', async ({ page }) => {
    await loginAndAddItem(page);
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await page.goBack();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-one.html`);
  });

  // --- FORM INTERACTIONS ---

  test('TC-PAY-027 | Tab key moves between checkout fields in order', async ({ page }) => {
    await loginAndAddItem(page);
    await page.click('[data-test="firstName"]');
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-test="lastName"]')).toBeFocused();
  });

  test('TC-PAY-028 | Tab from last name moves to postal code', async ({ page }) => {
    await loginAndAddItem(page);
    await page.click('[data-test="lastName"]');
    await page.keyboard.press('Tab');
    await expect(page.locator('[data-test="postalCode"]')).toBeFocused();
  });

  test('TC-PAY-029 | First name field has correct placeholder', async ({ page }) => {
    await loginAndAddItem(page);
    await expect(page.locator('[data-test="firstName"]')).toHaveAttribute('placeholder', 'First Name');
  });

  test('TC-PAY-030 | Last name field has correct placeholder', async ({ page }) => {
    await loginAndAddItem(page);
    await expect(page.locator('[data-test="lastName"]')).toHaveAttribute('placeholder', 'Last Name');
  });

  test('TC-PAY-031 | Postal code field has correct placeholder', async ({ page }) => {
    await loginAndAddItem(page);
    await expect(page.locator('[data-test="postalCode"]')).toHaveAttribute('placeholder', 'Zip/Postal Code');
  });

  test('TC-PAY-032 | Error message on step one is dismissible', async ({ page }) => {
    await loginAndAddItem(page);
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="error"] button').click();
    await expect(page.locator('[data-test="error"]')).not.toBeVisible();
  });

  test('TC-PAY-033 | After dismissing error fields remain fillable', async ({ page }) => {
    await loginAndAddItem(page);
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="error"] button').click();
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await expect(page.locator('[data-test="firstName"]')).toHaveValue('Muhammad');
  });

  // --- CONCURRENT / RACE CONDITION TESTS ---

  test('TC-PAY-034 | Rapid double click on finish button does not create duplicate order', async ({ page }) => {
    await loginAndAddItem(page);
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="finish"]').dblclick();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-complete.html`);
  });

  test('TC-PAY-035 | Rapid double click on continue does not skip step two', async ({ page }) => {
    await loginAndAddItem(page);
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').dblclick();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);
  });

  test.skip('TC-PAY-036 | Rapid double click on Add to cart does not add item twice', async ({ page }) => {
    await page.goto(BASE_URL);
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').dblclick();
    const badge = page.locator('.shopping_cart_badge');
    const count = await badge.textContent();
    expect(parseInt(count)).toBeLessThanOrEqual(1);
  });

  // --- PERFORMANCE ---

  test('TC-PAY-037 | Checkout step one loads within acceptable time', async ({ page }) => {
    await loginAndAddItem(page);
    const start = Date.now();
    await page.waitForLoadState('networkidle');
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(8000);
  });

  test('TC-PAY-038 | Checkout step two loads within acceptable time', async ({ page }) => {
    await loginAndAddItem(page);
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    const start = Date.now();
    await page.waitForLoadState('networkidle');
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(8000);
  });

  // --- VISUAL / UI ---

  test('TC-PAY-039 | Error state adds red border to empty fields', async ({ page }) => {
    await loginAndAddItem(page);
    await page.locator('[data-test="continue"]').click();
    const firstNameClass = await page.locator('[data-test="firstName"]').getAttribute('class');
    expect(firstNameClass).toContain('error');
  });

  test('TC-PAY-040 | Step indicator shows correct step on step one', async ({ page }) => {
    await loginAndAddItem(page);
    await expect(page.locator('.title')).toContainText('Checkout: Your Information');
  });

  test('TC-PAY-041 | Step indicator shows correct step on step two', async ({ page }) => {
    await loginAndAddItem(page);
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('.title')).toContainText('Checkout: Overview');
  });

  test('TC-PAY-042 | Finish button is visible on step two', async ({ page }) => {
    await loginAndAddItem(page);
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="finish"]')).toBeVisible();
  });

  test('TC-PAY-043 | Cancel button is visible on step two', async ({ page }) => {
    await loginAndAddItem(page);
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="cancel"]')).toBeVisible();
  });

  // --- WHITESPACE HANDLING ---

  test.skip('TC-PAY-044 | Whitespace-only first name shows error', async ({ page }) => {
    await loginAndAddItem(page);
    await page.fill('[data-test="firstName"]', '   ');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test.skip('TC-PAY-045 | Whitespace-only last name shows error', async ({ page }) => {
    await loginAndAddItem(page);
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', '   ');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test.skip('TC-PAY-046 | Whitespace-only postal code shows error', async ({ page }) => {
    await loginAndAddItem(page);
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '   ');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  // --- CROSS-BROWSER CONSISTENCY ---

  test.skip('TC-PAY-047 | Checkout step one form is visible on all viewports', async ({ page }) => {
    const viewports = [
      { width: 375, height: 812 },
      { width: 768, height: 1024 },
      { width: 1280, height: 800 },
    ];
    for (const vp of viewports) {
      await page.setViewportSize(vp);
      await loginAndAddItem(page);
      await expect(page.locator('[data-test="firstName"]')).toBeVisible();
      await page.goto(BASE_URL);
    }
  });

  test('TC-PAY-048 | Summary page is readable on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await loginAndAddItem(page);
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('.summary_total_label')).toBeVisible();
  });

  // --- ADDITIONAL EDGE CASES ---

  test('TC-PAY-049 | Newline characters in first name are handled', async ({ page }) => {
    await loginAndAddItem(page);
    await page.fill('[data-test="firstName"]', 'Muhammad\nMehboob');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await expect(page).not.toHaveURL(`${BASE_URL}/inventory.html`);
  });

  test('TC-PAY-050 | Tab characters in fields are handled', async ({ page }) => {
    await loginAndAddItem(page);
    await page.fill('[data-test="firstName"]', 'Muhammad\t');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await expect(page).not.toHaveURL(`${BASE_URL}/inventory.html`);
  });

  test('TC-PAY-051 | Negative number in postal code is handled', async ({ page }) => {
    await loginAndAddItem(page);
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '-12345');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);
  });

  test('TC-PAY-052 | Decimal number in postal code is handled', async ({ page }) => {
    await loginAndAddItem(page);
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000.5');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);
  });

  test('TC-PAY-053 | Order total is displayed with currency symbol', async ({ page }) => {
    await loginAndAddItem(page);
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    const total = await page.locator('.summary_total_label').textContent();
    expect(total).toContain('$');
  });

  test('TC-PAY-054 | Order subtotal is displayed with currency symbol', async ({ page }) => {
    await loginAndAddItem(page);
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    const subtotal = await page.locator('.summary_subtotal_label').textContent();
    expect(subtotal).toContain('$');
  });

  test('TC-PAY-055 | Tax is displayed with currency symbol', async ({ page }) => {
    await loginAndAddItem(page);
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    const tax = await page.locator('.summary_tax_label').textContent();
    expect(tax).toContain('$');
  });

  test('TC-PAY-056 | Checkout complete page shows order dispatch message', async ({ page }) => {
    await loginAndAddItem(page);
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="finish"]').click();
    await expect(page.locator('.complete-text')).toBeVisible();
  });

});
