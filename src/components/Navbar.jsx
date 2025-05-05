import React from "react";
import "./../styles/Navbar.css";

const Navbar = () => {
  return (
    <nav>
      <h1>FitJourney</h1>
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  );
};

export default Navbar;