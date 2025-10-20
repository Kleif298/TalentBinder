import { useLocation } from "react-router-dom";
import "./Header.scss";
import { getUserEmail, getAdminStatus } from "~/utils/auth.ts";

const Header = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <header>
      <div className="header-line"></div>
      <div className="header-main">
        <h1 className="header-title">TalentBinder</h1>
        <div className="user-data">
          {getAdminStatus() ? <p className="admin-state">Admin</p> : null}
          <div className="email-holder">{getUserEmail()}</div>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
      <nav>
        <a href="/dashboard" className={isActive("/dashboard") ? "active" : ""}>
          Talents
        </a>
        <a href="/EventDashboard" className={isActive("/EventDashboard") ? "active" : ""}>
          Event
        </a>
      </nav>
    </header>
  );
};

export default Header;
