import * as Html from "../display/markup"
import { decorate, markdownToHTML } from "./util/markdownParser"
import { cardView } from "./viewElements"

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

export enum LearningAreaGroup {
  Team = "team",
  Discipline = "discipline",
  Theory = "theory"
}

export interface LearningArea {
  id: string
  title: string
  content: string
  selected?: boolean
  group: LearningAreaGroup
}

export function learningAreasView<T extends LearningArea>(learningAreas: Array<T>, toView: (area: T) => Html.ViewChild): Html.View {
  return Html.section([
    Html.id("learning-areas"),
    Html.cssClassList([
      { "mx-auto": true },
      { "w-fit": true },
      { "gap-16": true },
      { "flex": true },
    ])
  ], [
    Html.section([
      Html.id("team-learning-areas"),
      learningAreaGroupStyles()
    ], [
      learningAreaGroupTitle("Team"),
      ...filterAreas(LearningAreaGroup.Team, learningAreas).map(toView)
    ]),
    Html.section([
      Html.id("discipline-learning-areas"),
      learningAreaGroupStyles()
    ], [
      learningAreaGroupTitle("Discipline"),
      ...filterAreas(LearningAreaGroup.Discipline, learningAreas).map(toView)
    ]),
    Html.section([
      Html.id("theory-learning-areas"),
      learningAreaGroupStyles()
    ], [
      learningAreaGroupTitle("Theory"),
      ...filterAreas(LearningAreaGroup.Theory, learningAreas).map(toView)
    ]),
  ])
}

function learningAreaGroupTitle(title: string): Html.ViewChild {
  return Html.div([
    Html.cssClassList([
      { "py-2": true },
      { "px-4": true },
      { "my-2": true },
      { "font-bold": true },
      { "bg-indigo-700": true },
      { "rounded": true },
      { "text-neutral-50": true },
      { "w-auto": true },
      { "inline-block": true }
    ])
  ], [
    Html.text(title)
  ])
}

function learningAreaGroupStyles(): Html.ViewAttribute {
  return Html.cssClassList([
    { "flex": true },
    { "flex-col": true },
    { "gap-8": true }
  ])
}

function filterAreas<T extends LearningArea>(group: LearningAreaGroup, areas: Array<T>): Array<T> {
  return areas.filter(area => area.group === group)
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
