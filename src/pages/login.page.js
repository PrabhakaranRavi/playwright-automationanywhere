export class LoginPage {
  constructor(page) {
    this.page = page;
    this.username = page.locator('input[name="username"]');
    this.password = page.locator('input[name="password"]');
    this.loginBtn = page.locator('button[name="submitLogin"]');
    this.automationNav = page.getByRole('link', { name: /^automation$/i });
  }

  async goto() {
    await this.page.goto('/#/login?next=/index');
  }

  async login(username, password) {
    await this.username.fill(username);
    await this.password.fill(password);
    await this.loginBtn.click();
    await this.automationNav.waitFor();
  }
}
