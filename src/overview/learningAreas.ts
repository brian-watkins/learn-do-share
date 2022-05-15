import * as Html from "@/display/markup"
import { LearningAreaCategory, learningAreaCategoryView } from "./learningAreaCategory"
import { cardView } from "../viewElements"

export interface LearningArea {
  id: string
  title: string
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
  return Html.a([Html.href(`/learning-areas/${learningArea.id}`)], [
    cardView([], [
      learningAreaTitleView(learningArea)
    ])
  ])
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
