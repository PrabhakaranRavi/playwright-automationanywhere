import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/login.page.js';
import { AutomationPage } from '../../src/pages/automation.page.js';
import { CreateTaskBotPage } from '../../src/pages/createTaskBot.page.js';
import { BotEditorPage } from '../../src/pages/botEditor.page.js';
import { createPerTestLogger } from '../../src/utils/logger.js';

test.describe('Use Case 1: Message Box Task (UI)', () => {
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

  test('should create and save a Task Bot with a Message Box action', async ({ page }) => {
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

    // 3) Create -> Task Bot
    await auto.createTaskBot();
    const modal = new CreateTaskBotPage(page);
    const botName = `MB_Auto_${Date.now()}`;
    await modal.fillMandatory({ name: botName, description: 'Playwright E2E' });
    await modal.createAndOpenEditor();
    logger.info({ botName }, 'Created Task Bot and opened editor');

    // 4) Add "Message box" from Actions
    const editor = new BotEditorPage(page);
    await editor.addMessageBoxViaActionsSearch();

    // Assert: message box node appears on canvas
    await expect(editor.messageBoxNode).toBeVisible();
    logger.info({}, 'Message Box node added');

    // 5) Configure right-panel fields and assert values
    const cfgValues = {
      title: 'Automation Anywhere Enterprise Client',
      text: 'This is an automated test message',
      lines: 30
    };
    await editor.configureMessageBox(cfgValues);

    await expect(editor.titleInput).toHaveText(/automation anywhere enterprise client/i);
    await expect(editor.messageInput).toHaveText(/automated test message/i);
    await expect(editor.scrollbarAfter).toHaveText(String(cfgValues.lines));
    logger.info({ cfgValues }, 'Right panel configured');

    // 6) Save bot and assert confirmation
    await editor.save();
    logger.info({}, 'Saved');
  });
});
