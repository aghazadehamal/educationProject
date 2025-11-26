import React, { useEffect, useState, useCallback } from "react";

import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/pageheader/PageHeader";
import { FiArrowLeft, FiCalendar, FiBookOpen, FiUser } from "react-icons/fi";
import { getExamById } from "../../services/examsApi";
import styles from "./ExamDetailPage.module.css";

const ExamDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const examId = Number(id);

  const [exam, setExam] = useState(null);
  const [examBase, setExamBase] = useState(null);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

 const fetchExam = useCallback(async () => {
  setLoading(true);
  setError("");
  try {
    const data = await getExamById(examId);
    setExam(data.exam || null);
    setExamBase(data.examBase || null);
    setStudents(data.students || []);
  } catch (e) {
    setError("İmtahan məlumatlarını yükləmək mümkün olmadı.");
  } finally {
    setLoading(false);
  }
}, [examId]);

useEffect(() => {
  if (!Number.isNaN(examId)) {
    fetchExam();
  }
}, [examId, fetchExam]);



  const renderStatusBadge = (status) => {
    if (!status) return "-";
    const normalized = status.toUpperCase();
    const className =
      normalized === "ACTIVE"
        ? styles.statusActive
        : normalized === "CANCELLED"
        ? styles.statusCancelled
        : styles.statusDefault;
    return <span className={className}>{normalized}</span>;
  };

  return (
    <div className={styles.container}>
      <PageHeader
        title={exam?.examName || "İmtahan detalları"}
        icon={<FiCalendar />}
        description="İmtahan, şablon və tələbə siyahısının detalları"
      />

      <button className={styles.backButton} onClick={() => navigate(-1)}>
        <FiArrowLeft />
        <span>Geri qayıt</span>
      </button>

      {loading ? (
        <div className={styles.infoText}>Yüklənir...</div>
      ) : error ? (
        <div className={styles.error}>{error}</div>
      ) : !exam ? (
        <div className={styles.infoText}>İmtahan tapılmadı.</div>
      ) : (
        <>
          <div className={styles.infoGrid}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <FiCalendar />
                <h2 className={styles.cardTitle}>İmtahan məlumatları</h2>
              </div>
              <div className={styles.cardRow}>
                <span>İD</span>
                <span>{exam.id}</span>
              </div>
              <div className={styles.cardRow}>
                <span>Adı</span>
                <span>{exam.examName}</span>
              </div>
              <div className={styles.cardRow}>
                <span>Başlama vaxtı</span>
                <span>{exam.scheduledStartTime}</span>
              </div>
              <div className={styles.cardRow}>
                <span>Bitmə vaxtı</span>
                <span>{exam.scheduledEndTime}</span>
              </div>
              <div className={styles.cardRow}>
                <span>Status</span>
                <span>{renderStatusBadge(exam.status)}</span>
              </div>
              <div className={styles.cardRow}>
                <span>Yaradıb</span>
                <span>{exam.createdBy || "-"}</span>
              </div>
              <div className={styles.cardRow}>
                <span>Qeyd</span>
                <span>{exam.note || "-"}</span>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <FiBookOpen />
                <h2 className={styles.cardTitle}>İmtahan şablonu</h2>
              </div>
              {examBase ? (
                <>
                  <div className={styles.cardRow}>
                    <span>İD</span>
                    <span>{examBase.id}</span>
                  </div>
                  <div className={styles.cardRow}>
                    <span>Başlıq</span>
                    <span>{examBase.title}</span>
                  </div>
                  <div className={styles.cardRow}>
                    <span>Müddət</span>
                    <span>
                      {examBase.durationMinutes} dəqiqə
                    </span>
                  </div>
                  <div className={styles.cardRow}>
                    <span>Fənn</span>
                    <span>{examBase.subjectTitle}</span>
                  </div>
                </>
              ) : (
                <div className={styles.infoTextSmall}>
                  Şablon məlumatı tapılmadı.
                </div>
              )}
            </div>
          </div>

          <div className={styles.studentsCard}>
            <div className={styles.cardHeader}>
              <FiUser />
              <h2 className={styles.cardTitle}>
                Tələbələr ({students.length})
              </h2>
            </div>

            {students.length === 0 ? (
              <div className={styles.infoText}>Bu imtahana tələbə təyin olunmayıb.</div>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Tələbə nömrəsi</th>
                      <th>Ad</th>
                      <th>Soyad</th>
                      <th>Email</th>
                      <th>Telefon</th>
                      <th>Ünvan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((s) => (
                      <tr key={s.studentNumber}>
                        <td>{s.studentNumber}</td>
                        <td>{s.firstName}</td>
                        <td>{s.lastName}</td>
                        <td>{s.email}</td>
                        <td>{s.phone || "-"}</td>
                        <td>{s.address || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ExamDetailPage;
