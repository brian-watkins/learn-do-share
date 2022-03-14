import { Browser, chromium, Page } from "playwright"

let browser: Browser

export async function startBrowser(): Promise<void> {
  browser = await chromium.launch({
    headless: true
  })
}

export async function newBrowserPage(): Promise<Page> {
  return browser.newPage()
}

export async function stopBrowser(): Promise<void> {
  await browser.close()
}