import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/pages/PaymentConfirm.css";

const PaymentConfirm = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [status, setStatus] = useState("idle");

  if (!state) {
    navigate("/");
    return null;
  }

  const {
    professionalName,
    professionalTitle,
    sessionAt,
    sessionFee,
    studentId,
    professionalId,
    studentEmail,
    professionalEmail,
    reason,
  } = state;

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleString(undefined, { dateStyle: "long", timeStyle: "short" });
  };

  const handleConfirm = async () => {
    setStatus("processing");
    try {
      const res = await fetch("http://localhost:5000/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          professional_id: professionalId,
          date: sessionAt.slice(0, 10),
          session_at: sessionAt,
          student_email: studentEmail,
          professional_email: professionalEmail,
          reason: reason || "",
        }),
      });

      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(payload.error || "Booking failed");
        setStatus("idle");
        return;
      }
      setStatus("done");
    } catch (err) {
      console.log(err);
      alert("Something went wrong. Please try again.");
      setStatus("idle");
    }
  };

  if (status === "done") {
    return (
      <>
        <Navbar />
        <div className="pc-wrap">
          <div className="pc-card">
            <div className="pc-success-circle">
              <svg viewBox="0 0 28 28" fill="none" width="30" height="30">
                <polyline
                  points="5,14 11,20 23,8"
                  stroke="var(--color-text-success)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="pc-success-title">Request sent!</h2>
            <p className="pc-success-sub">
              Your session request with <strong>{professionalName}</strong> for{" "}
              <strong>{formatDate(sessionAt)}</strong> has been submitted.<br />
              The professional will review your request and send a Google Meet link once accepted.
            </p>
            <button className="pc-done-btn" onClick={() => navigate("/student-dashboard")}>
              Go to my dashboard
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="pc-wrap">
        <h1 className="pc-heading">Confirm your booking request</h1>
        <div className="pc-card">
          <div className="pc-pro-info">
            <div className="pc-avatar">
              {professionalName?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="pc-pro-name">{professionalName}</p>
              <p className="pc-pro-title">{professionalTitle}</p>
            </div>
          </div>

          <div className="pc-divider" />

          <div className="pc-rows">
            <div className="pc-row">
              <span className="pc-label">Session date &amp; time</span>
              <span className="pc-val">{formatDate(sessionAt)}</span>
            </div>
            <div className="pc-row">
              <span className="pc-label">Duration</span>
              <span className="pc-val">60 minutes</span>
            </div>
            <div className="pc-row">
              <span className="pc-label">Session fee</span>
              <span className="pc-val">₹{sessionFee}</span>
            </div>
            {reason && (
              <div className="pc-row" style={{ flexDirection: "column", alignItems: "flex-start", gap: "4px" }}>
                <span className="pc-label">Your reason</span>
                <span className="pc-val" style={{ fontSize: "13px", color: "#374151" }}>{reason}</span>
              </div>
            )}
          </div>

          <div className="pc-total-row">
            <span className="pc-total-label">Session Fee</span>
            <span className="pc-total-val">₹{sessionFee}</span>
          </div>

          <button
            className="pc-confirm-btn"
            onClick={handleConfirm}
            disabled={status === "processing"}
          >
            {status === "processing" ? "Sending request…" : "Send booking request"}
          </button>

          <p className="pc-note">
            Your request will be reviewed by the professional before confirmation
          </p>
        </div>

        <button className="pc-back-btn" onClick={() => navigate(-1)}>
          ← Go back
        </button>
      </div>
    </>
  );
};

export default PaymentConfirm;
