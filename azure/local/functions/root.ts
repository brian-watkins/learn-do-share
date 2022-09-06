import { Adapters } from "@/src/overview/backstage";
import { StaticLearningAreasReader } from "@/adapters/staticLearningAreasReader";
import { generateRootFunction } from "@/api/root/function";
import { HttpNoteOverviewReader } from "azure/test/functions/HTTPNoteRepo";
import { HttpEngagementPlanReader } from "azure/test/functions/HTTPEngagementPlanRepo";

const adapters: Adapters = {
  learningAreasReader: new StaticLearningAreasReader(),
  engagementPlanReader: new HttpEngagementPlanReader(),
  engagementNoteReader: new HttpNoteOverviewReader()
}

export default generateRootFunction(adapters)
