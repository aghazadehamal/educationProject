import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/pageheader/PageHeader";
import { FiArrowLeft, FiTrash2 } from "react-icons/fi";

import {
  getExamBaseQuestions,
  deleteExamBaseQuestion,
  uploadExamBaseQuestions,
  replaceExamBaseQuestions,
} from "../../services/examBasesApi";

import ConfirmDeleteModal from "../../components/common/deleteModal/ConfirmDeleteModal";
import styles from "./ExamBaseQuestionsPage.module.css";

const ExamBaseQuestionsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const examBaseId = Number(id);

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [pageNo, setPageNo] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingQuestion, setDeletingQuestion] = useState(null);

  const [isUploading, setIsUploading] = useState(false);
  const [isReplacing, setIsReplacing] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const data = await getExamBaseQuestions(examBaseId, {
        text: searchText,
        pageNo,
        pageSize,
      });

      setQuestions(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (e) {
      console.log("ERROR:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [pageNo]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPageNo(0);
    fetchQuestions();
  };

  const openDeleteModal = (question) => {
    setDeletingQuestion(question);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeletingQuestion(null);
    setIsDeleteModalOpen(false);
  };

 const handleConfirmDelete = async () => {
  if (!deletingQuestion) return;
  try {
    await deleteExamBaseQuestion(examBaseId, deletingQuestion.id);
    closeDeleteModal();
    fetchQuestions();
  } catch (e) {
    alert("Sual silinmə zamanı xəta baş verdi.");
  }
};


  const handleFileChange = async (e, mode) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    try {
      if (mode === "upload") {
        setIsUploading(true);
        await uploadExamBaseQuestions(examBaseId, file);
      } else {
        setIsReplacing(true);
        await replaceExamBaseQuestions(examBaseId, file);
      }
      fetchQuestions();
    } catch (err) {
      alert("Fayl yüklənərkən xəta baş verdi.");
    } finally {
      setIsUploading(false);
      setIsReplacing(false);
      e.target.value = "";
    }
  };

  const goToPrevPage = () => {
    setPageNo((prev) => Math.max(prev - 1, 0));
  };

  const goToNextPage = () => {
    if (pageNo + 1 < totalPages) {
      setPageNo((prev) => prev + 1);
    }
  };

  return (
    <div className={styles.container}>
      <PageHeader title="İmtahan sualları" icon={<FiArrowLeft />} />

      <div className={styles.topBar}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          ← Geri qayıt
        </button>

        <div className={styles.topBarRight}>
          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => {
              const input = document.getElementById("uploadQuestionsInput");
              if (input) {
                input.value = "";
                input.click();
              }
            }}
            disabled={isUploading || isReplacing}
          >
            {isUploading ? "Yüklənir..." : "Sualları əlavə et"}
          </button>

          <button
            type="button"
            className={styles.secondaryButton}
            onClick={() => {
              const input = document.getElementById("replaceQuestionsInput");
              if (input) {
                input.value = "";
                input.click();
              }
            }}
            disabled={isUploading || isReplacing}
          >
            {isReplacing ? "Yüklənir..." : "Sualları əvəz et"}
          </button>

          <input
            id="uploadQuestionsInput"
            type="file"
            accept=".xlsx,.xls,.csv"
            style={{ display: "none" }}
            onChange={(e) => handleFileChange(e, "upload")}
          />

          <input
            id="replaceQuestionsInput"
            type="file"
            accept=".xlsx,.xls,.csv"
            style={{ display: "none" }}
            onChange={(e) => handleFileChange(e, "replace")}
          />
        </div>
      </div>

      <form className={styles.filterForm} onSubmit={handleSearch}>
        <input
          type="text"
          value={searchText}
          placeholder="Sual mətni üzrə axtar..."
          className={styles.filterInput}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button type="submit" className={styles.primaryButton}>
          Axtar
        </button>
      </form>

      <div className={styles.tableWrapper}>
        {loading ? (
          <div className={styles.infoText}>Yüklənir...</div>
        ) : questions.length === 0 ? (
          <div className={styles.infoText}>Sual tapılmadı.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Mətn</th>
                <th>Tip</th>
                <th>Bal</th>
                <th>Variant sayı</th>
                <th>Əlavə</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {questions.map((q) => (
                <tr key={q.id}>
                  <td>{q.id}</td>
                  <td>{q.text}</td>
                  <td>{q.type}</td>
                  <td>{q.points}</td>
                  <td>{q.options && q.options.length ? q.options.length : 0}</td>
                  <td>
                    {q.attachmentUrl ? (
                      <a href={q.attachmentUrl} target="_blank" rel="noreferrer">
                        Bax
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td>
                   <button
  type="button"
  className={styles.iconButtonDanger}
  onClick={() => openDeleteModal(q)}
>
  <FiTrash2 />
</button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            type="button"
            onClick={goToPrevPage}
            disabled={pageNo === 0}
          >
            Əvvəlki
          </button>
          <span>
            Səhifə {pageNo + 1} / {totalPages || 1}
          </span>
          <button
            type="button"
            onClick={goToNextPage}
            disabled={pageNo + 1 >= totalPages}
          >
            Növbəti
          </button>
        </div>
      )}

      {isDeleteModalOpen && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleConfirmDelete}
          title="Sual silinsin?"
          description="Bu sualı silmək istədiyinizə əminsiniz?"
        />
      )}
    </div>
  );
};

export default ExamBaseQuestionsPage;
