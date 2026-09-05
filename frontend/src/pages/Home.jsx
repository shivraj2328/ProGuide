import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
// import ProfessionalCard from "../components/ProfessionalCard";
import Hero from "../components/Hero";
import React from 'react'
import Footer from "../components/Footer";

const Home = () => {
    const [professionals, setProfessionals] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/professionals")
            .then(res => res.json())
            .then(data => setProfessionals(data))
            .catch(err => console.log("Error: ",err));
    }, []);

    return (
        <>
            <div>
                {/* <Navbar /> */}
                <Hero />
            </div >

            <Footer/>
        </>
    )
}

export default Home
