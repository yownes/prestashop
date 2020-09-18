import { App, AppGen, BuildState } from "../models/App";

export function getAppBuildState(app: App | AppGen): BuildState {
  return app.builds?.[app.builds.length - 1].state ?? BuildState.STALLED;
}
