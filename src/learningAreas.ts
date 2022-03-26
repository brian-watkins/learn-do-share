import * as Html from "../display/markup"

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

export type LearningAreasState = LearningAreasLoaded | LearningAreasLoading

export interface LearningArea {
  title: string
}

export function viewLearningArea(learningArea: LearningArea): Html.View {
  return Html.div([], [Html.text(`Title: ${learningArea.title}`)])
}

