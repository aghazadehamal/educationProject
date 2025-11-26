
import api from "./axios";


export async function getSubjects(filters = {}) {
  const {
    name,
    description,
    parentId,
    pageNo = 0,
    pageSize = 20,
  } = filters;

  const params = {};

  if (name && name.trim().length > 0) {
    params.name = name.trim();
  }

  if (description && description.trim().length > 0) {
    params.description = description.trim();
  }

  if (parentId !== undefined && parentId !== null && parentId !== "") {
    params.parentId = parentId;
  }

  params.pageNo = pageNo;
  params.pageSize = pageSize;

  const res = await api.get("/api/subjects", { params });

  console.log("GET SUBJECTS RESPONSE:", res.data);


  return res.data;
}

export async function getSubjectById(id) {
  const res = await api.get(`/api/subjects/${id}`);
  return res.data;
}

export async function createSubject(payload) {
  
  const res = await api.post("/api/subjects", payload);
  return res.data;
}

export async function updateSubject(payload) {
 
  const res = await api.put("/api/subjects", payload);
  return res.data;
}

export async function deleteSubject(id) {
  const res = await api.delete(`/api/subjects/${id}`);
  return res.data;
}
