import { User } from "@/api/common/user";

export class TestUser implements User {
  constructor(public identifier: string, public name: string) { }
}

export function FakeUser(email: string): TestUser {
  return new TestUser("test-id", email)
}
