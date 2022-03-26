import { h, VNode, VNodeChildElement } from "snabbdom";

export type View = VNode
export type ViewChild = VNodeChildElement

type Attribute = Property

class Property {
  type: "property" = "property"

  constructor(public key: string, public value: string) {}
}

export function id(value: string): Attribute {
  return new Property("id", value)
}

export function text(value: string): ViewChild {
  return value
}

export function div(attributes: Array<Attribute>, children: Array<ViewChild>): View {
  return h("div", makeAttributes(attributes), children)
}

export function h1(attributes: Array<Attribute>, children: Array<ViewChild>): View {
  return h("h1", makeAttributes(attributes), children)
}

export function ul(attributes: Array<Attribute>, children: Array<ViewChild>): View {
  return h("ul", makeAttributes(attributes), children)
}

export function li(attributes: Array<Attribute>, children: Array<ViewChild>): View {
  return h("li", makeAttributes(attributes), children)
}

function makeAttributes(attributes: Array<Attribute>): any {
  const dict: any = {
    props: {}
  }
  for (const attr of attributes) {
    switch (attr.type) {
      case "property":
        dict.props[attr.key] = attr.value
        break
    }
  }
  return dict
}