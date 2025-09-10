export class CreateTaskBotPage {
  constructor(page) {
    this.page = page;
    this.nameInput = page.locator('input[name="name"]');
    this.descriptionInput = page.locator('input[name="description"]');
    this.createAndEditBtn = page.locator('button:has-text("Create & edit")');
  }

  async fillMandatory({ name, description }) {
    await this.nameInput.fill(name);
    if (description) await this.descriptionInput.fill(description);
  }

  async createAndOpenEditor() {
    await this.createAndEditBtn.first().click();
    await this.page.locator('.taskbot-canvas-flow-point--start .taskbot-canvas-flow-point__label--name',
      { hasText: 'Start' }
    ).waitFor();
    await this.page.locator('.taskbot-canvas-flow-point--end .taskbot-canvas-flow-point__label--name',
      { hasText: 'End' }
    ).waitFor();
    await this.page.locator('.taskbotcode-dropzone.taskbotcode-dropzone--nodes-empty').first().waitFor();
  }
}
