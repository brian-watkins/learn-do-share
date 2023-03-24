import { Adapters } from "@/src/overview/backstage.js";
import { generateRootFunction } from "@/api/root/function.js";
import { HttpLearningAreasReader } from "./HTTPLearningAreasReader.js";
import { HttpEngagementPlanReader } from "./HTTPEngagementPlanRepo.js";
import { HttpEngagementNoteCounter } from "./HTTPNoteRepo.js";


const adapters: Adapters = {
  learningAreasReader: new HttpLearningAreasReader(),
  engagementPlanReader: new HttpEngagementPlanReader(),
  engagementNoteCounter: new HttpEngagementNoteCounter()
}

export default generateRootFunction(adapters)
