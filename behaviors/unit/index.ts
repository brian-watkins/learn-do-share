import { EngageTestContext } from "./engageTestContext"
import { TestLearningArea } from "./fakes/learningArea"

window.createEngageTestContext = (area: TestLearningArea) => {
  return new EngageTestContext(area)
}