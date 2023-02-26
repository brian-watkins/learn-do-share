import { StaticLearningAreaReader } from "@/adapters/staticLearningAreasReader.js"
import { Adapters } from "@/src/engage/backstage.js"
import { generateBackstageFunction } from "@/api/backstage/function.js"
import { HttpEngagementNoteReader, HttpNoteEngageWriter } from "azure/test/functions/HTTPNoteRepo.js"
import { HttpEngagementPlanReader, HttpEngagementPlanWriter } from "azure/test/functions/HTTPEngagementPlanRepo.js"


const adapters: Adapters = {
  learningAreaReader: new StaticLearningAreaReader(),
  engagementPlanReader: new HttpEngagementPlanReader(),
  engagementPlanWriter: new HttpEngagementPlanWriter(),
  engagementNoteReader: new HttpEngagementNoteReader(),
  engagementNoteWriter: new HttpNoteEngageWriter()
}

export default generateBackstageFunction(adapters)
