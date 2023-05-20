import * as Html from "display-party"
import * as Style from "../style.js"

export enum LearningAreaCategory {
  Team = "team",
  Discipline = "discipline",
  Theory = "theory"
}

export function learningAreaCategoryTitle(category: LearningAreaCategory): Html.View {
  return Html.div([
    Style.tag(Style.colorForCategory(category))
  ], [
    Html.text(category)
  ])
}
