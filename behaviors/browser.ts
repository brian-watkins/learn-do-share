import { Browser, chromium, Page } from "playwright"

let browser: Browser

export async function startBrowser(): Promise<void> {
  browser = await chromium.launch({
    headless: true
  })
}

export async function newBrowserPage(): Promise<Page> {
  const page = await browser.newPage()
  page.on("console", (message) => {
    if (message.text().startsWith("[vite]")) {
      return
    }
    console.log(message)
  })
  page.on("pageerror", console.log)
  return page
}

export async function stopBrowser(): Promise<void> {
  await browser.close()
}