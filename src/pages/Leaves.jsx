/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import api from "../services/api";

function Leaves() {
  const [employees, setEmployees] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Logged-in user
  const currentUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const role = currentUser.role;

  // MongoDB User _id
  const currentEmployeeId =
    currentUser.id ||
    currentUser._id ||
    currentUser.userId;

  const isEmployee = role === "EMPLOYEE";
  const isHR = role === "HR" || role === "ADMIN";

  const [form, setForm] = useState({
    employee: isEmployee ? currentEmployeeId : "",
    leaveType: "Casual",
    startDate: "",
    endDate: "",
    reason: "",
  });

  // ================================
  // Load Employees - HR/Admin only
  // ================================
  const fetchEmployees = async () => {
    if (!isHR) return;

    try {
      const response = await api.get("/employees");

      setEmployees(response.data.employees || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load employees"
      );
    }
  };

  // ================================
  // Load Leaves
  // ================================
  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError("");

      let response;

      if (isEmployee) {
        // Employee can see ONLY their own leaves
        if (!currentEmployeeId) {
          throw new Error("Employee ID not found");
        }

        response = await api.get(
          `/leaves/employee/${currentEmployeeId}`
        );
      } else if (isHR) {
        // HR/Admin can see all leaves
        response = await api.get("/leaves");
      } else {
        throw new Error("Invalid user role");
      }

      setLeaves(response.data.leaves || []);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
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

  // ================================
  // Handle Form Change
  // ================================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // ================================
  // Apply Leave
  // ================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");

      const employeeId = isEmployee
        ? currentEmployeeId
        : form.employee;

      if (!employeeId) {
        setError("Employee is required");
        return;
      }

      if (!form.startDate || !form.endDate) {
        setError("Start date and end date are required");
        return;
      }

      if (form.startDate > form.endDate) {
        setError("Start date cannot be after end date");
        return;
      }

      await api.post("/leaves", {
        employee: employeeId,
        leaveType: form.leaveType,
        startDate: form.startDate,
        endDate: form.endDate,
        reason: form.reason,
      });

      alert("Leave application submitted successfully");

      setForm({
        employee: isEmployee ? currentEmployeeId : "",
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

  // ================================
  // Approve / Reject Leave
  // HR/Admin only
  // ================================
  const updateLeaveStatus = async (id, status) => {
    try {
      setError("");

      await api.patch(`/leaves/${id}/status`, {
        status,
      });

      alert(
        `Leave ${status.toLowerCase()} successfully`
      );

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

      {/* ================================
          APPLY LEAVE
      ================================= */}

      <h2>Apply Leave</h2>

      <form onSubmit={handleSubmit}>
        {/* Employee */}

        {isHR ? (
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
        ) : (
          <div>
            <label>Employee</label>
            <br />

            <input
              type="text"
              value={
                currentUser.name ||
                "Logged-in Employee"
              }
              disabled
            />
          </div>
        )}

        <br />

        {/* Leave Type */}

        <div>
          <label>Leave Type</label>
          <br />

          <select
            name="leaveType"
            value={form.leaveType}
            onChange={handleChange}
          >
            <option value="Casual">Casual</option>
            <option value="Sick">Sick</option>
            <option value="Annual">Annual</option>
            <option value="Emergency">
              Emergency
            </option>
            <option value="Other">Other</option>
          </select>
        </div>

        <br />

        {/* Start Date */}

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

        {/* End Date */}

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

        {/* Reason */}

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

      {/* ================================
          LEAVE LIST
      ================================= */}

      <h2>
        {isEmployee
          ? "My Leave Applications"
          : "Leave Applications"}
      </h2>

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

              {isHR && <th>Action</th>}
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

                {isHR && (
                  <td>
                    {leave.status === "Pending" ? (
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
                    ) : (
                      <span>
                        Already reviewed
                      </span>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Leaves;
