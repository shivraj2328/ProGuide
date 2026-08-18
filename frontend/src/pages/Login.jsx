import { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import "../styles/pages/Login_signup.css"


const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (res.status === 200) {
      const user = await res.json();

      // SAVE USER
      localStorage.setItem("user", JSON.stringify(user));

      alert("Login successful");

      navigate("/"); // redirect
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-container">
        <h2>Login</h2>

        <form onSubmit={handleSubmit}>
          <input name="email" placeholder="Email" onChange={handleChange} />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} />

          <button type="submit">Login</button>
        </form>
        <div className="auth-footer">
          Don’t have an account? <a href="/signup">Signup</a>
        </div>
      </div>
    </>
  );
};

export default Login;