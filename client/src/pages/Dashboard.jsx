import { useEffect, useState } from "react";
import api from "../services/api";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/dashboard");

        setDashboard(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Failed to load dashboard"
        );
      }
    };

    fetchDashboard();
  }, []);

  if (error) {
    return <h2>{error}</h2>;
  }

  if (!dashboard) {
    return <h2>Loading dashboard...</h2>;
  }

  return (
    <div>
      <h1>Dashboard</h1>

      <p>
        Welcome to the HR Management System
      </p>

      <div className="dashboard-cards">

        <div className="dashboard-card">
          <h3>Total Candidates</h3>
          <p>
            {dashboard.candidates.total}
          </p>
        </div>

        <div className="dashboard-card">
          <h3>Total Employees</h3>
          <p>
            {dashboard.employees.total}
          </p>
        </div>

        <div className="dashboard-card">
          <h3>Total Interviews</h3>
          <p>
            {dashboard.interviews.total}
          </p>
        </div>

        <div className="dashboard-card">
          <h3>Pending Leaves</h3>
          <p>
            {dashboard.leaves.pending}
          </p>
        </div>

      </div>

      <br />

      <h2>Candidate Overview</h2>

      <div className="dashboard-cards">

        <div className="dashboard-card">
          <h3>Shortlisted</h3>
          <p>
            {dashboard.candidates.shortlisted}
          </p>
        </div>

        <div className="dashboard-card">
          <h3>Selected</h3>
          <p>
            {dashboard.candidates.selected}
          </p>
        </div>

        <div className="dashboard-card">
          <h3>Rejected</h3>
          <p>
            {dashboard.candidates.rejected}
          </p>
        </div>

        <div className="dashboard-card">
          <h3>Active Employees</h3>
          <p>
            {dashboard.employees.active}
          </p>
        </div>

      </div>

      <br />

      <h2>Today's Attendance</h2>

      <div className="dashboard-cards">

        <div className="dashboard-card">
          <h3>Present</h3>
          <p>
            {dashboard.attendanceToday.present}
          </p>
        </div>

        <div className="dashboard-card">
          <h3>Absent</h3>
          <p>
            {dashboard.attendanceToday.absent}
          </p>
        </div>

        <div className="dashboard-card">
          <h3>Leave</h3>
          <p>
            {dashboard.attendanceToday.leave}
          </p>
        </div>

        <div className="dashboard-card">
          <h3>Half Day</h3>
          <p>
            {dashboard.attendanceToday.halfDay}
          </p>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;