
import React from "react";
import styles from "./StudentDetailModal.module.css";


const StudentDetailModal = ({ isOpen, data, onClose }) => {
  if (!isOpen || !data) return null;

  const { student, subjectBases } = data;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>Tələbə məlumatı</h3>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className={styles.body}>
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Şəxsi məlumatlar</h4>
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
          </div>

          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Fənlər</h4>
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
              <p className={styles.emptyText}>
                Bu tələbə üçün fənn tapılmadı.
              </p>
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <button type="button" className={styles.closeFooterBtn} onClick={onClose}>
            Bağla
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentDetailModal;
