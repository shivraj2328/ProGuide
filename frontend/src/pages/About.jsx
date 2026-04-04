import React from "react";
import Navbar from "../components/Navbar";
import "../styles/About.css";

const About = () => {
    return (
        <>
         
            <div className="about">
                <div className="about-container">
                    <h1>About ProGuide</h1>
                    <p className="about-intro">
                        Hey! I'm ProGuide. I connect you with verified professionals who guide your career growth.
                    </p>

                    <div className="about-cards">
                        <div className="about-card">
                            <h3>Our Mission</h3>
                            <p>To bridge the gap between students and real-world professionals.</p>
                        </div>

                        <div className="about-card">
                            <h3>Our Vision</h3>
                            <p>To make mentorship accessible, trusted, and impactful.</p>
                        </div>

                        <div className="about-card">
                            <h3>Why ProGuide?</h3>
                            <p>Verified mentors, real insights, and practical career direction.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default About;