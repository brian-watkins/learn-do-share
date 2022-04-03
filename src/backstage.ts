import { Backstage } from "../api/backstage/backstage.js";
import { engagementPlanPersisted, EngagementPlanReader, EngagementPlanSelected, engagementPlansLoaded, EngagementPlansRequested, EngagementPlanWriter } from "./engagementPlans.js";
import { LearningAreasReader, LearningAreasRequested, requestLearningAreas } from "./requestLearningAreas.js";

export interface Adapters {
  learningAreasReader: LearningAreasReader
  engagementPlanWriter: EngagementPlanWriter
  engagementPlanReader: EngagementPlanReader
}


export type DataMessage = LearningAreasRequested | EngagementPlanSelected | EngagementPlansRequested

const update = (adapters: Adapters) => async (message: DataMessage) => {
  switch (message.type) {
    case "learningAreasRequested":
      return requestLearningAreas(adapters.learningAreasReader)
    case "engagementPlanSelected":
      await adapters.engagementPlanWriter.write(message.plan)
      return engagementPlanPersisted(message.plan)
    case "engagementPlansRequested":
      const plans = await adapters.engagementPlanReader.read()
      return engagementPlansLoaded(plans)
  }
}

export function initBackstage(adapters: Adapters): Backstage<DataMessage> {
  return {
    messageHandler: update(adapters)
  }
}