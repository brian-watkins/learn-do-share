import { fact, Presupposition } from "esbehavior";
import { TestContext } from "./testApp";

export function theAppShowsTheLearningAreas(): Presupposition<TestContext> {
  return fact("the app shows the list of learning areas", async (testContext) => {
    await testContext.start()
  })
}