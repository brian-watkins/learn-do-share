import { User } from "@/api/common/user.js"
import { EngagementNotes } from "./engagementNotes/index.js"
import { EngagementLevels } from "./engagementPlans/index.js"
import { LearningArea } from "./learningArea.js"


export interface Informative {
  type: "informative"
  learningArea: LearningArea
}

export interface Personalized {
  type: "personalized"
  learningArea: LearningArea
  engagementLevels: EngagementLevels
  engagementNotes: EngagementNotes
  user: User
}

export interface Error {
  type: "error"
  learningArea: LearningArea
  engagementLevels: EngagementLevels
  engagementNotes: EngagementNotes
  user: User
}

export type Model
  = Informative
  | Personalized
  | Error
