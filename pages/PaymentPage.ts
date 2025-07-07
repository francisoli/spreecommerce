import { Page, expect, test } from '@playwright/test';
import testdata from '../utils/testData.json';

export class PaymentPage {
  constructor(private page: Page) {}

  async fillCardDetails() {
  const { card } = testdata;
  const { user } = testdata;
    const spinner1 = this.page.locator("//div[@class=' spinner flex justify-center']");
    const spinner2 = this.page.locator("//div[contains(@class,'spinner flex justify-center')]");
    const spinner3 = this.page.locator('//div[@data-checkout-stripe-target="loading"]//text()[contains(., "Loading...")]');
    if (await spinner1.isVisible() || await spinner2.isVisible() || await spinner3.isVisible()) {
      if (await spinner1.isVisible()) {
      await spinner1.waitFor({ state: 'hidden' });
      }
      if (await spinner2.isVisible()) {
      await spinner2.waitFor({ state: 'hidden' });
      }
      if (await spinner3.isVisible()) {
      await spinner3.waitFor({ state: 'hidden' });
      }
    }

  await this.page.reload({ timeout: 60000 });
  const frame = await this.page.locator('iframe[title="Secure payment input frame"]').contentFrame();
  await this.page.waitForLoadState('load', { timeout: 20000 });
  await frame.getByRole('textbox', { name: 'Card number' }).waitFor({ state: 'visible' });
  await frame.getByRole('textbox', { name: 'Card number' }).type(card.Cardnumber, { delay: 50 });
  await frame.getByRole('textbox', { name: 'Expiration date MM / YY' }).type(card.expirationdate, { delay: 50 });
  // Try to use alternative selector if not found

  const cvcInput = frame.getByRole('textbox', { name: 'Security code' });
  if (await cvcInput.count() > 0 && await cvcInput.isVisible()) {
    await cvcInput.type(card.cvc, { delay: 50 });
  } else {
    // Use other selector if the first one is not found
    const altCvcInput = frame.locator('//input[@id="Field-cvcInput"]');
    await altCvcInput.waitFor({ state: 'visible', timeout: 5000 });
    await altCvcInput.type(card.cvc, { delay: 50 });
  }
  // Fill email and full name fields in the iframe with waits

  // Email field
  const emailInput = frame.getByRole('textbox', { name: 'Email' });
  await emailInput.waitFor({ state: 'visible', timeout: 15000 });
  await emailInput.waitFor({ state: 'attached', timeout: 5000 });
  await this.page.waitForTimeout(1000);
  await emailInput.click();
  await emailInput.clear();
  await emailInput.fill(user.email);

  // Full name field
  const fullNameInput = frame.getByRole('textbox', { name: 'Full name' });
  await fullNameInput.waitFor({ state: 'visible', timeout: 15000 });
  await fullNameInput.waitFor({ state: 'attached', timeout: 5000 });
  await this.page.waitForTimeout(1000);
  await fullNameInput.click();
  await fullNameInput.clear();
  await fullNameInput.fill(user.firstName + ' ' + user.lastName);
  
  await this.page.getByRole('button', { name: 'Pay now' }).dblclick({ timeout: 30000 });
  await this.page.waitForTimeout(10000);
  }
  
  async verifyOrderConfirmation() {
  const payNowButton = this.page.getByRole('button', { name: 'Pay now' });
 
  //Verify order number on confirmation page
      const orderNumberElement = await this.page.locator('//span[contains(text(),"Order R")]').first();
      const orderNumberText = await orderNumberElement.textContent();
      // Extract the order number using regex (e.g., "Order R375672289")
      const orderNumberMatch = orderNumberText?.match(/Order\s(R\d+)/);
      if (orderNumberMatch) {
        (globalThis as any).orderNumber = orderNumberMatch[1];
        expect(orderNumberMatch[1]).toMatch(/^R\d+$/);
        console.log(`Captured order number: ${orderNumberMatch[1]}`);
        test.info().attach('Order Number', {
          body: orderNumberMatch[1],
          contentType: 'text/plain'
        });
      } else {
        throw new Error('Order number not found on confirmation page');
      }
  await expect(this.page.locator('//h5[normalize-space(text())="Your order is confirmed!"]')).toContainText('Your order is confirmed!');
  await expect(this.page.locator('//span[contains(text(),"Paid")]')).toContainText('Paid');
  }
}