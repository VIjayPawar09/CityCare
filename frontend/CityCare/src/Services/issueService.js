import api from "./api";

export const fetchMyIssues = () => api.get("/issues/my-issues");
export const reportIssue = (FormData) => api.post("/issues", FormData);
export const updateIssueStatus = (id, status) => api.put(`/issues/${id}`, {status});