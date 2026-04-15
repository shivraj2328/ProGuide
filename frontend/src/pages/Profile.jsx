import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/pages/Profile.css";
import Footer from "../components/Footer";
const Profile = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5000/professionals/${id}`)
            .then(res => res.json())
            .then(data => setData(data));
    }, [id]);

    if (!data) return <h2>Loading...</h2>;

    return (
        <>
            <Navbar />

            <div className="profile-container">

                <div className="profile-header">
                    <h1>{data.name}</h1>
                    <h3>{data.title}</h3>
                </div>

                <div className="profile-grid">
                    <p><strong>Industry:</strong> {data.industry}</p>
                    <p><strong>Experience:</strong> {data.experience} years</p>
                    <p><strong>Organization:</strong> {data.organization}</p>
                    <p><strong>Location:</strong> {data.location}</p>
                    <p><strong>Availability:</strong> {data.availability}</p>
                    <p><strong>Session Fee:</strong> ₹{data.sessionFee}</p>
                </div>

                <div className="profile-section">
                    <h4>Skills</h4>
                    <p>{data.skills}</p>
                </div>

                <div className="profile-section">
                    <h4>Education</h4>
                    <p>{data.education}</p>
                </div>

                <div className="profile-section">
                    <h4>About</h4>
                    <p>{data.bio}</p>
                </div>

                <a href={data.linkedin} target="_blank" className="profile-link">
                    View LinkedIn Profile
                </a>

                <button className="book-btn">Book Session</button>

            </div>
            <Footer/>
        </>
    );
};

export default Profile;