import { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/pages/Login_signup.css"

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const result = await res.text();
    alert(result);
  };

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <h2>Signup</h2>

        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" onChange={handleChange} />
          <input name="email" placeholder="Email" onChange={handleChange} />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} />

          <select name="role" onChange={handleChange}>
            <option value="student">Student</option>
            <option value="professional">Professional</option>
          </select>

          <button type="submit">Register</button>
        </form>
        <div className="auth-footer">
  Already have an account? <a href="/login">Login</a>
</div>
      </div>
    </>
  );
};

export default Signup;