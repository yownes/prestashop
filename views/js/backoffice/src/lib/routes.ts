import { RoutePath } from "../components/organisms/Router";
import Validate from "../pages/auth/Validate";
import App from "../pages/client/App";
import Checkout from "../pages/client/Checkout";
import Pay from "../pages/client/Pay";
import Profile from "../pages/client/Profile";

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
    path: "/checkout/:id",
    name: "Check Out",
    component: Checkout,
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
  {
    exact: true,
    path: "/activate/:token",
    name: "Activar Cuenta",
    component: Validate,
  },
];

export default routes;
