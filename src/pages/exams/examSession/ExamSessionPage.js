import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/common/pageheader/PageHeader";
import { FiClock, FiCheckCircle, FiArrowLeft } from "react-icons/fi";
import ExamPhotoCapture from "./ExamPhotoCapture";
import {
  startExamSession,
  autosaveExamSession,
  submitExamSession,
  resumeExamSession,
} from "../../../services/examSessionsApi";
import { useAuth } from "../../../context/AuthContext";
import styles from "./ExamSessionPage.module.css";

const ExamSessionPage = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const numericExamId = Number(examId);

  const { user } = useAuth();
  const studentNumber = user?.studentNumber || null;

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [examInfo, setExamInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  const loadExamSession = useCallback(async () => {
    if (Number.isNaN(numericExamId)) return;

    setLoading(true);
    setError("");

    try {
      let data = null;

      try {
        const resumeData = await resumeExamSession(numericExamId);
        if (resumeData && resumeData.status && resumeData.status !== "COMPLETED") {
          data = resumeData;
        }
      } catch (e) {}

      if (!data) {
        const deviceType = window.innerWidth < 768 ? "MOBILE" : "DESKTOP";

        const payload = {
          examId: numericExamId,
          ipAddress: "127.0.0.1",
          userAgent: navigator.userAgent,
          deviceType,
        };

        data = await startExamSession(payload);
      }

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
      setCurrentIndex(0);

      const initialAnswers = {};

      if (data.answers) {
        Object.values(data.answers).forEach((a) => {
          if (!a || typeof a.questionId === "undefined") return;
          initialAnswers[a.questionId] = {
            selectedOptionIds: a.selectedOptionIds || [],
            textAnswer: a.textAnswer || "",
            booleanAnswer:
              typeof a.booleanAnswer === "boolean" ? a.booleanAnswer : null,
          };
        });
      }

      setAnswers(initialAnswers);
    } catch (e) {
      const msg =
        e?.response?.data?.message || "İmtahanı başlatmaq mümkün olmadı.";
      setError(msg);
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
    if (!studentNumber) return;

    const intervalId = window.setInterval(async () => {
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
        studentNumber,
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
  }, [examInfo, answers, remainingSeconds, questions.length, studentNumber]);

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

    if (!studentNumber) {
      setError("Tələbə nömrəsi tapılmadı. Yenidən daxil olun.");
      setSubmitting(false);
      return;
    }

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
      studentNumber,
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

  const handleGoToQuestion = (index) => {
    if (index < 0 || index >= questions.length) return;
    setCurrentIndex(index);
  };

  const handlePrev = () => {
    handleGoToQuestion(currentIndex - 1);
  };

  const handleNext = () => {
    handleGoToQuestion(currentIndex + 1);
  };

  const currentQuestion =
    questions.length > 0 && currentIndex >= 0 && currentIndex < questions.length
      ? questions[currentIndex]
      : null;

  const isQuestionAnswered = (questionId) => {
    const a = answers[questionId];
    if (!a) return false;
    return Array.isArray(a.selectedOptionIds) && a.selectedOptionIds.length > 0;
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

      <ExamPhotoCapture
        examId={examInfo?.examId || numericExamId}
        studentNumber={studentNumber}
      />

      {error && <div className={styles.error}>{error}</div>}


      {error && <div className={styles.error}>{error}</div>}

      {loading ? (
        <div className={styles.infoText}>Yüklənir...</div>
      ) : !currentQuestion ? (
        <div className={styles.infoText}>Bu imtahan üçün sual tapılmadı.</div>
      ) : (
        <>
          <div className={styles.questionNav}>
            <div className={styles.questionNavTitle}>Suallar:</div>
            <div className={styles.questionNavList}>
              {questions.map((q, idx) => {
                const answered = isQuestionAnswered(q.id);
                const isActive = idx === currentIndex;
                const classNames = [
                  styles.questionNavItem,
                  isActive ? styles.questionNavItemActive : "",
                  answered ? styles.questionNavItemAnswered : "",
                ]
                  .filter(Boolean)
                  .join(" ");
                return (
                  <button
                    key={q.id}
                    type="button"
                    className={classNames}
                    onClick={() => handleGoToQuestion(idx)}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <div className={styles.questionsWrapper}>
            <div className={styles.questionCard}>
              <div className={styles.questionHeader}>
                <span className={styles.questionIndex}>
                  Sual {currentIndex + 1} / {questions.length}
                </span>
                <span className={styles.questionPoints}>
                  {currentQuestion.points} bal
                </span>
              </div>

              <div className={styles.questionText}>{currentQuestion.text}</div>

              {currentQuestion.attachmentUrl && (
                <div className={styles.attachment}>
                  <a
                    href={currentQuestion.attachmentUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Əlavəyə bax
                  </a>
                </div>
              )}

              {currentQuestion.options && currentQuestion.options.length > 0 && (
                <div className={styles.optionsList}>
                  {currentQuestion.options.map((opt, idx) => {
                    const answer = answers[currentQuestion.id] || {
                      selectedOptionIds: [],
                    };
                    const checked = answer.selectedOptionIds.includes(opt.id);
                    const isMultiple =
                      currentQuestion.type &&
                      currentQuestion.type.toUpperCase() ===
                        "MULTIPLE_CHOICE_MULTIPLE";

                    return (
                      <label key={opt.id} className={styles.optionItem}>
                        <input
                          type={isMultiple ? "checkbox" : "radio"}
                          name={`q-${currentQuestion.id}`}
                          checked={checked}
                          onChange={() =>
                            handleOptionChange(
                              currentQuestion.id,
                              opt.id,
                              isMultiple
                            )
                          }
                        />
                        <span className={styles.optionLabel}>
                          {String.fromCharCode(65 + idx)}) {opt.optionText}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            <div className={styles.navButtons}>
              <button
                type="button"
                className={styles.navButton}
                onClick={handlePrev}
                disabled={currentIndex === 0}
              >
                Əvvəlki
              </button>
              <button
                type="button"
                className={styles.navButton}
                onClick={handleNext}
                disabled={currentIndex === questions.length - 1}
              >
                Növbəti
              </button>
            </div>
          </div>
        </>
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
