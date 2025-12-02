import React, { useState } from "react";
import styles from "./ExamFormModal.module.css";

const ExamFormModal = ({
  isOpen,
  mode,
  values,
  onChange,
  onClose,
  onSubmit,
  saving,
  error,
  examBases,
  examBasesLoading,
  examBaseStudents = [],
  examBaseStudentsLoading = false,
  onToggleStudent,
}) => {
  const [studentSearch, setStudentSearch] = useState("");

  if (!isOpen) return null;

  const isEdit = mode === "edit";
  const title = isEdit ? "İmtahanı redaktə et" : "Yeni imtahan yarat";

  const selectedNumbers = values.assignedStudentNumbers
    ? values.assignedStudentNumbers
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];

  const searchTerm = studentSearch.trim().toLowerCase();
  const filteredStudents =
    searchTerm.length === 0
      ? examBaseStudents
      : examBaseStudents.filter((student) => {
          const fullName = `${student.firstName || ""} ${student.lastName || ""}`
            .trim()
            .toLowerCase();
          const number = String(student.studentNumber || "");
          return (
            fullName.includes(searchTerm) ||
            number.includes(studentSearch.trim())
          );
        });

  return (
    <div className={styles.modalOverlay}>
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

        <form onSubmit={onSubmit} className={styles.modalForm}>
          {!isEdit && (
            <label className={styles.modalLabel}>
            İmtahan seç
              <select
                name="examBaseId"
                value={values.examBaseId}
                onChange={onChange}
                className={styles.modalInput}
                required
              >
                <option value="">
                  {examBasesLoading ? "Yüklənir..." : "İmtahan seçin"}
                </option>

                {examBases?.map((base) => (
                  <option key={base.id} value={base.id}>
                    {base.title}
                  </option>
                ))}
              </select>
            </label>
          )}

          <label className={styles.modalLabel}>
            Başlama tarixi/saatı
            <input
              type="datetime-local"
              name="scheduledStartTime"
              value={values.scheduledStartTime}
              onChange={onChange}
              className={styles.modalInput}
              required
            />
          </label>

          <label className={styles.modalLabel}>
            Bitmə tarixi/saatı
            <input
              type="datetime-local"
              name="scheduledEndTime"
              value={values.scheduledEndTime}
              onChange={onChange}
              className={styles.modalInput}
              required
            />
          </label>

          <label className={styles.modalLabel}>
            Qeyd
            <textarea
              name="note"
              value={values.note}
              onChange={onChange}
              className={styles.modalTextarea}
              rows={3}
              placeholder="İmtahanla bağlı əlavə qeyd"
            />
          </label>

          <label className={styles.modalLabel}>
            Tələbə nömrələri
          <input
  type="text"
  name="assignedStudentNumbers"
  value={values.assignedStudentNumbers}
  disabled
  className={styles.modalInput}
  placeholder="Seçilən tələbə nömrələri burada görünəcək"
/>

          </label>

          {!isEdit && values.examBaseId && (
            <div className={styles.modalStudentsBlock}>
              <div className={styles.modalStudentsHeader}>
                <span>Bu imtahan üçün tələbələr</span>
                <span className={styles.modalStudentsCount}>
                  {filteredStudents.length} nəfər
                </span>
              </div>

              <div className={styles.modalStudentsSearch}>
               <input
  type="text"
  value={studentSearch}
  onChange={(e) => setStudentSearch(e.target.value)}
  className={styles.studentSearchInput}
  placeholder="Ad, soyad və ya tələbə nömrəsinə görə axtar"
/>

              </div>

              {examBaseStudentsLoading ? (
                <div className={styles.infoText}>Tələbələr yüklənir...</div>
              ) : filteredStudents.length === 0 ? (
                <div className={styles.infoText}>
                  Axtarışa uyğun tələbə tapılmadı.
                </div>
              ) : (
                <div className={styles.studentsList}>
                  {filteredStudents.map((student) => (
                    <label
                      key={student.studentNumber}
                      className={styles.studentRow}
                    >
                      <input
                        type="checkbox"
                        checked={selectedNumbers.includes(
                          student.studentNumber
                        )}
                        onChange={() =>
                          onToggleStudent &&
                          onToggleStudent(student.studentNumber)
                        }
                      />
                      <span className={styles.studentText}>
                        {student.studentNumber} – {student.firstName}{" "}
                        {student.lastName}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.modalActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.secondaryBtn}
              disabled={saving}
            >
              Ləğv et
            </button>

            <button
              type="submit"
              disabled={saving}
              className={styles.primaryBtn}
            >
              {saving
                ? "Yadda saxlanılır..."
                : isEdit
                ? "Yadda saxla"
                : "Əlavə et"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExamFormModal;
