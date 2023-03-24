import { Adapters } from "@/src/engage/backstage.js"
import { generateBackstageFunction } from "@/api/backstage/function.js"
import { HttpLearningAreaReader } from "./HTTPLearningAreasReader.js"
import { HttpEngagementNoteReader, HttpNoteEngageWriter } from "./HTTPNoteRepo.js"
import { HttpEngagementPlanReader, HttpEngagementPlanWriter } from "./HTTPEngagementPlanRepo.js"


const adapters: Adapters = {
  learningAreaReader: new HttpLearningAreaReader(),
  engagementPlanReader: new HttpEngagementPlanReader(),
  engagementPlanWriter: new HttpEngagementPlanWriter(),
  engagementNoteReader: new HttpEngagementNoteReader(),
  engagementNoteWriter: new HttpNoteEngageWriter()
}

export default generateBackstageFunction(adapters)
