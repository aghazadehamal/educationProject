import api from "./axios";

export async function startExamSession(payload) {
  const res = await api.post("/api/exam-sessions/start", payload);
  return res.data;
}

export async function autosaveExamSession(payload) {
  const res = await api.post("/api/exam-sessions/autosave", payload);
  return res.data;
}

export async function submitExamSession(payload) {
  const res = await api.post("/api/exam-sessions/submit", payload);
  return res.data;
}
