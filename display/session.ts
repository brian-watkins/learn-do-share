import { MessageDispatcher } from "./effect"

export const SESSION_MESSAGE_TYPE = "session-property"

export interface SessionMessage {
  type: typeof SESSION_MESSAGE_TYPE
  slice: any
}

export function storeForSession(slice: any): SessionMessage {
  return {
    type: SESSION_MESSAGE_TYPE,
    slice
  }
}

// Ultimately probably want this to be a concern of the app, not the framework?
// export function handleSessionMessage(_: MessageDispatcher, message: SessionMessage) {
  // console.log("Storing session message in session store", message)
  // window.sessionStorage.setItem("__display_session_state", JSON.stringify(message))
// }