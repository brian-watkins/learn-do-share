import { validate } from "esbehavior"
import engageBehavior from "./engage.behavior"

window.esbehavior_run = () => {
  return validate([
    engageBehavior
  ])
}
