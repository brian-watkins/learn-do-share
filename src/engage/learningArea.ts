import { state, State } from "loop"
import * as Html from "loop/display"
import * as Style from "../style.js"
import { pageTitle } from "../viewElements.js"

type LearningAreaCategory = string

export interface LearningArea {
  id: string
  title: string
  content: string
  category: LearningAreaCategory
}

export const learningArea = state<LearningArea>(() => ({
  id: "", title: "", content: "", category: ""
}))

export function learningAreaCategoryView(get: <S>(state: State<S>) => S): Html.View {
  const area = get(learningArea)
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

export function learningAreaTitleView(get: <S>(state: State<S>) => S): Html.View {
  const area = get(learningArea)
  return pageTitle([
    Html.id("learning-area-title"),
    Html.cssClasses([
      Style.darkTextColor
    ])
  ], area.title)
}
