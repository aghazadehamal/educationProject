import React from 'react';
import './WhyUsSection.css'; 

const FeatureCard = ({ Icon, title, description }) => {
  return (
    <div className="uniqueFeatureCard">
      <div className="uniqueIcon">{Icon}</div> 
      <span className="uniqueTitle">{title}</span>
      <p className="uniqueDescription">{description}</p>
    </div>
  );
};

const WhyUsSection = () => {
  return (
    <div id="why-us" className="uniqueWhyUsSection">
      <span style={{ fontSize: "40px", lineHeight: "60px", fontWeight: "700" }}>
        Niyə bizim platforma?
      </span>

      <div className="uniqueCardsContainer">
        <FeatureCard
          Icon={<img src={process.env.PUBLIC_URL + '/niyeThree.svg'} alt="Icon" />}
          title="Rahat idarəetmə"
          description="Kurs, tələbə, müəllim, qruplar və dərs mövzularını tək paneldən idarə et. Heç bir əlavə texniki biliyə ehtiyac yoxdur."
        />

        <FeatureCard
          Icon={<img src={process.env.PUBLIC_URL + '/niyeTwo.svg'} alt="Icon" />}
          title="Tam onlayn sistem"
          description="Əyani dərs otağına ehtiyac olmadan materiallarını, mövzuları və qiymətləndirməni onlayn şəkildə paylaşa və idarə edə bilərsən."
        />

        <FeatureCard
          Icon={<img src={process.env.PUBLIC_URL + '/niyeOne.svg'} alt="Icon" />}
          title="Münasib və elastik qiymət"
          description="Hər bir kurs sahibinin büdcəsinə uyğun sərfəli paketlər və xüsusi endirimlər."
        />
      </div>
    </div>
  );
};

export default WhyUsSection;
