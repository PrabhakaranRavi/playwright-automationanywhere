export class AutomationPage {
  constructor(page) {
    this.page = page;
    this.automationLink = page.locator('a[name="automations"]');
    this.createBtn = page.getByRole('button', { name: /^create$/i }).nth(1);
    this.taskBotOption = page.locator('button[name="createTaskbot"]');
  }

  async open() {
    await this.automationLink.click();
    await this.createBtn.waitFor({ state: 'visible' });
  }

  async createTaskBot() {
    await this.createBtn.click();
    await this.taskBotOption.waitFor({ state: 'visible' });
    await this.taskBotOption.click();
  }
}
