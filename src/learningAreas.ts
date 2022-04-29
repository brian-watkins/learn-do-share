import * as Html from "../display/markup"
import { LearningAreaCategory, learningAreaCategoryView } from "./leanringAreaCategory"
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

export interface LearningArea {
  id: string
  title: string
  content: string
  selected?: boolean
  category: LearningAreaCategory
}

export function learningAreasView<T extends LearningArea>(learningAreas: Array<T>, toView: (area: T) => Html.View): Html.View {
  return Html.section([
    Html.id("learning-areas"),
    Html.cssClassList([
      { "mx-auto": true },
      { "w-fit": true },
      { "gap-16": true },
      { "flex": true },
    ])
  ], [
    learningAreaCategoryView(
      LearningAreaCategory.Team,
      filterAreas(LearningAreaCategory.Team, learningAreas).map(toView)
    ),
    learningAreaCategoryView(
      LearningAreaCategory.Discipline,
      filterAreas(LearningAreaCategory.Discipline, learningAreas).map(toView)
    ),
    learningAreaCategoryView(
      LearningAreaCategory.Theory,
      filterAreas(LearningAreaCategory.Theory, learningAreas).map(toView)
    ),
  ])
}

function filterAreas<T extends LearningArea>(group: LearningAreaCategory, areas: Array<T>): Array<T> {
  return areas.filter(area => area.category === group)
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
