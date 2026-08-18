use proguide;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role ENUM('student', 'professional'),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

select * from users;
select * from users 
where role = "student";