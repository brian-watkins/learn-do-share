import * as Html from "../display/markup"
import { decorate, markdownToHTML } from "./util/markdownParser"
import { cardView } from "./viewElements"
import { asListItem } from "./viewHelpers"

export interface LearningAreaOpened {
  type: "learningAreaOpened"
  area: LearningArea
}

export function learningAreaOpened(area: LearningArea): LearningAreaOpened {
  return {
    type: "learningAreaOpened",
    area
  }
}

export interface LearningArea {
  id: string
  title: string
  content: string
  selected?: boolean
}

export function learningAreasView(learningAreaViews: Array<Html.ViewChild>): Html.View {
  if (learningAreaViews.length == 0) {
    return Html.h1([Html.id("learning-areas")], [
      Html.text("There is nothing to learn!")
    ])
  }

  return Html.section([
    Html.id("learning-areas"),
    Html.cssClassList([
      { "flex": true },
      { "place-content-center": true }
    ])], [
    Html.ul([Html.cssClassList([
      { "basis-3/6": true },
      { "shrink-0": true },
      { "min-w-fit": true }
    ])], learningAreaViews.map(asListItem))
  ])
}

export function learningAreaView(learningArea: LearningArea): Html.View {
  if (learningArea.selected) {
    return cardView([], [
      learningAreaTitleView(learningArea),
      learningAreaContentView(learningArea),
    ])
  } else {
    return cardView([Html.onClick(learningAreaOpened(learningArea))], [
      learningAreaTitleView(learningArea)
    ])
  }
}

export function learningAreaTitleView(area: LearningArea): Html.ViewChild {
  return Html.h3([Html.cssClassList([
    { "p-4": true },
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
    Html.cssClassList([
      { "p-4": true },
      { "border-solid": true },
      { "border-sky-800": true },
      { "border-t-2": true }
    ]),
    Html.withHTMLContent(markdownToHTML(area.content, [
      decorate("a", { classname: "text-sky-800 underline visited:text-sky-600", rel: "external", target: "_blank" }),
      decorate("h1", { classname: "font-bold text-lg" }),
      decorate("h3", { classname: "font-bold" }),
      decorate("ul", { classname: "list-disc list-inside" }),
      decorate("p", { classname: "pt-4 pb-4 max-w-lg" })
    ]))
  ], [])
}
