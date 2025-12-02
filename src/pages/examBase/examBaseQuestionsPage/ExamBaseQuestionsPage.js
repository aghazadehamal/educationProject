import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getQuestionsByExamBase,
  deleteQuestion,
} from "../../../services/questionsApi";
import QuestionFormModal from "../questionFormModal/QuestionFormModal";
import ConfirmDeleteModal from "../../../components/common/deleteModal/ConfirmDeleteModal";
import styles from "./ExamBaseQuestionsPage.module.css";
import { FiArrowLeft } from "react-icons/fi";
import { toast } from "react-toastify";


const ExamBaseQuestionsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const examBaseId = Number(id);

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState(null);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await getQuestionsByExamBase(examBaseId);
      setQuestions(Array.isArray(data) ? data : data.content || []);
    } catch (e) {
      setQuestions([]);
      toast.error("Sual siyahısı yüklənmədi");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (examBaseId) {
      fetchQuestions();
    }
  }, [examBaseId]);

  const handleCreateClick = () => {
    setEditingQuestion(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (question) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingQuestion(null);
  };

  const handleDeleteClick = (question) => {
    setQuestionToDelete(question);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!questionToDelete) return;
    try {
      await deleteQuestion(examBaseId, questionToDelete.id);
      toast.success("Sual silindi");
      setIsDeleteOpen(false);
      setQuestionToDelete(null);
      fetchQuestions();
    } catch (e) {
      toast.error("Sual silinə bilmədi");
      setIsDeleteOpen(false);
      setQuestionToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteOpen(false);
    setQuestionToDelete(null);
  };

  const goBack = () => {
    navigate("/exams/base");
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
       <button type="button" onClick={goBack} className={styles.backBtn}>
          <FiArrowLeft size={16} />
          <span>Geri</span>
        </button>

        <button
          type="button"
          className={styles.addBtn}
          onClick={handleCreateClick}
        >
          Yeni sual əlavə et
        </button>
      </div>

      {loading && <div className={styles.loading}>Yüklənir...</div>}

      {!loading && questions.length === 0 && (
        <div className={styles.emptyMessage}>
          Bu imtahan bazasında hələ sual yoxdur.
        </div>
      )}

      {!loading &&
        questions.map((q, index) => (
          <div key={q.id} className={styles.questionCard}>
            <div className={styles.questionTopRow}>
              <div className={styles.questionText}>
                <span className={styles.qNumber}>{index + 1}.</span>
                {q.text}
              </div>

              <div className={styles.questionRight}>
                <span className={styles.pointsBadge}>Bal: {q.points ?? 0}</span>
                <div className={styles.questionActions}>
                  <button
                    type="button"
                    className={styles.editBtn}
                    onClick={() => handleEditClick(q)}
                  >
                    Redaktə et
                  </button>
                  <button
                    type="button"
                    className={styles.deleteBtn}
                    onClick={() => handleDeleteClick(q)}
                  >
                    Sil
                  </button>
                </div>
              </div>
            </div>

            {q.attachmentUrl && (
              <img
                src={q.attachmentUrl}
                alt="question"
                className={styles.imagePreview}
              />
            )}

            <div className={styles.optionsList}>
              {q.options?.map((opt, idx) => (
                <div
                  key={opt.id || opt.optionText}
                  className={`${styles.optionItem} ${
                    opt.correct ? styles.correct : ""
                  }`}
                >
                  <span className={styles.optionNumber}>
                    {String.fromCharCode(65 + idx)})
                  </span>
                  {opt.optionText}
                </div>
              ))}
            </div>
          </div>
        ))}

      <QuestionFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        examBaseId={examBaseId}
        onSuccess={fetchQuestions}
        mode={editingQuestion ? "edit" : "create"}
        initialQuestion={editingQuestion}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        message="Bu sualı silmək istədiyinizə əminsiniz?"
      />
    </div>
  );
};

export default ExamBaseQuestionsPage;
