
import api from "./axios";


export async function getStudents({
  page = 0,       
  pageSize = 10,
  studentNumber = "",
  firstName = "",
  lastName = "",
  phone = "",
} = {}) {

  const params = {
    pageNo: page + 1,  
    pageSize,
  };

 
  if (studentNumber && studentNumber.trim().length > 0) {
    params.studentNumber = studentNumber.trim();
  }
  if (firstName && firstName.trim().length > 0) {
    params.firstName = firstName.trim();
  }
  if (lastName && lastName.trim().length > 0) {
    params.lastName = lastName.trim();
  }
  if (phone && phone.trim().length > 0) {
    params.phone = phone.trim();
  }

  const res = await api.get("/api/students", { params });

  console.log("GET STUDENTS RESPONSE:", res.data);
  return res.data;
}


export async function createStudent(student) {

  const res = await api.post("/api/students", student);
  return res.data;
}



export async function updateStudent(student) {
 
  const res = await api.put("/api/students", student);
  return res.data;
}



export async function deleteStudent(id) {
  const res = await api.delete(`/api/students/${id}`);
  return res.data;
}



export async function getStudentDetail(studentNumber) {
  const res = await api.get(`/api/students/${studentNumber}`);
  console.log("GET STUDENT DETAIL RESPONSE:", res.data);
  return res.data; 
 
}

export async function assignSubjectsToStudent(studentNumber, subjectIds) {
  const res = await api.post(`/api/students/${studentNumber}/subjects`, {
    subjectIds, 
  });
  return res.data; 
}