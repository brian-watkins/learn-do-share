import { Adapters } from "@/src/overview/backstage.js";
import { StaticLearningAreasReader } from "@/adapters/staticLearningAreasReader.js";
import { generateRootFunction } from "@/api/root/function.js";
import { HttpEngagementPlanReader } from "azure/test/functions/HTTPEngagementPlanRepo.js";
import { HttpEngagementNoteCounter } from "azure/test/functions/HTTPNoteRepo.js";

const adapters: Adapters = {
  learningAreasReader: new StaticLearningAreasReader(),
  engagementPlanReader: new HttpEngagementPlanReader(),
  engagementNoteCounter: new HttpEngagementNoteCounter()
}

export default generateRootFunction(adapters)
