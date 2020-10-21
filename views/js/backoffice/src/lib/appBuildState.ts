import { App_app } from "../api/types/App";
import { BuildBuildStatus } from "../api/types/globalTypes";
import { MyAccount_me_apps_edges_node } from "../api/types/MyAccount";

export function getAppBuildState(
  app: MyAccount_me_apps_edges_node | App_app
): BuildBuildStatus {
  const nodes = app.builds?.edges.map((edge) => edge!!.node!!);
  return nodes[nodes.length - 1]?.buildStatus ?? BuildBuildStatus.STALLED;
}
