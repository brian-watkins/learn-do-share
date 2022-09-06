import { Adapters } from "@/src/engage/backstage";
import { StaticLearningAreaReader } from "@/adapters/staticLearningAreasReader";
import { generateEngageFunction } from "@/api/engage/function"
import { HttpNoteEngageReader, HttpNoteEngageWriter } from "azure/test/functions/HTTPNoteRepo";
import { HttpEngagementPlanReader, HttpEngagementPlanWriter } from "azure/test/functions/HTTPEngagementPlanRepo";


const adapters: Adapters = {
  learningAreaReader: new StaticLearningAreaReader(),
  engagementPlanReader: new HttpEngagementPlanReader(),
  engagementPlanWriter: new HttpEngagementPlanWriter(),
  engagementNoteReader: new HttpNoteEngageReader(),
  engagementNoteWriter: new HttpNoteEngageWriter()
}

export default generateEngageFunction(adapters)
