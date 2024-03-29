import { DisplayElement, DisplayElementList, SelectorOptions } from "behaviors/helpers/displayElement"
import { PlaywrightDisplayElement, PlaywrightDisplayElementList, waitForRequestsToComplete } from "behaviors/helpers/playwrightDisplayElement"
import { Page } from "playwright"
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

  async pause(): Promise<void> {
    await this.page?.pause()
  }

  async goBack(): Promise<void> {
    await this.page?.goBack()
  }

  async waitForPageLoad(): Promise<void> {
    await this.page?.waitForLoadState()
  }

  async waitForRequestsToComplete(): Promise<void> {
    await waitForRequestsToComplete(this.page!)
  }

  selectElementWithText(text: string): DisplayElement {
    return PlaywrightDisplayElement.withText(this.page!, text)
  }

  select(selector: string, options: SelectorOptions = {}): DisplayElement {
    return PlaywrightDisplayElement.fromSelector(this.page!, selector, options)
  }

  selectAll(selector: string): DisplayElementList {
    return PlaywrightDisplayElementList.fromSelector(this.page!, selector)
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
