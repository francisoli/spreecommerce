import { test } from '@playwright/test';
import { HomePage } from '../pages/HomePage';
import { AuthPage } from '../pages/AuthPage';
import { ProductPage } from '../pages/ProductPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { PaymentPage } from '../pages/PaymentPage';

test('Spree Commerce E2E flow', async ({ page }) => {
  const baseURL = 'https://demo.spreecommerce.org';
  const user = {
    email: `testuser_${Date.now()}@example.com`,
    password: 'TestPassword123'
  };

  const home = new HomePage(page);
  const auth = new AuthPage(page);
  const product = new ProductPage(page);
  const checkout = new CheckoutPage(page);
  const payment = new PaymentPage(page);

  // Navigate to homepage
  await home.goto(baseURL);

  // Sign up new user
  await home.openUserMenu();
  await home.clickSignUp();
  await auth.signUp(user.email, user.password);

  // Log out the newly registered user
  await page.locator('.hidden > a').first().click();
  await page.getByRole('button', { name: 'Log out' }).click();

  // Log in with the newly registered user credentials
  await page.reload();
  await home.openUserMenu();
  await auth.login(user.email, user.password);

  // Search and add knit wear product to cart 
  await product.searchProduct();
  await product.selectProduct();
  await product.chooseSize();
  await product.addToCart();

  // Checkout process
  await checkout.proceedToCheckout();
  await checkout.fillAddressDetails(user.email);
  await checkout.selectDeliveryMethod();

  // Payment process
  await payment.fillCardDetails();
  await payment.verifyOrderConfirmation();
});