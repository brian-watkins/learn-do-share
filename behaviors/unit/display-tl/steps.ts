import { Action, step } from "esbehavior";
import { EngageTestContext } from "./engageTestContext.js";

export function visitTheLearningAreaPage(): Action<EngageTestContext> {
  return step("visit the learning area page", async (testContext) => {
    await testContext.start()
  })
}

export function userClicksIncreaseEngagementButton(): Action<EngageTestContext> {
  return step("user clicks to signal they want to learn", async (testContext) => {
    await testContext.select("[data-increase-engagement]")
      .click()
  })
}

export function waitForResponseFromBackstage(): Action<EngageTestContext> {
  return step("wait for response from backstage", async (testContext) => {
    await testContext.waitForRequestsToComplete()
  })
}