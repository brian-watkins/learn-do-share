import { fact, Presupposition } from "esbehavior";
import { TestContext } from "./testApp";


export function someoneIsAuthenticated(user: string): Presupposition<TestContext> {
  return fact(`${user} is logged in`, (testContext) => {
    testContext.withAuthenticatedUser(user)
  })
}