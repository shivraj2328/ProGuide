use proguide;
CREATE TABLE appointments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  professional_id INT,
  date DATE,
  status VARCHAR(50) DEFAULT 'pending',
  is_paid BOOLEAN DEFAULT FALSE,
  student_email VARCHAR(100),
  professional_email VARCHAR(100)
);

update appointments
set student_email = "riteshhood0@gmail.com"
where id =1;
SELECT * FROM appointments;

