import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Components/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <nav>
      {/* LOGO */}
      <div className="logo">ProGuide</div>

      {/* RIGHT SIDE */}
      <div className="nav-right">

        {/* MENU */}
        <div className={`nav-menus ${menuOpen ? "active" : ""}`}>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/search">Search</Link></li>
            <li><Link to="/about">About</Link></li>
            {!user && <li><Link to="/login">Login</Link></li>}
          </ul>
        </div>

        {/* ROLE BASED BUTTONS */}
        {user?.role === "professional" && (
          <button
            className="nav-btn secondary"
            onClick={() => navigate("/professional-dashboard")}
          >
            Dashboard
          </button>
        )}

        {user?.role === "student" && (
          <button
            className="nav-btn"
            onClick={() => navigate("/my-bookings")}
          >
            My Bookings
          </button>
        )}
        {user && (
          <button
            className="nav-btn secondary"
            onClick={() => {
              localStorage.removeItem("user");
              navigate("/login");
              window.location.reload();
            }}
          >
            Logout
          </button>
        )}

        {/* HAMBURGER */}
        <div
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>
      </div>
    </nav>
  );
};

export default Navbar;