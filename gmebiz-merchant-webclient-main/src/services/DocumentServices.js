import http from "src/configs/http-common"

const getDocuments = data => {
  return http.post("/admin/documents", data)
}

const downloadDocuments = data => {
  return http.post("/admin/documents/download", data)
}

const viewDocuments = data => {
  return http.post('/document/view', data)
}

const DocumentServices = {
  getDocuments,
  downloadDocuments,
  viewDocuments
}

export default DocumentServices
