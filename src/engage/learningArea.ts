import * as Html from "@/display/markup"
import { decorate, markdownToHTML } from "../util/markdownParser"

type LearningAreaCategory = string

export interface LearningArea {
  id: string
  title: string
  content: string
  category: LearningAreaCategory
}


export function learningAreaCategoryView(area: LearningArea): Html.ViewChild {
  return Html.div([Html.id("learning-area-category"), Html.cssClassList([
    { "capitalize": true },
    { "py-2": true },
    { "px-4": true },
    { "my-8": true },
    { "mx-16": true },
    { "bg-fuchsia-500": true },
    { "rounded": true },
    { "text-neutral-50": true },
    { "border-2": true },
    { "border-fuchsia-500": true },
    { "w-auto": true },
    { "inline-block": true },
    { "capitalize": true },
    { "font-bold": true }
  ])], [
    Html.text(area.category)
  ])
}

export function learningAreaTitleView(area: LearningArea): Html.ViewChild {
  return Html.h3([Html.id("learning-area-title"), Html.cssClassList([
    { "font-bold": true },
    { "text-sky-800": true },
    { "text-8xl": true },
    { "mb-8": true },
    { "mx-16": true }
  ])], [
    Html.text(area.title),
  ])
}

export function learningAreaContentView(area: LearningArea): Html.ViewChild {
  return Html.p([
    Html.id("learning-area-content"),
    Html.cssClassList([
      { "mx-16": true },
      { "mt-8": true },
      { "max-w-xl": true },
      { "border-l-8": true },
      { "border-solid": true },
      { "border-cyan-500": true },
      { "pl-6": true },
      { "text-xl": true }
    ]),
    Html.withHTMLContent(markdownToHTML(area.content, [
      decorate("a", { classname: "text-sky-800 underline visited:text-sky-600", rel: "external", target: "_blank" }),
      decorate("h1", { classname: "font-bold text-2xl" }),
      decorate("h3", { classname: "font-bold" }),
      decorate("ul", { classname: "list-disc list-inside" }),
      decorate("p", { classname: "pb-4" })
    ]))
  ], [])
}
