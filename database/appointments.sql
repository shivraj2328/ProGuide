USE proguide;

CREATE TABLE IF NOT EXISTS appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  professional_id INT,
  date DATE,
  session_at DATETIME NULL,
  status VARCHAR(50) DEFAULT 'pending',
  is_paid BOOLEAN DEFAULT FALSE,
  student_email VARCHAR(100),
  professional_email VARCHAR(100),
  meeting_link VARCHAR(512) NULL,
  stripe_checkout_session_id VARCHAR(255) NULL,
  acceptance_email_sent_at DATETIME NULL
);
