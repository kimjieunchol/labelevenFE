import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 - JWT 토큰 자동 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터 - 에러 처리
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// AuthController 매핑
export const authAPI = {
  // POST /api/auth/login
  login: (email, password) => api.post("/auth/login", { email, password }),

  // POST /api/auth/register
  register: (username, email, password) =>
    api.post("/auth/register", { username, email, password }),

  // GET /api/auth/check-username?username=xxx
  checkUsername: (username) =>
    api.get("/auth/check-username", { params: { username } }),

  // GET /api/auth/check-email?email=xxx
  checkEmail: (email) => api.get("/auth/check-email", { params: { email } }),
};

// UserController 매핑
export const userAPI = {
  // GET /api/users/me
  getCurrentUser: () => api.get("/users/me"),
};

// ProjectController 매핑
export const projectAPI = {
  // POST /api/projects/upload (multipart/form-data)
  uploadFile: (title, country, file) => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("country", country);
    if (file) {
      formData.append("file", file);
    }
    return api.post("/projects/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  // GET /api/projects
  getProjects: () => api.get("/projects"),

  // GET /api/projects/{id}
  getProject: (id) => api.get(`/projects/${id}`),

  // DELETE /api/projects/{id}
  deleteProject: (id) => api.delete(`/projects/${id}`),

  // POST /api/projects/{id}/images
  uploadImages: (id, files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    return api.post(`/projects/${id}/images`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// LabelDataController 매핑
export const labelDataAPI = {
  // GET /api/label-data/project/{projectId}
  getProjectLabelData: (projectId) =>
    api.get(`/label-data/project/${projectId}`),

  // GET /api/label-data/{id}
  getLabelData: (id) => api.get(`/label-data/${id}`),
};

// PipelineController 매핑
export const pipelineAPI = {
  // POST /api/pipelines/execute
  executePipeline: (projectId, pipelineType, config = {}) =>
    api.post("/pipelines/execute", { projectId, pipelineType, config }),

  // GET /api/pipelines/{id}/status
  getPipelineStatus: (id) => api.get(`/pipelines/${id}/status`),

  // GET /api/pipelines/{id}/result
  getPipelineResult: (id) => api.get(`/pipelines/${id}/result`),

  // POST /api/pipelines/{id}/stop
  stopPipeline: (id) => api.post(`/pipelines/${id}/stop`),

  // POST /api/pipelines/{id}/reexecute
  reExecutePipeline: (id) => api.post(`/pipelines/${id}/reexecute`),
};

// ReportController 매핑
export const reportAPI = {
  // POST /api/reports
  createReport: (projectId, reportType, options = {}) =>
    api.post("/reports", { projectId, reportType, ...options }),

  // GET /api/reports/{id}/status
  getReportStatus: (id) => api.get(`/reports/${id}/status`),

  // GET /api/reports/{id}
  getReport: (id) => api.get(`/reports/${id}`),

  // POST /api/reports/approval
  approveReport: (reportId, approved, reason = "") =>
    api.post("/reports/approval", { reportId, approved, reason }),

  // GET /api/reports
  getReports: (reportType = null) =>
    api.get("/reports", { params: reportType ? { reportType } : {} }),

  // GET /api/reports/{id}/download?format=PDF
  downloadReport: (id, format = "PDF") =>
    api.get(`/reports/${id}/download`, {
      params: { format },
      responseType: "blob",
    }),

  // DELETE /api/reports/{id}
  deleteReport: (id) => api.delete(`/reports/${id}`),
};

export default api;
