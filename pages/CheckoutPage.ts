import { Page, expect } from '@playwright/test';
import testdata from '../utils/testData.json';
import { time } from 'console';

export class CheckoutPage {
  constructor(private page: Page) {}

  async proceedToCheckout() {
    await this.page.getByRole('link', { name: 'Checkout' }).click();
    await expect(this.page.locator('#checkout_line_items')).toContainText(testdata.product['code']);
  }

  async fillAddressDetails(userEmail: string) {
    await this.page.getByLabel('Country').selectOption('Philippines');
    const user = testdata.user;
    await this.page.getByRole('textbox', { name: 'First name' }).type(user.firstName, { delay: 20 });
    await this.page.getByRole('textbox', { name: 'Last name' }).type(user.lastName, { delay: 20 });
    await this.page.getByRole('textbox', { name: 'Street and house number' }).type(user.address, { delay: 20 });
    await this.page.getByRole('textbox', { name: 'City' }).type(user.city, { delay: 20 });
    await this.page.getByRole('textbox', { name: 'Postal Code' }).type(user.postalCode, { delay: 20 });
    await this.page.getByRole('textbox', { name: 'Phone (optional)' }).type(user.phone, { delay: 20 });
    await this.page.locator('//button[contains(text(),"Save and Continue")]').click({timeout: 8000});
    await expect(this.page.locator('#checkout')).toContainText(userEmail)
    await expect(this.page.locator(`//p[contains(text(),"${userEmail}")]`)).toContainText(`${userEmail}`);
    await expect(this.page.locator(`//p[contains(text(),"${testdata.user.firstName} ${testdata.user.lastName}")]`)).toContainText(`${testdata.user.firstName} ${testdata.user.lastName}`)
    //wait for the spinner to be hidden
    if (await this.page.locator("//div[@class=' spinner flex justify-center']").isVisible()) {
      await this.page.locator("//div[@class=' spinner flex justify-center']").waitFor({ state: 'hidden' });
    } else if (await this.page.locator("//div[contains(@class,'spinner flex justify-center')]").isVisible()) {
      await this.page.locator("//div[contains(@class,'spinner flex justify-center')]").waitFor({ state: 'hidden' });
    }
  }

  async selectDeliveryMethod() {
    // verify if the delivery method is visible
    // Standard Delivery in 3-5 days
    await expect(this.page.locator('//h5[normalize-space(text())="Delivery method from"]')).toContainText("Delivery method from");
    await this.page.getByRole('radio', { name: 'Standard Delivery in 3-5' }).check();
    await expect(this.page.getByText(`${testdata.delivery.standard}`)).toContainText(testdata.delivery.standard);

    // Premium Delivery in 2-3 days
    await this.page.getByRole('radio', { name: 'Premium Delivery in 2-3' }).click();
    await this.page.getByRole('radio', { name: 'Premium Delivery in 2-3' }).check();
    await expect(this.page.getByText(`${testdata.delivery.premium}`)).toContainText(testdata.delivery.premium);
   
    // Next Day Delivery in 1-2 days
    await this.page.getByRole('radio', { name: 'Next Day Delivery in 1-2' }).click();
    await this.page.getByRole('radio', { name: 'Next Day Delivery in 1-2' }).check();
    await expect(this.page.getByText(`${testdata.delivery.nextday}`)).toContainText(testdata.delivery.nextday);

    // Verify the prices for each delivery method
    await expect(this.page.locator(`//span[@class='text-right' and contains(text(),"${testdata.delivery['standard price']}")]`)).toContainText(testdata.delivery['standard price']);
    await expect(this.page.locator(`//span[@class='text-right' and contains(text(),"${testdata.delivery['premium price']}")]`)).toContainText(testdata.delivery['premium price']);
    await expect(this.page.locator(`//span[@class='text-right' and contains(text(),"${testdata.delivery['nextday price']}")]`)).toContainText(testdata.delivery['nextday price']);

    // Click on the Save and Continue button
    await this.page.getByRole('button', { name: 'Save and Continue' }).click();
    // Add more timeout after clicking Save and Continue to ensure the next section loads
    const spinner1 = this.page.locator("//div[@class=' spinner flex justify-center']");
    const spinner2 = this.page.locator("//div[contains(@class,'spinner flex justify-center')]");
    const spinner3 = this.page.locator("//*[contains(@class, 'spinner')]");
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
      await this.page.locator('//h5[normalize-space(text())="Billing Address"]').waitFor({ state: 'visible' });
  }
}
