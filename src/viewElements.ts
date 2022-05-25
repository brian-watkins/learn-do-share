import * as Html from "@/display/markup"

export function cardView(attributes: Array<Html.ViewAttribute>, children: Array<Html.ViewChild>): Html.View {
  return Html.section([cardViewStyle(), ...attributes], children)
}

function cardViewStyle(): Html.ViewAttribute {
  return Html.cssClasses([
    "p-8",
    "my-8",
    "flex",
    "items-center",
    "gap-8",
    "rounded",
    "border-2",
    "border-sky-800",
    "border-dotted",
    "break-inside-avoid",
  ])
}

export function linkStyles(): Html.ViewAttribute {
  return Html.cssClasses([
    "mt-8",
    "mx-16",
    "px-4",
    "py-2",
    "rounded",
    "border-cyan-800",
    "border-2",
    "border-dotted",
    "text-cyan-800",
    "font-bold",
    "inline-block"
  ])
}