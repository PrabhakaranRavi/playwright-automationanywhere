export class BotEditorPage {
  constructor(page) {
    this.page = page;
    this.actionsSearch = page.locator('input.editor-palette-search__input[placeholder="Search actions"]');
    this.paletteMessageBoxItem = page.locator(`(//span[text()="Message box"])[3]`);
    this.messageBoxNodeLabel = page
      .locator('.taskbot-canvas-flow-point__label--name', { hasText: /^Message box$/i })
      .first();
    this.messageBoxNode = this.messageBoxNodeLabel;
    this.titleInput = page.locator('//div[@role="textbox" and @name="title"]');
    this.messageInput = page.locator('//div[@role="textbox" and @name="content"]');
    this.scrollLinesInput = page.locator('//div[@role="textbox" and @name="scrollLines"]');
    this.scrollbarAfter = this.scrollLinesInput;
    this.closeAfterCheckbox = page.getByRole('checkbox', { name: /close message box after/i });
    this.timeOutInput = page.locator('input[name="timeOut"]');
    this.saveBtn = page.locator(`(//span[normalize-space()="Save"])[1]`);
  }

  async addMessageBoxViaActionsSearch() {
    await this.actionsSearch.fill('Message box');
    await this.paletteMessageBoxItem.waitFor({ state: 'visible' });
    await this.paletteMessageBoxItem.scrollIntoViewIfNeeded();
    await this.paletteMessageBoxItem.dblclick();
    await this.messageBoxNodeLabel.waitFor({ state: 'visible' });
  }

  async configureMessageBox({ title, text, lines = 30, closeAfterSeconds } = {}) {
    await this.titleInput.click();
    if (title !== undefined) await this.titleInput.fill(String(title));
    if (text !== undefined) await this.messageInput.fill(String(text));
    if (lines !== undefined) await this.scrollLinesInput.fill(String(lines));
    if (closeAfterSeconds !== undefined) {
      await this.closeAfterCheckbox.check();
      await this.timeOutInput.fill(String(closeAfterSeconds));
    }
  }

  async save() {
    await this.saveBtn.waitFor({ state: 'visible' });
    await this.saveBtn.click();
  }
}
