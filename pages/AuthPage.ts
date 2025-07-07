import { Page, expect } from '@playwright/test';

export class AuthPage {
  constructor(private page: Page) {}

  async signUp(email: string, password: string) { 
    //wait for the login form to be hidden
    await this.page.locator('//h2[normalize-space(text())="Login"]').waitFor({ state: 'hidden' });
    //wait for the sign up form to be visible
    await expect(this.page.locator('#login')).toContainText('Sign Up');
    await this.page.locator('//input[@name="user[email]"]').fill(email);
    await this.page.locator('//input[@name="user[password]"]').fill(password);
    await this.page.getByRole('textbox', { name: 'Password Confirmation' }).fill(password);
    await this.page.getByRole('button', { name: 'Sign Up' }).click({timeout: 6000 });
    await expect(this.page.locator('#flashes')).toContainText('Welcome! You have signed up successfully.');
  }

  async login(email: string, password: string) {
    await expect(this.page.locator('#login')).toContainText('Login');
    await this.page.getByRole('textbox', { name: 'Email', exact: true }).fill(email);
    await this.page.getByRole('textbox', { name: 'Password' }).fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click({timeout: 6000 });
    await expect(this.page.locator('#flashes')).toContainText('Signed in successfully.');
  }
}
