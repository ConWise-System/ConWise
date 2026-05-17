export const baseURL = "http://localhost:8000";

const summeryApi = {
  register: {
    url: "/api/auth/register-company",
    method: "post",
  },
  login: {
    url: "/api/auth/login",
    method: "post",
  },
  verifyAccount: {
    url: "/api/auth/verify-account",
    method: "post",
  },
  changePassword: {
    url: "/api/auth/change-password",
    method: "patch",
  },
  userDetails: {
    url: "/api/auth/me",
    method: "get",
  },
  addPersonnel: {
    url: "/api/auth/users",
    method: "post",
  },
  getUsers: {
    url: "/api/auth/users",
    method: "get",
  },
  createProject: {
    url: "/api/projects",
    method: "post",
  },
  getProjects: {
    url: "/api/projects",
    method: "get",
  },
  deleteProject: {
    url: "/api/projects",
    method: "delete",
  },
  createReport:{
    url: "/api/reports",
    method: "post",
  },
  reports: {
    url: "/api/reports/all",
    method: "get",
  },
  /* --- ADDED THIS ENDPOINT --- */
  downloadReport: {
    url: (reportId) => `/api/reports/${reportId}/download`,
    method: "get",
  },
  updateProfile: {
    url: `/api/auth/users`,
    method: "patch",
  },
  deleteReport: {
    url: (reportId) => `/api/reports/${reportId}`,
    method: "delete",
  },
  createProject: {
    url: "/api/projects",
    method: "post",
  },
  getAllProjects: {
    url: "/api/projects",
    method: "get",
  },
  projectMilestones: {
    url: (projectId) => `/api/milestones/${projectId}`,
    method: "get",
  },
  assignTask: {
    url: "/api/tasks",
    method: "post",
  },
  getTasks: {
    url: "/api/projects/{projectId}/tasks",
    method: "get",
  },
  changeTaskStatus: {
    url: "/api/tasks/{taskId}/status",
    method: "patch",
  },  
  uploadImage: {
    url: "/api/upload/image",
    method: "post",
  },
  createIssue: {
    url: (projectId) => `/api/projects/${projectId}/issues`,
    method: "post",
  },
  getAllMaterial: {
    url: "/api/materials",
    method: "get",
  },
  getAllIssues: {
    url: (projectId) => `/api/projects/${projectId}/issues`,
    method: "get",
  },
  updateIssueStatus: {
    // Add projectId as the first argument
    url: (projectId, issueId) =>
      `/api/projects/${projectId}/issues/${issueId}/status`,
    method: "patch",
  },

  // dashboard summary apis for all role
  getDashboardSummary: {
    url: "/api/analytics/dashboard-summary",
    method: "get",
  },
  //  get tasks by assignee( for the user task assigned forit meean)
  getTasksByAssignee: {
    url: "/api/assignee/tasks",
    method: "get",
  },

  // assigned user submit the task so that the task status is changed to DONE 
  submitTask: {
    url: (taskId) => `/api/tasks/${taskId}/submit`,
    method: "patch",
  },

  getIssueByAssignee: {
    url: "/api/projects/issue/assignee",
    method: "get",
  },

  //notification apis
  getNotifications: {
    url: "/api/notifications",
    method: "get",
  },

  readNotification: {
    url: (notificationId) => `/api/notifications/${notificationId}/read`,
    method: "patch",
  },
  
  readAllNotifications: {
    url: "/api/notifications/read-all",
    method: "patch",
  },

  submitTask:{
    url: `/api/tasks/{id}/submit`,
    method: "patch",
  }

};

export default summeryApi;
