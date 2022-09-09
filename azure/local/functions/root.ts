import { Adapters } from "@/src/overview/backstage";
import { StaticLearningAreasReader } from "@/adapters/staticLearningAreasReader";
import { generateRootFunction } from "@/api/root/function";
import { HttpEngagementPlanReader } from "azure/test/functions/HTTPEngagementPlanRepo";
import { HttpEngagementNoteCounter } from "azure/test/functions/HTTPNoteRepo";

const adapters: Adapters = {
  learningAreasReader: new StaticLearningAreasReader(),
  engagementPlanReader: new HttpEngagementPlanReader(),
  engagementNoteCounter: new HttpEngagementNoteCounter()
}

export default generateRootFunction(adapters)
