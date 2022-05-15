import * as Html from "@/display/markup"
import { decorate, markdownToHTML } from "../util/markdownParser"

type LearningAreaCategory = string

export interface LearningArea {
  id: string
  title: string
  content: string
  category: LearningAreaCategory
}


export function learningAreaTitleView(area: LearningArea): Html.ViewChild {
  return Html.h3([Html.id("learning-area-title"), Html.cssClassList([
    { "font-bold": true },
    { "text-sky-800": true },
    { "text-lg": true }
  ])], [
    Html.text(area.title),
  ])
}

export function learningAreaContentView(area: LearningArea): Html.ViewChild {
  return Html.p([
    Html.id("learning-area-content"),
    Html.withHTMLContent(markdownToHTML(area.content, [
      decorate("a", { classname: "text-sky-800 underline visited:text-sky-600", rel: "external", target: "_blank" }),
      decorate("h1", { classname: "font-bold text-lg" }),
      decorate("h3", { classname: "font-bold" }),
      decorate("ul", { classname: "list-disc list-inside" }),
      decorate("p", { classname: "pb-4 max-w-lg" })
    ]))
  ], [])
}
