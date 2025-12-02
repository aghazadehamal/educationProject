import React, { useState, useEffect } from "react";
import { createQuestion, updateQuestion } from "../../../services/questionsApi";
import styles from "./QuestionFormModal.module.css";
import { toast } from "react-toastify";

const defaultOptions = [
  { id: null, optionText: "", correct: true },
  { id: null, optionText: "", correct: false },
  { id: null, optionText: "", correct: false },
  { id: null, optionText: "", correct: false },
];

const QuestionFormModal = ({
  isOpen,
  onClose,
  examBaseId,
  onSuccess,
  mode = "create",
  initialQuestion = null,
}) => {
  const [text, setText] = useState("");
  const [points, setPoints] = useState(1);
  const [options, setOptions] = useState(defaultOptions);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && mode === "edit" && initialQuestion) {
      setText(initialQuestion.text || "");
      setPoints(initialQuestion.points || 1);

      if (initialQuestion.options && initialQuestion.options.length > 0) {
        const mapped = initialQuestion.options.map((o) => ({
          id: o.id ?? null,
          optionText: o.optionText || "",
          correct: !!o.correct,
        }));
        setOptions(mapped);
        const idx = mapped.findIndex((o) => o.correct);
        setCorrectIndex(idx === -1 ? 0 : idx);
      } else {
        setOptions(defaultOptions);
        setCorrectIndex(0);
      }

      setFile(null);
      setError("");
    }

    if (isOpen && mode === "create") {
      setText("");
      setPoints(1);
      setOptions(defaultOptions);
      setCorrectIndex(0);
      setFile(null);
      setError("");
    }
  }, [isOpen, mode, initialQuestion]);

  if (!isOpen) {
    return null;
  }

  const handleOptionChange = (index, value) => {
    const updated = [...options];
    updated[index] = { ...updated[index], optionText: value };
    setOptions(updated);
  };

  const handleCorrectChange = (index) => {
    setCorrectIndex(index);
    const updated = options.map((o, i) => ({ ...o, correct: i === index }));
    setOptions(updated);
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    setFile(selected || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedText = text.trim();
    if (!trimmedText) {
      setError("Sual mətni boş ola bilməz.");
      return;
    }

    const cleanedOptions = options
      .map((o, index) => ({
        id: o.id ?? null,
        optionText: o.optionText.trim(),
        correct: index === correctIndex,
      }))
      .filter((o) => o.optionText !== "");

    if (!cleanedOptions.length) {
      setError("Ən azı bir cavab variantı olmalıdır.");
      return;
    }

    if (correctIndex < 0 || correctIndex >= options.length) {
      setError("Düzgün cavab seçin.");
      return;
    }

    if (!options[correctIndex].optionText.trim()) {
      setError("Düzgün cavab üçün yazılmış variant olmalıdır.");
      return;
    }

    const payload = {
      text: trimmedText,
      points: Number(points) || 1,
      options: cleanedOptions,
    };

    if (mode === "edit" && initialQuestion?.id) {
      payload.id = initialQuestion.id;
    }

    try {
      setLoading(true);
      if (mode === "edit") {
        await updateQuestion(examBaseId, payload, file);
        toast.success("Sual uğurla yeniləndi");
      } else {
        await createQuestion(examBaseId, payload, file);
        toast.success("Sual uğurla yaradıldı");
      }
      if (onSuccess) {
        onSuccess();
      }
      onClose();
    } catch (e) {
      setError("Əməliyyatı yerinə yetirmək mümkün olmadı.");
      toast.error("Əməliyyatı yerinə yetirmək mümkün olmadı.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h3 className={styles.title}>
          {mode === "edit" ? "Sualı redaktə et" : "Yeni sual əlavə et"}
        </h3>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Sual mətni</label>
            <textarea
              className={styles.textarea}
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Bal</label>
            <input
              type="number"
              className={styles.input}
              value={points}
              min={1}
              onChange={(e) => setPoints(e.target.value)}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Şəkil (optional)</label>
            <input
              type="file"
              accept="image/*"
              className={styles.input}
              onChange={handleFileChange}
            />
          </div>

          <div className={styles.optionsGroup}>
            <div className={styles.optionsHeader}>
              <span>Cavab variantları</span>
              <span>Düzgün?</span>
            </div>

            {options.map((option, index) => (
              <div key={index} className={styles.optionRow}>
                <input
                  type="text"
                  className={styles.input}
                  value={option.optionText}
                  onChange={(e) =>
                    handleOptionChange(index, e.target.value)
                  }
                  placeholder={`Variant ${index + 1}`}
                />
                <input
                  type="radio"
                  name="correctOption"
                  checked={correctIndex === index}
                  onChange={() => handleCorrectChange(index)}
                />
              </div>
            ))}
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              className={styles.secondaryBtn}
              onClick={onClose}
              disabled={loading}
            >
              Ləğv et
            </button>
            <button
              type="submit"
              className={styles.primaryBtn}
              disabled={loading}
            >
              {loading
                ? "Yüklənir..."
                : mode === "edit"
                ? "Yenilə"
                : "Yarat"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuestionFormModal;
