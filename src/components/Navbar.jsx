import React from "react";
import { useNavigate } from "react-router-dom";
import "./../styles/Navbar.css";

const Navbar = () => {

  const navigate = useNavigate()
 
  return (
    <nav>
      <h1>FitJourney</h1>
      <ul>
        <li><a href="#home" onClick={() => navigate("/")}>Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;