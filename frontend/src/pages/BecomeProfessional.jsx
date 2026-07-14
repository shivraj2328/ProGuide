import { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/pages/becomeProfessional.css";
import Footer from "../components/Footer";

const BecomeProfessional = () => {
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        title: "",
        industry: "",
        experience: "",
        organization: "",
        bio: "",
        location: "",
        skills: "",
        education: "",
        linkedin: "",
        email: "",
        availability: "",
        sessionFee: ""
    });

    const industries = [
        "Technology",
        "Finance",
        "Healthcare",
        "Education",
        "Marketing",
        "Design",
        "Business",
        "Other"
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // ✅ Validation
        if (!formData.name.trim()) {
            alert("Name is required");
            return;
        }

        if (!formData.email.trim()) {
            alert("Email is required");
            return;
        }

        if (!formData.sessionFee) {
            alert("Session fee is required");
            return;
        }

        if (!formData.industry) {
            alert("Please select an industry");
            return;
        }

        try {
            setLoading(true); // 🔥 start loading

            const res = await fetch("http://localhost:5000/add-professional", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const result = await res.text();
            alert(result);

            // ✅ Reset FULL form
            setFormData({
                name: "",
                title: "",
                industry: "",
                experience: "",
                organization: "",
                bio: "",
                location: "",
                skills: "",
                education: "",
                linkedin: "",
                email: "",
                availability: "",
                sessionFee: ""
            });

        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false); // 🔥 stop loading
        }
    };

    return (
        <>
            <Navbar />

            <div className="become-container">
                <h1>Share Your Experience. Guide the Future.</h1>
                <p>
                    Join ProGuide as a verified professional and help students make informed career decisions.
                </p>

                <form className="professional-form" onSubmit={handleSubmit}>

                    <input
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                    />

                    <input
                        name="title"
                        placeholder="Job Title"
                        value={formData.title}
                        onChange={handleChange}
                    />

                    <select
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                    >
                        <option value="">Select Industry</option>
                        {industries.map((ind, index) => (
                            <option key={index} value={ind}>
                                {ind}
                            </option>
                        ))}
                    </select>

                    <input
                        name="experience"
                        placeholder="Experience (years)"
                        value={formData.experience}
                        onChange={handleChange}
                    />

                    <input
                        name="organization"
                        placeholder="Current Organization"
                        value={formData.organization}
                        onChange={handleChange}
                    />

                    
                    <textarea
                        name="bio"
                        placeholder="Write a short bio..."
                        value={formData.bio}
                        onChange={handleChange}
                        rows="4"
                    />

                    <input
                        name="location"
                        placeholder="Location"
                        value={formData.location}
                        onChange={handleChange}
                    />

                    <input
                        name="skills"
                        placeholder="Skills (comma separated)"
                        value={formData.skills}
                        onChange={handleChange}
                    />

                    <input
                        name="education"
                        placeholder="Education"
                        value={formData.education}
                        onChange={handleChange}
                    />

                    <input
                        name="linkedin"
                        placeholder="LinkedIn URL"
                        value={formData.linkedin}
                        onChange={handleChange}
                    />

                    <input
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />

                    <input
                        name="availability"
                        placeholder="Availability (e.g. Weekends)"
                        value={formData.availability}
                        onChange={handleChange}
                    />

                    <input
                        name="sessionFee"
                        placeholder="Session Fee (₹)"
                        value={formData.sessionFee}
                        onChange={handleChange}
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? "Submitting..." : "Submit Profile"}
                    </button>

                </form>
            </div>
            <Footer/>
        </>
    );
};

export default BecomeProfessional;