// import * as Html from "@/display/markup"
import * as Html from "loop/display"
import * as Style from "../../style.js"
import { EngagementLevel, EngagementLevels, engagementPlan, nextEngagementLevel } from "./index.js"
import { deleteEngagementPlans } from "./deleteEngagementPlans.js"
import { writeEngagementPlan } from "./saveEngagementPlan.js"
import { State, state, withDerivedValue } from "loop"
import { LearningArea } from "../learningArea.js"
import { writeMessage } from "node_modules/loop/dist/loop.js"
import { engagementPlanState } from "../model.js"


export function engagementPlansView(learningArea: LearningArea, levels: State<Array<EngagementLevel>>): State<Html.View> {
  return state(withDerivedValue(get => {
    const plans = get(levels)
    const isSaving = get(engagementPlanState).type === "writing"

    return Html.div([Html.cssClasses([
      "flex",
      "flex-col",
      "gap-4"
    ])], [
      Html.div([
        Html.cssClasses([
          "flex",
          "gap-4"
        ])
      ], [...plans.map(engagementPlanView), increaseEngagementButton(learningArea, plans, isSaving)])
    ])
  }))
}



// export function view(area: LearningArea, levels: EngagementLevels): Html.View {
//   return Html.div([ Html.cssClasses([
//     "flex",
//     "flex-col",
//     "gap-4"
//   ]) ], [
//     Html.div([
//       Html.cssClasses([
//         "flex",
//         "gap-4"
//       ])
//     ], [...levels.levels.map(engagementPlanView), increaseEngagementButton(area, levels)])  
//   ])
// }

function engagementPlanView(level: string): Html.ViewChild {
  return Html.div([
    Style.tag(Style.Colors.Engagement),
    Html.data("engagement-indicator")
  ], [
    Html.text(level)
  ])
}

// Notice how here I'm basically triggering a procedure by writing to this container.
// What I really want to do is just say: "Hey increase the learning area for this level
// for this person" and then there's a rule that's invoked that depends on the current
// levels. Also, the text of the button is dynamic as well.

// But then what would happen?
// 1. Trigger procedure
// 2. Procedure figures out next engagement level and writes it to some container
// 3. The Writer for that container does it's work and sets the status to Written
// 4. A provider for engagement levels picks up that change and updates the levels

// OR
// 1. Trigger procedure
// 2. Procedure figures out next engagement level and sends an INSERT to the engagement levels
// 3. The INSERT occurs

// OR
// 1. Trigger procedure
// 2. Procedure figures out next engagement level and writes it to some container
// 3. The Writer for that container does it's work and sets the status to Written AND updates
// the engagement levels container

export function increaseEngagementButton(learningArea: LearningArea, levels: Array<EngagementLevel>, isSaving: boolean): Html.View {
  return Html.button([
    Style.link(),
    Html.data("increase-engagement"),
    Html.onClick(writeMessage(engagementPlanState, {
      type: "writing",
      value: engagementPlan(learningArea, nextEngagementLevel(levels))
    })),
    Html.disabled(isSaving)
    // Html.onClick(nextEngagementLevelMessage(learningArea, levels)),
    // Html.disabled(isSavingEngagementLevels(levels))
  ], [
    Html.text(increaseEngagementText(levels))
  ])
}

// function isSavingEngagementLevels(engagementLevels: EngagementLevels) {
//   return engagementLevels.type === "engagement-levels-saving"
// }

function increaseEngagementText(levels: Array<EngagementLevel>): string {
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
}

// This function encodes a business rule that should be part of the model I think
// 

// function nextEngagementLevelMessage(learningArea: LearningArea, levels: Array<EngagementLevel>) {
//   const nextLevel = nextEngagementLevel(levels)
//   if (nextLevel === EngagementLevel.None) {
//     return deleteEngagementPlans(learningArea)
//   } else {
//     return writeEngagementPlan(engagementPlan(learningArea, nextLevel))
//   }
// }
