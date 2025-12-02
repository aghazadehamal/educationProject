import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../components/common/pageheader/PageHeader.js";
import { FiEdit, FiTrash2, FiArrowRightCircle } from "react-icons/fi";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";
import ConfirmDeleteModal from "../../components/common/deleteModal/ConfirmDeleteModal.js";
import { toast } from "react-toastify";


import {
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} from "../../services/subjectsApi.js";

import SubjectFormModal from "./subjectBaseModal/SubjectFormModal.js";
import styles from "./SubjectBasePage.module.css";

const SubjectBasePage = () => {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const [search, setSearch] = useState("");
const [searchDescription, setSearchDescription] = useState("");


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("create");

  const [formValues, setFormValues] = useState({
    id: null,
    name: "",
    description: "",
  });

  const [saving, setSaving] = useState(false);

  const [expandedSubjectId, setExpandedSubjectId] = useState(null);
  const [topicsBySubject, setTopicsBySubject] = useState({});
  const [topicsLoadingId, setTopicsLoadingId] = useState(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
const [subjectToDelete, setSubjectToDelete] = useState(null);


  const fetchSubjects = async (searchName, searchDesc) => {
  try {
    setLoading(true);
    setError("");

    const filters = {
      pageNo: 0,
      pageSize: 50,
    };

    if (searchName?.trim()) {
      filters.name = searchName.trim();
    }

    if (searchDesc?.trim()) {
      filters.description = searchDesc.trim();
    }

    const data = await getSubjects(filters);
    const list = Array.isArray(data?.content) ? data.content : [];

    const baseSubjects = list.filter(
      (s) => s.parentId === null || s.parentId === 0 || s.parentId === undefined
    );

    setSubjects(baseSubjects);
  } catch (err) {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err.message ||
      "Subjects yüklənərkən xəta baş verdi";
    setError(msg);

    toast.error(msg, { toastId: "subjects-load-error" }); 
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    fetchSubjects();
  }, []);

 const handleSearchSubmit = (e) => {
  e.preventDefault();
  fetchSubjects(search, searchDescription);
};


  const openCreateModal = () => {
    setFormMode("create");
    setFormValues({
      id: null,
      name: "",
      description: "",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (subject) => {
    setFormMode("edit");
    setFormValues({
      id: subject.id,
      name: subject.name || "",
      description: subject.description || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormValues({
      id: null,
      name: "",
      description: "",
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
    if (!formValues.name.trim()) {
      const msg = "Fənn adı boş ola bilməz";
      setError(msg);
      toast.error(msg, { toastId: "subject-name-required" });
      setSaving(false);
      return;
    }

    if (formMode === "create") {
      await createSubject({
        name: formValues.name.trim(),
        description: formValues.description?.trim() || "",
      });

      toast.success("Fənn uğurla əlavə edildi ✅", {
        toastId: "subject-create-success",
      }); 
    } else {
      await updateSubject({
        id: formValues.id,
        name: formValues.name.trim(),
        description: formValues.description?.trim() || "",
      });

      toast.success("Fənn uğurla yeniləndi ✅", {
        toastId: "subject-update-success",
      }); 
    }

    closeModal();
    fetchSubjects(search, searchDescription);
  } catch (err) {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err.message ||
      "Əməliyyat zamanı xəta baş verdi";

    setError(msg);
    toast.error(msg, {
      toastId: "subject-save-error",
    }); 
  } finally {
    setSaving(false);
  }
};


 

  const handleDeleteClick = (subject) => {
  setSubjectToDelete(subject);
  setDeleteModalOpen(true);
};
const confirmDelete = async () => {
  try {
    setLoading(true);
    await deleteSubject(subjectToDelete.id);

    toast.info(`"${subjectToDelete.name}" silindi 🗑️`, {
      toastId: "subject-delete-success",
    }); 

    setDeleteModalOpen(false);
    setSubjectToDelete(null);
    fetchSubjects(search, searchDescription);
  } catch (err) {
    const msg =
      err?.response?.data?.message || "Silinmə zamanı xəta baş verdi";

    setError(msg);
    toast.error(msg, {
      toastId: "subject-delete-error",
    }); 
  } finally {
    setLoading(false);
  }
};


const cancelDelete = () => {
  setDeleteModalOpen(false);
  setSubjectToDelete(null);
};



  const goToSubjectDetail = (subjectId) => {
    navigate(`/subjects/${subjectId}`);
  };

  const fetchTopicsForSubject = async (subjectId) => {
    try {
      setTopicsLoadingId(subjectId);
      setError("");

      const data = await getSubjects({
        parentId: subjectId,
        pageNo: 0,
        pageSize: 100,
      });

      const list = Array.isArray(data?.content) ? data.content : [];

      setTopicsBySubject((prev) => ({
        ...prev,
        [subjectId]: list,
      }));
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Mövzular yüklənərkən xəta baş verdi";
      setError(msg);
    } finally {
      setTopicsLoadingId(null);
    }
  };

  const toggleTopics = (subjectId) => {
    if (expandedSubjectId === subjectId) {
      setExpandedSubjectId(null);
      return;
    }

    setExpandedSubjectId(subjectId);

    if (!topicsBySubject[subjectId]) {
      fetchTopicsForSubject(subjectId);
    }
  };

  return (
    <div className={styles.container}>
      <PageHeader title="Fənn bazası" />

     <form onSubmit={handleSearchSubmit} className={styles.filterForm}>
  <input
    type="text"
    placeholder="Fənn adına görə axtar..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
    className={styles.searchInput}
  />

  <input
    type="text"
    placeholder="Təsvirə görə axtar..."
    value={searchDescription}
    onChange={(e) => setSearchDescription(e.target.value)}
    className={styles.searchInput}
  />

  <button type="submit" className={styles.primaryBtn}>
    Axtar
  </button>

  <button
    type="button"
    onClick={openCreateModal}
    className={styles.secondaryBtn}
  >
    + Yeni fənn
  </button>
</form>


      {loading && <p>Yüklənir...</p>}
      {error && <p className={styles.error}>Xəta: {error}</p>}

      {!loading && subjects.length === 0 && !error && (
        <p>Heç bir fənn tapılmadı.</p>
      )}

      {!loading && subjects.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Fənn adı</th>
              <th>Təsvir</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {subjects.map((s) => {
              const isExpanded = expandedSubjectId === s.id;
              const topics = topicsBySubject[s.id] || [];

              return (
                <React.Fragment key={s.id}>
                  <tr>
                    <td>{s.name}</td>
                    <td>{s.description}</td>

                    <td className={styles.actions}>
                   
                     <button
  type="button"
  onClick={() => toggleTopics(s.id)}
  className={styles.toggleIconBtn}
  title={isExpanded ? "Mövzuları bağla" : "Mövzuları aç"}
>
  {isExpanded ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
</button>


                   
                      <button
                        type="button"
                        onClick={() => goToSubjectDetail(s.id)}
                        className={styles.iconBtn}
                        title="Fənnə keç"
                      >
                        <FiArrowRightCircle size={18} />
                      </button>

                 
                      <button
                        type="button"
                        onClick={() => openEditModal(s)}
                        className={styles.iconBtn}
                        title="Redaktə"
                      >
                        <FiEdit size={18} />
                      </button>

                
                      <button
  type="button"
  onClick={() => handleDeleteClick(s)}
  className={styles.dangerIconBtn}
  title="Sil"
>
  <FiTrash2 size={18} />
</button>

                    </td>
                  </tr>

                
                  {isExpanded && (
                    <tr>
                      <td colSpan={3}>
                        {topicsLoadingId === s.id ? (
                          <p>Mövzular yüklənir...</p>
                        ) : topics.length === 0 ? (
                          <p>Bu fənn üçün hələ mövzu əlavə edilməyib.</p>
                        ) : (
                         <ul
  className={`${styles.topicList} ${isExpanded ? styles.show : ""}`}
>
  {topics.map((t) => (
    <li key={t.id} className={styles.topicItem}>
      <strong>{t.name}</strong>
      {t.description && <span> — {t.description}</span>}
    </li>
  ))}
</ul>

                        )}
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      )}

      <SubjectFormModal
        isOpen={isModalOpen}
        mode={formMode}
        values={formValues}
        onChange={handleFormChange}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        saving={saving}
        error={error}
      />

      <ConfirmDeleteModal
  isOpen={deleteModalOpen}
  onConfirm={confirmDelete}
  onCancel={cancelDelete}
  message={
    subjectToDelete
      ? `"${subjectToDelete.name}" fənnini silmək istədiyinizə əminsiniz?`
      : ""
  }
/>

    </div>
  );
};

export default SubjectBasePage;
