import { Adapters } from "@/src/engage/backstage"
import { generateBackstageFunction } from "@/api/backstage/function"
import { HttpLearningAreaReader } from "./HTTPLearningAreasReader"
import { HttpNoteEngageReader, HttpNoteEngageWriter } from "./HTTPNoteRepo"
import { HttpEngagementPlanReader, HttpEngagementPlanWriter } from "./HTTPEngagementPlanRepo"


const adapters: Adapters = {
  learningAreaReader: new HttpLearningAreaReader(),
  engagementPlanReader: new HttpEngagementPlanReader(),
  engagementPlanWriter: new HttpEngagementPlanWriter(),
  engagementNoteReader: new HttpNoteEngageReader(),
  engagementNoteWriter: new HttpNoteEngageWriter()
}

export default generateBackstageFunction(adapters)
