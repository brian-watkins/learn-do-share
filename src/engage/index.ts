// import display from "./display"
// import { AppDisplay } from "@/display/display"
import { display } from "loop/display"
import * as View from "loop/display"
import { container, withInitialValue } from "loop"
import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import appDisplay from "./display.js"
import { initSession, session } from "./model.js"

const appInsights = new ApplicationInsights({
  config: {
    connectionString: import.meta.env.VITE_APP_INSIGHTS_CONNECTION_STRING,
    disableTelemetry: import.meta.env.DEV,
    disablePageUnloadEvents: ["beforeUnload", "unload"], // required for bfcache on chrome
    disableFetchTracking: false,
    enableCorsCorrelation: true,
    enableRequestHeaderTracking: true,
    enableResponseHeaderTracking: true,
  }
});
appInsights.loadAppInsights();
appInsights.addTelemetryInitializer(function (envelope) {
  envelope.tags!["ai.cloud.role"] = "display";
});
appInsights.trackPageView({ name: "engage" });

// const app = new AppDisplay(display, window._display_initial_state)

initSession(window._display_initial_state)

const mountPoint = document.getElementById("app")
appDisplay().mount(mountPoint!)
