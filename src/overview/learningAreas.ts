import * as Html from "@/display/markup"
import * as Style from "../style"
import { LearningAreaCategory, learningAreaCategoryTitle } from "./learningAreaCategory"
import { cardBox } from "../viewElements"

export interface LearningArea {
  id: string
  title: string
  category: LearningAreaCategory
}

export function learningAreasView<T extends LearningArea>(learningAreas: Array<T>, toView: (area: T) => Html.View): Html.View {
  return Html.section([
    Html.id("learning-areas"),
    Html.cssClasses([
      "mt-16",
      "mx-16"
    ])
  ], learningAreas.map(toView))
}

export function learningAreaView(learningArea: LearningArea): Html.View {
  return Html.a([Html.href(`/learning-areas/${learningArea.id}`)], [
    cardBox([
      Html.data("learning-area", learningArea.id )
    ], [
      learningAreaCategoryTitle(learningArea.category),
      learningAreaTitleView(learningArea)
    ])
  ])
}

export function learningAreaTitleView(area: LearningArea): Html.ViewChild {
  return Html.h4([Html.cssClasses([
    "font-bold",
    Style.darkTextColor,
    "text-5xl",
    "hover:underline"
  ])], [
    Html.text(area.title),
  ])
}
