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

export function contentArea(selector: string = "") {
  return `#learning-area-content ${selector}`
}

export function learningAreas(selector: string = "") {
  return `#learning-areas ${selector}`
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

  async type(value: string): Promise<void> {
    await this.locator.first().click()
    await this.locator.first().type(value)
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
    return this.locator.first().textContent({ timeout: 1000 })
  }

  async getAttribute(name: string): Promise<string | null> {
    return this.locator.first().getAttribute(name)
  }

  selectDescendant(selector: string, options: SelectorOptions = {}): DisplayElement {
    return new DisplayElement(this.locator.locator(buildSelector(selector, options)))
  }

  selectAllDescendants(selector: string): DisplayElementList {
    return new DisplayElementList(this.locator.page(), selector)
  }

  selectDescendantWithText(text: string): DisplayElement {
    return new DisplayElement(this.locator.locator(`text="${text}"`))
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
