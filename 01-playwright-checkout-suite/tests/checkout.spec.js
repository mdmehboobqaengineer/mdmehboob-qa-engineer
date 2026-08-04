const { test, expect } = require('@playwright/test');

const BASE_URL = 'https://www.saucedemo.com';

test.describe('TC-CHK-001 to TC-CHK-072 | Checkout Flow', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto(BASE_URL);
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  });

  // --- INVENTORY ---

  test('TC-CHK-001 | Inventory page displays 6 products', async ({ page }) => {
    const items = page.locator('.inventory_item');
    await expect(items).toHaveCount(6);
  });

  test('TC-CHK-002 | Each product has a name', async ({ page }) => {
    const names = page.locator('.inventory_item_name');
    await expect(names).toHaveCount(6);
  });

  test('TC-CHK-003 | Each product has a price', async ({ page }) => {
    const prices = page.locator('.inventory_item_price');
    await expect(prices).toHaveCount(6);
  });

  test('TC-CHK-004 | Each product has an Add to cart button', async ({ page }) => {
    const buttons = page.locator('[data-test^="add-to-cart"]');
    await expect(buttons).toHaveCount(6);
  });

  test('TC-CHK-005 | Product image is visible for each item', async ({ page }) => {
    const images = page.locator('.inventory_item_img img');
    await expect(images).toHaveCount(6);
  });

  test('TC-CHK-006 | Sort by Name A to Z works correctly', async ({ page }) => {
    await page.selectOption('.product_sort_container', 'az');
    const first = await page.locator('.inventory_item_name').first().textContent();
    expect(first).toBe('Sauce Labs Backpack');
  });

  test('TC-CHK-007 | Sort by Name Z to A works correctly', async ({ page }) => {
    await page.selectOption('.product_sort_container', 'za');
    const first = await page.locator('.inventory_item_name').first().textContent();
    expect(first).toBe('Test.allTheThings() T-Shirt (Red)');
  });

  test('TC-CHK-008 | Sort by Price low to high works correctly', async ({ page }) => {
    await page.selectOption('.product_sort_container', 'lohi');
    const first = await page.locator('.inventory_item_price').first().textContent();
    expect(first).toBe('$7.99');
  });

  test('TC-CHK-009 | Sort by Price high to low works correctly', async ({ page }) => {
    await page.selectOption('.product_sort_container', 'hilo');
    const first = await page.locator('.inventory_item_price').first().textContent();
    expect(first).toBe('$49.99');
  });

  test('TC-CHK-010 | Clicking product name opens product detail page', async ({ page }) => {
    await page.locator('.inventory_item_name').first().click();
    await expect(page).toHaveURL(/inventory-item/);
  });

  // --- ADD TO CART ---

  test('TC-CHK-011 | Adding item to cart updates cart badge to 1', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('TC-CHK-012 | Adding two items updates cart badge to 2', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('2');
  });

  test('TC-CHK-013 | Add to cart button changes to Remove after click', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="remove-sauce-labs-backpack"]')).toBeVisible();
  });

  test('TC-CHK-014 | Removing item from inventory updates cart badge', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('TC-CHK-015 | Cart badge disappears when all items removed', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('TC-CHK-016 | Adding all 6 items shows badge count of 6', async ({ page }) => {
    const addButtons = page.locator('[data-test^="add-to-cart"]');
    const count = await addButtons.count();
    for (let i = 0; i < count; i++) {
      await addButtons.nth(i).click();
    }
    await expect(page.locator('.shopping_cart_badge')).toHaveText('6');
  });

  // --- CART PAGE ---

  test('TC-CHK-017 | Cart icon navigates to cart page', async ({ page }) => {
    await page.locator('.shopping_cart_link').click();
    await expect(page).toHaveURL(`${BASE_URL}/cart.html`);
  });

  test('TC-CHK-018 | Added item appears in cart', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.cart_item')).toHaveCount(1);
  });

  test('TC-CHK-019 | Cart shows correct item name', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.inventory_item_name')).toHaveText('Sauce Labs Backpack');
  });

  test('TC-CHK-020 | Cart shows correct item price', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.inventory_item_price')).toHaveText('$29.99');
  });

  test('TC-CHK-021 | Empty cart shows no items', async ({ page }) => {
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.cart_item')).toHaveCount(0);
  });

  test('TC-CHK-022 | Continue Shopping button returns to inventory', async ({ page }) => {
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="continue-shopping"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  });

  test('TC-CHK-023 | Remove button in cart removes item', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    await expect(page.locator('.cart_item')).toHaveCount(0);
  });

  test('TC-CHK-024 | Removing item in cart updates badge', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="remove-sauce-labs-backpack"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('TC-CHK-025 | Checkout button in cart navigates to checkout step one', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-one.html`);
  });

  test('TC-CHK-026 | Cart item quantity defaults to 1', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.cart_quantity')).toHaveText('1');
  });

  // --- CHECKOUT STEP ONE ---

  test('TC-CHK-027 | Checkout step one requires first name', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('First Name is required');
  });

  test('TC-CHK-028 | Checkout step one requires last name', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('Last Name is required');
  });

  test('TC-CHK-029 | Checkout step one requires postal code', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('[data-test="error"]')).toContainText('Postal Code is required');
  });

  test('TC-CHK-030 | Valid info on step one advances to step two', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-step-two.html`);
  });

  test('TC-CHK-031 | Cancel button on step one returns to cart', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.locator('[data-test="cancel"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/cart.html`);
  });

  // --- CHECKOUT STEP TWO ---

  test('TC-CHK-032 | Order summary shows item name', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('.inventory_item_name')).toContainText('Sauce Labs Backpack');
  });

  test('TC-CHK-033 | Order summary shows item price', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('.inventory_item_price')).toContainText('$29.99');
  });

  test('TC-CHK-034 | Order summary shows item total', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('.summary_subtotal_label')).toContainText('$29.99');
  });

  test('TC-CHK-035 | Order summary shows tax', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('.summary_tax_label')).toBeVisible();
  });

  test('TC-CHK-036 | Order summary shows total including tax', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('.summary_total_label')).toBeVisible();
  });

  test('TC-CHK-037 | Finish button on step two completes the order', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="finish"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-complete.html`);
  });

  test('TC-CHK-038 | Cancel on step two returns to inventory', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="cancel"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  });

  // --- ORDER CONFIRMATION ---

  test('TC-CHK-039 | Confirmation page shows thank you message', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="finish"]').click();
    await expect(page.locator('.complete-header')).toContainText('Thank you');
  });

  test('TC-CHK-040 | Confirmation page cart badge is cleared', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="finish"]').click();
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('TC-CHK-041 | Back home button on confirmation returns to inventory', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="finish"]').click();
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  });

  // --- MULTI-ITEM CHECKOUT ---

  test('TC-CHK-042 | Checkout with 3 items shows correct subtotal', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    const subtotal = await page.locator('.summary_subtotal_label').textContent();
    expect(subtotal).toContain('$');
  });

  test('TC-CHK-043 | Checkout with all 6 items completes successfully', async ({ page }) => {
    const addButtons = page.locator('[data-test^="add-to-cart"]');
    const count = await addButtons.count();
    for (let i = 0; i < count; i++) {
      await addButtons.nth(i).click();
    }
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="finish"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/checkout-complete.html`);
  });

  // --- PRODUCT DETAIL PAGE ---

  test('TC-CHK-044 | Product detail page shows correct name', async ({ page }) => {
    await page.locator('.inventory_item_name').first().click();
    await expect(page.locator('.inventory_details_name')).toBeVisible();
  });

  test('TC-CHK-045 | Product detail page shows correct price', async ({ page }) => {
    await page.locator('.inventory_item_name').first().click();
    await expect(page.locator('.inventory_details_price')).toBeVisible();
  });

  test('TC-CHK-046 | Product detail page Add to cart button works', async ({ page }) => {
    await page.locator('.inventory_item_name').first().click();
    await page.locator('[data-test^="add-to-cart"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('TC-CHK-047 | Back button on product detail returns to inventory', async ({ page }) => {
    await page.locator('.inventory_item_name').first().click();
    await page.locator('[data-test="back-to-products"]').click();
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  });

  // --- EDGE CASES ---

  test('TC-CHK-048 | Checkout without items in cart shows no items on summary', async ({ page }) => {
    await page.goto(`${BASE_URL}/checkout-step-one.html`);
    await expect(page.locator('[data-test="error"]')).toBeVisible();
  });

  test('TC-CHK-049 | Cart persists items after navigating back to inventory', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="continue-shopping"]').click();
    await expect(page.locator('.shopping_cart_badge')).toHaveText('1');
  });

  test('TC-CHK-050 | Adding same item twice is not possible from inventory', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await expect(page.locator('[data-test="add-to-cart-sauce-labs-backpack"]')).not.toBeVisible();
  });

  test('TC-CHK-051 | Cart page title is correct', async ({ page }) => {
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.title')).toHaveText('Your Cart');
  });

  test('TC-CHK-052 | Checkout step one page title is correct', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await expect(page.locator('.title')).toHaveText('Checkout: Your Information');
  });

  test('TC-CHK-053 | Checkout step two page title is correct', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('.title')).toHaveText('Checkout: Overview');
  });

  test('TC-CHK-054 | Checkout complete page title is correct', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="finish"]').click();
    await expect(page.locator('.title')).toHaveText('Checkout: Complete!');
  });

  test('TC-CHK-055 | Hamburger menu is accessible on inventory page', async ({ page }) => {
    await expect(page.locator('#react-burger-menu-btn')).toBeVisible();
  });

  test('TC-CHK-056 | Hamburger menu opens on click', async ({ page }) => {
    await page.click('#react-burger-menu-btn');
    await expect(page.locator('.bm-menu')).toBeVisible();
  });

  test('TC-CHK-057 | All items link in menu returns to inventory', async ({ page }) => {
    await page.click('#react-burger-menu-btn');
    await page.click('#inventory_sidebar_link');
    await expect(page).toHaveURL(`${BASE_URL}/inventory.html`);
  });

  test('TC-CHK-058 | About link in menu is present', async ({ page }) => {
    await page.click('#react-burger-menu-btn');
    await expect(page.locator('#about_sidebar_link')).toBeVisible();
  });

  test('TC-CHK-059 | Reset app state clears cart', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.click('#react-burger-menu-btn');
    await page.click('#reset_sidebar_link');
    await expect(page.locator('.shopping_cart_badge')).not.toBeVisible();
  });

  test('TC-CHK-060 | Inventory page loads within acceptable time', async ({ page }) => {
    const start = Date.now();
    await page.goto(`${BASE_URL}/inventory.html`);
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(8000);
  });

  test('TC-CHK-061 | Cart page loads within acceptable time', async ({ page }) => {
    const start = Date.now();
    await page.goto(`${BASE_URL}/cart.html`);
    const duration = Date.now() - start;
    expect(duration).toBeLessThan(8000);
  });

  test('TC-CHK-062 | Footer is visible on inventory page', async ({ page }) => {
    await expect(page.locator('.footer')).toBeVisible();
  });

  test('TC-CHK-063 | Social links are present in footer', async ({ page }) => {
    await expect(page.locator('.social_twitter')).toBeVisible();
    await expect(page.locator('.social_facebook')).toBeVisible();
    await expect(page.locator('.social_linkedin')).toBeVisible();
  });

  test('TC-CHK-064 | Inventory page is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await expect(page.locator('.inventory_list')).toBeVisible();
  });

  test('TC-CHK-065 | Cart page is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto(`${BASE_URL}/cart.html`);
    await expect(page.locator('.cart_list')).toBeVisible();
  });

  test('TC-CHK-066 | Checkout step one is responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await expect(page.locator('[data-test="firstName"]')).toBeVisible();
  });

  test('TC-CHK-067 | Item description is visible on inventory', async ({ page }) => {
    await expect(page.locator('.inventory_item_desc').first()).toBeVisible();
  });

  test('TC-CHK-068 | Cart shows QTY header', async ({ page }) => {
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.cart_quantity_label')).toBeVisible();
  });

  test('TC-CHK-069 | Cart shows Description header', async ({ page }) => {
    await page.locator('.shopping_cart_link').click();
    await expect(page.locator('.cart_desc_label')).toBeVisible();
  });

  test('TC-CHK-070 | Payment info label is visible on checkout step two', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('.summary_info_label').first()).toBeVisible();
  });

  test('TC-CHK-071 | Shipping info label is visible on checkout step two', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await expect(page.locator('.summary_info_label').nth(1)).toBeVisible();
  });

  test('TC-CHK-072 | Complete order image is visible on confirmation page', async ({ page }) => {
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('.shopping_cart_link').click();
    await page.locator('[data-test="checkout"]').click();
    await page.fill('[data-test="firstName"]', 'Muhammad');
    await page.fill('[data-test="lastName"]', 'Mehboob');
    await page.fill('[data-test="postalCode"]', '54000');
    await page.locator('[data-test="continue"]').click();
    await page.locator('[data-test="finish"]').click();
    await expect(page.locator('.pony_express')).toBeVisible();
  });

});
