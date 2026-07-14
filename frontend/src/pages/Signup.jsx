import { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/pages/Login_signup.css";

const initialForm = {
  name: "",
  email: "",
  password: "",
  role: "student",
};

const Signup = () => {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error on change
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be at least 6 characters, include one uppercase letter and one number.";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    try {
      const res = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await res.text();
      alert(result);
      if (res.ok) {
        setFormData(initialForm);
        setErrors({});
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <h2>Signup</h2>
        <form onSubmit={handleSubmit} autoComplete="off">
          <input
            name="name"
            placeholder="Name"
            autoComplete="off"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
          <input
            name="email"
            placeholder="Email"
            autoComplete="off"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
          <input
            name="password"
            type="password"
            placeholder="Password"
            autoComplete="new-password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <span className="field-error">{errors.password}</span>
          )}
          <select name="role" value={formData.role} onChange={handleChange}>
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
