/** Wait until a locator is visible. */
export async function waitVisible(locator) {
  await locator.waitFor({ state: 'visible' });
}

/** Wait until a locator is enabled (useful for Save buttons). */
export async function waitEnabled(locator) {
  await locator.waitFor({ state: 'attached' });
  await locator.waitFor({ state: 'visible' });
  await locator.waitFor({ state: 'stable' });
}
