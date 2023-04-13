import { ApplicationInsights } from '@microsoft/applicationinsights-web'
import { init } from "./storage.js"
import { activateIslands } from 'loop/display';

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

// this should still work to provide the state
init(window._display_initial_state)

document.addEventListener("DOMContentLoaded", () => {
// const mountPoint = document.getElementById("app")
// appDisplay().mount(mountPoint!)

// this is async -- should we await or anything?
  activateIslands()
})
