import { User } from "@/api/common/user.js";

export function TestUser(testId: number): User {
  return {
    identifier: `test-user-${testId}`,
    name: `user-${testId}@email.com`
  }
}
