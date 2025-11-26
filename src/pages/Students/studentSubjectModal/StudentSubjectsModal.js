
import React, { useState } from "react";
import { assignSubjectsToStudent } from "../../../services/studentsApi";

import styles from "./StudentSubjectsModal.module.css";

const StudentSubjectsModal = ({ isOpen, student, onClose, onAssigned }) => {
  const [subjectIdsInput, setSubjectIdsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen || !student) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

 
    const ids = subjectIdsInput
      .split(",")
      .map((x) => x.trim())
      .filter(Boolean)
      .map((x) => Number(x))
      .filter((x) => !Number.isNaN(x));

    if (ids.length === 0) {
      setError("Ən azı bir fənn ID-si daxil edin.");
      return;
    }

    try {
      setSaving(true);
      await assignSubjectsToStudent(student.studentNumber, ids);
      if (onAssigned) {
        await onAssigned();
      }
      onClose();
      setSubjectIdsInput("");
    } catch (err) {
      console.error("ASSIGN SUBJECTS ERROR:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Fənlər təyin edilərkən xəta baş verdi";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.title}>
          Tələbəyə fənn təyin et: {student.firstName} {student.lastName}
        </h3>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Fənn ID-ləri (vergüllə ayır):
            <input
              type="text"
              value={subjectIdsInput}
              onChange={(e) => setSubjectIdsInput(e.target.value)}
              placeholder="Məs: 1, 2, 5"
              className={styles.input}
            />
          </label>

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
            <button type="submit" className={styles.primaryBtn} disabled={saving}>
              {saving ? "Yüklənir..." : "Yadda saxla"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default StudentSubjectsModal;
