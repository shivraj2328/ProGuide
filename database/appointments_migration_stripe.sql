-- Run once on existing `proguide` database (Workbench)
USE proguide;

ALTER TABLE appointments
  ADD COLUMN session_at DATETIME NULL AFTER date,
  ADD COLUMN meeting_link VARCHAR(512) NULL,
  ADD COLUMN stripe_checkout_session_id VARCHAR(255) NULL,
  ADD COLUMN acceptance_email_sent_at DATETIME NULL;
