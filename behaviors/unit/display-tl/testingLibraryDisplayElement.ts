import { DisplayElement, DisplayElementList, SelectorOptions, TypingOptions } from "behaviors/helpers/displayElement.js";
import { getByText, screen } from "@testing-library/dom"
import { UserEvent } from "node_modules/@testing-library/user-event/dist/types/setup/setup.js";

export class TestingLibraryDisplayElement implements DisplayElement {
  static withText(actor: UserEvent, text: string): DisplayElement {
    return new TestingLibraryDisplayElement(actor, screen.getByText(text))
  }

  static fromSelector(actor: UserEvent, selector: string, _: SelectorOptions): DisplayElement {
    return new TestingLibraryDisplayElement(actor, document.querySelector(selector)!)
  }

  constructor (private actor: UserEvent, private element: HTMLElement | null) {}
  
  async fill(value: string, options?: TypingOptions | undefined): Promise<void> {
    if (!this.element) return Promise.reject("element not found")

    if (options?.clear) {
      await this.actor.clear(this.element)
    }
    await this.actor.type(this.element, value)
  }

  async tagName(): Promise<string> {
    if (!this.element) return Promise.reject("element not found")

    return this.element.tagName
  }

  click(): Promise<void> {
    if (!this.element) return Promise.reject("element not found")

    return this.actor.click(this.element)
  }

  async type(value: string, options: TypingOptions): Promise<void> {
    if (!this.element) return Promise.reject("element not found")

    if (options?.clear) {
      await this.actor.clear(this.element)
    }
    return this.actor.type(this.element, value)
  }

  async isVisible(): Promise<boolean> {
    return this.element !== null
  }
  async isHidden(): Promise<boolean> {
    return this.element === null
  }
  async isDisabled(): Promise<boolean> {
    if (!this.element) return Promise.reject("element not found")

    return this.element.getAttribute("disabled") ? true : false
  }
  async text(): Promise<string | null> {
    if (!this.element) return Promise.reject("element not found")

    return this.element.innerText
  }
  async getAttribute(name: string): Promise<string | null> {
    if (!this.element) return Promise.reject("element not found")

    return this.element.getAttribute(name)
  }
  async getProperty(name: string): Promise<any> {
    if (!this.element) return Promise.reject("element not found")

    return (this.element as any)[name]
  }
  async getInputValue(): Promise<string> {
    if (!this.element) return Promise.reject("element not found")

    return (this.element as HTMLInputElement).value
  }
  selectDescendant(selector: string, _: SelectorOptions): DisplayElement {
    return new TestingLibraryDisplayElement(this.actor, this.element?.querySelector(selector)!!)
  }
  selectAllDescendants(_: string): DisplayElementList {
    throw new Error("Method not implemented.");
  }
  selectDescendantWithText(text: string): DisplayElement {
    if (!this.element) return new TestingLibraryDisplayElement(this.actor, null)

    return new TestingLibraryDisplayElement(this.actor, getByText(this.element, text))
  }
}

export class TestingLibraryDisplayElementList implements DisplayElementList {
  static fromSelector(actor: UserEvent, selector: string): DisplayElementList {
    return new TestingLibraryDisplayElementList(actor, [...document.querySelectorAll(selector)] as Array<HTMLElement>)
  }

  constructor(private actor: UserEvent, private elements: Array<HTMLElement>) {}

  async mapElements<T>(handler: (element: DisplayElement) => Promise<T>): Promise<T[]> {
    return Promise.all(this.elements.map(el => new TestingLibraryDisplayElement(this.actor, el)).map(handler))
  }

  getElement(index: number): DisplayElement {
    return new TestingLibraryDisplayElement(this.actor, this.elements[index])
  }
  
  async count(): Promise<number> {
    return this.elements.length
  }
}