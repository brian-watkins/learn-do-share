import { h, VNode, VNodeChildElement } from "snabbdom";

export type View = VNode
export type ViewChild = VNodeChildElement

export type Attribute = Property | CSSClass | CSSClassList | EventHandler

class Property {
  type: "property" = "property"

  constructor(public key: string, public value: string) { }
}

class CSSClass {
  type: "css-class" = "css-class"

  constructor(public value: string) { }
}

export function id(value: string): Attribute {
  return new Property("id", value)
}

export function text(value: string): ViewChild {
  return value
}

export function cssClass(value: string): Attribute {
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

export function cssClassList(classes: Array<CssClassToggle>): Attribute {
  return new CSSClassList(classes)
}

class EventHandler {
  type: "event" = "event"

  constructor(public event: string, public message: any) { }
}

export function onClick(message: any): Attribute {
  return new EventHandler("click", message)
}

export function div(attributes: Array<Attribute>, children: Array<ViewChild>): View {
  return h("div", makeAttributes(attributes), children)
}

export function p(attributes: Array<Attribute>, children: Array<ViewChild>): View {
  return h("p", makeAttributes(attributes), children)
}

export function article(attributes: Array<Attribute>, children: Array<ViewChild>): View {
  return h("article", makeAttributes(attributes), children)
}

export function section(attributes: Array<Attribute>, children: Array<ViewChild>): View {
  return h("section", makeAttributes(attributes), children)
}

export function h1(attributes: Array<Attribute>, children: Array<ViewChild>): View {
  return h("h1", makeAttributes(attributes), children)
}

export function h3(attributes: Array<Attribute>, children: Array<ViewChild>): View {
  return h("h3", makeAttributes(attributes), children)
}

export function ul(attributes: Array<Attribute>, children: Array<ViewChild>): View {
  return h("ul", makeAttributes(attributes), children)
}

export function li(attributes: Array<Attribute>, children: Array<ViewChild>): View {
  return h("li", makeAttributes(attributes), children)
}

function makeAttributes(attributes: Array<Attribute>): any {
  const dict: any = {
    props: {},
    class: {},
    on: {}
  }
  for (const attr of attributes) {
    switch (attr.type) {
      case "property":
        dict.props[attr.key] = attr.value
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
            detail: attr.message
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