require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const { sendAcceptanceEmail } = require("./emailService");

const app = express();

function queryDb(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.query(sql, params, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
}

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "proguide"
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.code || err.message);
  } else {
    console.log("Connected to MySQL");
  }
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Backend running"));

app.get("/professionals", (req, res) => {
  db.query("SELECT * FROM professionals", (err, result) => {
    if (err) return res.status(500).send("Error fetching data");
    res.json(result);
  });
});

app.post("/add-professional", (req, res) => {
  const { name, title, industry, experience, organization, bio, location, skills, education, linkedin, email, availability, sessionFee } = req.body;
  const sql = `INSERT INTO professionals (name, title, industry, experience, organization, bio, location, skills, education, linkedin, email, availability, sessionFee) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(sql, [name, title, industry, experience, organization, bio, location, skills, education, linkedin, email, availability, sessionFee], (err) => {
    if (err) return res.status(500).send("Error adding professional");
    res.send("Professional added successfully");
  });
});

app.get("/professionals/:id", (req, res) => {
  db.query("SELECT * FROM professionals WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result[0]);
  });
});

app.get("/booked-slots/:professionalId", (req, res) => {
  const { professionalId } = req.params;
  db.query(
    `SELECT session_at, date FROM appointments WHERE professional_id = ? AND status != 'rejected'`,
    [professionalId],
    (err, results) => {
      if (err) return res.status(500).send(err);
      const slots = results
        .map((r) => r.session_at || r.date)
        .filter(Boolean)
        .map((s) => String(s).slice(0, 16));
      res.json(slots);
    }
  );
});

app.post("/register", (req, res) => {
  const { name, email, password, role } = req.body;
  db.query("INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)", [name, email, password, role], (err) => {
    if (err) return res.status(500).send(err);
    res.send("User registered successfully");
  });
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  db.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length > 0) res.json(result[0]);
    else res.status(401).send("Invalid credentials");
  });
});


app.post("/book", (req, res) => {
  const { student_id, professional_id, date, session_at, student_email, professional_email, reason } = req.body;
  const dateOnly = date || (session_at && String(session_at).slice(0, 10)) || null;
  db.query(
    `INSERT INTO appointments (student_id, professional_id, date, session_at, status, student_email, professional_email, reason) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [student_id, professional_id, dateOnly, session_at || null, "pending", student_email, professional_email, reason || null],
    (err, result) => {
      if (err) { console.log(err); return res.status(500).json({ error: "Error booking appointment." }); }
      res.json({ message: "Appointment booked successfully", appointmentId: result.insertId });
    }
  );
});

app.post("/update-status", (req, res) => {
  const { id, status } = req.body;
  db.query("UPDATE appointments SET status = ? WHERE id = ?", [status, id], (err) => {
    if (err) return res.status(500).send(err);
    res.send("Updated");
  });
});

// email to stduent
app.post("/appointments/:id/accept", async (req, res) => {
  const id = req.params.id;
  const { meetingLink, professionalEmail } = req.body;
  if (!meetingLink || !String(meetingLink).trim().startsWith("http"))
    return res.status(400).json({ error: "Valid Google Meet link required" });
  if (!professionalEmail)
    return res.status(400).json({ error: "professionalEmail required" });

  try {
    const rows = await queryDb("SELECT * FROM appointments WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    const appt = rows[0];
    if (appt.professional_email !== professionalEmail) return res.status(403).json({ error: "Forbidden" });
    if (appt.status !== "pending") return res.status(400).json({ error: "Appointment is not pending" });

    await queryDb("UPDATE appointments SET status = ?, meeting_link = ? WHERE id = ?", ["accepted", meetingLink.trim(), id]);

    const users = await queryDb("SELECT name, email FROM users WHERE id = ?", [appt.student_id]);
    const profs = await queryDb("SELECT name FROM professionals WHERE id = ?", [appt.professional_id]);
    const studentName = users[0]?.name || "Student";
    const studentEmail = users[0]?.email || appt.student_email;
    const professionalName = profs[0]?.name || "Professional";

    let emailSent = false;
    try {
      const result = await sendAcceptanceEmail({ to: studentEmail, studentName, professionalName, sessionAt: appt.session_at, fallbackDate: appt.date, meetingLink: meetingLink.trim(), appointmentId: id });
      emailSent = !result.skipped;
      if (emailSent) await queryDb("UPDATE appointments SET acceptance_email_sent_at = NOW() WHERE id = ?", [id]);
    } catch (mailErr) {
      console.error("Email failed:", mailErr);
      return res.status(200).json({ ok: true, emailSent: false, emailError: mailErr.message });
    }
    res.json({ ok: true, emailSent });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message || "Accept failed" });
  }
});

// Resend email
app.post("/appointments/:id/resend-acceptance-email", async (req, res) => {
  const id = req.params.id;
  const { professionalEmail } = req.body;
  if (!professionalEmail) return res.status(400).json({ error: "professionalEmail required" });

  try {
    const rows = await queryDb("SELECT * FROM appointments WHERE id = ?", [id]);
    if (!rows.length) return res.status(404).json({ error: "Not found" });
    const appt = rows[0];
    if (appt.professional_email !== professionalEmail) return res.status(403).json({ error: "Forbidden" });
    if (appt.status !== "accepted") return res.status(400).json({ error: "Only accepted appointments can resend mail" });
    if (!appt.meeting_link) return res.status(400).json({ error: "No meeting link on file" });

    const users = await queryDb("SELECT name, email FROM users WHERE id = ?", [appt.student_id]);
    const profs = await queryDb("SELECT name FROM professionals WHERE id = ?", [appt.professional_id]);
    const studentName = users[0]?.name || "Student";
    const studentEmail = users[0]?.email || appt.student_email;
    const professionalName = profs[0]?.name || "Professional";

    const result = await sendAcceptanceEmail({ to: studentEmail, studentName, professionalName, sessionAt: appt.session_at, fallbackDate: appt.date, meetingLink: appt.meeting_link, appointmentId: id });
    if (result.skipped) return res.status(503).json({ error: "Email not configured. Set SMTP_* variables in .env" });

    await queryDb("UPDATE appointments SET acceptance_email_sent_at = NOW() WHERE id = ?", [id]);
    res.json({ ok: true, resent: true });
  } catch (e) {
    res.status(500).json({ error: e.message || "Resend failed" });
  }
});


app.get("/professional-requests/:email", (req, res) => {
  db.query(
    `SELECT a.*, u.name AS student_name 
     FROM appointments a
     LEFT JOIN users u ON u.id = a.student_id
     WHERE a.professional_email = ?
     ORDER BY a.id DESC`,
    [req.params.email],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    }
  );
});

app.get("/student-appointments/:id", (req, res) => {
  db.query("SELECT * FROM appointments WHERE student_id = ? ORDER BY id DESC", [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

app.listen(5000, () => console.log("Server running on port 5000"));
