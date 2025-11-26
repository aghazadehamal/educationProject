import React, { useState } from "react";
import "./CourseModulesSection.css";
import { Link } from "react-router-dom";

const Accordion = ({ moduleTitle, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const titleStyle = {
    fontSize: "20px",
    lineHeight: "30px",
    fontWeight: "700",
    color: isOpen ? "white" : "#1F203F",
  };

  return (
    <div className={`customAccordion ${isOpen ? "customOpen" : ""}`}>
      <div className="customAccordionHeader" onClick={() => setIsOpen(!isOpen)}>
        <span style={titleStyle}>{moduleTitle}</span>
        {isOpen ? <img src={process.env.PUBLIC_URL + "/yuxari.svg"} alt="Yuxarı" /> : <img src={process.env.PUBLIC_URL + "/asagi.svg"} alt="Aşağı" />}
      </div>
      {isOpen && <div className="customAccordionContent">{children}</div>}
    </div>
  );
};

const CourseModulesSection = () => {
  return (
    <div id="what" className="customCourseModulesSection">
      <span className="spanFirst">Platformada nələri idarə edə biləcəksiniz?</span>

      <div style={{ marginTop: "40px" }}>
        <Accordion moduleTitle="Kurs və qrup idarəetməsi">
          <p>Birdən çox kurs yarada, səviyyə və istiqamətlərə görə qruplar təşkil edə və hər bir kurs üçün ayrıca qruplar formalaşdıra bilərsiniz. Bütün struktur vahid idarəetmə paneli üzərindən nəzarət olunur ki, həm əyani, həm də online dərslərin planlanması rahat olsun.</p>
        </Accordion>

        <Accordion moduleTitle="Tələbə və müəllim paneli">
          <p>Tələbə və müəllimləri sistemə əlavə edə, onların hansı kurs və qruplara aid olduğunu təyin edə, əlaqə məlumatlarını və aktivliklərini izləyə bilərsiniz. Hər kəs öz şəxsi kabineti vasitəsilə dərslərə və materiallara çıxış əldə edir.</p>
        </Accordion>

        <Accordion moduleTitle="Mövzular və dərs cədvəli">
          <p>Hər kurs üçün dərs mövzuları, modul strukturu və dərs cədvəlini əvvəlcədən planlaya bilərsiniz. Mövzular üzrə materiallar, fayllar və qeydlər əlavə edərək həm tələbələr, həm də müəllimlər üçün aydın yol xəritəsi yaradırsınız.</p>
        </Accordion>

        <Accordion moduleTitle="İmtahanlar və qiymətləndirmə">
          <p>Fərqli tip imtahanlar (quiz, yazılı, praktiki və s.) yarada, nəticələri sistem üzərindən qeyd edə və tələbələrin ümumi performansını izləyə bilərsiniz. Hər tələbə üçün ayrıca nəticə tarixi formalaşır və qiymətləndirmə prosesiniz daha şəffaf olur.</p>
        </Accordion>

        <Accordion moduleTitle="Ödənişlər və hesabatlar">
          <p>Kurslar üzrə ödəniş statuslarını, aktiv qeydiyyatları və gəlir dinamikasını izləyə bilərsiniz. Bu, həm maliyyə nəzarətini asanlaşdırır, həm də yeni kampaniyalar və endirim strategiyaları qurmağınıza kömək edir.</p>
        </Accordion>
      </div>

      <div className="customRegisterButtonDiv">
        <Link style={{ textDecoration: "none" }} to="/register">
          <button className="customRegisterButton">Daha çoxu üçün qeydiyyatdan keçin</button>
        </Link>
      </div>
    </div>
  );
};

export default CourseModulesSection;
