import { Adapters } from "@/src/overview/backstage";
import { generateRootFunction } from "@/api/root/function";
import { HttpLearningAreasReader } from "./HTTPLearningAreasReader";
import { HttpNoteOverviewReader } from "./HTTPNoteRepo";
import { HttpEngagementPlanReader } from "./HTTPEngagementPlanRepo";


const adapters: Adapters = {
  learningAreasReader: new HttpLearningAreasReader(),
  engagementPlanReader: new HttpEngagementPlanReader(),
  engagementNoteReader: new HttpNoteOverviewReader()
}

export default generateRootFunction(adapters)
