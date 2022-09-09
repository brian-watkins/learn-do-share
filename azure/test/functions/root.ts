import { Adapters } from "@/src/overview/backstage";
import { generateRootFunction } from "@/api/root/function";
import { HttpLearningAreasReader } from "./HTTPLearningAreasReader";
import { HttpEngagementPlanReader } from "./HTTPEngagementPlanRepo";
import { HttpEngagementNoteCounter } from "./HTTPNoteRepo";


const adapters: Adapters = {
  learningAreasReader: new HttpLearningAreasReader(),
  engagementPlanReader: new HttpEngagementPlanReader(),
  engagementNoteCounter: new HttpEngagementNoteCounter()
}

export default generateRootFunction(adapters)
