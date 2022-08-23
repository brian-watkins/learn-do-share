import { validate } from "esbehavior"
import deleteNoteBehavior from "./deleteNote.behavior"
import engageBehavior from "./engage.behavior"

window.validateBehaviors = () => {
  return validate([
    engageBehavior,
    deleteNoteBehavior
  ])
}