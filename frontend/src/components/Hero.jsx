import React from "react";
import "../styles/Components/Hero.css";
import { Link } from "react-router-dom";
import mentoring from "../assets/Mentoring-hero-section.png";

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-container">

        <div className="hero-content">
          <h1>
            Connect with Industry Experts <br />
            <span>Grow Your Career Faster</span>
          </h1>

          <p>
            Hi, I’m ProGuide — your bridge to experts who guide your career growth.
          </p>

          <div className="hero-buttons">
            <Link to="/search">
              <button className="primary-btn">Find a Professional</button>
            </Link>

            <Link to="/become-professional">
              <button className="secondary-btn">
                Become a Professional
              </button>
            </Link>
          </div>
        </div>

        <div className="hero-image">
          <img src={mentoring} alt="mentoring" />
        </div>

      </div>
    </section>
  );
};

export default Hero;