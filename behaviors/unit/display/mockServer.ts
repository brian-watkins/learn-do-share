import { SetupWorker, setupWorker } from "msw"

let worker: SetupWorker | null = null

export async function getServiceWorker(): Promise<SetupWorker> {
  if (!worker) {
    worker = setupWorker()

    await worker.start({
      serviceWorker: {
        url: "/behaviors/unit/display/mockServiceWorker.js",
        options: {
          scope: "/"
        }
      },
      onUnhandledRequest: "bypass",
      quiet: !__IS_DEBUG__
    })
  }
  
  return worker
}
