import React, { useEffect, useState } from "react";
import PageHeader from "../../components/common/pageheader/PageHeader";
import { FiBook, FiPlus, FiEdit, FiTrash2, FiArrowRightCircle } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { getSubjects } from "../../services/subjectsApi";
import { getExamBases, createExamBase, updateExamBase, deleteExamBase } from "../../services/examBasesApi";
import ConfirmDeleteModal from "../../components/common/deleteModal/ConfirmDeleteModal";
import ExamBaseFormModal from "./ExamBaseFormModal/ExamBaseFormModal";
import styles from "./ExamBasePage.module.css";
import { toast } from "react-toastify";

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
    topicId: "",
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingExamBase, setDeletingExamBase] = useState(null);

  const [subjects, setSubjects] = useState([]);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [subjectsError, setSubjectsError] = useState("");

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
        content = content.filter((item) => item.subjectTitle?.toLowerCase().includes(query));
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
      toast.error("İmtahan şablonlarını yükləmək mümkün olmadı.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubjects = async () => {
    setSubjectsLoading(true);
    setSubjectsError("");

    try {
      const data = await getSubjects({ pageNo: 0, pageSize: 1000 });
      const content = data.content || data || [];
      setSubjects(content);
    } catch (e) {
      setSubjectsError("Fənnləri yükləmək mümkün olmadı.");
      toast.error("Fənnləri yükləmək mümkün olmadı.");
    } finally {
      setSubjectsLoading(false);
    }
  };

  useEffect(() => {
    fetchExamBases();
  }, [pageNo]);

  useEffect(() => {
    fetchSubjects();
  }, []);

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
      topicId: "",
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
      subjectId: examBase.subjectId ? String(examBase.subjectId) : "",
      topicId: examBase.subjectId ? String(examBase.subjectId) : "",
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

    setFormValues((prev) => {
      if (name === "subjectId") {
        return {
          ...prev,
          subjectId: value,
          topicId: "",
        };
      }

      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFormError("");

    const payloadSubjectId = formMode === "create"
      ? Number(formValues.topicId)
      : Number(formValues.topicId || formValues.subjectId);

    try {
      if (formMode === "edit" && editingExamBase) {
        await updateExamBase({
          id: editingExamBase.id,
          title: formValues.title,
          durationMinutes: Number(formValues.durationMinutes),
          subjectId: payloadSubjectId,
        });
        toast.success("İmtahan şablonu yeniləndi");
      } else {
        await createExamBase({
          title: formValues.title,
          durationMinutes: Number(formValues.durationMinutes),
          subjectId: payloadSubjectId,
        });
        toast.success("Yeni imtahan şablonu yaradıldı");
      }
      closeFormModal();
      fetchExamBases();
    } catch (e) {
      setFormError("Əməliyyatı yerinə yetirmək alınmadı.");
      toast.error("Əməliyyatı yerinə yetirmək alınmadı.");
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
      toast.success("İmtahan şablonu silindi");
      closeDeleteModal();
      fetchExamBases();
    } catch (e) {
      toast.error("Silinmə zamanı xəta baş verdi.");
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
      {subjectsError && <div className={styles.error}>{subjectsError}</div>}

      <div className={styles.tableWrapper}>
        {loading ? (
          <div className={styles.infoText}>Yüklənir...</div>
        ) : examBases.length === 0 ? (
          <div className={styles.infoText}>Heç bir imtahan şablonu tapılmadı.</div>
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
          <button type="button" onClick={goToPrevPage} disabled={pageNo === 0}>
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
        subjects={subjects}
        subjectsLoading={subjectsLoading}
      />

      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onConfirm={handleConfirmDelete}
        onCancel={closeDeleteModal}
        message={
          deletingExamBase
            ? `"${deletingExamBase.title}" şablonunu silmək istədiyinizə əminsiniz?`
            : "Bu imtahan şablonunu silmək istədiyinizə əminsiniz?"
        }
      />
    </div>
  );
};

export default ExamBasePage;
