import { expect } from "chai"
import { Browser, chromium, Page } from "playwright"

export class TestApp {
  display = new TestDisplay()

  async start(): Promise<TestApp> {
    await this.display.start()
    return this
  }

  async stop(): Promise<void> {
    await this.display.stop()
  }
}

class TestDisplay {
  private browser: Browser | null = null
  private page: Page | null = null
  
  async start(): Promise<void> {
    this.browser = await chromium.launch({
      headless: true
    })
    this.page = await this.browser.newPage()
    await this.page.goto("http://localhost:7777")
  }

  async stop(): Promise<void> {
    await this.browser?.close()
  }

  async pageText(): Promise<string | null> {
    return this.page?.textContent("body") ?? null
  }
}