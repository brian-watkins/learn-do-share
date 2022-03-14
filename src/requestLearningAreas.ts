import { h, VNode } from "snabbdom"

export interface LearningArea {
  title: string
}

export function viewLearningArea(learningArea: LearningArea): VNode {
  return h("div", {}, `Title: ${learningArea.title}`)
}


export interface RequestMessage {
  meta: "request"
}


export interface LearningAreasRequested extends RequestMessage {
  type: "learningAreasRequested"
}

export function learningAreasRequested(): LearningAreasRequested {
  return {
    type: "learningAreasRequested",
    meta: "request"
  }
}

export interface LearningAreasResponse {
  type: "learningAreasResponse"
  learningAreas: Array<LearningArea>
}



export interface LearningAreasReader {
  read(): Promise<Array<LearningArea>>
}

export function requestLearningAreas(reader: LearningAreasReader): (request: LearningAreasRequested) => Promise<LearningAreasResponse> {
  return async (request) => {
    const learningAreas = await reader.read()
    return {
      type: "learningAreasResponse",
      learningAreas
    }
  }
}