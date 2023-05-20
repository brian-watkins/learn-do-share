import { container, derived, rule, State, withReducer } from "state-party"
import { LearningArea } from "../learningArea.js"

export enum EngagementLevel {
  None = "none",
  Learning = "learning",
  Doing = "doing",
  Sharing = "sharing"
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

interface SetEngagementLevels {
  type: "set-levels"
  levels: Array<EngagementLevel>
}

export function setEngagementLevels(levels: Array<EngagementLevel>): SetEngagementLevels {
  return {
    type: "set-levels",
    levels
  }
}

interface AddEngagementLevel {
  type: "add-plan"
  level: EngagementLevel
}

function addEngagementLevel(level: EngagementLevel): AddEngagementLevel {
  return {
    type: "add-plan",
    level
  }
}

interface ClearEngagementLevels {
  type: "clear-levels"
}

function clearEngagementLevels(): ClearEngagementLevels {
  return {
    type: "clear-levels"
  }
}

type EngagementPlanMessage = SetEngagementLevels | AddEngagementLevel | ClearEngagementLevels

export const engagementLevels = container<Array<EngagementLevel>, EngagementPlanMessage>(withReducer([], (message, current: Array<EngagementLevel>) => {
  switch (message.type) {
    case "set-levels":
      return message.levels
    case "add-plan":
      return [ ...current, message.level ]
    case "clear-levels":
      return []
  }
}))

function nextEngagementLevel(levels: Array<EngagementLevel>): EngagementLevel {
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

export const increaseEngagementLevelRule = rule(engagementLevels, ({current}) => {
  const nextLevel = nextEngagementLevel(current)
  if (nextLevel === EngagementLevel.None) {
    return clearEngagementLevels()
  } else {
    return addEngagementLevel(nextLevel)
  }
})

export const increaseEngagementText: State<string> = derived(get => {
  const levels = get(engagementLevels)
  switch (nextEngagementLevel(levels)) {
    case EngagementLevel.Learning:
      return "I'm ready to learn!"
    case EngagementLevel.Doing:
      return "Let's do it!"
    case EngagementLevel.Sharing:
      return "I'm ready to share!"
    case EngagementLevel.None:
      return "I'm done for now!"
  }
})
