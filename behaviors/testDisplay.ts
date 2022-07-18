import { Locator, Page } from "playwright"
import { newBrowserPage, PageOptions, resetBrowser } from "./services/browser"

export class TestDisplay {
  private page: Page | null = null

  async tickClock(milliseconds: number): Promise<void> {
    await this.page?.evaluate(`window.__test_clock.tick(${milliseconds})`)
  }

  async start(url: string, pageOptions: PageOptions): Promise<void> {
    this.page = await newBrowserPage(pageOptions)
    await this.goto(url)
  }

  async goto(url: string): Promise<void> {
    await this.page?.goto(url)
  }

  async stop(): Promise<void> {
    await resetBrowser(this.page)
    this.page = null
  }

  async goBack(): Promise<void> {
    await this.page?.goBack()
  }

  async waitForPageLoad(): Promise<void> {
    await this.page?.waitForLoadState()
  }

  async waitForRequestsToComplete(): Promise<void> {
    await this.page?.waitForResponse(() => true)
  }

  selectElementWithText(text: string): DisplayElement {
    return this.select(`text="${text}"`)
  }

  select(selector: string, options: SelectorOptions = {}): DisplayElement {
    return new DisplayElement(this.page!.locator(buildSelector(selector, options)))
  }

  selectAll(selector: string): DisplayElementList {
    return new DisplayElementList(this.page!.locator(selector))
  }

  path(): string | undefined {
    const url = new URL(this.page?.url() ?? "")
    if (url) {
      return url.pathname
    } else {
      return undefined
    }
  }
}

export interface TypingOptions {
  clear: boolean
}

export class DisplayElement {
  constructor(private locator: Locator) {}

  async tagName(): Promise<string> {
    return await this.locator.first().evaluate(el => el.tagName, null, { timeout: 1000 })
  }

  async click(): Promise<void> {
    await this.locator.first().click({ timeout: 2000 })
  }

  async type(value: string, options: TypingOptions = { clear: false }): Promise<void> {
    await this.locator.first().click({ clickCount: options.clear ? 3 : 1, timeout: 1000 })
    await this.locator.first().type(value, { timeout: 1000 })
  }

  async isVisible(): Promise<boolean> {
    await this.locator.first().waitFor({ state: "visible", timeout: 1000 })
    return true
  }

  async isHidden(): Promise<boolean> {
    await this.locator.first().waitFor({ state: "hidden", timeout: 1000 })
    return true
  }

  async text(): Promise<string | null> {
    return this.locator.first().innerText({ timeout: 1000 })
  }

  async getAttribute(name: string): Promise<string | null> {
    return this.locator.first().getAttribute(name)
  }

  async getProperty(name: string): Promise<any> {
    const element = await this.locator.first().elementHandle()
    const propertyValue = await element?.getProperty(name)
    return propertyValue?.jsonValue()
  }

  async getInputValue(): Promise<string> {
    return this.locator.first().inputValue()
  }

  selectDescendant(selector: string, options: SelectorOptions = {}): DisplayElement {
    return new DisplayElement(this.locator.locator(buildSelector(selector, options)))
  }

  selectAllDescendants(selector: string): DisplayElementList {
    return new DisplayElementList(this.locator.locator(selector))
  }

  selectDescendantWithText(text: string): DisplayElement {
    return new DisplayElement(this.locator.locator(`text="${text}"`))
  }
}

export class DisplayElementList {
  constructor(private locator: Locator) {}

  async mapElements<T>(handler: (element: DisplayElement) => Promise<T>): Promise<Array<T>> {
    let promises = new Array<Promise<T>>()
    const count = await this.locator.count()
    for (let i = 0; i < count; i++) {
      promises.push(handler(this.getElement(i)))
    }
    return Promise.all(promises)
  }

  getElement(index: number): DisplayElement {
    return new DisplayElement(this.locator.nth(index))
  }

  count(): Promise<number> {
    return this.locator.count()
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
