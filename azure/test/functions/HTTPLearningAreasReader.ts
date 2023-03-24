import { LearningArea as LearningAreaToEngage } from "@/src/engage/learningArea.js";
import { LearningAreaReader } from "@/src/engage/learningAreaReader.js";
import { LearningAreasReader } from "@/src/overview/backstage.js";
import { LearningArea } from "@/src/overview/learningAreas.js";
import fetch from "node-fetch"

export class HttpLearningAreasReader implements LearningAreasReader {
  async read(): Promise<LearningArea[]> {
    const response = await fetch("http://localhost:7171/learning-areas")
    const data = await response.json()
    return data as Array<LearningArea>
  }
}

export class HttpLearningAreaReader implements LearningAreaReader {
  async read(id: string): Promise<LearningAreaToEngage | null> {
    const response = await fetch(`http://localhost:7171/learning-area/${id}`)
    const data = await response.json()
    return data as LearningAreaToEngage
  }
}