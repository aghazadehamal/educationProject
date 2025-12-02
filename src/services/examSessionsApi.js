import api from "./axios";

export async function startExamSession(payloadOrExamId) {
  const examId =
    typeof payloadOrExamId === "object"
      ? payloadOrExamId.examId
      : payloadOrExamId;

  const body = {
    examId: Number(examId),
  };

  const res = await api.post("/api/exam-sessions/start", body);
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

export async function resumeExamSession(examId) {
  const res = await api.get(`/api/exam-sessions/${Number(examId)}/resume`);
  return res.data;
}

export async function uploadExamSessionPhoto({
  examId,
  studentNumber,
  timestamp,
  sequenceNumber,
  file,
}) {
  const formData = new FormData();

  if (studentNumber) {
    formData.append("studentNumber", String(studentNumber));
  }

  if (timestamp) {
    formData.append("timestamp", timestamp);
  }

  if (sequenceNumber !== undefined && sequenceNumber !== null) {
    formData.append("sequenceNumber", String(sequenceNumber));
  }

  formData.append("photo", file, "exam-photo.jpg");

  const res = await api.post(
    `/api/exam-sessions/${Number(examId)}/photo`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
}
