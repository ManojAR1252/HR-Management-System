import { NavLink, useNavigate } from "react-router-dom";

function Layout({ children }) {
  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <div className="app-layout">

      {/* Sidebar */}

      <aside className="sidebar">
        <h2>HRMS</h2>

        <p className="sidebar-subtitle">
          HR Management System
        </p>

        <nav>
          <NavLink to="/dashboard">
            Dashboard
          </NavLink>

          <NavLink to="/candidates">
            Candidates
          </NavLink>

          <NavLink to="/interviews">
            Interviews
          </NavLink>

          <NavLink to="/employees">
            Employees
          </NavLink>

          <NavLink to="/attendance">
            Attendance
          </NavLink>

          <NavLink to="/leaves">
            Leaves
          </NavLink>
        </nav>

        <div className="sidebar-user">
          <strong>{user?.name}</strong>
          <span>{user?.role}</span>

          <button onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}

      <main className="main-content">
        {children}
      </main>
    </div>
  );
}

export default Layout;