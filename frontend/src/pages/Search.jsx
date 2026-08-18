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
    const [visibleCount, setVisibleCount] = useState(6);

    useEffect(() => {
        fetch("http://localhost:5000/professionals")
            .then(res => res.json())
            .then(data => {
                console.log("DATA:", data);

                // set the professionals data to professionals
                setProfessionals(data);

                //if data fetched successfully , setLoading=false to remove the text.
                setLoading(false);
            })
            .catch(err => console.log(err));
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
            (industry === "" || item.industry === industry)    //industry wise filter
        );
    });

    //LOADING STATE
    if (loading) {
        return <h2 style={{ textAlign: "center" }}>Loading...!</h2>;
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

                //view more button
                {visibleCount < filteredData.length && (
                    <button
                        className="view-more-btn"
                        onClick={() => setVisibleCount(prev => prev + 6)}
                    >
                        View More
                    </button>
                )}

            </div>
            <Footer />
        </>
    );
};

export default Search;