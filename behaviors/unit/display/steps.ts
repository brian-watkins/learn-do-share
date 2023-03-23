import { Action, step } from "esbehavior";
import { EngageTestContextProxy } from "./engageTestContextProxy.js";

export function visitTheLearningAreaPage(): Action<EngageTestContextProxy> {
  return step("visit the learning area page", async (testContext) => {
    await testContext.start()
  })
}

export function userClicksIncreaseEngagementButton(message: string = "user clicks increase engagement button"): Action<EngageTestContextProxy> {
  return step(message, async (testContext) => {
    await testContext.select("[data-increase-engagement]")
      .click()
  })
}

export function waitForResponseFromBackstage(): Action<EngageTestContextProxy> {
  return step("wait for response from backstage", async (testContext) => {
    await testContext.waitForRequestsToComplete()
  })
}

export function pause(): Action<EngageTestContextProxy> {
  return step("pause script", async (testContext) => {
    await testContext.pause()
  })
}