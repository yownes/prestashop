import React from "react";
import Router from "../../components/organisms/Router";
import routes from "../../lib/adminRoutes";

const AdminDashboard = () => {
  return <Router routes={routes} />;
};

export default AdminDashboard;
