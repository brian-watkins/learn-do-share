import { validate } from "esbehavior"
import deleteNoteBehavior from "./deleteNote.behavior"
import engageBehavior from "./engage.behavior"
import notesBehavior from "./notes.behavior"
import saveNoteBehavior from "./saveNote.behavior"

window.validateBehaviors = () => {
  return validate([
    engageBehavior,
    deleteNoteBehavior,
    notesBehavior,
    saveNoteBehavior
  ])
}