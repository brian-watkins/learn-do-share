import { LearningArea } from "../learningArea"

export enum EngagementLevel {
  None = "none",
  Learning = "learning",
  Doing = "doing",
  Sharing = "sharing"
}

export function nextEngagementLevel(levels: Array<EngagementLevel>): EngagementLevel {
  if (levels.includes(EngagementLevel.Sharing)) {
    return EngagementLevel.None
  }
  if (levels.includes(EngagementLevel.Doing)) {
    return EngagementLevel.Sharing
  }
  if (levels.includes(EngagementLevel.Learning)) {
    return EngagementLevel.Doing
  }
  return EngagementLevel.Learning
}

export interface EngagementPlan {
  learningArea: string
  level: EngagementLevel
}

export function engagementPlan(learningArea: LearningArea, level: EngagementLevel): EngagementPlan {
  return {
    learningArea: learningArea.id,
    level
  }
}

export type EngagementLevels
  = EngagementLevelsRetrieved
  | EngagementLevelsSaving

export interface EngagementLevelsRetrieved {
  type: "engagement-levels-retrieved"
  levels: Array<EngagementLevel>
}

export function engagementLevelsRetrieved(levels: Array<EngagementLevel>): EngagementLevels {
  return {
    type: "engagement-levels-retrieved",
    levels
  }
}

export interface EngagementLevelsSaving {
  type: "engagement-levels-saving"
  levels: Array<EngagementLevel>
}

export function engagementLevelsSaving(levels: Array<EngagementLevel>): EngagementLevels {
  return {
    type: "engagement-levels-saving",
    levels
  }
}

