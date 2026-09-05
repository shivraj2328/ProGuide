import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import ProfessionalCard from "../components/ProfessionalCard";
import "../styles/pages/search.css";
import Footer from "../components/Footer";

const Search = () => {
    const [professionals, setProfessionals] = useState([]);
    const [search, setSearch] = useState("");
    const [industry, setIndustry] = useState("");
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);
    const [visibleCount, setVisibleCount] = useState(6);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoadError(null);
            try {
                const res = await fetch("http://localhost:5000/professionals");
                const text = await res.text();
                let data;
                try {
                    data = text ? JSON.parse(text) : [];
                } catch {
                    throw new Error(
                        res.ok
                            ? "Invalid response from server"
                            : text || `Server error (${res.status})`
                    );
                }
                if (!res.ok) {
                    throw new Error(
                        typeof data === "string" ? data : `Server error (${res.status})`
                    );
                }
                if (!cancelled) {
                    setProfessionals(Array.isArray(data) ? data : []);
                }
            } catch (err) {
                console.error(err);
                if (!cancelled) {
                    setLoadError(
                        err.message ||
                            "Could not load professionals. Is the backend running on port 5000?"
                    );
                    setProfessionals([]);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    // filter data.
    const filteredData = professionals.filter((item) => {
        const searchText = search.toLowerCase();

        const combinedText = `
        ${item.name}
        ${item.title}
        ${item.industry}
        ${item.organization}
        ${item.skills}
    `.toLowerCase();

        return (
            combinedText.includes(searchText) &&
            (industry === "" || item.industry === industry)
        );
    });

    if (loading) {
        return <h2 style={{ textAlign: "center" }}>Loading...!</h2>;
    }

    if (loadError) {
        return (
            <>
                {/* <Navbar /> */}
                <div className="search-container">
                    <h2 style={{ textAlign: "center", color: "#b91c1c" }}>
                        Could not load professionals
                    </h2>
                    <p style={{ textAlign: "center", maxWidth: 520, margin: "12px auto" }}>
                        {loadError}
                    </p>
                    <p style={{ textAlign: "center", color: "#6b7280", fontSize: "14px" }}>
                        Start the API with <code>npm run dev</code> in the <code>backend</code> folder
                        and fix MySQL connection if the server logs a database error.
                    </p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />

            <div className="search-container">
                <h1>Explore Professionals</h1>

                <div className="search-controls">
                    <input
                        type="text"
                        placeholder="Search professionals..."
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <select onChange={(e) => setIndustry(e.target.value)}>
                        <option value="">All Industries</option>
                        <option value="Technology">Technology</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Finance">Finance</option>
                        <option value="Law">Law</option>
                        <option value="Education">Education</option>
                        <option value="Business">Business</option>
                        <option value="Government">Government</option>
                    </select>
                </div>


                <div className="card-container">
                    {filteredData.length > 0 ? (
                        filteredData.slice(0, visibleCount).map((item) => (
                            <ProfessionalCard key={item.id} data={item} />
                        ))
                    ) : (
                        <p className="no-results">No results found</p>
                    )}
                </div>
            {visibleCount < filteredData.length && (
                <button
                    className="view-more-btn"
                    onClick={() => setVisibleCount(prev => prev + 6)}
                >
                    View More
                </button>
            )}
            
            </div>
            <Footer/>
        </>
    );
};

export default Search;