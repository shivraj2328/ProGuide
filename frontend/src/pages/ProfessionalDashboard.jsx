import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import "../styles/pages/Dashboard.css";

const ProfessionalDashboard = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [requests, setRequests] = useState([]);

    // fetch requests
    useEffect(() => {
        if (!user) return;

        fetch(`http://localhost:5000/professional-requests/${user.email}`)
            .then(res => res.json())
            .then(data => setRequests(data))
            .catch(err => console.log(err));
    }, []);

    // accept / reject
    const updateStatus = async (id, status) => {
        try {
            await fetch("http://localhost:5000/update-status", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id, status }),
            });

            // update UI instantly
            setRequests((prev) =>
                prev.map((req) =>
                    req.id === id ? { ...req, status } : req
                )
            );

        } catch (error) {
            console.log(error);
        }
    };

    if (!user) return <h2>Please login first</h2>;

    if (user.role !== "professional") {
        return <h2>Access denied</h2>;
    }

    return (
        <>
            <Navbar />

            <div className="dashboard-container">
                <h2 className="dashboard-title">Appointment Requests</h2>

                {requests.length === 0 ? (
                    <p className="no-data">No requests yet</p>
                ) : (
                    <>
                        {requests.map((req) => (
                            <div key={req.id} className="dashboard-card">

                                {/* BASIC INFO */}
                                <p><strong>Request ID:</strong> {req.id}</p>
                                <p><strong>Date:</strong> {req.date}</p>

                                <p>
                                    <strong>Status:</strong>{" "}
                                    <span className={`status-${req.status}`}>
                                        {req.status}
                                    </span>
                                </p>

                                {/* STUDENT INFO */}
                                <p><strong>Student ID:</strong> {req.student_id}</p>
                                <p><strong>Student Email:</strong> {req.student_email}</p>

                                {/* ACTIONS */}
                                {req.status === "pending" && (
                                    <>
                                        <button
                                            className="dashboard-btn accept-btn"
                                            onClick={() => updateStatus(req.id, "accepted")}
                                        >
                                            Accept
                                        </button>

                                        <button
                                            className="dashboard-btn reject-btn"
                                            onClick={() => updateStatus(req.id, "rejected")}
                                        >
                                            Reject
                                        </button>
                                    </>
                                )}

                                {/* VIEW DETAILS BUTTON */}
                                <button
                                    className="dashboard-btn"
                                    onClick={() => setSelectedRequest(req)}
                                >
                                    View Details
                                </button>

                                {/* AFTER ACCEPT */}
                                {req.status === "accepted" && (
                                    <p style={{ marginTop: "10px", color: "#10b981" }}>
                                        Contact student via email to proceed
                                    </p>
                                )}
                            </div>
                        ))}

                        {/* DETAILS PANEL (OUTSIDE MAP BUT INSIDE FRAGMENT) */}
                        {selectedRequest && (
                            <div className="dashboard-card" style={{ marginTop: "30px" }}>
                                <h3>Request Details</h3>

                                <p><strong>ID:</strong> {selectedRequest.id}</p>
                                <p><strong>Date:</strong> {selectedRequest.date}</p>
                                <p><strong>Status:</strong> {selectedRequest.status}</p>

                                <p><strong>Student Email:</strong> {selectedRequest.student_email}</p>
                                <p><strong>Professional Email:</strong> {selectedRequest.professional_email}</p>

                                <button
                                    className="dashboard-btn"
                                    onClick={() => setSelectedRequest(null)}
                                >
                                    Close
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

        </>
    );
};

export default ProfessionalDashboard;