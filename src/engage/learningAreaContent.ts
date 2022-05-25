import * as Html from "@/display/markup"
import { decorate, TagDecorator } from "../util/markdownParser";
import { LearningArea } from "./learningArea";

export function learningAreaContentView(area: LearningArea): Html.ViewChild {
  return Html.p([
    Html.id("learning-area-content"),
    Html.cssClasses([
      "mx-16",
      "mt-12",
      "max-w-xl",
      "border-l-8",
      "border-solid",
      "border-cyan-500",
      "pl-6",
      "text-xl"
    ]),
    Html.withHTMLContent(area.content)
  ], [])
}

export function contentTagStyles(): Array<TagDecorator> {
  return [
    decorate("a", { classname: "text-sky-800 underline visited:text-sky-600", rel: "external", target: "_blank" }),
    decorate("h1", { classname: "font-bold text-2xl" }),
    decorate("h3", { classname: "font-bold" }),
    decorate("ul", { classname: "list-disc list-inside" }),
    decorate("p", { classname: "pb-4" })
  ]
}