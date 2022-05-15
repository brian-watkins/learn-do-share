import { behavior, condition, example, pick } from "esbehavior"
import { FakeLearningArea, testContext } from "./testApp"
import { disciplineLearningAreas, teamLearningAreas, theoryLearningAreas } from "./testDisplay"
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
          learningAreaDisplayed(FakeLearningArea(1), { in: teamLearningAreas() }),
          learningAreaDisplayed(FakeLearningArea(2), { in: teamLearningAreas() }),
          learningAreaDisplayed(FakeLearningArea(3), { in: disciplineLearningAreas() }),
          learningAreaDisplayed(FakeLearningArea(4), { in: theoryLearningAreas() }),
          learningAreaDisplayed(FakeLearningArea(5), { in: theoryLearningAreas() }),
        ]
      })
  ])