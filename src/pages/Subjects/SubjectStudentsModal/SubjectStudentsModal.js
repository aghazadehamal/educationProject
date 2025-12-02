import React, { useEffect, useState } from "react";
import { getStudents } from "../../../services/studentsApi";
import { assignStudentsToSubject } from "../../../services/subjectsApi";
import styles from "./SubjectStudentsModal.module.css";

const SubjectStudentsModal = ({ isOpen, subject, onClose, onAssigned }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudentNumbers, setSelectedStudentNumbers] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setStudents([]);
      setSelectedStudentNumbers([]);
      setError("");
      return;
    }

    const fetchStudents = async () => {
      try {
        setLoadingStudents(true);
        const data = await getStudents({ pageNo: 0, pageSize: 1000 });
        const content = data.content || data || [];
        setStudents(content);
      } catch (err) {
        const msg =
          err?.response?.data?.message ||
          err?.response?.data?.error ||
          err.message ||
          "Tələbələr yüklənə bilmədi.";
        setError(msg);
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchStudents();
  }, [isOpen]);

  if (!isOpen || !subject) return null;

  const toggleStudent = (studentNumber) => {
    setSelectedStudentNumbers((prev) =>
      prev.includes(studentNumber)
        ? prev.filter((n) => n !== studentNumber)
        : [...prev, studentNumber]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (selectedStudentNumbers.length === 0) {
      setError("Ən azı bir tələbə seçilməlidir.");
      return;
    }

    try {
      setSaving(true);
      await assignStudentsToSubject(subject.id, selectedStudentNumbers);
      if (onAssigned) await onAssigned();
      onClose();
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Tələbələr təyin edilərkən xəta baş verdi";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            Tələbə təyin et: {subject.name || subject.title}
          </h3>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Bağla"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>Tələbə seç</label>

          <div className={styles.studentsBox}>
            {loadingStudents && (
              <p className={styles.infoText}>Tələbələr yüklənir...</p>
            )}

            {!loadingStudents && students.length === 0 && (
              <p className={styles.infoText}>Heç bir tələbə tapılmadı.</p>
            )}

            {!loadingStudents &&
              students.length > 0 &&
              students.map((st) => (
                <label
                  key={st.studentNumber}
                  className={styles.checkboxRow}
                >
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={selectedStudentNumbers.includes(st.studentNumber)}
                    onChange={() => toggleStudent(st.studentNumber)}
                    disabled={saving}
                  />
                  <span className={styles.studentName}>
                    {st.firstName} {st.lastName} — {st.studentNumber}
                  </span>
                </label>
              ))}
          </div>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.footer}>
            <button
              type="button"
              onClick={onClose}
              className={styles.secondaryBtn}
              disabled={saving}
            >
              Bağla
            </button>

            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={saving}
            >
              {saving ? "Yüklənir..." : "Təyin et"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubjectStudentsModal;
