import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/pageheader/PageHeader";
import { FiCalendar, FiArrowRightCircle } from "react-icons/fi";
import { getMyExams } from "../../services/examsApi";
import styles from "./MyExamsPage.module.css";

const MyExamsPage = () => {
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchMyExams = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getMyExams();
      setExams(Array.isArray(data) ? data : []);
    } catch (e) {
      setError("İmtahanlarınızı yükləmək mümkün olmadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyExams();
  }, []);

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
        title="Mənim imtahanlarım"
        icon={<FiCalendar />}
        description="Cari istifadəçi üçün təyin olunmuş imtahanların siyahısı"
      />

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.tableWrapper}>
        {loading ? (
          <div className={styles.infoText}>Yüklənir...</div>
        ) : exams.length === 0 ? (
          <div className={styles.infoText}>Sizin üçün imtahan tapılmadı.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Adı</th>
                <th>Başlama</th>
                <th>Bitmə</th>
                <th>Status</th>
                <th>Qeyd</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam.id}>
                  <td>{exam.id}</td>
                  <td>{exam.examName}</td>
                  <td>{exam.scheduledStartTime}</td>
                  <td>{exam.scheduledEndTime}</td>
                  <td>{renderStatusBadge(exam.status)}</td>
                  <td>{exam.note || "-"}</td>
                 <td className={styles.actionsCell}>
  <button
    type="button"
    className={styles.iconButton}
    onClick={() => navigate(`/exams/${exam.id}`)}
  >
    <FiArrowRightCircle />
  </button>

  <button
    type="button"
    className={styles.primaryButton}
    onClick={() => navigate(`/exam-session/${exam.id}`)}
  >
    İmtahana başla
  </button>
</td>

                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MyExamsPage;
