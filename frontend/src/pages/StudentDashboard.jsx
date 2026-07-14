import { useCallback, useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/pages/dashboard.css";

const api = "http://localhost:5000";

const StudentDashboard = () => {
  const userRaw = localStorage.getItem("user");
  const user = userRaw ? JSON.parse(userRaw) : null;
  const studentId = user?.id;
  const [appointments, setAppointments] = useState([]);

  const load = useCallback(() => {
    if (!studentId) return;
    fetch(`${api}/student-appointments/${studentId}`)
      .then((res) => res.json())
      .then((data) => setAppointments(data))
      .catch((err) => console.log(err));
  }, [studentId]);

  useEffect(() => { load(); }, [load]);

  const formatWhen = (item) => {
    if (item.session_at) {
      const d = new Date(item.session_at);
      if (!Number.isNaN(d.getTime())) {
        return d.toLocaleString(undefined, { dateStyle: "long", timeStyle: "short" });
      }
    }
    return item.date || "—";
  };

  const getSessionDate = (item) => {
    if (item.session_at) {
      const d = new Date(item.session_at);
      if (!Number.isNaN(d.getTime())) return d;
    }
    return null;
  };

  const isCompleted = (item) => {
    if (item.status !== "accepted") return false;
    const d = getSessionDate(item);
    return d && d < new Date();
  };

  const isScheduled = (item) => {
    if (item.status !== "accepted") return false;
    const d = getSessionDate(item);
    return d && d >= new Date();
  };

  const getLabel = (item) => {
    if (isCompleted(item)) return "completed";
    if (isScheduled(item)) return "scheduled";
    return item.status; // pending | rejected
  };

  // Sort: upcoming first (soonest at top), then pending, completed, rejected
  const labelOrder = { scheduled: 0, pending: 1, completed: 2, rejected: 3 };

  const sorted = [...appointments].sort((a, b) => {
    const la = getLabel(a);
    const lb = getLabel(b);
    if (la !== lb) return (labelOrder[la] ?? 9) - (labelOrder[lb] ?? 9);
    // Within same group: ascending by session date (soonest first)
    const da = getSessionDate(a)?.getTime() ?? 0;
    const db = getSessionDate(b)?.getTime() ?? 0;
    return da - db;
  });

  const groups = [
    { key: "scheduled", title: "Upcoming Sessions",     items: sorted.filter((i) => getLabel(i) === "scheduled") },
    { key: "pending",   title: "Pending Confirmation",   items: sorted.filter((i) => getLabel(i) === "pending")   },
    { key: "completed", title: "Completed Sessions",     items: sorted.filter((i) => getLabel(i) === "completed") },
    { key: "rejected",  title: "Rejected",               items: sorted.filter((i) => getLabel(i) === "rejected")  },
  ].filter((g) => g.items.length > 0);

  if (!user) return <h2>Please login first</h2>;
  if (user.role !== "student") return <h2>Access denied</h2>;

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <h2 className="dashboard-title">My Bookings</h2>

        {appointments.length === 0 ? (
          <p className="no-data">No bookings yet</p>
        ) : (
          groups.map((group) => (
            <div key={group.key} className="booking-group">
              <h3 className="booking-group-title">{group.title}</h3>

              {group.items.map((item) => {
                const label = getLabel(item);
                return (
                  <div key={item.id} className={`dashboard-card booking-card-${label}`}>
                    <span className={`booking-badge badge-${label}`}>
                      {label === "scheduled" && "Scheduled"}
                      {label === "completed" && "Completed"}
                      {label === "pending"   && "Pending"}
                      {label === "rejected"  && "Rejected"}
                    </span>

                    <p style={{ marginTop: "10px" }}>
                      <strong>Session:</strong> {formatWhen(item)}
                    </p>
                    <p><strong>Professional:</strong> {item.professional_email}</p>

                    {item.reason && (
                      <p style={{ color: "#6b7280", fontSize: "13px", marginTop: "4px" }}>
                        <strong>Your reason:</strong> {item.reason}
                      </p>
                    )}

                    {label === "pending" && (
                      <p style={{ color: "#d97706", marginTop: "8px", fontSize: "13px", fontWeight: 500 }}>
                        Awaiting confirmation from the professional.
                      </p>
                    )}

                    {label === "scheduled" && (
                      <>
                        <p className="status-accepted" style={{ marginTop: "8px" }}>
                          ✅ Session confirmed by professional
                        </p>
                        <p>
                          <strong>Google Meet:</strong>{" "}
                          {item.meeting_link ? (
                            <a href={item.meeting_link} target="_blank" rel="noreferrer">Join meeting</a>
                          ) : (
                            "Link will be shared soon"
                          )}
                        </p>
                      </>
                    )}

                    {label === "completed" && (
                      <p style={{ color: "#7c3aed", marginTop: "8px", fontSize: "13px", fontWeight: 600 }}>
                        Session has been completed.
                        {item.meeting_link && (
                          <> — <a href={item.meeting_link} target="_blank" rel="noreferrer">View meet link</a></>
                        )}
                      </p>
                    )}

                    {label === "rejected" && (
                      <p className="status-rejected" style={{ marginTop: "8px" }}>
                        This session was not accepted. Please book another slot.
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

export default StudentDashboard;

