import * as Html from "@/display/markup"
import * as Style from "../style"

export enum LearningAreaCategory {
  Team = "team",
  Discipline = "discipline",
  Theory = "theory"
}

export function learningAreaCategoryTitle(category: LearningAreaCategory): Html.ViewChild {
  return Html.div([Style.tag(Style.colorForCategory(category))], [
    Html.text(category)
  ])
}
