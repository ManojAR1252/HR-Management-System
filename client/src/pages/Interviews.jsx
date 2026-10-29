import { useEffect, useState } from "react";
import api from "../services/api";

function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [candidates, setCandidates] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    candidate: "",
    date: "",
    interviewType: "Online",
    mode: "Technical",
    meetingLink: "",
    location: "",
  });

  const fetchInterviews = async () => {
    try {
      setLoading(true);

      const response = await api.get("/interviews");

      setInterviews(response.data.interviews);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load interviews"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidates = async () => {
    try {
      const response = await api.get("/candidates");

      setCandidates(response.data.candidates);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to load candidates"
      );
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchInterviews();
    fetchCandidates();
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
      const user = JSON.parse(
        localStorage.getItem("user")
      );
  
      const interviewData = {
        candidate: form.candidate,
        interviewer: user.id,
        date: new Date(form.date).toISOString(),
        interviewType: form.interviewType,
        mode: form.mode,
        meetingLink: form.meetingLink,
        location: form.location,
      };
  
      console.log("Sending interview data:", interviewData);
  
      await api.post("/interviews", interviewData);
  
      alert("Interview scheduled successfully");
  
      setForm({
        candidate: "",
        date: "",
        interviewType: "Online",
        mode: "Technical",
        meetingLink: "",
        location: "",
      });
  
      fetchInterviews();
      fetchCandidates();
  
    } catch (error) {
      console.error(error);
  
      setError(
        error.response?.data?.message ||
          "Failed to schedule interview"
      );
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.patch(
        `/interviews/${id}/status`,
        { status }
      );

      fetchInterviews();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update status"
      );
    }
  };

  const updateFeedback = async (id) => {
    const feedback = prompt(
      "Enter interview feedback:"
    );

    if (!feedback) return;

    try {
      await api.patch(
        `/interviews/${id}/feedback`,
        { feedback }
      );

      fetchInterviews();
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update feedback"
      );
    }
  };

  return (
    <div>
      <h1>Interviews</h1>

      {error && (
        <p style={{ color: "red" }}>
          {error}
        </p>
      )}

      {/* Schedule Interview */}

      <h2>Schedule Interview</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Candidate</label>
          <br />

          <select
            name="candidate"
            value={form.candidate}
            onChange={handleChange}
            required
          >
            <option value="">
              Select Candidate
            </option>

            {candidates.map((candidate) => (
              <option
                key={candidate._id}
                value={candidate._id}
              >
                {candidate.name} -{" "}
                {candidate.position}
              </option>
            ))}
          </select>
        </div>

        <br />

        <div>
          <label>Date & Time</label>
          <br />

          <input
            type="datetime-local"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>

        <br />

        <div>
          <label>Interview Type</label>
          <br />

          <select
            name="interviewType"
            value={form.interviewType}
            onChange={handleChange}
          >
            <option value="Online">
              Online
            </option>

            <option value="Offline">
              Offline
            </option>
          </select>
        </div>

        <br />

        <div>
          <label>Mode</label>
          <br />

          <select
            name="mode"
            value={form.mode}
            onChange={handleChange}
          >
            <option value="Technical">
              Technical
            </option>

            <option value="HR">
              HR
            </option>

            <option value="Managerial">
              Managerial
            </option>
          </select>
        </div>

        <br />

        {form.interviewType === "Online" && (
          <div>
            <label>Meeting Link</label>
            <br />

            <input
              type="text"
              name="meetingLink"
              value={form.meetingLink}
              onChange={handleChange}
              placeholder="https://meet.google.com/..."
            />
          </div>
        )}

        {form.interviewType === "Offline" && (
          <div>
            <label>Location</label>
            <br />

            <input
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Meeting room"
            />
          </div>
        )}

        <br />

        <button type="submit">
          Schedule Interview
        </button>
      </form>

      <hr />

      {/* Interview List */}

      <h2>Interview List</h2>

      {loading ? (
        <p>Loading interviews...</p>
      ) : interviews.length === 0 ? (
        <p>No interviews found.</p>
      ) : (
        <table border="1" cellPadding="10">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Position</th>
              <th>Date</th>
              <th>Type</th>
              <th>Mode</th>
              <th>Interviewer</th>
              <th>Status</th>
              <th>Feedback</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {interviews.map((interview) => (
              <tr key={interview._id}>
                <td>
                  {interview.candidate?.name ||
                    "Unknown"}
                </td>

                <td>
                  {interview.candidate?.position ||
                    "-"}
                </td>

                <td>
                  {new Date(
                    interview.date
                  ).toLocaleString()}
                </td>

                <td>
                  {interview.interviewType}
                </td>

                <td>{interview.mode}</td>

                <td>
                  {interview.interviewer?.name ||
                    "-"}
                </td>

                <td>
                  <select
                    value={interview.status}
                    onChange={(e) =>
                      updateStatus(
                        interview._id,
                        e.target.value
                      )
                    }
                  >
                    <option value="Scheduled">
                      Scheduled
                    </option>

                    <option value="Completed">
                      Completed
                    </option>

                    <option value="Cancelled">
                      Cancelled
                    </option>
                  </select>
                </td>

                <td>
                  {interview.feedback || "No feedback"}
                </td>

                <td>
                  <button
                    onClick={() =>
                      updateFeedback(
                        interview._id
                      )
                    }
                  >
                    Add Feedback
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

export default Interviews;