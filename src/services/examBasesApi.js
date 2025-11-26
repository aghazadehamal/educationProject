import api from "./axios";

export async function getExamBases(filters = {}) {
  const { title, subjectId, pageNo = 0, pageSize = 20 } = filters;

  const params = {};

  if (title && title.trim().length > 0) {
    params.title = title.trim();
  }

  if (subjectId !== undefined && subjectId !== null && subjectId !== "") {
    params.subjectId = Number(subjectId);
  }

  params.pageNo = pageNo;
  params.pageSize = pageSize;

  const res = await api.get("/api/exam-bases", { params });
  return res.data;
}

export async function createExamBase(payload) {
  const body = {
    title: payload.title,
    durationMinutes: Number(payload.durationMinutes),
    subjectId: Number(payload.subjectId),
  };

  const res = await api.post("/api/exam-bases", body);
  return res.data;
}

export async function updateExamBase(payload) {
  const body = {
    id: payload.id,
    title: payload.title,
    durationMinutes: Number(payload.durationMinutes),
  };

  const res = await api.put("/api/exam-bases", body);
  return res.data;
}

export async function deleteExamBase(id) {
  const res = await api.delete(`/api/exam-bases/${id}`);
  return res.data;
}


export async function getExamBaseQuestions(examBaseId, filters = {}) {
  const { text, pageNo = 0, pageSize = 20 } = filters;

  const params = {};
  if (text && text.trim().length > 0) {
    params.text = text.trim();
  }
  params.pageNo = pageNo;
  params.pageSize = pageSize;

  const res = await api.get(`/api/exam-bases/${examBaseId}/questions`, { params });
  return res.data;
}






export async function uploadExamBaseQuestions(examBaseId, file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post(
    `/api/exam-bases/${examBaseId}/questions`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
}

export async function replaceExamBaseQuestions(examBaseId, file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.put(
    `/api/exam-bases/${examBaseId}/questions`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
}


export async function deleteExamBaseQuestion(examBaseId, questionId) {
  const res = await api.delete(
    `/api/exam-bases/${examBaseId}/questions/${questionId}`
  );
  return res.data;
}

