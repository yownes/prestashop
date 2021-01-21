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
    admin: true,
  },
  {
    exact: true,
    path: "/builds",
    name: "Builds",
    component: Builds,
    admin: true,
  },
  {
    exact: true,
    path: "/clients",
    name: "Clientes",
    component: Clients,
    admin: true,
  },
  {
    exact: true,
    path: "/clients/:id",
    name: "Cliente",
    component: Client,
    admin: true,
  },
  {
    exact: true,
    path: "/profile",
    name: "Perfil",
    component: Profile,
    admin: true,
  },
  {
    exact: false,
    path: "*",
    name: "Error 404",
    component: NotFound,
    admin: true,
  },
];

export default routes;
