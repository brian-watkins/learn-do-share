import { Backstage } from "../api/backstage/backstage.js";
import { LearningAreasReader, LearningAreasRequested, requestLearningAreas } from "./requestLearningAreas.js";

export interface Adapters {
  learningAreasReader: LearningAreasReader
}

export type DataMessage = LearningAreasRequested

const update = (adapters: Adapters) => async (message: DataMessage) => {
  switch (message.type) {
    case "learningAreasRequested":
      return requestLearningAreas(adapters.learningAreasReader)
  }
}

export function initBackstage(adapters: Adapters): Backstage<DataMessage> {
  return {
    messageHandler: (msg) => update(adapters)(msg.wrapped)
  }
}