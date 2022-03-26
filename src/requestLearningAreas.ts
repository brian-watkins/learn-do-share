import { BackstageMessage, ProgramMessage } from "../display/program.js"
import { LearningArea } from "./learningAreas.js"

export class LearningAreasRequested extends BackstageMessage {
  declare type: "learningAreasRequested"
  constructor() {
    super("learningAreasRequested")
  }
}

export class LearningAreasResponse implements ProgramMessage {
  type: "learningAreasResponse" = "learningAreasResponse"
  constructor(public learningAreas: Array<LearningArea>) {}
}

export interface LearningAreasReader {
  read(): Promise<Array<LearningArea>>
}

export function requestLearningAreas(reader: LearningAreasReader): (request: LearningAreasRequested) => Promise<LearningAreasResponse> {
  return async (request) => {
    const learningAreas = await reader.read()
    return new LearningAreasResponse(learningAreas)
  }
}