import { RoutePath } from "../components/organisms/Router";
import Builds from "../pages/admin/Builds";
import Clients from "../pages/admin/Clients";
import Client from "../pages/admin/Client";
import NotFound from "../pages/NotFound";
import Profile from "../pages/admin/Profile";

const routes: RoutePath[] = [
  {
    exact: true,
    path: "/",
    redirect: "/clients",
  },
  {
    exact: true,
    path: "/builds",
    name: "Builds",
    component: Builds,
  },
  {
    exact: true,
    path: "/clients",
    name: "Clientes",
    component: Clients,
  },
  {
    exact: true,
    path: "/clients/:id",
    name: "Cliente",
    component: Client,
  },
  {
    exact: true,
    path: "/profile",
    name: "Perfil",
    component: Profile,
  },
  {
    exact: false,
    path: "*",
    name: "Error 404",
    component: NotFound,
  },
];

export default routes;
