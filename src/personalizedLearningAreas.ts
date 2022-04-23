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

function increaseEngagementText(_: PersonalizedLearningArea): string {
  return "Increase Engagement!"
}

function nextEngagementLevelMessage(learningArea: PersonalizedLearningArea) {
  if (learningArea.engagementLevels.includes(EngagementLevel.Sharing)) {
    return deleteEngagementPlans(learningArea)
  }
  if (learningArea.engagementLevels.includes(EngagementLevel.Doing)) {
    return writeEngagementPlan(engagementPlan(learningArea, EngagementLevel.Sharing))
  }
  if (learningArea.engagementLevels.includes(EngagementLevel.Learning)) {
    return writeEngagementPlan(engagementPlan(learningArea, EngagementLevel.Doing))
  }
  return writeEngagementPlan(engagementPlan(learningArea, EngagementLevel.Learning))
}

export function engagementPlanSelected(area: LearningArea, level: EngagementLevel) {
  return writeEngagementPlan(engagementPlan(area, level))
}
