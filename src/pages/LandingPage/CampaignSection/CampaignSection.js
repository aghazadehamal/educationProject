import React, { useEffect, useState } from "react";
import "./CampaignSection.css";
import { Link } from "react-router-dom";

const CampaignSection = () => {
  const [targetDate, setTargetDate] = useState(null);

  useEffect(() => {
    const savedTargetDate = localStorage.getItem("targetDate");

    if (!savedTargetDate) {
      const newTargetDate = new Date("2024-08-06T00:00:00");
      localStorage.setItem("targetDate", newTargetDate);
      setTargetDate(newTargetDate);
    } else {
      setTargetDate(new Date(savedTargetDate));
    }
  }, []);

  if (!targetDate) {
    return <div>Loading...</div>;
  }

  return (
    <div className="uniqueCampaignSection">
      <p className="uniqueCampaignSectionp">
        Öz <span style={{ color: "rgba(59, 130, 246, 1)" }}>kursunu yarat</span> və tələbələrini onlayn idarə et
      </p>

      <p className="uniqueCampaignSectionpTwo">
        Platformaya qoşul və müəllimlərini, tələbələrini, qrupları və dərs mövzularını istədiyin vaxt idarə et. Yalnız bu həftəyə özəl endirimlə <span style={{ color: "rgba(59, 130, 246, 1)" }}>₼59</span> əvəzinə <span style={{ color: "rgba(59, 130, 246, 1)" }}>₼39</span> ödə və fürsəti qaçırma!
      </p>

      <div>
        <Link to="/register">
          <button className="uniqueCampaignButton">İndicə qeydiyyatdan keç</button>
        </Link>
      </div>
    </div>
  );
};

export default CampaignSection;
