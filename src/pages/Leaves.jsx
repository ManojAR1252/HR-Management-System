/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import api from "../services/api";

function Leaves() {
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    employee: "",
    leaveType: "Casual",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const fetchEmployees = async () => {
    try {
      const response = await api.get("/employees");

      setEmployees(response.data.employees);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load employees"
      );
    }
  };

  const fetchLeaves = async () => {
    try {
      setLoading(true);

      const response = await api.get("/leaves");

      setLeaves(response.data.leaves);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load leaves"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchLeaves();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/leaves", {
        employee: form.employee,
        leaveType: form.leaveType,
        startDate: form.startDate,
        endDate: form.endDate,
        reason: form.reason,
      });

      alert("Leave application created successfully");

      setForm({
        employee: "",
        leaveType: "Casual",
        startDate: "",
        endDate: "",
        reason: "",
      });

      fetchLeaves();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to create leave"
      );
    }
  };

  const updateLeaveStatus = async (id, status) => {
    try {
      await api.patch(
        `/leaves/${id}/status`,
        { status }
      );

      alert(`Leave ${status.toLowerCase()}`);

      fetchLeaves();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update leave status"
      );
    }
  };

  return (
    <div>
      <h1>Leave Management</h1>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {/* Apply Leave */}

      <h2>Apply Leave</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Employee</label>
          <br />

          <select
            name="employee"
            value={form.employee}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Employee
            </option>

            {employees.map((employee) => (
              <option
                key={employee._id}
                value={employee._id}
              >
                {employee.employeeId} -{" "}
                {employee.name}
              </option>
            ))}
          </select>
        </div>

        <br />

        <div>
          <label>Leave Type</label>
          <br />

          <select
            name="leaveType"
            value={form.leaveType}
            onChange={handleChange}
          >
            <option value="Casual">
              Casual
            </option>

            <option value="Sick">
              Sick
            </option>

            <option value="Annual">
              Annual
            </option>

            <option value="Emergency">
              Emergency
            </option>

            <option value="Other">
              Other
            </option>
          </select>
        </div>

        <br />

        <div>
          <label>Start Date</label>
          <br />

          <input
            type="date"
            name="startDate"
            value={form.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>End Date</label>
          <br />

          <input
            type="date"
            name="endDate"
            value={form.endDate}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Reason</label>
          <br />

          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            placeholder="Enter reason"
            required
          />
        </div>

        <br />

        <button type="submit">
          Apply Leave
        </button>
      </form>

      <hr />

      {/* Leave List */}

      <h2>Leave Applications</h2>

      {loading ? (
        <p>Loading leaves...</p>
      ) : leaves.length === 0 ? (
        <p>No leave applications found.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Employee ID</th>
              <th>Leave Type</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {leaves.map((leave) => (
              <tr key={leave._id}>
                <td>
                  {leave.employee?.name ||
                    "Unknown"}
                </td>

                <td>
                  {leave.employee?.employeeId ||
                    "-"}
                </td>

                <td>{leave.leaveType}</td>

                <td>
                  {new Date(
                    leave.startDate
                  ).toLocaleDateString()}
                </td>

                <td>
                  {new Date(
                    leave.endDate
                  ).toLocaleDateString()}
                </td>

                <td>{leave.reason}</td>

                <td>{leave.status}</td>

                <td>
                  {leave.status === "Pending" && (
                    <>
                      <button
                        onClick={() =>
                          updateLeaveStatus(
                            leave._id,
                            "Approved"
                          )
                        }
                      >
                        Approve
                      </button>

                      <button
                        onClick={() =>
                          updateLeaveStatus(
                            leave._id,
                            "Rejected"
                          )
                        }
                        style={{
                          marginLeft: "5px",
                        }}
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {leave.status !== "Pending" && (
                    <span>
                      Already reviewed
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Leaves;