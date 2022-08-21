import { setupWorker, SetupWorkerApi } from "msw"

let worker: SetupWorkerApi | null = null

export async function getServiceWorker(): Promise<SetupWorkerApi> {
  if (!worker) {
    worker = setupWorker()

    await worker.start({
      serviceWorker: {
        url: "/behaviors/unit/mockServiceWorker.js",
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
