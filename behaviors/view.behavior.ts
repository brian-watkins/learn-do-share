import { behavior, condition, effect, example, pick } from "esbehavior"
import { expect } from "chai"
import { FakeLearningArea, testContext } from "./testApp"
import { disciplineLearningAreas, teamLearningAreas, theoryLearningAreas } from "./testDisplay"
import { LearningAreaGroup } from "../src/learningAreas"

export default
  behavior("viewing items", [
    example(testContext())
      .description("when there are learning areas available")
      .script({
        prepare: [
          condition("the app loads learning areas", async (testContext) =>
            await testContext
              .withLearningAreas([
                FakeLearningArea(1).withGroup(LearningAreaGroup.Team),
                FakeLearningArea(2).withGroup(LearningAreaGroup.Team),
                FakeLearningArea(3).withGroup(LearningAreaGroup.Discipline),
                FakeLearningArea(4).withGroup(LearningAreaGroup.Theory),
                FakeLearningArea(5).withGroup(LearningAreaGroup.Theory),
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