import { User } from "@/api/common/user.js";
import { state } from "loop";

export interface PublicSession {
  type: "public-session"
}

export interface PersonalizedSession {
  type: "personalized-session"
  user: User
}

export type Session = PublicSession | PersonalizedSession

export const session = state<Session>(() => ({
  type: "public-session"
}))


