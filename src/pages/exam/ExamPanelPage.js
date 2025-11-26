
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/pageheader/PageHeader";
import {
  FiCalendar,
  FiPlus,
  FiEdit,
  FiSlash,
  FiArrowRightCircle,
} from "react-icons/fi";

import {
  getExams,
  createExam,
  updateExam,
  cancelExam,
} from "../../services/examsApi";

import ConfirmDeleteModal from "../../components/common/deleteModal/ConfirmDeleteModal";
import ExamFormModal from "./ExamFormModal";
import styles from "./ExamPanelPage.module.css";

const ExamPanelPage = () => {
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [examBaseIdFilter, setExamBaseIdFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [createdByFilter, setCreatedByFilter] = useState("");

 const [pageNo, setPageNo] = useState(1);


  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [editingExam, setEditingExam] = useState(null);

  const [formValues, setFormValues] = useState({
    examBaseId: "",
    assignedStudentNumbers: "",
    scheduledStartTime: "",
    scheduledEndTime: "",
    note: "",
  });
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");

  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancellingExam, setCancellingExam] = useState(null);

  const fetchExams = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getExams({
        examBaseId: examBaseIdFilter || undefined,
        status: statusFilter || undefined,
        createdBy: createdByFilter || undefined,
        pageNo,
        pageSize,
      });

      setExams(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (e) {
      setError("İmtahanları yükləmək mümkün olmadı.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  fetchExams();
}, [pageNo]);

const handleSearchSubmit = (e) => {
  e.preventDefault();
  setError("");

  if (pageNo !== 1) {
   
    setPageNo(1);
  } else {
   
    fetchExams();
  }
};




  const resetForm = () => {
    setFormValues({
      examBaseId: "",
      assignedStudentNumbers: "",
      scheduledStartTime: "",
      scheduledEndTime: "",
      note: "",
    });
    setFormError("");
    setSaving(false);
  };

  const openCreateModal = () => {
    setFormMode("create");
    setEditingExam(null);
    resetForm();
    setIsFormModalOpen(true);
  };

  const openEditModal = (exam) => {
    setFormMode("edit");
    setEditingExam(exam);
    setFormValues({
      examBaseId: "",
      assignedStudentNumbers: "",
      scheduledStartTime: exam.scheduledStartTime || "",
      scheduledEndTime: exam.scheduledEndTime || "",
      note: exam.note || "",
    });
    setFormError("");
    setSaving(false);
    setIsFormModalOpen(true);
  };

  const closeFormModal = () => {
    setIsFormModalOpen(false);
    setEditingExam(null);
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

    const payload = {
      assignedStudentNumbers: formValues.assignedStudentNumbers
        ? formValues.assignedStudentNumbers
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
      scheduledStartTime: formValues.scheduledStartTime,
      scheduledEndTime: formValues.scheduledEndTime,
      note: formValues.note,
    };

    try {
      if (formMode === "edit" && editingExam) {
        await updateExam({
          id: editingExam.id,
          ...payload,
        });
      } else {
        await createExam({
          examBaseId: Number(formValues.examBaseId),
          ...payload,
        });
      }
      closeFormModal();
      fetchExams();
    } catch (e) {
      setFormError("Əməliyyatı yerinə yetirmək alınmadı.");
    } finally {
      setSaving(false);
    }
  };

  const openCancelModal = (exam) => {
    setCancellingExam(exam);
    setIsCancelModalOpen(true);
  };

  const closeCancelModal = () => {
    setCancellingExam(null);
    setIsCancelModalOpen(false);
  };

  const handleConfirmCancel = async () => {
    if (!cancellingExam) return;
    try {
      await cancelExam(cancellingExam.id);
      closeCancelModal();
      fetchExams();
    } catch (e) {
      alert("İmtahanı ləğv edərkən xəta baş verdi.");
    }
  };

 const goToPrevPage = () => {
  setPageNo((prev) => Math.max(prev - 1, 1));
};


  const goToNextPage = () => {
  if (pageNo < totalPages) {
    setPageNo((prev) => prev + 1);
  }
};


  return (
    <div className={styles.container}>
      <PageHeader
        title="İmtahanlar"
        icon={<FiCalendar />}
        description="Planlaşdırılmış imtahanların siyahısı və idarə olunması"
      />

      <form className={styles.filterForm} onSubmit={handleSearchSubmit}>
        <input
          type="number"
          placeholder="Exam base ID"
          className={styles.filterInput}
          value={examBaseIdFilter}
          onChange={(e) => setExamBaseIdFilter(e.target.value)}
        />

        <select
          className={styles.filterInput}
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Status</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>

        <input
          type="text"
          placeholder="Created by"
          className={styles.filterInput}
          value={createdByFilter}
          onChange={(e) => setCreatedByFilter(e.target.value)}
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
          Yeni imtahan
        </button>
      </form>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.tableWrapper}>
        {loading ? (
          <div className={styles.infoText}>Yüklənir...</div>
        ) : exams.length === 0 ? (
          <div className={styles.infoText}>Heç bir imtahan tapılmadı.</div>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Adı</th>
                <th>Başlama</th>
                <th>Bitmə</th>
                <th>Status</th>
                <th>Yaradıb</th>
                <th>Qeyd</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {exams.map((exam) => (
                <tr key={exam.id}>
                  <td>{exam.id}</td>
                  <td>{exam.examName}</td>
                  <td>{exam.scheduledStartTime}</td>
                  <td>{exam.scheduledEndTime}</td>
                  <td>{exam.status}</td>
                  <td>{exam.createdBy}</td>
                  <td>{exam.note}</td>
                  <td className={styles.actionsCell}>
                    <button
                      type="button"
                      className={styles.iconButton}
                      onClick={() => navigate(`/exams/${exam.id}`)}
                    >
                      <FiArrowRightCircle />
                    </button>
                    <button
                      type="button"
                      className={styles.iconButton}
                      onClick={() => openEditModal(exam)}
                    >
                      <FiEdit />
                    </button>
                    {exam.status === "ACTIVE" && (
                      <button
                        type="button"
                        className={styles.iconButtonDanger}
                        onClick={() => openCancelModal(exam)}
                      >
                        <FiSlash />
                      </button>
                    )}
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
      disabled={pageNo === 1}
    >
      Əvvəlki
    </button>
    <span>
      Səhifə {pageNo} / {totalPages || 1}
    </span>
    <button
      type="button"
      onClick={goToNextPage}
      disabled={pageNo >= totalPages}
    >
      Növbəti
    </button>
  </div>
)}


      <ExamFormModal
        isOpen={isFormModalOpen}
        mode={formMode}
        values={formValues}
        onChange={handleFormChange}
        onClose={closeFormModal}
        onSubmit={handleFormSubmit}
        saving={saving}
        error={formError}
      />

     {isCancelModalOpen && (
  <ConfirmDeleteModal
    isOpen={isCancelModalOpen}
    onCancel={closeCancelModal}                
    onConfirm={handleConfirmCancel}
    message={
      cancellingExam
        ? `"${cancellingExam.examName}" imtahanını ləğv etmək istədiyinizə əminsiniz?`
        : "İmtahanı ləğv etmək istədiyinizə əminsiniz?"
    }
  />
)}

    </div>
  );
};

export default ExamPanelPage;
