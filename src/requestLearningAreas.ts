import { DisplayMessage } from "../display/display.js"
import { LearningArea } from "./learningAreas.js"

export class LearningAreasRequested {
  type: "learningAreasRequested" = "learningAreasRequested"
}

export class LearningAreasResponse implements DisplayMessage {
  type: "learningAreasResponse" = "learningAreasResponse"
  constructor(public learningAreas: Array<LearningArea>) { }
}

export interface LearningAreasReader {
  read(): Promise<Array<LearningArea>>
}

export async function requestLearningAreas(reader: LearningAreasReader): Promise<LearningAreasResponse> {
  const learningAreas = await reader.read()
  return new LearningAreasResponse(learningAreas)
}