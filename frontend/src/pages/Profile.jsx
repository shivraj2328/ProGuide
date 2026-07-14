import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/pages/Profile.css";
import Footer from "../components/Footer";

const ALL_SLOTS = [
  "09:00", "10:00", "11:00",
  "12:00", "13:00", "14:00",
  "15:00", "16:00", "17:00",
  "18:00", "19:00",
];

const getVisibleSlots = (day) => {
  const now = new Date();
  const isToday = day.toDateString() === now.toDateString();
  if (!isToday) return ALL_SLOTS;
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return ALL_SLOTS.filter((slot) => {
    const [h, m] = slot.split(":").map(Number);
    return h * 60 + m > currentMinutes;
  });
};

const getNext7Days = () => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(d);
  }
  return days;
};

const formatDate = (d) =>
  d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });

const toISO = (date, time) => {
  const d = new Date(date);
  const [h, m] = time.split(":").map(Number);
  d.setHours(h, m, 0, 0);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(h)}:${pad(m)}`;
};

const Profile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [reason, setReason] = useState("");

  const days = getNext7Days();

  useEffect(() => {
    fetch(`http://localhost:5000/professionals/${id}`)
      .then((res) => res.json())
      .then((d) => setData(d));

    fetch(`http://localhost:5000/booked-slots/${id}`)
      .then((res) => res.json())
      .then((slots) => setBookedSlots(slots))
      .catch(() => setBookedSlots([]));
  }, [id]);

  if (!data) return <h2>Loading...</h2>;

  const isBooked = (day, time) => {
    const dateStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, "0")}-${String(day.getDate()).padStart(2, "0")}`;
    return bookedSlots.some(
      (s) => s.startsWith(`${dateStr} ${time}`) || s.startsWith(`${dateStr}T${time}`)
    );
  };

  const handleBooking = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) { alert("Please login first"); return; }
    if (user.role !== "student") { alert("Only students can book sessions"); return; }
    if (!selectedDay || !selectedSlot) { alert("Please select a date and time slot"); return; }
    if (!reason.trim()) { alert("Please tell us why you want to book this session"); return; }

    const sessionAt = toISO(selectedDay, selectedSlot);
    navigate("/payment-confirm", {
      state: {
        professionalName: data.name,
        professionalTitle: data.title,
        sessionAt,
        sessionFee: data.sessionFee,
        studentId: user.id,
        professionalId: data.id,
        studentEmail: user.email,
        professionalEmail: data.email || "pro@email.com",
        reason: reason.trim(),
      },
    });
  };

  return (
    <>
      <Navbar />
      <div className="profile-container">
        <div className="profile-header">
          <h1>{data.name}</h1>
          <h3>{data.title}</h3>
        </div>

        <div className="profile-grid">
          <p><strong>Industry:</strong> {data.industry}</p>
          <p><strong>Experience:</strong> {data.experience} years</p>
          <p><strong>Organization:</strong> {data.organization}</p>
          <p><strong>Location:</strong> {data.location}</p>
          <p><strong>Availability:</strong> {data.availability}</p>
          <p><strong>Session Fee:</strong> ₹{data.sessionFee}</p>
        </div>

        <div className="profile-section">
          <h4>Skills</h4>
          <p>{data.skills}</p>
        </div>

        <div className="profile-section">
          <h4>Education</h4>
          <p>{data.education}</p>
        </div>

        <div className="profile-section">
          <h4>About</h4>
          <p>{data.bio}</p>
        </div>

        <a href={data.linkedin} target="_blank" rel="noreferrer" className="profile-link">
          View LinkedIn Profile
        </a>

        {/* TIME SLOT PICKER */}
        <div className="slot-picker-section">
          <h4>Select a Date</h4>
          <div className="day-tabs">
            {days.map((day, i) => (
              <button
                key={i}
                className={`day-tab ${selectedDay && day.toDateString() === selectedDay.toDateString() ? "active" : ""}`}
                onClick={() => { setSelectedDay(day); setSelectedSlot(null); }}
              >
                <span className="day-name">
                  {day.toLocaleDateString(undefined, { weekday: "short" })}
                </span>
                <span className="day-date">
                  {day.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                </span>
              </button>
            ))}
          </div>

          {selectedDay && (
            <>
              <h4 style={{ marginTop: "20px" }}>
                Available slots — {formatDate(selectedDay)}
              </h4>
              <div className="slots-grid">
                {getVisibleSlots(selectedDay).length === 0 && (
                  <p style={{ color: "#6b7280", fontSize: "14px", gridColumn: "1 / -1" }}>
                    No more slots available for today. Please select another day.
                  </p>
                )}
                {getVisibleSlots(selectedDay).map((slot) => {
                  const booked = isBooked(selectedDay, slot);
                  const active = selectedSlot === slot;
                  return (
                    <button
                      key={slot}
                      disabled={booked}
                      className={`slot-btn ${booked ? "slot-booked" : ""} ${active ? "slot-active" : ""}`}
                      onClick={() => !booked && setSelectedSlot(slot)}
                    >
                      {slot}
                      {booked && <span className="slot-tag">Booked</span>}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* REASON FOR BOOKING */}
        <div className="profile-section" style={{ marginTop: "24px" }}>
          <h4>Why do you want to book this session?</h4>
          <textarea
            placeholder="E.g. I want career guidance on switching from engineering to finance, need help with my resume, etc."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
              resize: "vertical",
              fontFamily: "inherit",
              marginTop: "8px",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          className="book-btn"
          onClick={handleBooking}
          disabled={!selectedDay || !selectedSlot}
          style={{ marginTop: "16px", opacity: (!selectedDay || !selectedSlot) ? 0.5 : 1 }}
        >
          {selectedDay && selectedSlot
            ? `Book ${selectedSlot} on ${formatDate(selectedDay)}`
            : "Select a slot to book"}
        </button>
      </div>
      <Footer />
    </>
  );
};

export default Profile;
