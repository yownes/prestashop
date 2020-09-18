import App from "../pages/client/App";
import Pay from "../pages/client/Pay";
import Profile from "../pages/client/Profile";

interface RoutePath {
  exact: boolean;
  path: string;
  redirect?: string;
  component?: () => JSX.Element;
  name?: string;
}

const routes: RoutePath[] = [
  {
    exact: true,
    path: "/",
    redirect: "/profile",
  },
  {
    exact: true,
    path: "/profile",
    name: "Perfil",
    component: Profile,
  },
  {
    exact: true,
    path: "/pay",
    name: "Pago",
    component: Pay,
  },
  {
    exact: true,
    path: "/app/new",
    name: "Nueva App",
    component: App,
  },
  {
    exact: false,
    path: "/app/:appId",
    name: "Editar App",
    component: App,
  },
];

export default routes;
