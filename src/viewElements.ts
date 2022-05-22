import * as Html from "@/display/markup"

export function cardView(attributes: Array<Html.ViewAttribute>, children: Array<Html.ViewChild>): Html.View {
  return Html.section([cardViewStyle(), ...attributes], children)
}

function cardViewStyle(): Html.ViewAttribute {
  return Html.cssClassList([
    { "p-8": true },
    { "my-8": true },
    { "flex": true },
    { "items-center": true },
    { "gap-8": true },
    { "rounded": true },
    { "border-2": true },
    { "border-sky-800": true },
    { "border-dotted": true },
    { "break-inside-avoid": true },
  ])
}

export function linkStyles(): Html.ViewAttribute {
  return Html.cssClassList([
    { "mt-8": true },
    { "mx-16": true },
    { "px-4": true },
    { "py-2": true },
    { "rounded": true },
    { "border-cyan-800": true },
    { "border-2": true },
    { "border-dotted": true },
    { "text-cyan-800": true },
    { "font-bold": true },
    { "inline-block": true }
  ])
}