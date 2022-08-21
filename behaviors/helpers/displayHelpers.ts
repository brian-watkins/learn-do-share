import { Page } from "playwright";

export async function waitForRequestsToComplete(page: Page): Promise<void> {
  await page.waitForResponse(() => true, { timeout: 1000 })
}
