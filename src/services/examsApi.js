import api from "./axios";

export async function getExams(filters = {}) {
  const {
    examBaseId,
    scheduledStartTimeFrom,
    scheduledStartTimeTo,
    status,
    createdBy,
    pageNo = 1,   
    pageSize = 10,
  } = filters;

  const params = {};

  if (examBaseId !== undefined && examBaseId !== null && examBaseId !== "") {
    params.examBaseId = Number(examBaseId);
  }

  if (scheduledStartTimeFrom) {
    params.scheduledStartTimeFrom = scheduledStartTimeFrom;
  }

  if (scheduledStartTimeTo) {
    params.scheduledStartTimeTo = scheduledStartTimeTo;
  }

  if (status && status.trim().length > 0) {
    params.status = status.trim();
  }

  if (createdBy && createdBy.trim().length > 0) {
    params.createdBy = createdBy.trim();
  }

 params.pageNo = pageNo;
  params.pageSize = pageSize;

  const res = await api.get("/api/exams", { params });
  return res.data;
}

export async function createExam(payload) {
  const body = {
    examBaseId: Number(payload.examBaseId),
    assignedStudentNumbers: payload.assignedStudentNumbers,
    scheduledStartTime: payload.scheduledStartTime,
    scheduledEndTime: payload.scheduledEndTime,
    note: payload.note,
  };

  const res = await api.post("/api/exams", body);
  return res.data;
}

export async function updateExam(payload) {
  const body = {
    id: Number(payload.id),
    assignedStudentNumbers: payload.assignedStudentNumbers,
    scheduledStartTime: payload.scheduledStartTime,
    scheduledEndTime: payload.scheduledEndTime,
    note: payload.note,
  };

  const res = await api.put("/api/exams", body);
  return res.data;
}

export async function cancelExam(id) {
  const res = await api.patch(`/api/exams/${Number(id)}/cancel`);
  return res.data;
}

export async function getExamById(id) {
  const res = await api.get(`/api/exams/${Number(id)}`);
  return res.data;
}

export async function getMyExams() {
  const res = await api.get("/api/exams/my");
  return res.data;
}



