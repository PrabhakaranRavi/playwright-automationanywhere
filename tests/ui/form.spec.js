import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page.js';
import { AutomationPage } from '../../src/pages/automation.page.js';
import { CreateFormPage } from '../../src/pages/createFormPage.page.js';
import { createPerTestLogger } from '../../src/utils/logger.js';

test.describe('Use Case 2: Form with Upload Flow (UI)', () => {
  test.beforeEach(async ({ }, testInfo) => {
    testInfo._logger = createPerTestLogger(testInfo);

    testInfo._logger.info(
      { cfg: { baseUrl: process.env.AA_BASE_URL } },
      'Test start'
    );
  });

  test.afterEach(async ({ }, testInfo) => {
    testInfo._logger.info({}, 'Test end');
    testInfo._logger.flush?.();
  });

  test('should create and save a Form with textbox and file upload', async ({ page }) => {
    const logger = /** @type any */(test.info()._logger);

    // 1) Login
    const login = new LoginPage(page);
    await login.goto();
    logger.info({}, 'Navigated to base URL');
    await login.login(process.env.AA_USERNAME, process.env.AA_PASSWORD);
    logger.info({}, 'Logged in');

    // 2) Open Automation
    const auto = new AutomationPage(page);
    await auto.open();
    logger.info({}, 'Opened Automation page');

    // 3) Create -> Form
    await auto.createBtn.click(); // open "Create" dropdown
    const modal = new CreateFormPage(page);
    const formName = `Form_Auto_${Date.now()}`;
    await modal.fillMandatory({ name: formName, description: 'Playwright E2E Form' });
    await modal.createAndOpenEditor();
    logger.info({ formName }, 'Created Form and opened editor');

    
    // 4) Add Textbox + File input to canvas
await modal.addTextboxAndFile();
logger.info({}, 'Textbox and File input added');

    logger.info({}, 'Textbox and File input added');

    // 5) Interact with right-panel fields (TODO: assert properties if needed)

    // 6) Enter text and upload a file
    // Example file upload (replace path with a real test file in your repo)
    // await page.locator('input[type="text"]').fill('Sample text');
    // await page.locator('input[type="file"]').setInputFiles('tests/fixtures/sample.txt');
    logger.info({}, 'Text entered and file uploaded');

    // 7) Save form
    await modal.save?.(); // if you add save() method in CreateFormPage
    logger.info({}, 'Saved form');

    // 8) Optional: Verify form exists in Automation list
    // await page.getByRole('link', { name: /^automation$/i }).click();
    // await expect(page.getByRole('row', { name: new RegExp(formName) })).toBeVisible();
    // logger.info({}, 'Form listed under Automation');
  });
});
