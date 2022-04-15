import { Backstage } from "../api/backstage/backstage.js";
import { AppState } from "./app.js";
import { EngagementPlanReader, engagementPlansLoaded } from "./readEngagementPlans.js";
import { LearningAreasReader } from "./readLearningAreas.js";
import { toUser } from "./user.js";
import { engagementPlanPersisted, EngagementPlanWriter, WriteEngagementPlan } from "./writeEngagementPlans.js";

export interface Adapters {
  learningAreasReader: LearningAreasReader
  engagementPlanWriter: EngagementPlanWriter
  engagementPlanReader: EngagementPlanReader
}

export type DataMessage = WriteEngagementPlan

const update = (adapters: Adapters) => async (message: DataMessage) => {
  switch (message.type) {
    case "writeEngagementPlan":
      await adapters.engagementPlanWriter.write(message.plan)
      return engagementPlanPersisted(message.plan)
  }
}

const initialState = (adapters: Adapters) => async (userIdentifier: string | null): Promise<AppState> => {
  const learningAreas = await adapters.learningAreasReader.read()
  const plans = await adapters.engagementPlanReader.read()
  const user = toUser(userIdentifier)

  return {
    learningAreas: learningAreas,
    engagementPlansContent: engagementPlansLoaded(plans),
    selectedLearningArea: null,
    user
  }
}

export function initBackstage(adapters: Adapters): Backstage<DataMessage, AppState> {
  return {
    messageHandler: update(adapters),
    initialState: initialState(adapters)
  }
}