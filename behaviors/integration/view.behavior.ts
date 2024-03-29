import { behavior, example } from "esbehavior"
import { FakeLearningArea, testContext } from "./testApp"
import { LearningAreaCategory } from "@/src/overview/learningAreaCategory"
import { learningAreaSummaryDisplayed } from "./effects"
import { visitTheLearningAreas } from "./actions"
import { thereAreLearningAreas } from "./presuppositions"

export default
  behavior("viewing items", [
    example(testContext())
      .description("when there are learning areas available")
      .script({
        suppose: [
          thereAreLearningAreas([
            FakeLearningArea(1).withCategory(LearningAreaCategory.Team),
            FakeLearningArea(2).withCategory(LearningAreaCategory.Team),
            FakeLearningArea(3).withCategory(LearningAreaCategory.Discipline),
            FakeLearningArea(4).withCategory(LearningAreaCategory.Theory),
            FakeLearningArea(5).withCategory(LearningAreaCategory.Theory),
          ])
        ],
        perform: [
          visitTheLearningAreas()
        ],
        observe: [
          learningAreaSummaryDisplayed(FakeLearningArea(1), { withCategory: "Team" }),
          learningAreaSummaryDisplayed(FakeLearningArea(2), { withCategory: "Team" }),
          learningAreaSummaryDisplayed(FakeLearningArea(3), { withCategory: "Discipline" }),
          learningAreaSummaryDisplayed(FakeLearningArea(4), { withCategory: "Theory" }),
          learningAreaSummaryDisplayed(FakeLearningArea(5), { withCategory: "Theory" }),
        ]
      })
  ])