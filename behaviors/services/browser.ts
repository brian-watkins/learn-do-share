import { Browser, chromium, Page } from "playwright"
import { isDebug } from "../helpers"

let browser: Browser

export async function startBrowser(): Promise<void> {
  browser = await chromium.launch({
    headless: !isDebug()
  })
}

export async function newBrowserPage(): Promise<Page> {
  const context = await browser.newContext()
  const page = await context.newPage()
  page.on("console", (message) => {
    if (message.text().startsWith("[vite]")) {
      return
    }
    console.log(message)
  })
  page.on("pageerror", console.log)
  return page
}

export async function resetBrowser(page: Page | null): Promise<void> {
  if (!isDebug()) {
    return page?.close()
  }
}

export async function stopBrowser(): Promise<void> {
  await browser.close()
}