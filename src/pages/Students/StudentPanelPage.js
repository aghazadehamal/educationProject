import React, { useEffect, useState, useCallback } from "react";

import PageHeader from "../../components/common/pageheader/PageHeader";
import { getStudents, createStudent, updateStudent, deleteStudent, getStudentDetail } from "../../services/studentsApi";
import StudentFormModal from "./studentFormModal/StudentFormModal";
import StudentDetailModal from "./studentDetail/StudentDetailModal";
import StudentSubjectsModal from "./studentSubjectModal/StudentSubjectsModal";

import { FiBook, FiEdit, FiTrash2, FiArrowRightCircle } from "react-icons/fi";
import { toast } from "react-toastify";

import styles from "./StudentPanelPage.module.css";

const StudentPanelPage = () => {
  const [students, setStudents] = useState([]);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const [filters, setFilters] = useState({
    studentNumber: "",
    firstName: "",
    lastName: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");
  const [formValues, setFormValues] = useState({
    id: null,
    studentNumber: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    nationalId: "",
    birthDate: "",
    gender: "",
    address: "",
  });
  const [saving, setSaving] = useState(false);

  const [detailData, setDetailData] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [isSubjectsModalOpen, setIsSubjectsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fetchStudents = useCallback(
  async (overridePageNo) => {
    try {
      setLoading(true);
      setError("");

      const currentPage = overridePageNo ?? pageNo;

      const baseFilters = {
        pageNo: currentPage,
        pageSize,
      };

      const cleanedFilters = { ...baseFilters };

      ["studentNumber", "firstName", "lastName"].forEach((key) => {
        const value = filters[key];
        if (value && value.trim().length > 0) {
          cleanedFilters[key] = value.trim();
        }
      });

      const data = await getStudents(cleanedFilters);

      setStudents(data.content || []);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      console.error("FETCH STUDENTS ERROR:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Tələbələr yüklənərkən xəta baş verdi";

      setError(msg);
      toast.error(msg, { toastId: "students-load-error" });
    } finally {
      setLoading(false);
    }
  },
  [pageNo, pageSize, filters] 
);


 useEffect(() => {
  fetchStudents();
}, [fetchStudents]);


  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    setPageNo(0);
    fetchStudents(0);
  };

  const openCreateModal = () => {
    setFormMode("create");
    setFormValues({
      id: null,
      studentNumber: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      nationalId: "",
      birthDate: "",
      gender: "",
      address: "",
    });
    setError("");
    setIsModalOpen(true);
  };

  const openEditModal = (student) => {
    setFormMode("edit");
    setFormValues({
      id: student.id,
      studentNumber: student.studentNumber,
      firstName: student.firstName || "",
      lastName: student.lastName || "",
      email: student.email || "",
      phone: student.phone || "",
      nationalId: student.nationalId || "",
      birthDate: student.birthDate || "",
      gender: student.gender || "",
      address: student.address || "",
    });
    setError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormValues({
      id: null,
      studentNumber: "",
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      nationalId: "",
      birthDate: "",
      gender: "",
      address: "",
    });
    setError("");
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
    setError("");

    try {
      if (!formValues.firstName.trim() || !formValues.lastName.trim()) {
        const msg = "Ad və soyad boş ola bilməz";
        setError(msg);
        toast.error(msg, { toastId: "student-name-required" });
        setSaving(false);
        return;
      }

      if (!formValues.email.trim()) {
        const msg = "Email boş ola bilməz";
        setError(msg);
        toast.error(msg, { toastId: "student-email-required" }); 
        setSaving(false);
        return;
      }

      if (!formValues.nationalId.trim()) {
        const msg = "Şəxsiyyət vəsiqəsinin nömrəsi boş ola bilməz";
        setError(msg);
        toast.error(msg, { toastId: "student-nationalId-required" }); 
        setSaving(false);
        return;
      }

      if (!formValues.birthDate) {
        const msg = "Doğum tarixi boş ola bilməz";
        setError(msg);
        toast.error(msg, { toastId: "student-birthDate-required" }); 
        setSaving(false);
        return;
      }

      if (!formValues.gender) {
        const msg = "Cins seçilməlidir";
        setError(msg);
        toast.error(msg, { toastId: "student-gender-required" }); 
        setSaving(false);
        return;
      }

      const payload = {
        firstName: formValues.firstName.trim(),
        lastName: formValues.lastName.trim(),
        email: formValues.email.trim(),
        studentNumber: formValues.studentNumber,
        phone: formValues.phone?.trim() || "",
        nationalId: formValues.nationalId?.trim() || "",
        birthDate: formValues.birthDate,
        gender: formValues.gender,
        address: formValues.address?.trim() || "",
      };

      if (formMode === "create") {
        await createStudent(payload);
        toast.success("Tələbə uğurla əlavə edildi ✅", {
          toastId: "student-create-success",
        }); 
      } else {
        await updateStudent(payload);
        toast.success("Tələbə məlumatları yeniləndi ✅", {
          toastId: "student-update-success",
        }); 
      }

      closeModal();
      fetchStudents();
    } catch (err) {
      console.error("CREATE/UPDATE STUDENT ERROR:", err);
      const msg = err?.response?.data?.message || err?.response?.data?.error || err.message || "Əməliyyat zamanı xəta baş verdi";
      setError(msg);
      toast.error(msg, { toastId: "student-save-error" }); 
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (student) => {
    const confirmed = window.confirm(`"${student.firstName} ${student.lastName}" tələbəsini silmək istədiyinizə əminsiniz?`);
    if (!confirmed) return;

    try {
      setLoading(true);
      const id = student.id ?? student.studentNumber;
      await deleteStudent(id);

      toast.info(`"${student.firstName} ${student.lastName}" silindi 🗑️`, { toastId: "student-delete-success" }); 

      fetchStudents();
    } catch (err) {
      console.error("DELETE STUDENT ERROR:", err);
      const msg = err?.response?.data?.message || err?.response?.data?.error || err.message || "Silinmə zamanı xəta baş verdi";
      setError(msg);
      toast.error(msg, { toastId: "student-delete-error" }); 
    } finally {
      setLoading(false);
    }
  };

  const handleView = async (studentNumber) => {
    try {
      setLoading(true);
      setError("");
      const data = await getStudentDetail(studentNumber);
      setDetailData(data);
      setIsDetailOpen(true);
    } catch (err) {
      console.error("GET STUDENT DETAIL ERROR:", err);
      const msg = err?.response?.data?.message || err?.response?.data?.error || err.message || "Tələbənin detalları yüklənərkən xəta baş verdi";
      setError(msg);
      toast.error(msg, { toastId: "student-detail-error" }); 
    } finally {
      setLoading(false);
    }
  };

  const openSubjectsModal = (student) => {
    setSelectedStudent(student);
    setIsSubjectsModalOpen(true);
  };

  const closeSubjectsModal = () => {
    setIsSubjectsModalOpen(false);
    setSelectedStudent(null);
  };

  const handleSubjectsAssigned = async () => {
    await fetchStudents();
    toast.success("Fənlər uğurla təyin edildi ✅", {
      toastId: "student-subjects-assigned",
    }); 
  };

  return (
    <div className={styles.container}>
      <PageHeader title="Tələbələr" />

      <form onSubmit={handleFilterSubmit} className={styles.filterForm}>
        <input type="text" name="studentNumber" placeholder="Tələbə nömrəsinə görə axtar..." value={filters.studentNumber} onChange={handleFilterChange} className={styles.filterInput} />

        <input type="text" name="firstName" placeholder="Ada görə axtar..." value={filters.firstName} onChange={handleFilterChange} className={styles.filterInput} />

        <input type="text" name="lastName" placeholder="Soyada görə axtar..." value={filters.lastName} onChange={handleFilterChange} className={styles.filterInput} />

        <button type="submit" className={styles.primaryBtn}>
          Axtar
        </button>

        <button type="button" onClick={openCreateModal} className={styles.secondaryBtn}>
          + Yeni tələbə
        </button>
      </form>

      {loading && <p>Yüklənir...</p>}
      {error && <p className={styles.error}>Xəta: {error}</p>}

      {!loading && students.length === 0 && !error && <p>Heç bir tələbə tapılmadı.</p>}

      {!loading && students.length > 0 && (
        <>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Tələbə №</th>
                <th>Ad</th>
                <th>Soyad</th>
                <th>Email</th>
                <th>Telefon</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.studentNumber}>
                  <td>{s.studentNumber}</td>
                  <td>{s.firstName}</td>
                  <td>{s.lastName}</td>
                  <td>{s.email}</td>
                  <td>{s.phone}</td>
                  <td className={styles.actions}>
                    <button type="button" onClick={() => handleView(s.studentNumber)} className={styles.iconBtn} title="Ətraflı bax">
                      <FiArrowRightCircle size={18} />
                    </button>

                    <button type="button" onClick={() => openSubjectsModal(s)} className={styles.iconBtn} title="Fənn təyin et">
                      <FiBook size={18} />
                    </button>

                    <button type="button" onClick={() => openEditModal(s)} className={styles.iconBtn} title="Redaktə">
                      <FiEdit size={18} />
                    </button>

                    <button type="button" onClick={() => handleDelete(s)} className={styles.dangerIconBtn} title="Sil">
                      <FiTrash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.pagination}>
            <button type="button" onClick={() => setPageNo((p) => Math.max(p - 1, 0))} disabled={pageNo === 0} className={styles.paginationBtn}>
              ⬅️ Əvvəlki
            </button>

            <span className={styles.paginationInfo}>
              Səhifə: {pageNo + 1} / {totalPages || 1}
            </span>

            <button type="button" onClick={() => setPageNo((p) => (totalPages && p < totalPages - 1 ? p + 1 : p))} disabled={totalPages && pageNo >= totalPages - 1} className={styles.paginationBtn}>
              Növbəti ➡️
            </button>
          </div>
        </>
      )}

      <StudentFormModal isOpen={isModalOpen} mode={formMode} values={formValues} onChange={handleFormChange} onClose={closeModal} onSubmit={handleFormSubmit} saving={saving} error={error} />

      <StudentDetailModal
        isOpen={isDetailOpen}
        data={detailData}
        onClose={() => {
          setIsDetailOpen(false);
          setDetailData(null);
        }}
      />

      <StudentSubjectsModal isOpen={isSubjectsModalOpen} student={selectedStudent} onClose={closeSubjectsModal} onAssigned={handleSubjectsAssigned} />
    </div>
  );
};

export default StudentPanelPage;
