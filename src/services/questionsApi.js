import api from "./axios";

export const getQuestionsByExamBase = async (examBaseId, params = {}) => {
  const res = await api.get(`/api/exam-bases/${examBaseId}/questions`, {
    params,
  });
  return res.data;
};

export const createQuestion = async (examBaseId, payload, file) => {
  const formData = new FormData();
  const jsonBlob = new Blob([JSON.stringify(payload)], {
    type: "application/json",
  });
  formData.append("payload", jsonBlob);

  if (file) {
    formData.append("file", file);
  }

  const res = await api.post(
    `/api/exam-bases/${examBaseId}/questions`,
    formData
  );
  return res.data;
};

export const updateQuestion = async (examBaseId, payload, file) => {
  const formData = new FormData();
  const jsonBlob = new Blob([JSON.stringify(payload)], {
    type: "application/json",
  });
  formData.append("payload", jsonBlob);

  if (file) {
    formData.append("file", file);
  }

  const res = await api.put(
    `/api/exam-bases/${examBaseId}/questions`,
    formData
  );
  return res.data;
};

export const deleteQuestion = async (examBaseId, questionId) => {
  const res = await api.delete(
    `/api/exam-bases/${examBaseId}/questions/${questionId}`
  );
  return res.data;
};
