use proguide;
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT,
  professional_id INT,
  rating INT,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select * from reviews;