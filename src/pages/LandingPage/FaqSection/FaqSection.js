import { useState } from "react";
import "./FaqSection.css";

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`uniqueFaqItem ${
        isOpen ? "uniqueOpen uniqueFaqItemOpen" : ""
      }`}
    >
      <div className="uniqueFaqQuestion" onClick={() => setIsOpen(!isOpen)}>
        {question}

        {isOpen ? (
          <img
            src={process.env.PUBLIC_URL + "/yuxari.svg"}
            alt="Yuxarı"
            className="uniqueFaqIcon"
          />
        ) : (
          <img
            src={process.env.PUBLIC_URL + "/asagi.svg"}
            alt="Aşağı"
            className="uniqueFaqIcon"
          />
        )}
      </div>
      {isOpen && <div className="uniqueFaqAnswer">{answer}</div>}
    </div>
  );
};

const FaqSection = () => {
  const [showContactInfo, setShowContactInfo] = useState(false);

  return (
    <div id="faq" className="uniqueFaqSection">
      <h1 className="spanFirst">FAQ</h1>

      <div style={{ marginTop: "40px" }}>
        <FAQItem
          question="Bu platforma nədir?"
          answer="Bu platforma kurs sahiblərinin öz kurslarını, tələbələrini, müəllimlərini, dərs mövzularını və imtahanlarını onlayn şəkildə idarə edə bildiyi təhsil idarəetmə sistemidir."
        />
        <FAQItem
          question="Kimlər platformadan istifadə edə bilər?"
          answer="Platformadan kurs mərkəzləri, təlim şirkətləri, müəllim komandaları və fərdi təlimçilər istifadə edə bilər. Bir sözlə, təlim təşkil edən hər kəs üçün uyğundur."
        />
        <FAQItem
          question="Platformanın qiyməti necədir?"
          answer="Platformaya giriş üçün aylıq və ya birdəfəlik paketlər təklif oluna bilər. Hazırkı kampaniya çərçivəsində daha sərfəli qiymətlərlə qeydiyyatdan keçə bilərsiniz."
        />
        <FAQItem
          question="Tələbə və müəllimləri necə əlavə edirəm?"
          answer="İdarəetmə panelindən yeni tələbə və müəllim yaratmaq, onları müəyyən kurs və qruplara təyin etmək mümkündür. Bütün istifadəçilər üçün ayrıca profil və çıxış imkanı olur."
        />
        <FAQItem
          question="Dərs mövzuları və imtahanları necə idarə olunur?"
          answer="Hər kurs üçün modul və mövzular yarada, dərs cədvəli tərtib edə, imtahanlar və qiymətləndirmə sistemi qura bilərsiniz. Nəticələri izləmək üçün hesabatlar da mövcuddur."
        />
        <FAQItem
          question="Platforma tam onlayn işləyir?"
          answer="Bəli, bütün idarəetmə prosesi onlayn həyata keçirilir. Siz yalnız internet bağlantısı ilə istənilən yerdən kurslarınızı və tələbələrinizi idarə edə bilərsiniz."
        />
      </div>

      <div className="uniqueFaqContact">
        <p>Sualınız qalıb?</p>
        <button
          onClick={() => setShowContactInfo(!showContactInfo)}
          style={{ marginTop: "10px" }}
        >
          Bizimlə əlaqə saxlayın
        </button>
        {showContactInfo && (
          <div className="uniqueFaqContactInfo">
            <p>Telefon: 099 766 00 42</p>
            <p>E-mail: aghazadehamal@gmail.com</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FaqSection;
