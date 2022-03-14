import { h, VNode } from "snabbdom"

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

export function viewLearningArea(learningArea: LearningArea): VNode {
  return h("div", {}, `Title: ${learningArea.title}`)
}

