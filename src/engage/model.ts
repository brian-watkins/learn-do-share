import { User } from "@/api/common/user.js";
import { container, State, state, withInitialValue } from "loop";
import { EngagementNote, EngagementNotes } from "./engagementNotes/index.js";
import { EngagementLevel, EngagementLevels, EngagementPlan } from "./engagementPlans/index.js";
import { LearningArea } from "./learningArea.js";
import { Model } from "./sharedTypes.js";


// This is kind of weird since there's a lot of static state
// that's state from the backend that will not change
// But then there are the notes and the levels which could change
// Not really sure how to handle static state like this well
// it would be great to pass it into a function as like initial state
// But that kind of makes it hard to export all the states individually
// Maybe we can export an object with getters



export interface PublicSession {
  type: "public-session"
  learningArea: LearningArea
}

export interface PersonalizedSession {
  type: "personalized-session"
  learningArea: LearningArea
  user: User
  engagementNotes: State<Array<EngagementNote>>
  engagementLevels: State<Array<EngagementLevel>>
}

// We need to be able to write an engagement plan and then update the list of levels

export interface Writing<T> {
  type: "writing"
  value: T
}

export interface Written<T> {
  type: "written"
  value: T
}

export interface Ready {
  type: "ready"
}

export type Writable<T> = Writing<T> | Written<T> | Ready

export const engagementPlanState = container<Writable<EngagementPlan>>(withInitialValue({ type: "ready" }))

export type Session = PublicSession | PersonalizedSession

let currentSession: Session | undefined = undefined

export function initSession(model: Model) {
  switch (model.type) {
    case "informative":
      currentSession = {
        type: "public-session",
        learningArea: model.learningArea
      }
      break
    case "personalized":
      currentSession = {
        type: "personalized-session",
        learningArea: model.learningArea,
        user: model.user,
        engagementNotes: state(withInitialValue(model.engagementNotes.notes)),
        engagementLevels: state(withInitialValue(model.engagementLevels.levels))
      }
      break
  } 
}

export function session(): Session {
  return currentSession!
}





// if you are logged in, you have a user object, engagement levels, and engagement notes

