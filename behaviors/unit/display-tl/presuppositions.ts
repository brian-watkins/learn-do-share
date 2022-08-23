import { fact, Presupposition } from "esbehavior"
import { EngageTestContext } from "./engageTestContext"
import { FakeUser } from "./fakes/user"

export function backstageRequestsAreDelayed(): Presupposition<EngageTestContext> {
  return fact("requests to backstage are delayed", async (testContext) => {
    await testContext.stubBackstageResponse({
      type: "engagementPlanPersisted",
      plan: {
        level: "learning"
      }
    }, { delay: "infinite" })
  })
}

export function backstageRequestsFailDueToNetworkError(): Presupposition<EngageTestContext> {
  return fact("requests to backstage fail with a network error", async (testContext) => {
    await testContext.stubBackstageResponse("", { networkError: true })
  })
}

export function backstageRequestsFailDueToServerError(): Presupposition<EngageTestContext> {
  return fact("requests to backstage fail with a server error", async (testContext) => {
    await testContext.stubBackstageResponse("", { status: 500 })
  })
}

export function someoneIsAuthenticated(email: string): Presupposition<EngageTestContext> {
  return fact("someone is logged in", async (testContext) => {
    await testContext.withUser(FakeUser(email))
  })
}