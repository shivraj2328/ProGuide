const nodemailer = require("nodemailer");

function getTransport() {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user, pass }
  });
}

function formatSessionWhen(sessionAt, fallbackDate) {
  if (sessionAt) {
    const d = new Date(sessionAt);
    if (!Number.isNaN(d.getTime())) {
      return d.toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short"
      });
    }
  }
  if (fallbackDate) {
    return String(fallbackDate);
  }
  return "TBD";
}

async function sendAcceptanceEmail({
  to,
  studentName,
  professionalName,
  sessionAt,
  fallbackDate,
  meetingLink,
  appointmentId
}) {
  const transport = getTransport();
  const when = formatSessionWhen(sessionAt, fallbackDate);
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;

  const html = `
    <h2>Your session is confirmed</h2>
    <p>Hi ${studentName || "there"},</p>
    <p><strong>${professionalName}</strong> has accepted your ProGuide appointment.</p>
    <p><strong>When:</strong> ${when}</p>
    <p><strong>Google Meet:</strong> <a href="${meetingLink}">${meetingLink}</a></p>
    <p><strong>Reference ID:</strong> ${appointmentId}</p>
    <p>See you at the scheduled time.</p>
  `;

  const text = [
    "Your session is confirmed",
    "",
    `${professionalName} has accepted your ProGuide appointment.`,
    `When: ${when}`,
    `Google Meet: ${meetingLink}`,
    `Reference ID: ${appointmentId}`
  ].join("\n");

  if (!transport) {
    console.warn(
      "[emailService] SMTP not configured; skipping send. Set SMTP_HOST, SMTP_USER, SMTP_PASS."
    );
    return { skipped: true };
  }

  await transport.sendMail({
    from,
    to,
    subject: `ProGuide: Session confirmed (#${appointmentId})`,
    text,
    html
  });

  return { skipped: false };
}

module.exports = { sendAcceptanceEmail, formatSessionWhen };
