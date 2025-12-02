import React from "react";
import "./Footer.css";

const Footer = () => {
  const scrollToSection = (event, sectionId) => {
    event.preventDefault();
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <footer className="footer">
      <nav className="footer-nav">
        <ul className="nav-list">
          <li>
            <a
              href="#why-us"
              className="customNavLink"
              onClick={(e) => scrollToSection(e, "why-us")}
            >
              Niyə bizim platforma?
            </a>
          </li>
          <li>
            <a
              href="#mentor"
              className="customNavLink"
              onClick={(e) => scrollToSection(e, "what")}
            >
              Platforma necə işləyir?
            </a>
          </li>
          <li>
            <a
              href="#courses"
              className="customNavLink"
              onClick={(e) => scrollToSection(e, "courses")}
            >
              Platforma haqqında
            </a>
          </li>
          <li>
            <a
              href="#what"
              className="customNavLink"
              onClick={(e) => scrollToSection(e, "what")}
            >
              Nələri idarə edə biləcəksiniz?
            </a>
          </li>
          <li>
            <a
              href="#faq"
              className="customNavLink"
              onClick={(e) => scrollToSection(e, "faq")}
            >
              FAQ
            </a>
          </li>
        </ul>
      </nav>

      <hr className="footer-divider" />

      <div className="footer-content">
        <p>
          Biz kurs sahiblərinin öz təlimlərini, tələbə və müəllimlərini, dərs
          mövzularını və imtahanlarını onlayn şəkildə idarə etməsinə imkan verən
          modern təhsil idarəetmə platformasıyıq.
        </p>
        <div className="social-media-icons">
          <a href="https://facebook.com" target={"_blank"} rel="noreferrer">
            <img
              src={process.env.PUBLIC_URL + "/Facebook.png"}
              alt="Facebook"
              className="socialIcon"
            />
          </a>
          <a href="https://instagram.com" target={"_blank"} rel="noreferrer">
            <img
              src={process.env.PUBLIC_URL + "/Instagram.png"}
              alt="Instagram"
              className="socialIcon"
            />
          </a>
          <a href="https://linkedin.com" target={"_blank"} rel="noreferrer">
            <img
              src={process.env.PUBLIC_URL + "/lnkdn.png"}
              alt="LinkedIn"
              className="socialIcon"
            />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
