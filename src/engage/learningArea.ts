import * as Html from "@/display/markup"
import * as Style from "../style"
import { pageTitle } from "../viewElements"

type LearningAreaCategory = string

export interface LearningArea {
  id: string
  title: string
  content: string
  category: LearningAreaCategory
}


export function learningAreaCategoryView(area: LearningArea): Html.View {
  return Html.div([
    Html.id("learning-area-category"),
    Style.tag(Style.colorForCategory(area.category)),
    Html.cssClasses([
      "mt-8",
      "mb-4",
      "mx-16",
    ])], [
    Html.text(area.category)
  ])
}

export function learningAreaTitleView(area: LearningArea): Html.View {
  return pageTitle([
    Html.id("learning-area-title"),
    Html.cssClasses([
      Style.darkTextColor
    ])
  ], area.title)
}
