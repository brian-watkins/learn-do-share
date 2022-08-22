import { InitialStateResult, RenderContext } from "@/api/common/render"
import { User } from "@/api/common/user"
import { Adapters, EngageContext } from "@/src/engage/backstage"
import { Model } from "@/src/engage/display"
import { LearningArea } from "@/src/engage/learningArea"
import { EngageTestContext } from "./engageTestContext"
import { TestLearningArea } from "./fakes/learningArea"

export declare global {
  interface Window {
    createEngageTestContext(area: TestLearningArea): EngageTestContext
    _testContext: EngageTestContext | null
  }

  const __IS_DEBUG__: boolean
}