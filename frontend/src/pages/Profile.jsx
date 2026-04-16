import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/pages/Profile.css";
import Footer from "../components/Footer";
const Profile = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [date, setDate] = useState("");
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const user = JSON.parse(localStorage.getItem("user"));
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:5000/reviews/${id}`)
            .then(res => res.json())
            .then(data => setReviews(data));
    }, [id]);

    const submitReview = async () => {
        if (!rating) return alert("Please select rating");

        await fetch("http://localhost:5000/add-review", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                student_id: user.id,
                professional_id: id,
                rating,
                comment,
            }),
        });

        alert("Review submitted");
    };

    useEffect(() => {
        fetch(`http://localhost:5000/professionals/${id}`)
            .then(res => res.json())
            .then(data => setData(data));
    }, [id]);

    if (!data) return <h2>Loading...</h2>;

    const handleBooking = async () => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) {
            alert("Please login first");
            return;
        }

        if (user.role !== "student") {
            alert("Only students can book sessions");
            return;
        }

        if (!date) {
            alert("Please select a date");
            return;
        }

        try {
            const res = await fetch("http://localhost:5000/book", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    student_id: user.id,
                    professional_id: data.id,
                    date: date,
                    student_email: user.email,
                    professional_email: data.email || "pro@email.com"
                }),
            });

            const result = await res.text();
            alert(result);

        } catch (error) {
            console.log(error);
        }
    };

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
                <div className="booking-section">
                    <label className="date-label">Select Date</label>

                    <input
                        type="date"
                        className="date-input"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>

                <button className="book-btn" onClick={handleBooking}>
                    Book Session
                </button>
                {/*REVIEW SECTION START */}
                <div className="reviews-list">
                    <h3>Reviews</h3>

                    {reviews.length === 0 ? (
                        <p>No reviews yet</p>
                    ) : (
                        reviews.map((rev) => (
                            <div key={rev.id} className="review-card">
                                <p>Rating: {"⭐".repeat(rev.rating)}</p>
                                <p>{rev.comment}</p>
                            </div>
                        ))
                    )}
                </div>
                <div className="review-section">
                    <h3>Leave a Review</h3>

                    <select onChange={(e) => setRating(e.target.value)}>
                        <option value="">Select Rating</option>
                        <option value="5">⭐⭐⭐⭐⭐</option>
                        <option value="4">⭐⭐⭐⭐</option>
                        <option value="3">⭐⭐⭐</option>
                        <option value="2">⭐⭐</option>
                        <option value="1">⭐</option>
                    </select>

                    <textarea
                        placeholder="Write your review..."
                        onChange={(e) => setComment(e.target.value)}
                    ></textarea>

                    <button onClick={submitReview}>Submit Review</button>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default Profile;