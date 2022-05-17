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

  async goBack(): Promise<void> {
    await this.page?.goBack()
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

export function title() {
  return "#learning-area-title"
}

export function contentArea(selector: string = "") {
  return `#learning-area-content ${selector}`
}

export function teamLearningAreas(selector: string = "") {
  return `#team-learning-areas ${selector}`
}

export function disciplineLearningAreas(selector: string = "") {
  return `#discipline-learning-areas ${selector}`
}

export function theoryLearningAreas(selector: string = "") {
  return `#theory-learning-areas ${selector}`
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
    await this.locator.first().click({ timeout: 1000 })
  }

  async type(value: string, options: TypingOptions = { clear: false }): Promise<void> {
    await this.locator.first().click({ clickCount: options.clear ? 3 : 1 })
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
    return this.locator.first().innerText({ timeout: 1000 })
  }

  async getAttribute(name: string): Promise<string | null> {
    return this.locator.first().getAttribute(name)
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
