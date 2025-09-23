import React from "react";
import { getAdminStatus } from "../utils/auth.ts";

const DashboardAdmin = () => {

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h1>Dashboard</h1>
      <p>Willkommen im Dashboard, !</p>
      <p>Du bist Admin</p>
    </div>
  );
};

export default DashboardAdmin;
