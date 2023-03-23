import { fact, Presupposition } from "esbehavior";
import { TestContext, TestLearningArea } from "./testApp.js";


export function thereAreLearningAreas(learningAreas: Array<TestLearningArea>): Presupposition<TestContext> {
  return fact(`There are ${learningAreas.length} learning areas`, (testContext) => {
    testContext.withLearningAreas(learningAreas)
  })
}

export function someoneIsAuthenticated(user: string): Presupposition<TestContext> {
  return fact(`${user} is logged in`, (testContext) => {
    testContext.withAuthenticatedUser(user)
  })
}