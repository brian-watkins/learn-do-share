import { Adapters } from "@/src/engage/backstage"
import { generateBackstageFunction } from "@/api/backstage/function"
import { HttpLearningAreaReader } from "./HTTPLearningAreasReader"
import { HttpEngagementNoteReader, HttpNoteEngageWriter } from "./HTTPNoteRepo"
import { HttpEngagementPlanReader, HttpEngagementPlanWriter } from "./HTTPEngagementPlanRepo"


const adapters: Adapters = {
  learningAreaReader: new HttpLearningAreaReader(),
  engagementPlanReader: new HttpEngagementPlanReader(),
  engagementPlanWriter: new HttpEngagementPlanWriter(),
  engagementNoteReader: new HttpEngagementNoteReader(),
  engagementNoteWriter: new HttpNoteEngageWriter()
}

export default generateBackstageFunction(adapters)
