import { StaticLearningAreaReader } from "@/adapters/staticLearningAreasReader"
import { Adapters } from "@/src/engage/backstage"
import { generateBackstageFunction } from "@/api/backstage/function"
import { HttpNoteEngageReader, HttpNoteEngageWriter } from "azure/test/functions/HTTPNoteRepo"
import { HttpEngagementPlanReader, HttpEngagementPlanWriter } from "azure/test/functions/HTTPEngagementPlanRepo"


const adapters: Adapters = {
  learningAreaReader: new StaticLearningAreaReader(),
  engagementPlanReader: new HttpEngagementPlanReader(),
  engagementPlanWriter: new HttpEngagementPlanWriter(),
  engagementNoteReader: new HttpNoteEngageReader(),
  engagementNoteWriter: new HttpNoteEngageWriter()
}

export default generateBackstageFunction(adapters)
