import { User } from "@/api/common/user.js"
import { EngagementNote } from "./engagementNotes/index.js"
import { EngagementLevel } from "./engagementPlans/index.js"
import { LearningArea } from "./learningArea.js"


export interface Informative {
  type: "informative"
  learningArea: LearningArea
}

export interface Personalized {
  type: "personalized"
  learningArea: LearningArea
  engagementLevels: Array<EngagementLevel>
  engagementNotes: Array<EngagementNote>
  user: User
}

export interface Error {
  type: "error"
  learningArea: LearningArea
  engagementLevels: Array<EngagementLevel>
  engagementNotes: Array<EngagementNote>
  user: User
}

export type Model
  = Informative
  | Personalized
  | Error
