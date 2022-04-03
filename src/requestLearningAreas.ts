import { LearningArea } from "./learningAreas.js"

export interface LearningAreasRequested {
  type: "learningAreasRequested"
}

export function learningAreasRequested(): LearningAreasRequested {
  return {
    type: "learningAreasRequested"
  }
}

export interface LearningAreasResponse {
  type: "learningAreasResponse"
  learningAreas: Array<LearningArea>
}

export function learningAreasResponse(learningAreas: Array<LearningArea>): LearningAreasResponse {
  return {
    type: "learningAreasResponse",
    learningAreas
  }
}

export interface LearningAreasReader {
  read(): Promise<Array<LearningArea>>
}

export async function requestLearningAreas(reader: LearningAreasReader): Promise<LearningAreasResponse> {
  const learningAreas = await reader.read()
  return learningAreasResponse(learningAreas)
}