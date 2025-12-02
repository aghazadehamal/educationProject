import React, { useState, useEffect } from "react";
import { assignSubjectsToStudent } from "../../../services/studentsApi";
import { getSubjects } from "../../../services/subjectsApi";

import styles from "./StudentSubjectsModal.module.css";

const StudentSubjectsModal = ({ isOpen, student, onClose, onAssigned }) => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setSelectedSubjectId("");
      setSelectedTopics([]);
      setError("");
      return;
    }

    const fetchSubjects = async () => {
      try {
        setLoadingSubjects(true);
        const data = await getSubjects({ pageNo: 0, pageSize: 1000 });
        const content = data.content || data || [];
        setSubjects(content);
      } catch (err) {
        setError("Fənnlər yüklənə bilmədi.");
      } finally {
        setLoadingSubjects(false);
      }
    };

    fetchSubjects();
  }, [isOpen]);

  if (!isOpen || !student) return null;

  const parentSubjects = subjects.filter(
    (subject) => subject.parentId === null || subject.parentId === undefined
  );

  const selectedSubject =
    parentSubjects.find(
      (subject) => String(subject.id) === String(selectedSubjectId)
    ) || null;

  const directTopics = Array.isArray(selectedSubject?.topics)
    ? selectedSubject.topics
    : [];

  const childSubjectsAsTopics = subjects.filter(
    (subject) =>
      selectedSubject &&
      subject.parentId === selectedSubject.id &&
      (!subject.topics || subject.topics.length === 0)
  );

  const allTopicsMap = new Map();

  directTopics.forEach((topic) => {
    if (!allTopicsMap.has(topic.id)) {
      allTopicsMap.set(topic.id, {
        id: topic.id,
        name:
          topic.name ||
          topic.title ||
          topic.subjectTitle ||
          `ID: ${topic.id}`,
      });
    }
  });

  childSubjectsAsTopics.forEach((topic) => {
    if (!allTopicsMap.has(topic.id)) {
      allTopicsMap.set(topic.id, {
        id: topic.id,
        name:
          topic.name ||
          topic.title ||
          topic.subjectTitle ||
          `ID: ${topic.id}`,
      });
    }
  });

  const topics = Array.from(allTopicsMap.values());

  const handleSubjectChange = (e) => {
    setSelectedSubjectId(e.target.value);
    setSelectedTopics([]);
    setError("");
  };

  const handleTopicsChange = (e) => {
    const selected = Array.from(
      e.target.selectedOptions,
      (option) => Number(option.value)
    );
    setSelectedTopics(selected);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedSubjectId) {
      setError("Əvvəl fənn seçilməlidir.");
      return;
    }

    if (selectedTopics.length === 0) {
      setError("Ən azı bir mövzu (topic) seçilməlidir.");
      return;
    }

    try {
      setSaving(true);

      await assignSubjectsToStudent(student.studentNumber, selectedTopics);

      if (onAssigned) await onAssigned();
      onClose();
    } catch (err) {
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
        <div className={styles.header}>
          <h3 className={styles.title}>
            Tələbəyə fənn təyin et: {student.firstName} {student.lastName}
          </h3>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Bağla"
            disabled={saving}
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label className={styles.label}>
            Fənn seç
            <select
              className={styles.input}
              value={selectedSubjectId}
              onChange={handleSubjectChange}
              disabled={loadingSubjects || saving}
            >
              <option value="">
                {loadingSubjects ? "Fənnlər yüklənir..." : "Fənn seçin"}
              </option>
              {parentSubjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.name ||
                    subject.subjectTitle ||
                    subject.title ||
                    `ID: ${subject.id}`}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.label}>
            Mövzu (topic) seç
            <select
              multiple
              className={`${styles.input} ${styles.multipleInput}`}
              onChange={handleTopicsChange}
              disabled={
                loadingSubjects ||
                saving ||
                !selectedSubjectId ||
                topics.length === 0
              }
              size={6}
            >
              {!selectedSubjectId && (
                <option value="">Əvvəl fənn seçin</option>
              )}

              {selectedSubjectId && topics.length === 0 && (
                <option value="">Bu fənnin mövzusu yoxdur</option>
              )}

              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.name}
                </option>
              ))}
            </select>
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

export default StudentSubjectsModal;
