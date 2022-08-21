import { Action, step } from "esbehavior";
import { EngageTestContextProxy } from "./engageTestContextProxy";

export function visitTheLearningAreaPage(): Action<EngageTestContextProxy> {
  return step("visit the learning area page", async (testContext) => {
    await testContext.start()
  })
}

export function userClicksIncreaseEngagementButton(): Action<EngageTestContextProxy> {
  return step("user clicks to signal they want to learn", async (testContext) => {
    await testContext.selectElementWithText("I'm ready to learn!")
      .click()
  })
}

export function waitForResponseFromBackstage(): Action<EngageTestContextProxy> {
  return step("wait for response from backstage", async (testContext) => {
    await testContext.waitForRequestsToComplete()
  })
}