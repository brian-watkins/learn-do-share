import * as Html from "../display/markup"
import { decorate, markdownToHTML } from "./util/markdownParser"
import { asListItem } from "./viewHelpers"

export interface LearningAreasLoaded {
  type: "learningAreasLoaded"
  areas: Array<LearningArea>
}

export function learningAreasLoaded(areas: Array<LearningArea>): LearningAreasLoaded {
  return {
    type: "learningAreasLoaded",
    areas
  }
}

export interface LearningAreasLoading {
  type: "learningAreasLoading"
}

export function learningAreasLoading(): LearningAreasLoading {
  return {
    type: "learningAreasLoading"
  }
}

export interface LearningAreaOpened {
  type: "learningAreaOpened"
  area: LearningArea
}

function learningAreaOpened(area: LearningArea): LearningAreaOpened {
  return {
    type: "learningAreaOpened",
    area
  }
}

export type LearningAreasContent = LearningAreasLoaded | LearningAreasLoading

export interface LearningArea {
  title: string
  content: string
}

function viewLearningArea(selected: LearningArea | null): (learningArea: LearningArea) => Html.View {
  return (learningArea) => {
    if (learningArea.title === selected?.title) {
      return Html.article([cardStyle()], [
        viewTitle(learningArea),
        viewContent(learningArea)
      ])
    } else {
      return Html.article([cardStyle(), Html.onClick(learningAreaOpened(learningArea))], [
        viewTitle(learningArea)
      ])
    }
  }
}

function viewTitle(area: LearningArea): Html.ViewChild {
  return Html.h3([Html.cssClassList([
    { "p-4": true },
    { "font-bold": true },
    { "text-sky-800": true },
    { "text-lg": true }
  ])], [
    Html.text(area.title)
  ])
}

function viewContent(area: LearningArea): Html.ViewChild {
  return Html.p([
    Html.id("learning-area-content"),
    Html.cssClassList([
      { "p-4": true },
      { "border-solid": true },
      { "border-sky-800": true },
      { "border-t-2": true }
    ]),
    Html.withHTMLContent(markdownToHTML(area.content, [
      decorate("a",  { classname: "text-sky-800 underline visited:text-sky-600", rel: "external", target: "_blank" }),
      decorate("h1", { classname: "font-bold text-lg" }),
      decorate("h3", { classname: "font-bold" }),
      decorate("ul", { classname: "list-disc list-inside" }),
      decorate("p", { classname: "pt-4 pb-4 max-w-lg" })
    ]))
  ], [])
}

function cardStyle(): Html.Attribute {
  return Html.cssClassList([
    { "m-4": true },
    { "rounded": true },
    { "border-2": true },
    { "border-sky-800": true },
    { "border-solid": true }])
}

export function learningAreasView(learningAreas: Array<LearningArea>, selected: LearningArea | null): Html.View {
  if (learningAreas.length == 0) {
    return Html.h1([], [
      Html.text("There is nothing to learn!")
    ])
  }

  return Html.section([Html.cssClassList([
    { "flex": true },
    { "place-content-center": true }
  ])], [
    Html.ul([Html.cssClassList([
      { "basis-3/6": true },
      { "shrink-0": true },
      { "min-w-fit": true }
    ])], learningAreas.map(viewLearningArea(selected)).map(asListItem))
  ])
}
