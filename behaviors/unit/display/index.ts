import { EngageTestContext } from "./engageTestContext.js"
import { TestLearningArea } from "./fakes/learningArea.js"

window.createEngageTestContext = (area: TestLearningArea) => {
  return new EngageTestContext(area)
}