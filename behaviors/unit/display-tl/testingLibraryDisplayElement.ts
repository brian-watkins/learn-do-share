import { UserEvent } from "@testing-library/user-event/dist/types/setup/setup";
import { DisplayElement, DisplayElementList, SelectorOptions, TypingOptions } from "behaviors/helpers/displayElement";
import { getByText, screen } from "@testing-library/dom"

export class TestingLibraryDisplayElement implements DisplayElement {
  static withText(actor: UserEvent, text: string): DisplayElement {
    return new TestingLibraryDisplayElement(actor, screen.getByText(text))
  }

  static fromSelector(actor: UserEvent, selector: string, options: SelectorOptions): DisplayElement {
    return new TestingLibraryDisplayElement(actor, document.querySelector(selector)!)
  }

  constructor (private actor: UserEvent, private element: HTMLElement) {}
  
  async tagName(): Promise<string> {
    return this.element.tagName
  }
  click(): Promise<void> {
    return this.actor.click(this.element)
  }
  type(value: string, options: TypingOptions): Promise<void> {
    return this.actor.type(this.element, value)
  }
  isVisible(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  isHidden(): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  async isDisabled(): Promise<boolean> {
    return this.element.getAttribute("disabled") ? true : false
  }
  async text(): Promise<string | null> {
    return this.element.innerText
  }
  async getAttribute(name: string): Promise<string | null> {
    return this.element.getAttribute(name)
  }
  async getProperty(name: string): Promise<any> {
    return (this.element as any)[name]
  }
  async getInputValue(): Promise<string> {
    return (this.element as HTMLInputElement).value
  }
  selectDescendant(selector: string, options: SelectorOptions): DisplayElement {
    return new TestingLibraryDisplayElement(this.actor, this.element.querySelector(selector)!!)
  }
  selectAllDescendants(selector: string): DisplayElementList {
    throw new Error("Method not implemented.");
  }
  selectDescendantWithText(text: string): DisplayElement {
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