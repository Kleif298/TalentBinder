import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Dashboard from "./pages/Dashboard/Dashboard";
import DashboardAdmin from "./pages/Dashboard/DashboardAdmin";
import ProtectedRoute from "./guards/ProtectedRoute";
import AdminProtectedRoute from "./guards/AdminProtectedRoute";
import EventDashboard from "./pages/EventDashboard/EventDashboard";

import "./App.css"; 

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/admin"
          element={
            <AdminProtectedRoute>
              <DashboardAdmin />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/EventDashboard"
          element={
            <ProtectedRoute>
              <EventDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
