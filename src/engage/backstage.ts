import { Backstage, BackstageContext } from "../../api/backstage/backstage.js";
import { User } from "../../api/common/user.js";
import { EngageContext } from "../../api/engage/render"
import { EngagementPlanReader } from "../readEngagementPlans.js";
import { DeleteEngagementPlans, engagementPlanPersisted, engagementPlansDeleted, EngagementPlanWriter, WriteEngagementPlan } from "../writeEngagementPlans.js";
import { Model } from "./display.js";
import { LearningAreaReader } from "./learningAreaReader"

export interface Adapters {
  learningAreaReader: LearningAreaReader
  engagementPlanWriter: EngagementPlanWriter
  engagementPlanReader: EngagementPlanReader
}

export type DataMessage = WriteEngagementPlan | DeleteEngagementPlans

const update = (adapters: Adapters) => async (user: User | null, message: DataMessage) => {
  if (user == null) {
    return { type: "no-user-found" }
  }

  switch (message.type) {
    case "writeEngagementPlan":
      await adapters.engagementPlanWriter.write(user, message.plan)
      return engagementPlanPersisted(message.plan)
    case "deleteEngagementPlans":
      await adapters.engagementPlanWriter.deleteAll(user, message.learningArea)
      return engagementPlansDeleted(message.learningArea)
  }
}

const initialState = (adapters: Adapters) => async (context: BackstageContext<EngageContext>): Promise<Model> => {
  const learningArea = await adapters.learningAreaReader.read(context.attributes.learningAreaId)

  if (learningArea == null) {
    return {
      type: "unknown-area"
    }
  }

  if (context.user === null) {
    return {
      type: "informative",
      learningArea
    }
  } else {
    const plans = await adapters.engagementPlanReader.read(context.user)
    const levels = plans
      .filter(plan => plan.learningArea === learningArea.id)
      .map(plan => {
        return plan.level
      })

    return {
      type: "personalized",
      learningArea: { ...learningArea, engagementLevels: levels },
      user: context.user
    }
  }
}

export function initBackstage(adapters: Adapters): Backstage<EngageContext, any, Model> {
  return {
    messageHandler: update(adapters),
    initialState: initialState(adapters)
  }
}