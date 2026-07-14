import { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/pages/dashboard.css";

const api = "http://localhost:5000";

const ProfessionalDashboard = () => {
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  const professionalEmail = user?.email;
  const [requests, setRequests] = useState([]);
  const [meetInputs, setMeetInputs] = useState({});
  const [busyId, setBusyId] = useState(null);

  const loadRequests = useCallback(() => {
    if (!professionalEmail) return;
    fetch(`${api}/professional-requests/${encodeURIComponent(professionalEmail)}`)
      .then((res) => res.json())
      .then((data) => setRequests(data))
      .catch((err) => console.log(err));
  }, [professionalEmail]);

  useEffect(() => { loadRequests(); }, [loadRequests]);

  const setMeetFor = (id, value) => {
    setMeetInputs((prev) => ({ ...prev, [id]: value }));
  };

  const acceptWithMeet = async (req) => {
    const link = (meetInputs[req.id] || "").trim();
    if (!link) { alert("Paste your Google Meet link before accepting."); return; }
    if (!link.startsWith("http")) { alert("Meet link should start with https://"); return; }

    setBusyId(req.id);
    try {
      const res = await fetch(`${api}/appointments/${req.id}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ meetingLink: link, professionalEmail: user.email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { alert(data.error || "Accept failed"); return; }
      if (data.emailSent === false) {
        alert(`Accepted, but email was not sent: ${data.emailError || "configure SMTP in backend .env"}`);
      } else {
        alert("Accepted and confirmation email sent to the student.");
      }
      loadRequests();
    } catch (e) {
      console.log(e);
      alert("Request failed");
    } finally {
      setBusyId(null);
    }
  };

  const rejectRequest = async (id) => {
    try {
      await fetch(`${api}/update-status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "rejected" }),
      });
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)));
    } catch (e) { console.log(e); }
  };

  const resendMail = async (req) => {
    setBusyId(req.id);
    try {
      const res = await fetch(`${api}/appointments/${req.id}/resend-acceptance-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ professionalEmail: user.email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { alert(data.error || "Resend failed"); return; }
      alert("Confirmation email resent to the student.");
      loadRequests();
    } catch (e) {
      console.log(e);
      alert("Resend failed");
    } finally {
      setBusyId(null);
    }
  };

  const formatWhen = (req) => {
    if (req.session_at) {
      const d = new Date(req.session_at);
      if (!Number.isNaN(d.getTime())) {
        return d.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
      }
    }
    return req.date || "—";
  };

  const getSessionDate = (req) => {
    if (req.session_at) {
      const d = new Date(req.session_at);
      if (!Number.isNaN(d.getTime())) return d;
    }
    return null;
  };

  const isCompleted = (req) => {
    if (req.status !== "accepted") return false;
    const d = getSessionDate(req);
    return d && d < new Date();
  };

  const isScheduled = (req) => {
    if (req.status !== "accepted") return false;
    const d = getSessionDate(req);
    return d && d >= new Date();
  };

  const getLabel = (req) => {
    if (isCompleted(req)) return "completed";
    if (isScheduled(req)) return "scheduled";
    return req.status; // pending | rejected
  };

  const labelOrder = { scheduled: 0, pending: 1, completed: 2, rejected: 3 };

  const sorted = [...requests].sort((a, b) => {
    const la = getLabel(a);
    const lb = getLabel(b);
    if (la !== lb) return (labelOrder[la] ?? 9) - (labelOrder[lb] ?? 9);
    const da = getSessionDate(a)?.getTime() ?? 0;
    const db = getSessionDate(b)?.getTime() ?? 0;
    return da - db;
  });

  const groups = [
    { key: "scheduled", title: "Upcoming Sessions",    items: sorted.filter((r) => getLabel(r) === "scheduled") },
    { key: "pending",   title: "Pending Requests",      items: sorted.filter((r) => getLabel(r) === "pending")   },
    { key: "completed", title: "Completed Sessions",    items: sorted.filter((r) => getLabel(r) === "completed") },
    { key: "rejected",  title: "Rejected",              items: sorted.filter((r) => getLabel(r) === "rejected")  },
  ].filter((g) => g.items.length > 0);

  if (!user) return <h2>Please login first</h2>;
  if (user.role !== "professional") return <h2>Access denied</h2>;

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <h2 className="dashboard-title">Appointment Requests</h2>

        {requests.length === 0 ? (
          <p className="no-data">No requests yet</p>
        ) : (
          groups.map((group) => (
            <div key={group.key} className="booking-group">
              <h3 className="booking-group-title">{group.title}</h3>

              {group.items.map((req) => {
                const label = getLabel(req);
                return (
                  <div key={req.id} className={`dashboard-card booking-card-${label}`}>

                    <span className={`booking-badge badge-${label}`}>
                      {label === "scheduled" && "Scheduled"}
                      {label === "completed" && "Completed"}
                      {label === "pending"   && "Pending"}
                      {label === "rejected"  && "Rejected"}
                    </span>

                    {/* Student name */}
                    <p style={{ fontSize: "17px", fontWeight: 700, marginTop: "10px", marginBottom: "4px" }}>
                      👤 {req.student_name || "Student"}&nbsp;
                      <span style={{ fontSize: "13px", fontWeight: 400, color: "#6b7280" }}>
                        ({req.student_email})
                      </span>
                    </p>

                    <p><strong>When:</strong> {formatWhen(req)}</p>

                    {/* Reason */}
                    {req.reason && (
                      <div style={{
                        background: "#f3f4f6",
                        borderLeft: "3px solid #6366f1",
                        borderRadius: "4px",
                        padding: "8px 12px",
                        margin: "8px 0",
                        fontSize: "14px",
                        color: "#374151",
                      }}>
                        <strong>Reason:</strong> {req.reason}
                      </div>
                    )}

                    {/* PENDING — accept / reject actions */}
                    {label === "pending" && (
                      <>
                        <label className="meet-label" htmlFor={`meet-${req.id}`}>
                          Google Meet link (https://…)
                        </label>
                        <input
                          id={`meet-${req.id}`}
                          type="url"
                          className="meet-input"
                          placeholder="https://meet.google.com/..."
                          value={meetInputs[req.id] || ""}
                          onChange={(e) => setMeetFor(req.id, e.target.value)}
                        />
                        <div>
                          <button
                            type="button"
                            className="dashboard-btn accept-btn"
                            disabled={busyId === req.id}
                            onClick={() => acceptWithMeet(req)}
                          >
                            {busyId === req.id ? "Saving…" : "✅ Accept & email student"}
                          </button>
                          <button
                            type="button"
                            className="dashboard-btn reject-btn"
                            onClick={() => rejectRequest(req.id)}
                          >
                            ❌ Reject
                          </button>
                        </div>
                      </>
                    )}

                    {/* SCHEDULED — show meet link + resend option */}
                    {label === "scheduled" && (
                      <div style={{ marginTop: "10px" }}>
                        <p className="status-accepted">
                          ✅ Accepted —{" "}
                          {req.meeting_link ? (
                            <a href={req.meeting_link} target="_blank" rel="noreferrer">
                              Open Meet link
                            </a>
                          ) : "—"}
                        </p>
                        <button
                          type="button"
                          className="dashboard-btn resend-btn"
                          disabled={busyId === req.id || !req.meeting_link}
                          onClick={() => resendMail(req)}
                        >
                          {busyId === req.id ? "Sending…" : "Resend confirmation email"}
                        </button>
                      </div>
                    )}

                    {/* COMPLETED — no meet link shown */}
                    {label === "completed" && (
                      <p style={{ color: "#7c3aed", fontWeight: 600, fontSize: "14px", marginTop: "10px" }}>
                        🎓 Session has been completed.
                      </p>
                    )}

                    {/* REJECTED */}
                    {label === "rejected" && (
                      <p className="status-rejected" style={{ marginTop: "8px" }}>
                        ❌ Rejected
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default ProfessionalDashboard;
