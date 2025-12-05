import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// ⭐ 요청 인터셉터 - 모든 요청에 토큰 자동 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("🔑 토큰 추가됨:", token.substring(0, 20) + "...");
    } else {
      console.warn("⚠️ 토큰 없음");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ⭐ 응답 인터셉터 - 401 에러 시 로그인 페이지로 이동
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      console.error("🚫 인증 실패 - 토큰 만료 또는 유효하지 않음");
      localStorage.removeItem("accessToken");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (data) => {
    const response = await apiClient.post("/auth/login", data);
    return response.data; // { success, message, data: { accessToken, userId, username } }
  },
  register: async (data) => {
    const response = await apiClient.post("/auth/register", data);
    return response.data;
  },
  checkUsername: async (username) => {
    const response = await apiClient.get("/auth/check-username", {
      params: { username },
    });
    return response.data;
  },
  checkEmail: async (email) => {
    const response = await apiClient.get("/auth/check-email", {
      params: { email },
    });
    return response.data;
  },
};

// Project API
export const projectAPI = {
  uploadFile: async (formData) => {
    const response = await apiClient.post("/projects/upload", formData);
    return response.data;
  },

  getProjects: async () => {
    const response = await apiClient.get("/projects");
    return response.data;
  },

  getProject: async (id) => {
    const response = await apiClient.get(`/projects/${id}`);
    return response.data;
  },

  deleteProject: async (id) => {
    const response = await apiClient.delete(`/projects/${id}`);
    return response.data;
  },

  uploadImages: async (projectId, files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file);
    });

    // Content-Type 제거 ✅
    const response = await apiClient.post(
      `/projects/${projectId}/images`,
      formData
    );
    return response.data;
  },
};

// Report API
export const reportAPI = {
  createReport: async (data) => {
    const response = await apiClient.post("/reports", data);
    return response.data;
  },
  getReportStatus: async (id) => {
    const response = await apiClient.get(`/reports/${id}/status`);
    return response.data;
  },
  getReport: async (id) => {
    const response = await apiClient.get(`/reports/${id}`);
    return response.data;
  },
  approveReport: async (data) => {
    const response = await apiClient.post("/reports/approval", data);
    return response.data;
  },
  getReports: async (reportType) => {
    const response = await apiClient.get("/reports", {
      params: { reportType },
    });
    return response.data;
  },
  downloadReport: async (id, format = "PDF") => {
    const response = await apiClient.get(`/reports/${id}/download`, {
      params: { format },
    });
    return response.data;
  },
  deleteReport: async (id) => {
    const response = await apiClient.delete(`/reports/${id}`);
    return response.data;
  },
};

// Pipeline API
export const pipelineAPI = {
  executePipeline: async (data) => {
    const response = await apiClient.post("/pipelines/execute", data);
    return response.data;
  },
  getPipelineStatus: async (id) => {
    const response = await apiClient.get(`/pipelines/${id}/status`);
    return response.data;
  },
  getPipelineResult: async (id) => {
    const response = await apiClient.get(`/pipelines/${id}/result`);
    return response.data;
  },
  stopPipeline: async (id) => {
    const response = await apiClient.post(`/pipelines/${id}/stop`);
    return response.data;
  },
  reExecutePipeline: async (id) => {
    const response = await apiClient.post(`/pipelines/${id}/reexecute`);
    return response.data;
  },
};

// User API
export const userAPI = {
  getCurrentUser: async () => {
    const response = await apiClient.get("/users/me");
    return response.data;
  },
  updateUser: async (data) => {
    const response = await apiClient.put("/users/me", data);
    return response.data;
  },
  changePassword: async (data) => {
    const response = await apiClient.put("/users/me/password", data);
    return response.data;
  },
};

// Label Data API
export const labelDataAPI = {
  getProjectLabelData: async (projectId) => {
    const response = await apiClient.get(`/label-data/project/${projectId}`);
    return response.data;
  },
  getLabelData: async (id) => {
    const response = await apiClient.get(`/label-data/${id}`);
    return response.data;
  },
};

export default apiClient;
