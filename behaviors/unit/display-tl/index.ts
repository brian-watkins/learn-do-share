import { validate } from "esbehavior"
import deleteNoteBehavior from "./deleteNote.behavior.js"
import engageBehavior from "./engage.behavior.js"
import notesBehavior from "./notes.behavior.js"
import saveNoteBehavior from "./saveNote.behavior.js"

window.validateBehaviors = () => {
  return validate([
    engageBehavior,
    deleteNoteBehavior,
    notesBehavior,
    saveNoteBehavior
  ])
}