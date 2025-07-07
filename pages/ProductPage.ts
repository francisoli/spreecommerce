import { expect, Page } from '@playwright/test';
import testData from '../utils/testData.json';

export class ProductPage {
  constructor(private page: Page) {}

  async searchProduct() {
    await this.page.getByRole('button', { name: 'Search' }).click();
    await this.page.getByRole('textbox', { name: 'Search' }).fill(testData.product['code']);
  }

  async selectProduct() {
    const productLinkText = testData.product.name;
    await this.page.getByLabel(testData.product['label size']).getByRole('link', { name: productLinkText }).click();
  }

  async chooseSize() {
    const size = testData.product.size;
    await this.page.getByRole('button', { name: 'Please choose Size' }).nth(1).click();
    await this.page.locator('#product-variant-picker label').filter({ hasText: size }).click();
  }

  async addToCart() {
    await this.page.getByRole('button', { name: 'Add To Cart' }).click({ timeout: 3000 });
  }
}