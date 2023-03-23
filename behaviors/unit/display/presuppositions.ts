import { fact, Presupposition } from "esbehavior"
import { EngageTestContextProxy } from "./engageTestContextProxy.js"
import { FakeUser } from "./fakes/user.js"

export function backstageRequestsAreDelayed(): Presupposition<EngageTestContextProxy> {
  return fact("requests to backstage are delayed", async (testContext) => {
    await testContext.stubBackstageResponse({
      type: "engagementPlanPersisted",
      plan: {
        level: "learning"
      }
    }, { delay: "infinite" })
  })
}

export function backstageRequestsFailDueToNetworkError(): Presupposition<EngageTestContextProxy> {
  return fact("requests to backstage fail with a network error", async (testContext) => {
    await testContext.stubBackstageResponse("", { networkError: true })
  })
}

export function backstageRequestsFailDueToServerError(): Presupposition<EngageTestContextProxy> {
  return fact("requests to backstage fail with a server error", async (testContext) => {
    await testContext.stubBackstageResponse("", { status: 500 })
  })
}

export function someoneIsAuthenticated(email: string): Presupposition<EngageTestContextProxy> {
  return fact("someone is logged in", async (testContext) => {
    await testContext.withUser(FakeUser(email))
  })
}