/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import api from "../services/api";

function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    experience: "",
    skills: "",
  });

  // =========================
  // Fetch Candidates
  // =========================
  const fetchCandidates = async () => {
    try {
      setLoading(true);

      const response = await api.get("/candidates");

      setCandidates(response.data.candidates || []);
    } catch (error) {
      console.error("Failed to fetch candidates:", error);

      alert(
        error.response?.data?.message ||
          "Failed to fetch candidates"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  // =========================
  // Handle Input
  // =========================
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // Add / Update Candidate
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.email ||
      !form.phone ||
      !form.position
    ) {
      alert("Please fill all required fields");
      return;
    }

    try {
      const candidateData = {
        name: form.name,
        email: form.email,
        phone: form.phone,
        position: form.position,
        experience: Number(form.experience) || 0,
        skills: form.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill !== ""),
      };

      if (editingId) {
        await api.put(
          `/candidates/${editingId}`,
          candidateData
        );

        alert("Candidate updated successfully");
      } else {
        await api.post(
          "/candidates",
          candidateData
        );

        alert("Candidate added successfully");
      }

      resetForm();
      fetchCandidates();
    } catch (error) {
      console.error("Candidate save error:", error);

      alert(
        error.response?.data?.message ||
          "Failed to save candidate"
      );
    }
  };

  // =========================
  // Edit Candidate
  // =========================
  const handleEdit = (candidate) => {
    setEditingId(candidate._id);

    setForm({
      name: candidate.name || "",
      email: candidate.email || "",
      phone: candidate.phone || "",
      position: candidate.position || "",
      experience: candidate.experience || "",
      skills: candidate.skills
        ? candidate.skills.join(", ")
        : "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // =========================
  // Reset Form
  // =========================
  const resetForm = () => {
    setEditingId(null);

    setForm({
      name: "",
      email: "",
      phone: "",
      position: "",
      experience: "",
      skills: "",
    });
  };

  // =========================
  // Update Candidate Status
  // =========================
  const handleStatusChange = async (
    candidateId,
    status
  ) => {
    try {
      await api.patch(
        `/candidates/${candidateId}/status`,
        {
          status,
        }
      );

      alert(
        `Candidate status changed to ${status}`
      );

      fetchCandidates();
    } catch (error) {
      console.error(
        "Status update error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to update candidate status"
      );
    }
  };

  // =========================
  // Convert Candidate to Employee
  // =========================
  const handleConvertToEmployee = async (
    candidateId
  ) => {
    const candidate = candidates.find(
      (item) => item._id === candidateId
    );

    const confirmConvert = window.confirm(
      `Are you sure you want to convert ${
        candidate?.name || "this candidate"
      } to an employee?`
    );

    if (!confirmConvert) {
      return;
    }

    try {
      const response = await api.post(
        `/candidates/${candidateId}/convert`
      );

      const employee =
        response.data.employee;

      alert(
        `Candidate converted successfully!\n\n` +
          `Employee ID: ${
            employee?.employeeId || "Generated"
          }\n` +
          `Name: ${
            employee?.name || candidate?.name
          }\n\n` +
          `Default Password: Employee@123`
      );

      fetchCandidates();
    } catch (error) {
      console.error(
        "Candidate conversion error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Failed to convert candidate to employee"
      );
    }
  };

  // =========================
  // JSX
  // =========================
  return (
    <div className="page-container">

      {/* =========================
          Page Header
      ========================= */}
      <div className="page-header">
        <div>
          <h1>Candidates</h1>
          <p>
            Manage candidates and recruitment
            process
          </p>
        </div>
      </div>

      {/* =========================
          Candidate Form
      ========================= */}
      <div className="card">
        <h2>
          {editingId
            ? "Edit Candidate"
            : "Add Candidate"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="form-grid"
        >
          <div className="form-group">
            <label>Name *</label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter candidate name"
            />
          </div>

          <div className="form-group">
            <label>Email *</label>

            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </div>

          <div className="form-group">
            <label>Phone *</label>

            <input
              type="text"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Enter phone number"
            />
          </div>

          <div className="form-group">
            <label>Position *</label>

            <input
              type="text"
              name="position"
              value={form.position}
              onChange={handleChange}
              placeholder="React Developer"
            />
          </div>

          <div className="form-group">
            <label>Experience</label>

            <input
              type="number"
              name="experience"
              value={form.experience}
              onChange={handleChange}
              placeholder="Years"
              min="0"
            />
          </div>

          <div className="form-group">
            <label>Skills</label>

            <input
              type="text"
              name="skills"
              value={form.skills}
              onChange={handleChange}
              placeholder="React, Node.js, MongoDB"
            />
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="primary-btn"
            >
              {editingId
                ? "Update Candidate"
                : "Add Candidate"}
            </button>

            {editingId && (
              <button
                type="button"
                className="secondary-btn"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* =========================
          Candidate List
      ========================= */}
      <div className="card">

        <div className="table-header">
          <h2>Candidate List</h2>

          <button
            className="secondary-btn"
            onClick={fetchCandidates}
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p>Loading candidates...</p>
        ) : candidates.length === 0 ? (
          <p>No candidates found.</p>
        ) : (
          <div className="table-container">

            <table>

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Position</th>
                  <th>Experience</th>
                  <th>Skills</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {candidates.map((candidate) => (
                  <tr key={candidate._id}>

                    <td>
                      {candidate.name}
                    </td>

                    <td>
                      {candidate.email}
                    </td>

                    <td>
                      {candidate.phone}
                    </td>

                    <td>
                      {candidate.position}
                    </td>

                    <td>
                      {candidate.experience} years
                    </td>

                    <td>
                      {candidate.skills &&
                      candidate.skills.length > 0
                        ? candidate.skills.join(", ")
                        : "-"}
                    </td>

                    {/* Status */}
                    <td>
                      <select
                        value={candidate.status}
                        onChange={(e) =>
                          handleStatusChange(
                            candidate._id,
                            e.target.value
                          )
                        }
                      >
                        <option value="Applied">
                          Applied
                        </option>

                        <option value="Shortlisted">
                          Shortlisted
                        </option>

                        <option value="Interview">
                          Interview
                        </option>

                        <option value="Selected">
                          Selected
                        </option>

                        <option value="Rejected">
                          Rejected
                        </option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td>

                      <div className="action-buttons">

                        {/* Edit */}
                        <button
                          className="secondary-btn"
                          onClick={() =>
                            handleEdit(candidate)
                          }
                        >
                          Edit
                        </button>

                        {/* Convert */}
                        {candidate.status ===
                          "Selected" && (
                          <button
                            className="success-btn"
                            onClick={() =>
                              handleConvertToEmployee(
                                candidate._id
                              )
                            }
                          >
                            Convert to Employee
                          </button>
                        )}

                      </div>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>
        )}
      </div>
    </div>
  );
}

export default Candidates;