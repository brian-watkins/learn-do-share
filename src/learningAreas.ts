import * as Html from "../display/markup"
import { asListItem } from "./viewHelpers"

export class LearningAreasLoaded {
  type: "learningAreasLoaded" = "learningAreasLoaded"
  constructor(public areas: Array<LearningArea>) {}
}

export class LearningAreasLoading {
  type: "learningAreasLoading" = "learningAreasLoading"
}

export type LearningAreasContent = LearningAreasLoaded | LearningAreasLoading

export interface LearningArea {
  title: string
}

function viewLearningArea(learningArea: LearningArea): Html.View {
  return Html.div([], [Html.text(`Title: ${learningArea.title}`)])
}

export function learningAreasView(learningAreas: Array<LearningArea>): Html.View {
  if (learningAreas.length == 0) {
    return Html.h1([], [
      Html.text("There is nothing to learn!")
    ])
  }

  return Html.ul([], learningAreas.map(viewLearningArea).map(asListItem))
}
