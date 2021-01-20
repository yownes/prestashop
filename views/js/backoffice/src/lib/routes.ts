import { RoutePath } from "../components/organisms/Router";
import Validate from "../pages/auth/Validate";
import App from "../pages/client/App";
import Checkout from "../pages/client/Checkout";
import EditProfile from "../pages/client/EditProfile";
import NewApp from "../pages/client/NewApp";
import Pay from "../pages/client/Pay";
import PaymentMethod from "../pages/client/PaymentMethod";
import Profile from "../pages/client/Profile";
import NotFound from "../pages/NotFound";

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
    path: "/profile/edit",
    name: "Editar Perfil",
    component: EditProfile,
  },
  {
    exact: true,
    path: "/profile/paymentMethods",
    name: "Editar Métodos de Pago",
    component: PaymentMethod,
  },
  {
    exact: true,
    path: "/pay",
    name: "Pago",
    component: Pay,
  },
  {
    exact: true,
    path: "/checkout",
    name: "Check Out",
    component: Checkout,
  },
  {
    exact: true,
    path: "/app/new",
    name: "Nueva App",
    component: NewApp,
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
  {
    exact: false,
    path: "*",
    name: "Error 404",
    component: NotFound,
  },
];

export default routes;
