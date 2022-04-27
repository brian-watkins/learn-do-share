import * as Html from "../display/markup"

export function fullView(attributes: Array<Html.ViewAttribute>, children: Array<Html.ViewChild>): Html.View {
  return Html.article([fullViewStyle(), ...attributes], children)
}

function fullViewStyle(): Html.ViewAttribute {
  return Html.cssClassList([
    { "p-8": true },
    { "w-80": true },
    { "rounded": true },
    { "border-2": true },
    { "border-sky-800": true },
    { "border-solid": true },
  ])
}

export function cardView(attributes: Array<Html.ViewAttribute>, children: Array<Html.ViewChild>): Html.View {
  return Html.article([cardViewStyle(), ...attributes], children)
}

function cardViewStyle(): Html.ViewAttribute {
  return Html.cssClassList([
    { "p-8": true },
    { "w-80": true },
    { "rounded": true },
    { "border-2": true },
    { "border-sky-800": true },
    { "border-solid": true },
    { "break-inside-avoid": true },
  ])
}
