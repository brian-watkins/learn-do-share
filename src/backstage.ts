import { Backstage } from "../api/backstage/backstage.js";
import { LearningAreasReader, requestLearningAreas } from "./requestLearningAreas.js";

export interface Adapters {
  learningAreasReader: LearningAreasReader
}

interface TypedMessage {
  type: string
}

export function initBackstage(adapters: Adapters): Backstage {
  let handlers = new Map()
  handlers.set("learningAreasRequested", requestLearningAreas(adapters.learningAreasReader))

  return {
    messageHandler: async (message: TypedMessage) => {
      const handler = handlers.get(message.type)
      if (handler) {
        return await handler(message)
      } else {
        return { type: "unknown-backstage-message" }
      }
    }
  }
}