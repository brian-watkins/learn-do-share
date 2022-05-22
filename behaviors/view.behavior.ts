import { behavior, condition, example, pick } from "esbehavior"
import { FakeLearningArea, testContext } from "./testApp"
import { LearningAreaCategory } from "@/src/overview/learningAreaCategory"
import { learningAreaDisplayed } from "./effects"

export default
  behavior("viewing items", [
    example(testContext())
      .description("when there are learning areas available")
      .script({
        prepare: [
          condition("the app loads learning areas", async (testContext) =>
            await testContext
              .withLearningAreas([
                FakeLearningArea(1).withCategory(LearningAreaCategory.Team),
                FakeLearningArea(2).withCategory(LearningAreaCategory.Team),
                FakeLearningArea(3).withCategory(LearningAreaCategory.Discipline),
                FakeLearningArea(4).withCategory(LearningAreaCategory.Theory),
                FakeLearningArea(5).withCategory(LearningAreaCategory.Theory),
              ])
              .start()
          )
        ],
        observe: [
          learningAreaDisplayed(FakeLearningArea(1), { withCategory: "Team" }),
          learningAreaDisplayed(FakeLearningArea(2), { withCategory: "Team" }),
          learningAreaDisplayed(FakeLearningArea(3), { withCategory: "Discipline" }),
          learningAreaDisplayed(FakeLearningArea(4), { withCategory: "Theory" }),
          learningAreaDisplayed(FakeLearningArea(5), { withCategory: "Theory" }),
        ]
      })
  ])