const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Ritesh@2545",
  database: "proguide"
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed");
  } else {
    console.log("Connected to MySQL");
  }
});


// api to fetch all professionals from database.
app.get("/professionals", (req, res) => {
  const sql = "SELECT * FROM Professionals";

  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error fetching data");
    } else {
      res.json(result);
    }
  });
});


// Test route
app.get("/", (req, res) => {
  res.send("Backend running ");
});


// Add professional to database.
app.post("/add-professional", (req, res) => {
  const {
    name,
    title,
    industry,
    experience,
    organization,
    bio,
    location,
    skills,
    education,
    linkedin,
    email,
    availability,
    sessionFee
  } = req.body;
  const sql = `
INSERT INTO professionals 
(name, title, industry, experience, organization, bio, location, skills, education, linkedin, email, availability, sessionFee)
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

  db.query(sql, [
    name,
    title,
    industry,
    experience,
    organization,
    bio,
    location,
    skills,
    education,
    linkedin,
    email,
    availability,
    sessionFee
  ], (err, result) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error adding professional");
    } else {
      res.send("Professional added successfully");
    }
  });
});

// select perticular professional.
app.get("/professionals/:id", (req, res) => {
  const { id } = req.params;

  db.query("SELECT * FROM professionals WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result[0]);
  });
});

//register:
app.post("/register", (req, res) => {
  const { name, email, password, role } = req.body;

  db.query(
    "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
    [name, email, password, role],
    (err) => {
      if (err) return res.status(500).send(err);
      res.send("User registered successfully");
    }
  );
});


//Login :
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ? AND password = ?",
    [email, password],
    (err, result) => {
      if (err) return res.status(500).send(err);

      if (result.length > 0) {
        res.json(result[0]); // send user
      } else {
        res.status(401).send("Invalid credentials");
      }
    }
  );
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});