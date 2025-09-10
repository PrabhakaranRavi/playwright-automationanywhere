import { CreateTaskBotPage } from './createTaskBot.page.js';

export class CreateFormPage extends CreateTaskBotPage {
    constructor(page) {
        super(page);
        this.formOption = page.locator('button[name="create-attended-form"]');
        this.textboxElement = page.locator('(//span[text()="Text Box"])[1]');
        this.selectFileElement = page.locator('(//span[text()="Select File"])[1]');
        this.canvas = page.locator('//div[contains(@class,"formcanvas__leftpane")]');


    }

    async fillMandatory({ name, description }) {
        await this.formOption.click();
        await super.fillMandatory({ name, description });
    }

    async createAndOpenEditor() {
        await this.createAndEditBtn.first().click();
    }

    // async addTextboxAndFile() {
    //     await this.textboxElement.scrollIntoViewIfNeeded();
    //     await this.textboxElement.hover();
    //     await this.canvas.hover();
    //     await this.textboxElement.dragTo(this.canvas);

    //     await this.selectFileElement.scrollIntoViewIfNeeded();
    //     await this.selectFileElement.hover();
    //     await this.canvas.hover();
    //     await this.selectFileElement.dragTo(this.canvas);
    // }

   async addTextboxAndFile() {
  await this.canvas.waitFor({ state: 'visible' });
  const canvasBB = await this.canvas.boundingBox();
  if (!canvasBB) throw new Error("Canvas bounding box not found");

  for (const element of [this.textboxElement, this.selectFileElement]) {
    await element.waitFor({ state: 'visible' });
    const bb = await element.boundingBox();
    if (!bb) throw new Error("Element bounding box not found");

    // Drag element into the center of the canvas
    await this.page.mouse.move(bb.x + bb.width / 2, bb.y + bb.height / 2);
    await this.page.mouse.down();
    await this.page.mouse.move(canvasBB.x + canvasBB.width / 2, canvasBB.y + canvasBB.height / 2, { steps: 5 });
    await this.page.mouse.up();
  }
}





}
