import React from "react";
import "../styles/components/card.css";
import { useNavigate } from "react-router-dom";


const ProfessionalCard = ({ data }) => {
  const navigate = useNavigate();
  return (
    <div
      className="card"
      onClick={() => navigate(`/profile/${data.id}`)} 
      style={{ cursor: "pointer" }}>
      <h3>{data.name}</h3>
      <p className="title">{data.title}</p>
      <p>{data.industry} | {data.experience} yrs</p>
      <p>{data.organization}</p>
      <p className="bio">{data.bio}</p>
    </div>
  );
};

export default ProfessionalCard;