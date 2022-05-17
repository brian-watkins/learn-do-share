import { User } from "./user"

export interface RenderContext<C> {
  user: User | null
  attributes: C
}

export interface OkResult<M> {
  type: "ok"
  state: M
}

export function okResult<M>(state: M): OkResult<M> {
  return {
    type: "ok",
    state
  }
}

export interface NotFoundResult {
  type: "not-found"
}

export function notFoundResult(): NotFoundResult {
  return {
    type: "not-found"
  }
}

export type InitialStateResult<M> = OkResult<M> | NotFoundResult

export interface BackstageRenderer<C, M> {
  initialState(context: RenderContext<C>): Promise<InitialStateResult<M>>
}

// export async function renderTemplate<C, M>(renderer: BackstageRenderer<C, M>, template: string, context: RenderContext<C>): Promise<string> {
//   const state = await renderer.initialState(context)

//   const content = `window._display_initial_state = ${JSON.stringify(state)};`

//   return template.replace("/* DISPLAY_INITIAL_STATE */", content)
// }

export function renderTemplate(template: string, content: any): string {
  const jsContent = `window._display_initial_state = ${JSON.stringify(content)};`
  return template.replace("/* DISPLAY_INITIAL_STATE */", jsContent)
}