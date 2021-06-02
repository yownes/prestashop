import React, { useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { notification, Typography } from "antd";
import { useQuery } from "@apollo/client";
import { Logo } from "../atoms";
import HeaderSessionInfo from "../molecules/HeaderSessionInfo";
import clientRoutes from "../../lib/routes";
import adminoutes from "../../lib/adminRoutes";

import { ME, MY_PAYMENT_METHODS } from "../../api/queries";
import { Me } from "../../api/types/Me";
import { MyPaymentMethods } from "../../api/types/MyPaymentMethods";

import styles from "./Header.module.css";
import { RightOutlined } from "@ant-design/icons";
import connectionToNodes from "../../lib/connectionToNodes";
import { ICreditCardStripe } from "../molecules/CreditCard";
import { useTranslation } from "react-i18next";

const routes = [...clientRoutes, ...adminoutes];

const Header = () => {
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation("translation");
  const { data } = useQuery<Me>(ME);
  const { data: paymentsData } = useQuery<MyPaymentMethods>(MY_PAYMENT_METHODS);
  const card: ICreditCardStripe | undefined =
    (paymentsData?.me?.customer?.paymentMethods &&
      paymentsData?.me?.customer?.defaultPaymentMethod &&
      JSON.parse(
        connectionToNodes(paymentsData?.me?.customer?.paymentMethods)
          .find(
            (payment) =>
              payment.stripeId ===
              paymentsData?.me?.customer?.defaultPaymentMethod?.stripeId
          )
          ?.card.replace(/None/g, "null")
          .replace(/True/g, "true")
          .replace(/False/g, "false")
          .replace(/'/g, '"')!!
      )) ||
    undefined;
  useEffect(() => {
    notification.destroy();
    if (location.pathname !== "/profile/edit") {
      card &&
        new Date(card.exp_year, card.exp_month) < new Date() &&
        notification.warning({
          message: t("expiredPayment.message"),
          description: t("expiredPayment.description"),
          duration: 0,
          onClick: () => {
            history.push("/profile/edit");
          },
          style: { cursor: "pointer" },
        });
    }
  }, [card, history, location.pathname, t]);

  let route = routes.find(
    (r) => r.path === location.pathname && r.admin === data?.me?.isStaff
  );
  if (!route) {
    route = routes
      .filter((r) => /:\w+/.exec(r.path))
      .map((r) => {
        const path = r.path.replace(/:\w+/, "");
        return {
          ...r,
          path,
        };
      })
      .find((r) => location.pathname.includes(r.path));
  }

  return (
    <header className={styles.container}>
      <Link to="/">
        <Logo />
      </Link>
      <Typography.Title level={2} className={styles.title}>
        {route?.name && data?.me?.isStaff === route.admin && (
          <>
            <RightOutlined className={styles.titleIcon} />
            {route?.name}
          </>
        )}
      </Typography.Title>
      {data?.me?.email && (
        <HeaderSessionInfo email={data.me.email} name={data.me.username} />
      )}
    </header>
  );
};

export default Header;
