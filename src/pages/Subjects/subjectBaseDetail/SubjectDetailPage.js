import React, { useEffect, useState, useCallback } from "react";

import { useParams, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/common/pageheader/PageHeader";
import { FiEdit, FiTrash2, FiArrowLeft } from "react-icons/fi";

import {
  getSubjectById,
  getSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
} from "../../../services/subjectsApi";

import TopicFormModal from "../topicPage/TopicFormModal";
import ConfirmDeleteModal from "../../../components/common/deleteModal/ConfirmDeleteModal";
import styles from "./SubjectDetailPage.module.css";

const SubjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const subjectId = Number(id);

  const [subject, setSubject] = useState(null);
  const [topics, setTopics] = useState([]);

  const [loadingSubject, setLoadingSubject] = useState(false);
  const [loadingTopics, setLoadingTopics] = useState(false);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formMode, setFormMode] = useState("create"); 
  const [formValues, setFormValues] = useState({
    id: null,
    name: "",
    description: "",
  });
  const [saving, setSaving] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [topicToDelete, setTopicToDelete] = useState(null);
const fetchSubject = useCallback(async () => {
  try {
    setLoadingSubject(true);
    setError("");
    const raw = await getSubjectById(subjectId);
    const data = raw?.data || raw;
    setSubject(data);
  } catch (err) {
    const msg =
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err.message ||
      "Fənn yüklənərkən xəta baş verdi";
    setError(msg);
  } finally {
    setLoadingSubject(false);
  }
}, [subjectId]);

const fetchTopics = useCallback(
  async (searchTerm) => {
    try {
      setLoadingTopics(true);
      setError("");

      const filters = {
        parentId: subjectId,
        pageNo: 0,
        pageSize: 100,
      };

      if (searchTerm && searchTerm.trim().length > 0) {
        filters.name = searchTerm.trim();
      }

      const data = await getSubjects(filters);
      const list = Array.isArray(data?.content) ? data.content : [];
      setTopics(list);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Mövzular yüklənərkən xəta baş verdi";
      setError(msg);
    } finally {
      setLoadingTopics(false);
    }
  },
  [subjectId]
);


  useEffect(() => {
  if (!Number.isNaN(subjectId)) {
    fetchSubject();
    fetchTopics();
  }
}, [subjectId, fetchSubject, fetchTopics]);


  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchTopics(search);
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

  const openEditModal = (topic) => {
    setFormMode("edit");
    setFormValues({
      id: topic.id,
      name: topic.name || "",
      description: topic.description || "",
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
        setError("Mövzu adı boş ola bilməz");
        setSaving(false);
        return;
      }

      if (formMode === "create") {
        await createSubject({
          name: formValues.name.trim(),
          description: formValues.description?.trim() || "",
          parentId: subjectId,
        });
      } else {
        await updateSubject({
          id: formValues.id,
          name: formValues.name.trim(),
          description: formValues.description?.trim() || "",
          parentId: subjectId,
        });
      }

      closeModal();
      fetchTopics(search);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Əməliyyat zamanı xəta baş verdi";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };


  const openDeleteTopicModal = (topic) => {
    setTopicToDelete(topic);
    setDeleteModalOpen(true);
  };

  const confirmDeleteTopic = async () => {
    if (!topicToDelete) return;

    try {
      setLoadingTopics(true);
      setError("");
      await deleteSubject(topicToDelete.id);
      setDeleteModalOpen(false);
      setTopicToDelete(null);
      fetchTopics(search);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err.message ||
        "Silinmə zamanı xəta baş verdi";
      setError(msg);
    } finally {
      setLoadingTopics(false);
    }
  };

  const cancelDeleteTopic = () => {
    setDeleteModalOpen(false);
    setTopicToDelete(null);
  };

  const goBack = () => {
    navigate("/subjects/base");
  };

  return (
    <div className={styles.container}>
      <PageHeader
        title={subject ? `Fənn: ${subject.subjectBase.name}` : "Fənn detalları"}
      />

      <div className={styles.topBar}>
        <button type="button" onClick={goBack} className={styles.backBtn}>
          <FiArrowLeft size={16} />
          <span>Geri</span>
        </button>

        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Mövzu adına görə axtar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.primaryBtn}>
            Axtar
          </button>
        </form>

        <button
          type="button"
          onClick={openCreateModal}
          className={styles.secondaryBtn}
        >
          + Yeni mövzu
        </button>
      </div>

      {loadingSubject && <p>Fənn məlumatı yüklənir...</p>}
      {loadingTopics && <p>Mövzular yüklənir...</p>}
      {error && <p className={styles.error}>{error}</p>}

      {!loadingTopics && topics.length === 0 && !error && (
        <p>Bu fənn üçün hələ mövzu əlavə edilməyib.</p>
      )}

      {!loadingTopics && topics.length > 0 && (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Mövzu adı</th>
              <th>Təsvir</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {topics.map((t) => (
              <tr key={t.id}>
                <td>{t.name}</td>
                <td>{t.description}</td>
                <td className={styles.actions}>
                  <button
                    type="button"
                    onClick={() => openEditModal(t)}
                    className={styles.iconBtn}
                    title="Redaktə"
                  >
                    <FiEdit size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => openDeleteTopicModal(t)}
                    className={styles.dangerIconBtn}
                    title="Sil"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <TopicFormModal
        isOpen={isModalOpen}
        mode={formMode}
        values={formValues}
        onChange={handleFormChange}
        onClose={closeModal}
        onSubmit={handleFormSubmit}
        saving={saving}
        error={error}
        subjectName={subject?.name}
      />

    
      <ConfirmDeleteModal
        isOpen={deleteModalOpen}
        onConfirm={confirmDeleteTopic}
        onCancel={cancelDeleteTopic}
        message={
          topicToDelete
            ? `"${topicToDelete.name}" mövzusunu silmək istədiyinizə əminsiniz?`
            : ""
        }
      />
    </div>
  );
};

export default SubjectDetailPage;
