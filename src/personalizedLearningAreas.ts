import { EngagementLevel, engagementPlan } from "./engagementPlans"
import { LearningArea, learningAreaContentView, learningAreaOpened, learningAreaTitleView } from "./learningAreas"
import * as Html from '../display/markup'
import { deleteEngagementPlans, writeEngagementPlan } from "./writeEngagementPlans"
import { cardView } from "./viewElements"

export interface PersonalizedLearningArea extends LearningArea {
  engagementLevels: Array<EngagementLevel>
}

export function personalizedLearningAreaView(learningArea: PersonalizedLearningArea): Html.View {
  if (learningArea.selected) {
      return cardView([], [
        learningAreaTitleView(learningArea),
        engagementPlansView(learningArea.engagementLevels),
        learningAreaContentView(learningArea),
        increaseEngagementButton(learningArea)
      ])
  } else {
    return cardView([Html.onClick(learningAreaOpened(learningArea))], [
      learningAreaTitleView(learningArea),
      engagementPlansView(learningArea.engagementLevels)
    ])
  }
}

function engagementPlansView(engagementLevels: Array<EngagementLevel>): Html.ViewChild {
  let levelViews: Array<Html.ViewChild> = []

  for (const level of engagementLevels) {
    switch (level) {
      case EngagementLevel.Doing:
        levelViews.push(engagementPlanView("Doing"))
        break
      case EngagementLevel.Learning:
        levelViews.push(engagementPlanView("Learning"))
        break
      case EngagementLevel.Sharing:
        levelViews.push(engagementPlanView("Sharing"))
        break
    }
  }

  return Html.div([], levelViews)
}

function engagementPlanView(level: string): Html.ViewChild {
  return Html.div([Html.data("engagement-indicator")], [
    Html.text(level)
  ])
}

function increaseEngagementButton(learningArea: PersonalizedLearningArea): Html.ViewChild {
  return Html.section([], [
    Html.button([
      Html.data("increase-engagement"),
      Html.onClick(nextEngagementLevelMessage(learningArea))
    ], [
      Html.text(increaseEngagementText(learningArea))
    ])
  ])
}

function increaseEngagementText(learningArea: PersonalizedLearningArea): string {
  switch (nextEngagementLevel(learningArea)) {
    case EngagementLevel.Learning:
      return "I'm ready to learn!"
    case EngagementLevel.Doing:
      return "Let's do it!"
    case EngagementLevel.Sharing:
      return "I'm ready to share!"
    case EngagementLevel.None:
      return "I'm done for now!"
  }
}

function nextEngagementLevelMessage(learningArea: PersonalizedLearningArea) {
  const nextLevel = nextEngagementLevel(learningArea)
  if (nextLevel === EngagementLevel.None) {
    return deleteEngagementPlans(learningArea)
  } else {
    return writeEngagementPlan(engagementPlan(learningArea, nextLevel))
  }
}

function nextEngagementLevel(learningArea: PersonalizedLearningArea): EngagementLevel {
  if (learningArea.engagementLevels.includes(EngagementLevel.Sharing)) {
    return EngagementLevel.None
  }
  if (learningArea.engagementLevels.includes(EngagementLevel.Doing)) {
    return EngagementLevel.Sharing
  }
  if (learningArea.engagementLevels.includes(EngagementLevel.Learning)) {
    return EngagementLevel.Doing
  }
  return EngagementLevel.Learning
}

export function engagementPlanSelected(area: LearningArea, level: EngagementLevel) {
  return writeEngagementPlan(engagementPlan(area, level))
}
