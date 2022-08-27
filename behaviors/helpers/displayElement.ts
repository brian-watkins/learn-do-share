export interface TypingOptions {
  clear: boolean
}

export interface SelectorOptions {
  withText?: string
}

export interface DisplayElement {
  tagName(): Promise<string>
  click(): Promise<void>
  type(value: string, options?: TypingOptions): Promise<void>
  fill(value: string, options?: TypingOptions): Promise<void>
  isVisible(): Promise<boolean>
  isHidden(): Promise<boolean>
  isDisabled(): Promise<boolean>
  text(): Promise<string | null>
  getAttribute(name: string): Promise<string | null>
  getProperty(name: string): Promise<any>
  getInputValue(): Promise<string>
  selectDescendant(selector: string, options: SelectorOptions): DisplayElement
  selectAllDescendants(selector: string): DisplayElementList
  selectDescendantWithText(text: string): DisplayElement
}

export interface DisplayElementList {
  mapElements<T>(handler: (element: DisplayElement) => Promise<T>): Promise<Array<T>>
  getElement(index: number): DisplayElement
  count(): Promise<number>
}
