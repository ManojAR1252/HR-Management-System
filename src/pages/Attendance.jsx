/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import api from "../services/api";

function Attendance() {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    employee: "",
    date: "",
    status: "Present",
    checkIn: "",
    checkOut: "",
    remarks: "",
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

  const fetchAttendance = async () => {
    try {
      setLoading(true);

      const response = await api.get("/attendance");

      setAttendance(response.data.attendance);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load attendance"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
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
      await api.post("/attendance", {
        employee: form.employee,
        date: form.date,
        status: form.status,
        checkIn: form.checkIn,
        checkOut: form.checkOut,
        remarks: form.remarks,
      });

      alert("Attendance marked successfully");

      setForm({
        employee: "",
        date: "",
        status: "Present",
        checkIn: "",
        checkOut: "",
        remarks: "",
      });

      fetchAttendance();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to mark attendance"
      );
    }
  };

  return (
    <div>
      <h1>Attendance Management</h1>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {/* Mark Attendance */}

      <h2>Mark Attendance</h2>

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
          <label>Date</label>
          <br />

          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Status</label>
          <br />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
          >
            <option value="Present">
              Present
            </option>

            <option value="Absent">
              Absent
            </option>

            <option value="Leave">
              Leave
            </option>

            <option value="Half Day">
              Half Day
            </option>
          </select>
        </div>

        <br />

        <div>
          <label>Check In</label>
          <br />

          <input
            type="time"
            name="checkIn"
            value={form.checkIn}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Check Out</label>
          <br />

          <input
            type="time"
            name="checkOut"
            value={form.checkOut}
            onChange={handleChange}
          />
        </div>

        <br />

        <div>
          <label>Remarks</label>
          <br />

          <input
            type="text"
            name="remarks"
            value={form.remarks}
            onChange={handleChange}
            placeholder="Optional remarks"
          />
        </div>

        <br />

        <button type="submit">
          Mark Attendance
        </button>
      </form>

      <hr />

      {/* Attendance List */}

      <h2>Attendance Records</h2>

      {loading ? (
        <p>Loading attendance...</p>
      ) : attendance.length === 0 ? (
        <p>No attendance records found.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Employee ID</th>
              <th>Date</th>
              <th>Status</th>
              <th>Check In</th>
              <th>Check Out</th>
              <th>Remarks</th>
            </tr>
          </thead>

          <tbody>
            {attendance.map((record) => (
              <tr key={record._id}>
                <td>
                  {record.employee?.name ||
                    "Unknown"}
                </td>

                <td>
                  {record.employee?.employeeId ||
                    "-"}
                </td>

                <td>
                  {new Date(
                    record.date
                  ).toLocaleDateString()}
                </td>

                <td>{record.status}</td>

                <td>
                  {record.checkIn || "-"}
                </td>

                <td>
                  {record.checkOut || "-"}
                </td>

                <td>
                  {record.remarks || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Attendance;