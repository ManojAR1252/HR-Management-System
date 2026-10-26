import { Link, useNavigate } from "react-router-dom";

function Navbar() {
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
    <nav>
      <h2>HR Management</h2>

      <div>
        <Link to="/dashboard">
          Dashboard
        </Link>

        {" | "}

        <Link to="/candidates">
          Candidates
        </Link>

        {" | "}

        <Link to="/interviews">
          Interviews
        </Link>

        {" | "}

        <Link to="/employees">
          Employees
        </Link>

        {" | "}

        <Link to="/attendance">
          Attendance
        </Link>

        {" | "}

        <Link to="/leaves">
          Leaves
        </Link>
      </div>

      <div>
        <span>
          {user?.name} ({user?.role})
        </span>

        <button onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;