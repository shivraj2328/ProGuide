import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/pages/Dashboard.css";

const StudentDashboard = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        if (!user) return;

        fetch(`http://localhost:5000/student-appointments/${user.id}`)
            .then(res => res.json())
            .then(data => setAppointments(data))
            .catch(err => console.log(err));
    }, []);

    if (!user) return <h2>Please login first</h2>;

    if (user.role !== "student") {
        return <h2>Access denied</h2>;
    }

    return (
        <>
            <Navbar />

            <div className="dashboard-container">
                <h2 className="dashboard-title">My Appointments</h2>

                {appointments.length === 0 ? (
                    <p className="no-data">No appointments yet</p>
                ) : (
                    appointments.map((item) => (
                        <div key={item.id} className="dashboard-card">
                            <p><strong>Date:</strong> {item.date}</p>

                            <p>
                                <strong>Status:</strong>{" "}
                                <span className={`status-${item.status}`}>
                                    {item.status}
                                </span>
                            </p>

                            {item.status === "pending" && (
                                <p className="status-pending">Waiting for approval</p>
                            )}

                            {item.status === "accepted" && (
                                <p>
                                    <strong>Contact Professional:</strong>{" "}
                                    {item.professional_email}
                                </p>
                            )}

                            {item.status === "rejected" && (
                                <p className="status-rejected">Request Rejected</p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </>
    );
};

export default StudentDashboard;