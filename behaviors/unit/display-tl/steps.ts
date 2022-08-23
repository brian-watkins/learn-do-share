import { Action, step } from "esbehavior";
import { EngageTestContext } from "./engageTestContext";

export function visitTheLearningAreaPage(): Action<EngageTestContext> {
  return step("visit the learning area page", async (testContext) => {
    await testContext.start()
  })
}

export function userClicksIncreaseEngagementButton(): Action<EngageTestContext> {
  return step("user clicks to signal they want to learn", async (testContext) => {
    await testContext.selectElementWithText("I'm ready to learn!")
      .click()
  })
}

export function waitForResponseFromBackstage(): Action<EngageTestContext> {
  return step("wait for response from backstage", async (testContext) => {
    await testContext.waitForRequestsToComplete()
  })
}