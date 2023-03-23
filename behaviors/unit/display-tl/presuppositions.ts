import { fact, Presupposition } from "esbehavior"
import { EngageTestContext } from "./engageTestContext.js"
import { FakeUser } from "./fakes/user.js"

export function backstageRequestsAreDelayed(): Presupposition<EngageTestContext> {
  return fact("requests to backstage are delayed", (testContext) => {
    testContext.stubBackstageResponse({
      type: "engagementPlanPersisted",
      plan: {
        level: "learning"
      }
    }, { delay: "infinite" })
  })
}

export function backstageRequestsFailDueToNetworkError(): Presupposition<EngageTestContext> {
  return fact("requests to backstage fail with a network error", (testContext) => {
    testContext.stubBackstageResponse("", { networkError: true })
  })
}

export function backstageRequestsFailDueToServerError(): Presupposition<EngageTestContext> {
  return fact("requests to backstage fail with a server error", (testContext) => {
    testContext.stubBackstageResponse("", { status: 500 })
  })
}

export function someoneIsAuthenticated(email: string): Presupposition<EngageTestContext> {
  return fact("someone is logged in", (testContext) => {
    testContext.withUser(FakeUser(email))
  })
}