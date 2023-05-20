import { User } from "@/api/common/user.js";
import { derived } from "state-party";

export interface PublicSession {
  type: "public-session"
}

export interface PersonalizedSession {
  type: "personalized-session"
  user: User
}

export type Session = PublicSession | PersonalizedSession

export const session = derived<Session>(() => ({
  type: "public-session"
}))


