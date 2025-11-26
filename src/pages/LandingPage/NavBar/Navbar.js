import React from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";

function Navbar() {
  const scrollToSection = (event, sectionId) => {
    event.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <div className="customNavbar">
        <img className="logoNavBar" src="/logogradeus.png" alt="Novademy Logo" />

        <img className="favlogologo" src="/logogradeus.png" alt="logovariant" />

        <nav className="customNav">
          <a href="#courses" className="customNavLink" onClick={(e) => scrollToSection(e, "courses")}>
            Platforma haqqında
          </a>
          <a href="#why-us" className="customNavLink" onClick={(e) => scrollToSection(e, "why-us")}>
            Niyə bu platforma?
          </a>
          <a href="#courses" className="customNavLink" onClick={(e) => scrollToSection(e, "courses")}>
            Kurslar üçün imkanlar
          </a>
        </nav>
        <div className="customButtons">
          <Link to="/login">
            <button className="customBtn customLogin">Daxil ol</button>
          </Link>
          <Link to="/register">
            <button className="customBtn customRegister">Qeydiyyatdan keç</button>
          </Link>
          <Link style={{ display: "none" }} to="/loginFormAdmin">
            <img className="avatarAdmin" src={`${process.env.PUBLIC_URL}/Avatar.svg`} alt="Clock Icon" style={{ width: "43px", height: "38px", marginLeft: "5px" }} />
          </Link>
        </div>
      </div>
    </>
  );
}

export default Navbar;
