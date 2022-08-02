import { InitialStateResult, RenderContext } from "@/api/common/render"
import { User } from "@/api/common/user"
import { Adapters, EngageContext } from "@/src/engage/backstage"
import { Model } from "@/src/engage/display"
import { LearningArea } from "@/src/engage/learningArea"

export declare global {
  interface Window {
    esbehavior_run(): Promise<Summary>
  }

  const __IS_DEBUG__: boolean
}