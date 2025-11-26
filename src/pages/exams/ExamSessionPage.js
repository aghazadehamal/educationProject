import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/pageheader/PageHeader";
import { FiClock, FiCheckCircle, FiArrowLeft } from "react-icons/fi";
import {
  startExamSession,
  autosaveExamSession,
  submitExamSession,
} from "../../services/examSessionsApi";
import styles from "./ExamSessionPage.module.css";

const ExamSessionPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const numericExamId = Number(examId);

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [examInfo, setExamInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  const loadExamSession = useCallback(async () => {
    if (Number.isNaN(numericExamId)) return;

    setLoading(true);
    setError("");

    try {
      const deviceType = window.innerWidth < 768 ? "MOBILE" : "DESKTOP";
      const payload = {
        examId: numericExamId,
        ipAddress: "",
        userAgent: navigator.userAgent,
        deviceType,
      };

      const data = await startExamSession(payload);
      setExamInfo({
        attemptId: data.attemptId,
        examId: data.examId,
        examTitle: data.examTitle,
        durationSeconds: data.durationSeconds,
        startedAt: data.startedAt,
        scheduledEndTime: data.scheduledEndTime,
      });
      setQuestions(data.questions || []);
      setRemainingSeconds(data.remainingSeconds || data.durationSeconds || 0);
    } catch (e) {
      setError("İmtahanı başlatmaq mümkün olmadı.");
    } finally {
      setLoading(false);
    }
  }, [numericExamId]);

  useEffect(() => {
    loadExamSession();
  }, [loadExamSession]);

  useEffect(() => {
    if (!remainingSeconds || remainingSeconds <= 0) return;

    const intervalId = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          window.clearInterval(intervalId);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [remainingSeconds]);

  useEffect(() => {
    if (!examInfo || !examInfo.examId) return;
    if (!questions.length) return;

    const intervalId = window.setInterval(async () => {
      const studentId = null;

      const preparedAnswers = Object.entries(answers).map(
        ([questionId, value]) => {
          return {
            questionId: Number(questionId),
            selectedOptionIds: value.selectedOptionIds || [],
            textAnswer: value.textAnswer || null,
            booleanAnswer:
              typeof value.booleanAnswer === "boolean"
                ? value.booleanAnswer
                : null,
          };
        }
      );

      const payload = {
        examId: examInfo.examId,
        studentId,
        answers: preparedAnswers,
        remainingSeconds,
      };

      try {
        await autosaveExamSession(payload);
      } catch (e) {}
    }, 30000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [examInfo, answers, remainingSeconds, questions.length]);

  const handleOptionChange = (questionId, optionId, multiple) => {
    setAnswers((prev) => {
      const existing = prev[questionId] || {
        selectedOptionIds: [],
        textAnswer: "",
        booleanAnswer: null,
      };

      let updatedSelected = [];

      if (multiple) {
        const exists = existing.selectedOptionIds.includes(optionId);
        if (exists) {
          updatedSelected = existing.selectedOptionIds.filter(
            (id) => id !== optionId
          );
        } else {
          updatedSelected = [...existing.selectedOptionIds, optionId];
        }
      } else {
        updatedSelected = [optionId];
      }

      return {
        ...prev,
        [questionId]: {
          ...existing,
          selectedOptionIds: updatedSelected,
        },
      };
    });
  };

  const handleSubmit = async () => {
    if (!examInfo || !examInfo.examId) return;

    const confirmSubmit = window.confirm(
      "İmtahanı bitirmək istədiyinizə əminsiniz?"
    );
    if (!confirmSubmit) return;

    setSubmitting(true);
    setError("");

    const studentId = null;

    const preparedAnswers = Object.entries(answers).map(
      ([questionId, value]) => {
        return {
          questionId: Number(questionId),
          selectedOptionIds: value.selectedOptionIds || [],
        };
      }
    );

    const elapsedSeconds = examInfo.durationSeconds
      ? examInfo.durationSeconds - remainingSeconds
      : null;

    const payload = {
      examId: examInfo.examId,
      studentId,
      answers: preparedAnswers,
      elapsedSeconds: elapsedSeconds || 0,
    };

    try {
      await submitExamSession(payload);
      alert("İmtahan uğurla təslim olundu.");
      navigate("/exams/my");
    } catch (e) {
      setError("İmtahanı təslim edərkən xəta baş verdi.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (totalSeconds) => {
    if (!totalSeconds || totalSeconds < 0) return "00:00";
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const m = String(minutes).padStart(2, "0");
    const s = String(seconds).padStart(2, "0");
    return `${m}:${s}`;
  };

  return (
    <div className={styles.container}>
      <PageHeader
        title={examInfo?.examTitle || "İmtahan seansı"}
        icon={<FiClock />}
        description="İmtahan suallarını cavablayın və vaxtınıza nəzarət edin"
      />

      <div className={styles.topBar}>
        <button
          type="button"
          className={styles.backButton}
          onClick={() => navigate(-1)}
        >
          <FiArrowLeft />
          <span>Geri qayıt</span>
        </button>

        <div className={styles.timerBox}>
          <span>Qalan vaxt:</span>
          <span className={styles.timerValue}>
            {formatTime(remainingSeconds)}
          </span>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {loading ? (
        <div className={styles.infoText}>Yüklənir...</div>
      ) : questions.length === 0 ? (
        <div className={styles.infoText}>Bu imtahan üçün sual tapılmadı.</div>
      ) : (
        <div className={styles.questionsList}>
          {questions.map((q, index) => {
            const answer = answers[q.id] || {
              selectedOptionIds: [],
            };
            const isMultiple =
              q.type && q.type.toUpperCase() === "MULTIPLE_CHOICE_MULTIPLE";

            return (
              <div key={q.id} className={styles.questionCard}>
                <div className={styles.questionHeader}>
                  <span className={styles.questionIndex}>
                    Sual {index + 1}
                  </span>
                  <span className={styles.questionPoints}>
                    {q.points} bal
                  </span>
                </div>
                <div className={styles.questionText}>{q.text}</div>

                {q.attachmentUrl && (
                  <div className={styles.attachment}>
                    <a
                      href={q.attachmentUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Əlavəyə bax
                    </a>
                  </div>
                )}

                {q.options && q.options.length > 0 && (
                  <div className={styles.optionsList}>
                    {q.options.map((opt) => {
                      const checked = answer.selectedOptionIds.includes(
                        opt.id
                      );
                      return (
                        <label
                          key={opt.id}
                          className={styles.optionItem}
                        >
                          <input
                            type={isMultiple ? "checkbox" : "radio"}
                            name={`q-${q.id}`}
                            checked={checked}
                            onChange={() =>
                              handleOptionChange(q.id, opt.id, isMultiple)
                            }
                          />
                          <span>{opt.optionText}</span>
                        </label>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className={styles.actionsBar}>
        <button
          type="button"
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={submitting || loading || !questions.length}
        >
          <FiCheckCircle />
          <span>{submitting ? "Göndərilir..." : "İmtahanı bitir"}</span>
        </button>
      </div>
    </div>
  );
};

export default ExamSessionPage;
