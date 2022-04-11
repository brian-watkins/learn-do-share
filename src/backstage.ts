import { Backstage } from "../api/backstage/backstage.js";
import { learningAreasLoaded } from "./learningAreas.js";
import { EngagementPlanReader, engagementPlansLoaded, EngagementPlansRequested } from "./readEngagementPlans.js";
import { LearningAreasReader, LearningAreasRequested, requestLearningAreas } from "./requestLearningAreas.js";
import { engagementPlanPersisted, EngagementPlanWriter, WriteEngagementPlan } from "./writeEngagementPlans.js";

export interface Adapters {
  learningAreasReader: LearningAreasReader
  engagementPlanWriter: EngagementPlanWriter
  engagementPlanReader: EngagementPlanReader
}

export type DataMessage = LearningAreasRequested | WriteEngagementPlan | EngagementPlansRequested

const update = (adapters: Adapters) => async (message: DataMessage) => {
  switch (message.type) {
    case "learningAreasRequested":
      return requestLearningAreas(adapters.learningAreasReader)
      break
    case "writeEngagementPlan":
      await adapters.engagementPlanWriter.write(message.plan)
      return engagementPlanPersisted(message.plan)
    case "engagementPlansRequested":
      const plans = await adapters.engagementPlanReader.read()
      return engagementPlansLoaded(plans)
  }
}

const initialState = (adapters: Adapters) => async () => {
  const learningAreas = await adapters.learningAreasReader.read()
  const plans = await adapters.engagementPlanReader.read()

  return {
    learningAreasContent: learningAreasLoaded(learningAreas),
    engagementPlansContent: engagementPlansLoaded(plans),
    selectedLearningArea: null
  }
}

export function initBackstage(adapters: Adapters): Backstage<DataMessage> {
  return {
    messageHandler: update(adapters),
    initialState: initialState(adapters)
  }
}