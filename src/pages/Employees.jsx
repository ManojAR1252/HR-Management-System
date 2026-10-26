/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import api from "../services/api";

function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    position: "",
    joiningDate: "",
  });

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/employees");

      setEmployees(response.data.employees);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load employees"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleEdit = (employee) => {
    setEditingId(employee._id);

    setForm({
      name: employee.name || "",
      phone: employee.phone || "",
      position: employee.position || "",
      joiningDate: employee.joiningDate
        ? employee.joiningDate.substring(0, 10)
        : "",
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await api.put(
        `/employees/${editingId}`,
        {
          name: form.name,
          phone: form.phone,
          position: form.position,
          joiningDate: form.joiningDate || null,
        }
      );

      alert("Employee updated successfully");

      resetForm();
      fetchEmployees();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update employee"
      );
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.patch(
        `/employees/${id}/status`,
        { status }
      );

      fetchEmployees();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update employee status"
      );
    }
  };

  const resetForm = () => {
    setEditingId(null);

    setForm({
      name: "",
      phone: "",
      position: "",
      joiningDate: "",
    });
  };

  return (
    <div>
      <h1>Employees</h1>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {/* Edit Employee */}

      {editingId && (
        <>
          <h2>Edit Employee</h2>

          <form onSubmit={handleUpdate}>
            <div>
              <label>Name</label>
              <br />

              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <br />

            <div>
              <label>Phone</label>
              <br />

              <input
                type="text"
                name="phone"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <br />

            <div>
              <label>Position</label>
              <br />

              <input
                type="text"
                name="position"
                value={form.position}
                onChange={handleChange}
              />
            </div>

            <br />

            <div>
              <label>Joining Date</label>
              <br />

              <input
                type="date"
                name="joiningDate"
                value={form.joiningDate}
                onChange={handleChange}
              />
            </div>

            <br />

            <button type="submit">
              Update Employee
            </button>

            <button
              type="button"
              onClick={resetForm}
              style={{ marginLeft: "10px" }}
            >
              Cancel
            </button>
          </form>

          <hr />
        </>
      )}

      {/* Employee List */}

      <h2>Employee List</h2>

      {loading ? (
        <p>Loading employees...</p>
      ) : employees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Position</th>
              <th>Joining Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((employee) => (
              <tr key={employee._id}>
                <td>
                  {employee.employeeId || "-"}
                </td>

                <td>{employee.name}</td>

                <td>{employee.email}</td>

                <td>{employee.phone || "-"}</td>

                <td>
                  {employee.position || "-"}
                </td>

                <td>
                  {employee.joiningDate
                    ? new Date(
                        employee.joiningDate
                      ).toLocaleDateString()
                    : "-"}
                </td>

                <td>
                  <select
                    value={employee.status}
                    onChange={(e) =>
                      handleStatusChange(
                        employee._id,
                        e.target.value
                      )
                    }
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>
                </td>

                <td>
                  <button
                    onClick={() =>
                      handleEdit(employee)
                    }
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Employees;