import React from "react";
import styles from "./ExamBaseFormModal.module.css";

const ExamBaseFormModal = ({
  isOpen,
  mode,
  values,
  onChange,
  onClose,
  onSubmit,
  saving,
  error,
  subjects = [],
  subjectsLoading = false,
}) => {
  if (!isOpen) return null;

  const title =
    mode === "create"
      ? "Yeni imtahan şablonu əlavə et"
      : "İmtahan şablonunu redaktə et";

  const isCreateMode = mode === "create";

  const parentSubjects = subjects.filter(
    (subject) => subject.parentId === null
  );

  const selectedSubject =
    parentSubjects.find(
      (subject) => String(subject.id) === String(values.subjectId)
    ) || null;

  const topics = selectedSubject?.topics || [];

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Bağla"
          >
            ×
          </button>
        </div>

        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Başlıq</label>
            <input
              type="text"
              name="title"
              value={values.title}
              onChange={onChange}
              className={styles.input}
              placeholder="İmtahan şablonunun adını daxil edin"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Müddət (dəqiqə)</label>
            <input
              type="number"
              name="durationMinutes"
              value={values.durationMinutes}
              onChange={onChange}
              className={styles.input}
              placeholder="Məsələn: 60"
              min={1}
            />
          </div>

          {isCreateMode && (
            <>
              <div className={styles.formGroup}>
                <label className={styles.label}>Fənn</label>
                <select
                  name="subjectId"
                  value={values.subjectId}
                  onChange={onChange}
                  className={styles.input}
                  disabled={subjectsLoading}
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#0f172a",
                  }}
                >
                  <option value="">
                    {subjectsLoading ? "Fənnlər yüklənir..." : "Fənn seçin"}
                  </option>
                  {parentSubjects.map((subject) => (
                    <option
                      key={subject.id}
                      value={subject.id}
                      style={{
                        backgroundColor: "#ffffff",
                        color: "#0f172a",
                      }}
                    >
                      {subject.name ||
                        subject.subjectTitle ||
                        subject.title ||
                        `ID: ${subject.id}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label className={styles.label}>Mövzu (topic)</label>
                <select
                  name="topicId"
                  value={values.topicId}
                  onChange={onChange}
                  className={styles.input}
                  disabled={subjectsLoading || !values.subjectId}
                  style={{
                    backgroundColor: "#ffffff",
                    color: "#0f172a",
                  }}
                >
                  <option value="">
                    {!values.subjectId
                      ? "Əvvəlcə fənn seçin"
                      : topics.length === 0
                      ? "Bu fənnin mövzusu yoxdur"
                      : "Mövzu seçin"}
                  </option>

                  {topics.map((topic) => (
                    <option
                      key={topic.id}
                      value={topic.id}
                      style={{
                        backgroundColor: "#ffffff",
                        color: "#0f172a",
                      }}
                    >
                      {topic.name ||
                        topic.subjectTitle ||
                        topic.title ||
                        `ID: ${topic.id}`}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.secondaryBtn}
            >
              Ləğv et
            </button>

            <button
              type="submit"
              disabled={
                saving ||
                (isCreateMode &&
                  (!values.topicId || values.topicId === ""))
              }
              className={styles.primaryBtn}
            >
              {saving
                ? "Yadda saxlanılır..."
                : isCreateMode
                ? "Əlavə et"
                : "Yadda saxla"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExamBaseFormModal;
