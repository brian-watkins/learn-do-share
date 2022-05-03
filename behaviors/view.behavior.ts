import { behavior, condition, effect, example, pick } from "esbehavior"
import { expect } from "chai"
import { FakeLearningArea, testContext } from "./testApp"
import { disciplineLearningAreas, teamLearningAreas, theoryLearningAreas } from "./testDisplay"
import { LearningAreaCategory } from "../src/leanringAreaCategory"

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
          effect("it shows the team learning areas", async (testContext) => {
            const text = await testContext.display.select(teamLearningAreas()).text()
            expect(text).to.contain(FakeLearningArea(1).title)
            expect(text).to.contain(FakeLearningArea(2).title)
          }),
          effect("it shows the discipline learning areas", async (testContext) => {
            const text = await testContext.display.select(disciplineLearningAreas()).text()
            expect(text).to.contain(FakeLearningArea(3).title)
          }),
          effect("it shows the theory learning areas", async (testContext) => {
            const text = await testContext.display.select(theoryLearningAreas()).text()
            expect(text).to.contain(FakeLearningArea(4).title)
            expect(text).to.contain(FakeLearningArea(5).title)
          })
        ]
      })
  ])