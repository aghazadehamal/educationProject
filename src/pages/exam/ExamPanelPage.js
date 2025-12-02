import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/pageheader/PageHeader";
import { getExamBases, getExamBaseStudents } from "../../services/examBasesApi";
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
import ExamFormModal from "./ExamFormModal/ExamFormModal";
import styles from "./ExamPanelPage.module.css";
import { toast } from "react-toastify";

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

  const [examBases, setExamBases] = useState([]);
  const [examBasesLoading, setExamBasesLoading] = useState(false);

  const [examBaseStudents, setExamBaseStudents] = useState([]);
  const [examBaseStudentsLoading, setExamBaseStudentsLoading] = useState(false);

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
      toast.error("İmtahanları yükləmək mümkün olmadı.");
    } finally {
      setLoading(false);
    }
  };

  const fetchExamBasesForSelect = async () => {
    try {
      setExamBasesLoading(true);
      const data = await getExamBases({ pageNo: 0, pageSize: 1000 });
      setExamBases(data.content || []);
    } catch (err) {
      console.error("EXAM BASE LOAD ERROR:", err);
      toast.error("Exam base siyahısını yükləmək mümkün olmadı.");
    } finally {
      setExamBasesLoading(false);
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
    fetchExamBasesForSelect();
    setIsFormModalOpen(true);
  };

  const toLocalInputValue = (isoString) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    const pad = (n) => String(n).padStart(2, "0");
    const yyyy = d.getFullYear();
    const mm = pad(d.getMonth() + 1);
    const dd = pad(d.getDate());
    const hh = pad(d.getHours());
    const min = pad(d.getMinutes());
    return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
  };

  const openEditModal = (exam) => {
    setFormMode("edit");
    setEditingExam(exam);
    setFormValues({
      examBaseId: "",
      assignedStudentNumbers: "",
      scheduledStartTime: toLocalInputValue(exam.scheduledStartTime),
      scheduledEndTime: toLocalInputValue(exam.scheduledEndTime),
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

  const handleFormChange = async (e) => {
    const { name, value } = e.target;

    if (name === "examBaseId") {
      setFormValues((prev) => ({
        ...prev,
        examBaseId: value,
        assignedStudentNumbers: "",
      }));
      setExamBaseStudents([]);
      if (!value) {
        return;
      }

      try {
        setExamBaseStudentsLoading(true);
        const students = await getExamBaseStudents(Number(value));
        setExamBaseStudents(Array.isArray(students) ? students : []);
      } catch (err) {
        console.error("EXAM BASE STUDENTS LOAD ERROR:", err);
        setExamBaseStudents([]);
        toast.error("Bu exam base üçün tələbələri yükləmək mümkün olmadı.");
      } finally {
        setExamBaseStudentsLoading(false);
      }

      return;
    }

    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toIsoOrNull = (value) => {
    if (!value) return null;
    return new Date(value).toISOString();
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
      scheduledStartTime: toIsoOrNull(formValues.scheduledStartTime),
      scheduledEndTime: toIsoOrNull(formValues.scheduledEndTime),
      note: formValues.note,
    };

    try {
      if (formMode === "edit" && editingExam) {
        await updateExam({
          id: editingExam.id,
          ...payload,
        });
        toast.success("İmtahan uğurla yeniləndi.");
      } else {
        await createExam({
          examBaseId: Number(formValues.examBaseId),
          ...payload,
        });
        toast.success("İmtahan uğurla yaradıldı.");
      }
      closeFormModal();
      fetchExams();
    } catch (e) {
      setFormError("Əməliyyatı yerinə yetirmək alınmadı.");
      toast.error("Əməliyyatı yerinə yetirmək alınmadı.");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStudent = (studentNumber) => {
    setFormValues((prev) => {
      const current = prev.assignedStudentNumbers
        ? prev.assignedStudentNumbers
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      const exists = current.includes(studentNumber);
      const next = exists
        ? current.filter((n) => n !== studentNumber)
        : [...current, studentNumber];

      return {
        ...prev,
        assignedStudentNumbers: next.join(", "),
      };
    });
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
      toast.success("İmtahan uğurla ləğv edildi.");
    } catch (e) {
      toast.error("İmtahanı ləğv edərkən xəta baş verdi.");
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
        examBases={examBases}
        examBasesLoading={examBasesLoading}
        examBaseStudents={examBaseStudents}
        examBaseStudentsLoading={examBaseStudentsLoading}
        onToggleStudent={handleToggleStudent}
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
