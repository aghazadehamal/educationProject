import React from "react";
import "./AboutAs.css";



const DashboardIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="#3B82F6">
    <path d="M3 3h8v8H3V3zm10 0h8v5h-8V3zM3 13h5v8H3v-8zm7 0h11v8H10v-8z" />
  </svg>
);


const UsersIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="#3B82F6">
    <path d="M16 11c1.66 0 3-1.34 3-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 3-1.34 3-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5C15 14.17 10.33 13 8 13zm8 0c-.29 0-.62.02-.97.05A4.97 4.97 0 0 1 18 17.5V19h6v-2.5c0-2.33-4.67-3.5-8-3.5z"/>
  </svg>
);

const DocumentIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="#3B82F6">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm1 18H7v-2h8v2zm0-4H7v-2h8v2zm-3-7V3.5L18.5 9H12z"/>
  </svg>
);

const GlobeIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="#3B82F6">
    <path d="M12 2a10 10 0 1 0 10 10A10.01 10.01 0 0 0 12 2zm7.93 8h-2.95A15.86 15.86 0 0 0 15 4.07 8.06 8.06 0 0 1 19.93 10zM12 4c.78 0 2.36 1.86 2.9 6h-5.8C9.64 5.86 11.22 4 12 4zM4.07 10A8.06 8.06 0 0 1 9 4.07 15.86 15.86 0 0 0 6.02 10H4.07zM4.07 14h1.95A15.86 15.86 0 0 0 9 19.93 8.06 8.06 0 0 1 4.07 14zm7.93 6c-.78 0-2.36-1.86-2.9-6h5.8c-.54 4.14-2.12 6-2.9 6zm3.93-1.07A15.86 15.86 0 0 0 17.98 14h2.95a8.06 8.06 0 0 1-4.93 4.93z"/>
  </svg>
);


const AboutAs = () => {
  return (
    <div style={{ backgroundColor: "#1F203F" }}>
      <div id="courses" className="learn-about-content">
        <div className="about-instructor">
          <img
            className="aboutphoto"
            src="/education2.webp"
            alt="Platforma haqqında şəkil"
          />
        </div>

        <div className="learn-about-two">
          <div className="learn-about-three">
            <p
              style={{
                color: "rgba(59, 130, 246, 1)",
                marginBottom: "7px",
                marginTop: "5px",
              }}
            >
              Platforma haqqında
            </p>

            <span style={{ color: "white" }}>
              Biz{" "}
              <span style={{ color: "rgba(59, 130, 246, 1)" }}>kurs sahibləri</span> üçün
              yaradılmış{" "}
              <span style={{ color: "rgba(59, 130, 246, 1)" }}>online təhsil platformasıyıq</span>.
              Burada öz kurslarını, tələbələrini və müəllimlərini bir paneldən idarə edə bilərsən.
            </span>

            <p style={{ color: "white", marginTop: "20px" }}>
              Qeydiyyatdan keçdikdən sonra kurslarını yarada, qruplar təyin edə,
              müəllim və tələbə siyahılarını idarə edə, dərs mövzularını, imtahanları
              və nəticələri izləyə bilərsən.
            </p>
          </div>

          <div className="learn-about-info">
            
            <InfoItem Icon={<DashboardIcon />} text="Asan kurs idarəetməsi" />

            <InfoItem Icon={<UsersIcon />} text="Tələbə və müəllim paneli" />

            <InfoItem Icon={<DocumentIcon />} text="Mövzu və imtahan planlaması" />

            <InfoItem Icon={<GlobeIcon />} text="Tam online və çevik istifadə" />

          </div>
        </div>
      </div>

      <div className="about-instructorResponsiv">
        <img
            className="aboutphoto"
            src="/education2.webp"
            alt="Platforma haqqında şəkil"
          />
      </div>
    </div>
  );
};

const InfoItem = ({ Icon, text }) => {
  return (
    <div className="about-item">
      {Icon}
      <div className="containerİnfoİtem">
        <p style={{ color: "white" }}>{text}</p>
      </div>
    </div>
  );
};

export default AboutAs;
