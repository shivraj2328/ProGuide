import { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import "../styles/pages/Login_signup.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
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
      const res = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.status === 200) {
        const user = await res.json();
        localStorage.setItem("user", JSON.stringify(user));
        alert("Login successful");
        navigate("/");
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit} autoComplete="off">
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
          <button type="submit">Login</button>
        </form>
        <div className="auth-footer">
          Don't have an account? <a href="/signup">Signup</a>
        </div>
      </div>
    </>
  );
};

export default Login;
