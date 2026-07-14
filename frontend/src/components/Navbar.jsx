import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Components/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setDropdownOpen(false);
    navigate("/");
    window.location.reload();
  };

  const handleDashboard = () => {
    setDropdownOpen(false);
    if (user?.role === "professional") {
      navigate("/professional-dashboard");
    } else {
      navigate("/student-dashboard");
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const roleColor = user?.role === "professional" ? "#10B981" : "#3B82F6";
  const roleLabel = user?.role === "professional" ? "Professional" : "Student";

  return (
    <nav>
      {/* LEFT: Logo */}
      <div className="logo" onClick={() => navigate("/")}>
        ProGuide
      </div>

      {/* RIGHT: links + avatar together */}
      <div className="nav-right">
        <div className={`nav-menus ${menuOpen ? "active" : ""}`}>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/search">Search</Link></li>
            <li><Link to="/about">About</Link></li>
            {!user && <li><Link to="/login">Login</Link></li>}
          </ul>
        </div>

        {user && (
          <div className="profile-wrapper" ref={dropdownRef}>
            <button
              className="avatar-btn"
              onClick={() => setDropdownOpen((prev) => !prev)}
              aria-label="Profile menu"
            >
              <div className="avatar-circle" style={{ "--role-color": roleColor }}>
                {getInitials(user.name)}
              </div>
              <span className="avatar-name">{user.name?.split(" ")[0]}</span>
              <svg
                className={`avatar-chevron ${dropdownOpen ? "open" : ""}`}
                width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-avatar" style={{ "--role-color": roleColor }}>
                    {getInitials(user.name)}
                  </div>
                  <div className="dropdown-user-info">
                    <span className="dropdown-name">{user.name}</span>
                    <span className="dropdown-email">{user.email}</span>
                    <span className="dropdown-role-badge" style={{ background: roleColor }}>
                      {roleLabel}
                    </span>
                  </div>
                </div>

                <div className="dropdown-divider" />

                <button className="dropdown-item" onClick={handleDashboard}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                  {user.role === "professional" ? "Dashboard" : "My Bookings"}
                </button>

                <div className="dropdown-divider" />

                <button className="dropdown-item logout-item" onClick={handleLogout}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>
    </nav>
  );
};

export default Navbar;
