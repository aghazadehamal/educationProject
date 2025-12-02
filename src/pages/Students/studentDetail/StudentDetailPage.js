import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/common/pageheader/PageHeader";
import { getStudentDetail } from "../../../services/studentsApi";
import styles from "./StudentDetailPage.module.css";
import { FiArrowLeft } from "react-icons/fi";

const StudentDetailPage = () => {
  const { studentNumber } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await getStudentDetail(studentNumber);
        setData(res);
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err.message ||
          "Tələbənin detalları yüklənərkən xəta baş verdi";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    if (studentNumber) {
      fetchDetail();
    }
  }, [studentNumber]);

  if (loading) {
    return (
      <div className={styles.container}>
        <PageHeader title="Tələbə məlumatı" />
        <p>Yüklənir...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <PageHeader title="Tələbə məlumatı" />
        <p className={styles.error}>{error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.container}>
        <PageHeader title="Tələbə məlumatı" />
        <p className={styles.empty}>Məlumat tapılmadı.</p>
      </div>
    );
  }

  const { student, subjectBases } = data;
  
   const goBack = () => {
    navigate("/students");
  };


  return (
    <div className={styles.container}>
      <PageHeader
        title="Tələbə məlumatı"
        description={`${student.firstName} ${student.lastName}`}
      />

      <div className={styles.topActions}>
         <button type="button" onClick={goBack} className={styles.backBtn}>
          <FiArrowLeft size={16} />
          <span>Geri</span>
        </button>
      </div>

      <div className={styles.content}>
        <section className={styles.card}>
          <h3 className={styles.sectionTitle}>Şəxsi məlumatlar</h3>
          <div className={styles.fieldGrid}>
            <div className={styles.field}>
              <span className={styles.label}>Tələbə №:</span>
              <span className={styles.value}>{student.studentNumber}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Ad:</span>
              <span className={styles.value}>{student.firstName}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Soyad:</span>
              <span className={styles.value}>{student.lastName}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Email:</span>
              <span className={styles.value}>{student.email}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Telefon:</span>
              <span className={styles.value}>{student.phone}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Ş/V nömrəsi:</span>
              <span className={styles.value}>{student.nationalId}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Doğum tarixi:</span>
              <span className={styles.value}>{student.birthDate}</span>
            </div>
            <div className={styles.field}>
              <span className={styles.label}>Ünvan:</span>
              <span className={styles.value}>{student.address}</span>
            </div>
          </div>
        </section>

        <section className={styles.card}>
          <h3 className={styles.sectionTitle}>Fənlər</h3>
          {subjectBases && subjectBases.length > 0 ? (
            <ul className={styles.subjectList}>
              {subjectBases.map((sb) => (
                <li key={sb.id} className={styles.subjectItem}>
                  <div className={styles.subjectHeader}>
                    <span className={styles.subjectName}>{sb.name}</span>
                    {!sb.active && (
                      <span className={styles.subjectBadge}>Aktiv deyil</span>
                    )}
                  </div>
                  {sb.description && (
                    <p className={styles.subjectDescription}>
                      {sb.description}
                    </p>
                  )}
                  {sb.topics && sb.topics.length > 0 && (
                    <p className={styles.subjectTopics}>
                      Mövzular: {sb.topics.join(", ")}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty}>Bu tələbə üçün fənn tapılmadı.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default StudentDetailPage;
