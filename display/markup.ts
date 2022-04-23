import { h, VNode, VNodeChildElement } from "snabbdom";

export type View = VNode
export type ViewChild = VNodeChildElement

export type ViewAttribute = Property | Attribute | CSSClass | CSSClassList | EventHandler

class Property {
  type: "property" = "property"

  constructor(public key: string, public value: string) { }
}

class Attribute {
  type: "attribute" = "attribute"

  constructor(public key: string, public value: string) { }
}

class CSSClass {
  type: "css-class" = "css-class"

  constructor(public value: string) { }
}

export function id(value: string): ViewAttribute {
  return new Property("id", value)
}

export function type(value: string): ViewAttribute {
  return new Attribute("type", value)
}

export function name(value: string): ViewAttribute {
  return new Attribute("name", value)
}

export function value(value: string): ViewAttribute {
  return new Attribute("value", value)
}

export function data(name: string, value: string = ""): ViewAttribute {
  return new Attribute(`data-${name}`, value)
}

export function href(value: string): ViewAttribute {
  return new Attribute("href", value)
}

export function text(value: string): ViewChild {
  return value
}

export function cssClass(value: string): ViewAttribute {
  return new CSSClass(value)
}

export type CssClassToggle = { [key: string]: boolean }

class CSSClassList {
  type: "css-class-list" = "css-class-list"

  constructor(private classes: Array<CssClassToggle>) { }

  toObject(): any {
    const classObject = {}
    for (const classToggle of this.classes) {
      Object.assign(classObject, classToggle)
    }
    return classObject
  }
}

export function cssClassList(classes: Array<CssClassToggle>): ViewAttribute {
  return new CSSClassList(classes)
}

class EventHandler {
  type: "event" = "event"

  constructor(public event: string, public generator: (evt: Event) => any) { }
}

export function onClick(message: any): ViewAttribute {
  return new EventHandler("click", () => message)
}

export function onInput(generator: (value: string) => any): ViewAttribute {
  return new EventHandler("input", (evt) => {
    return generator((<HTMLInputElement>evt.target)?.value)
  })
}

export function withHTMLContent(content: string): ViewAttribute {
  return new Property("innerHTML", content)
}

export function div(attributes: Array<ViewAttribute>, children: Array<ViewChild>): View {
  return h("div", makeAttributes(attributes), children)
}

export function p(attributes: Array<ViewAttribute>, children: Array<ViewChild>): View {
  return h("p", makeAttributes(attributes), children)
}

export function article(attributes: Array<ViewAttribute>, children: Array<ViewChild>): View {
  return h("article", makeAttributes(attributes), children)
}

export function section(attributes: Array<ViewAttribute>, children: Array<ViewChild>): View {
  return h("section", makeAttributes(attributes), children)
}

export function h1(attributes: Array<ViewAttribute>, children: Array<ViewChild>): View {
  return h("h1", makeAttributes(attributes), children)
}

export function h3(attributes: Array<ViewAttribute>, children: Array<ViewChild>): View {
  return h("h3", makeAttributes(attributes), children)
}

export function ul(attributes: Array<ViewAttribute>, children: Array<ViewChild>): View {
  return h("ul", makeAttributes(attributes), children)
}

export function li(attributes: Array<ViewAttribute>, children: Array<ViewChild>): View {
  return h("li", makeAttributes(attributes), children)
}

export function input(attributes: Array<ViewAttribute>, children: Array<ViewChild>): View {
  return h("input", makeAttributes(attributes), children)
}

export function label(attributes: Array<ViewAttribute>, children: Array<ViewChild>): View {
  return h("label", makeAttributes(attributes), children)
}

export function a(attributes: Array<ViewAttribute>, children: Array<ViewChild>): View {
  return h("a", makeAttributes(attributes), children)
}

export function button(attributes: Array<ViewAttribute>, children: Array<ViewChild>): View {
  return h("button", makeAttributes(attributes), children)
}

function makeAttributes(attributes: Array<ViewAttribute>): any {
  const dict: any = {
    props: {},
    attrs: {},
    class: {},
    on: {}
  }
  for (const attr of attributes) {
    switch (attr.type) {
      case "property":
        dict.props[attr.key] = attr.value
        break
      case "attribute":
        dict.attrs[attr.key] = attr.value
        break
      case "css-class":
        dict.class[attr.value] = true
        break
      case "css-class-list":
        dict.class = attr.toObject()
        break
      case "event":
        dict.on[attr.event] = function (evt: Event) {
          evt.target?.dispatchEvent(new CustomEvent("displayMessage", {
            bubbles: true,
            cancelable: true,
            detail: attr.generator(evt)
          }))
        }
        break
      default:
        exhaustiveMatchGuard(attr)
    }
  }
  return dict
}

function exhaustiveMatchGuard(_: never) {
  throw new Error("Should never get here!")
}