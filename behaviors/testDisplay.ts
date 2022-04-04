import { Locator, Page } from "playwright"
import { newBrowserPage, resetBrowser } from "./browser"

export class TestDisplay {
  private page: Page | null = null

  async start(url: string): Promise<void> {
    this.page = await newBrowserPage()
    await this.page.goto(url)
  }

  async stop(): Promise<void> {
    await resetBrowser(this.page)
    this.page = null
  }

  async pageText(): Promise<string | null> {
    return this.select("body").text()
  }

  selectElementWithText(text: string): DisplayElement {
    return this.select(`text="${text}"`)
  }

  select(selector: string, options: SelectorOptions = {}): DisplayElement {
    return DisplayElement.New(this.page!, buildSelector(selector, options))
  }

  selectAll(selector: string): DisplayElementList {
    return new DisplayElementList(this.page!, selector)
  }
}

export class DisplayElement {
  static New(page: Page, selector: string): DisplayElement {
    return new DisplayElement(page.locator(selector))
  }

  constructor(private locator: Locator) {}

  async tagName(): Promise<string> {
    return await this.locator.first().evaluate(el => el.tagName)
  }

  async click(): Promise<void> {
    await this.locator.first().click({ timeout: 1000 })
  }

  async isVisible(): Promise<boolean> {
    return this.locator.first().isVisible()
  }

  async text(): Promise<string | null> {
    return this.locator.first().textContent({ timeout: 1000 })
  }

  async getAttribute(name: string): Promise<string | null> {
    return this.locator.first().getAttribute(name)
  }

  select(selector: string, options: SelectorOptions = {}): DisplayElement {
    return new DisplayElement(this.locator.locator(buildSelector(selector, options)))
  }
}

export class DisplayElementList {
  locator: Locator

  constructor(page: Page, selector: string) {
    this.locator = page.locator(selector)
  }

  async mapElements<T>(handler: (element: DisplayElement) => Promise<T>): Promise<Array<T>> {
    let promises = new Array<Promise<T>>()
    const count = await this.locator.count()
    for (let i = 0; i < count; i++) {
      const element = new DisplayElement(this.locator.nth(i))
      promises.push(handler(element))
    }
    return Promise.all(promises)
  }
}

export interface SelectorOptions {
  withText?: string
}

function buildSelector(base: string, options: SelectorOptions): string {
  if (options.withText) {
    return `${base}:has-text("${options.withText}")`
  } else {
    return base
  }
}
