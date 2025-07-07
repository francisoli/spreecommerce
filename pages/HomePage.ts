import { Page, expect } from '@playwright/test';

export class HomePage {
  constructor(private page: Page) {}

  async goto(baseURL: string) {
    await this.page.goto(baseURL);
    await expect(this.page).toHaveURL(baseURL);
  }

  async openUserMenu() {
    await this.page.getByRole('navigation', { name: 'Top' }).getByRole('button').nth(2  ).click({timeout: 10000});
  }

  async clickSignUp() {
    await this.page.waitForTimeout(2000);
    await this.page.getByRole('link', { name: 'Sign Up' }).click();
  }

  async clickLogin() {
    await this.page.getByRole('link', { name: 'Login' }).waitFor({ state: 'visible' });
    await this.page.getByRole('link', { name: 'Login' }).click();
   }
}
