import React, { useEffect, useState } from "react";
import PageHeader from "../../components/common/pageheader/PageHeader";
import { FiBook, FiPlus, FiEdit, FiTrash2, FiArrowRightCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import {
  getExamBases,
  createExamBase,
  updateExamBase,
  deleteExamBase,
} from "../../services/examBasesApi";

import ConfirmDeleteModal from "../../components/common/deleteModal/ConfirmDeleteModal";
import ExamBaseFormModal from "./ExamBaseFormModal/ExamBaseFormModal";
import styles from "./ExamBasePage.module.css";

const ExamBasePage = () => {
  const [examBases, setExamBases] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [titleFilter, setTitleFilter] = useState("");
  const [subjectTitleFilter, setSubjectTitleFilter] = useState("");

  const [pageNo, setPageNo] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [editingExamBase, setEditingExamBase] = useState(null);

  const [formValues, setFormValues] = useState({
    title: "",
    durationMinutes: "",
    subjectId: "",
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingExamBase, setDeletingExamBase] = useState(null);

  const navigate = useNavigate();

  const fetchExamBases = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getExamBases({
        title: titleFilter || undefined,
        pageNo,
        pageSize,
      });

      let content = data.content || [];

      if (subjectTitleFilter && subjectTitleFilter.trim().length > 0) {
        const query = subjectTitleFilter.trim().toLowerCase();
        content = content.filter((item) =>
          item.subjectTitle?.toLowerCase().includes(query)
        );
      }

      setExamBases(content);

      if (subjectTitleFilter && subjectTitleFilter.trim().length > 0) {
        setTotalPages(1);
        setPageNo(0);
      } else {
        setTotalPages(data.totalPages || 0);
      }
    } catch (e) {
      setError("İmtahan şablonlarını yükləmək mümkün olmadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamBases();
  }, [pageNo]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPageNo(0);
    fetchExamBases();
  };

  const resetForm = () => {
    setFormValues({
      title: "",
      durationMinutes: "",
      subjectId: "",
    });
    setFormError("");
    setSaving(false);
  };

  const openCreateModal = () => {
    setFormMode("create");
    setEditingExamBase(null);
    resetForm();
    setIsFormModalOpen(true);
  };

  const openEditModal = (examBase) => {
    setFormMode("edit");
    setEditingExamBase(examBase);
    setFormValues({
      title: examBase.title || "",
      durationMinutes: examBase.durationMinutes || "",
      subjectId: "",
    });
    setFormError("");
    setSaving(false);
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setEditingExamBase(null);
    resetForm();
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");

    try {
      if (formMode === "edit" && editingExamBase) {
        await updateExamBase({
          id: editingExamBase.id,
          title: formValues.title,
          durationMinutes: formValues.durationMinutes,
        });
      } else {
        await createExamBase({
          title: formValues.title,
          durationMinutes: formValues.durationMinutes,
          subjectId: formValues.subjectId,
        });
      }
      closeFormModal();
      fetchExamBases();
    } catch (e) {
      setFormError("Əməliyyatı yerinə yetirmək alınmadı.");
    } finally {
      setSaving(false);
    }
  };

  const openDeleteModal = (examBase) => {
    setDeletingExamBase(examBase);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeletingExamBase(null);
    setIsDeleteModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!deletingExamBase) return;
    try {
      await deleteExamBase(deletingExamBase.id);
      closeDeleteModal();
      fetchExamBases();
    } catch (e) {
      alert("Silinmə zamanı xəta baş verdi.");
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
      <PageHeader
        title="İmtahan şablonları"
        icon={<FiBook />}
        description="Fənlər üzrə imtahan şablonlarının siyahısı və idarə olunması"
      />

      <form className={styles.filterForm} onSubmit={handleSearchSubmit}>
        <input
          type="text"
          placeholder="Başlıq üzrə axtar"
          className={styles.filterInput}
          value={titleFilter}
          onChange={(e) => setTitleFilter(e.target.value)}
        />

        <input
          type="text"
          placeholder="Fənn adına görə axtar"
          className={styles.filterInput}
          value={subjectTitleFilter}
          onChange={(e) => setSubjectTitleFilter(e.target.value)}
        />

        <button type="submit" className={styles.primaryButton}>
          Axtar
        </button>

        <button
          type="button"
          className={styles.secondaryButton}
          onClick={openCreateModal}
        >
          <FiPlus />
          Yeni şablon
        </button>
      </form>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.tableWrapper}>
        {loading ? (
          <div className={styles.infoText}>Yüklənir...</div>
        ) : examBases.length === 0 ? (
          <div className={styles.infoText}>
            Heç bir imtahan şablonu tapılmadı.
          </div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Başlıq</th>
                <th>Fənn</th>
                <th>Müddət (dəqiqə)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {examBases.map((examBase) => (
                <tr key={examBase.id}>
                  <td>{examBase.id}</td>
                  <td>{examBase.title}</td>
                  <td>{examBase.subjectTitle}</td>
                  <td>{examBase.durationMinutes}</td>
                  <td className={styles.actionsCell}>
                    <button
                      type="button"
                      className={styles.iconButton}
                      title="Suallara bax"
                      onClick={() =>
                        navigate(`/exam-bases/${examBase.id}/questions`)
                      }
                    >
                      <FiArrowRightCircle size={18} />
                    </button>

                    <button
                      type="button"
                      className={styles.iconButton}
                      onClick={() => openEditModal(examBase)}
                    >
                      <FiEdit />
                    </button>

                    <button
                      type="button"
                      className={styles.iconButtonDanger}
                      onClick={() => openDeleteModal(examBase)}
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

      <ExamBaseFormModal
        isOpen={isFormModalOpen}
        mode={formMode}
        values={formValues}
        onChange={handleFormChange}
        onClose={closeFormModal}
        onSubmit={handleFormSubmit}
        saving={saving}
        error={formError}
      />

      {isDeleteModalOpen && (
        <ConfirmDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={closeDeleteModal}
          onConfirm={handleConfirmDelete}
          title="İmtahan şablonunu sil"
          description={
            deletingExamBase
              ? `"${deletingExamBase.title}" şablonunu silmək istədiyinizə əminsiniz?`
              : "Silmək istədiyinizə əminsiniz?"
          }
        />
      )}
    </div>
  );
};

export default ExamBasePage;
