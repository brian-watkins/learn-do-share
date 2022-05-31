import { Context } from "@azure/functions"
import { User } from "./user"
import fs from "fs"
import path from "path"

export interface RenderContext<C> {
  user: User | null
  attributes: C
}

export interface TemplateResult<M> {
  type: "template"
  templateName: string
  state: M
}

export function templateResult<M>(templateName: string, state: M): TemplateResult<M> {
  return {
    type: "template",
    templateName,
    state
  }
}

export interface RedirectResult {
  type: "redirect"
  location: string
}

export function redirectResult(location: string): RedirectResult {
  return {
    type: "redirect",
    location
  }
}

export type InitialStateResult<M> = TemplateResult<M> | RedirectResult

export interface BackstageRenderer<C, M> {
  initialState(context: RenderContext<C>): Promise<InitialStateResult<M>>
}

export function render<M>(context: Context, result: InitialStateResult<M>) {
  switch (result.type) {
    case "redirect":
      context.res = {
        status: 301,
        headers: {
          "Location": result.location
        }
      }
      break
    case "template":
      let template = fetchTemplate(context, result.templateName)
      const html = renderTemplate(template, result.state)
      context.res = {
        headers: {
          'Content-Type': 'text/html',
          'Cache-Control': 'no-store'
        },
        body: html
      }
      break
  }
}

function fetchTemplate(context: Context, templateName: string): string {
  const basePath = process.env["TEMPLATE_PATH"] ?? context.executionContext.functionDirectory
  return fs.readFileSync(path.join(basePath, templateName), 'utf-8')
}

function renderTemplate(template: string, content: any): string {
  const jsContent = `window._display_initial_state = ${JSON.stringify(content)};`
  return template.replace("/* DISPLAY_INITIAL_STATE */", jsContent)
}
