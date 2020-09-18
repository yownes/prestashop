import React from "react";
import AdminHeader from "../components/organisms/AdminHeader";
import DashboardTemplate from "../components/templates/Dashboard";
import Auth from "../lib/auth";
import AdminDashboard from "./admin";
import ClientDashboard from "./client";


const Dashboard = () => {
  const isAdmin = Auth.getSingleton().isAdmin();
  return (
    <DashboardTemplate header={isAdmin ? <AdminHeader /> : null}>
      {isAdmin ? <AdminDashboard /> : <ClientDashboard />}
    </DashboardTemplate>
  );
};

export default Dashboard;
