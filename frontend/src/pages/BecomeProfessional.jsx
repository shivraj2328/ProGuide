import { useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/pages/becomeProfessional.css"
const BecomeProfessional = () => {
    const [formData, setFormData] = useState({
        name: "",
        title: "",
        industry: "",
        experience: "",
        organization: "",
        bio: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);

        // reset form
        setFormData({
            name: "",
            title: "",
            industry: "",
            experience: "",
            organization: "",
            bio: "",
        });
    };

    return (
        <>
            <div>
                <Navbar />
            </div>
            <div className="become-container">
                <h1>Share Your Experience. Guide the Future.</h1>
                <p>
                    Join ProGuide as a verified professional and help students make informed career decisions.
                </p>

                <form className="professional-form" onSubmit={handleSubmit}>

                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="title"
                        placeholder="Professional Title (e.g., Cardiologist, Advocate)"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />

                    <select
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Industry</option>
                        <option value="Technology">Technology</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Finance">Finance</option>
                        <option value="Law">Law</option>
                        <option value="Education">Education</option>
                        <option value="Business">Business</option>
                        <option value="Government">Government</option>
                        <option value="Other">Other</option>
                    </select>

                    <input
                        type="number"
                        name="experience"
                        placeholder="Years of Experience"
                        value={formData.experience}
                        onChange={handleChange}
                        required
                    />

                    <input
                        type="text"
                        name="organization"
                        placeholder="Current Organization"
                        value={formData.organization}
                        onChange={handleChange}
                        required
                    />

                    <textarea
                        name="bio"
                        placeholder="Short Bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="4"
                        required
                    />

                    <button type="submit">Submit Profile</button>

                </form>
            </div>
        </>
    );
};

export default BecomeProfessional;