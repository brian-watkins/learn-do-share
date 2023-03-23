import { Browser, chromium, Page } from "playwright"
import { isDebug, userIdentifierFor } from "../helpers.js"

let browser: Browser

export async function startBrowser(): Promise<void> {
  browser = await chromium.launch({
    headless: !isDebug()
  })
}

export interface PageOptions {
  date: Date | null
  user: string | null
}

export async function newBrowserPage(options: PageOptions): Promise<Page> {
  const context = await browser.newContext()

  if (options.date) {
    await context.addInitScript({
      path: "./node_modules/sinon/pkg/sinon.js"
    })
    await context.addInitScript(`
      window.__test_clock = sinon.useFakeTimers({toFake: ['Date']})
      window.__test_clock.setSystemTime(${options.date?.getTime()})
    `)
  }

  if (options.user) {
    context.addCookies([
      azureAuthCookie(options.user)
    ])
  }

  const page = await context.newPage()
  page.on("console", (message) => {
    if (message.text().startsWith("[vite]")) {
      return
    }
    console.log(message)
  })
  page.on("pageerror", console.log)
  return page
}

export async function resetBrowser(page: Page | null): Promise<void> {
  if (!isDebug()) {
    return page?.close()
  }
}

export async function stopBrowser(): Promise<void> {
  await browser.close()
}

function azureAuthCookie(user: string) {
  return {
    name: "StaticWebAppsAuthCookie",
    value: makeAzurePrincipal(user),
    domain: "localhost",
    path: "/",
  }
}

function makeAzurePrincipal(user: string): string {
  const principal = {
    userId: userIdentifierFor(user),
    userRoles: [
      "anonymous",
      "authenticated"
    ],
    claims: [],
    identityProvider: "aad",
    userDetails: user
  }

  return Buffer.from(JSON.stringify(principal)).toString('base64')
}
