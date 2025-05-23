import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api", // Make sure your backend runs on this
  withCredentials: true, // if you're using cookies for auth
});

// ===========================
//         ISSUE APIs
// ===========================

// Report a new issue
export const reportIssue = async (formData) => {
  const res = await API.post("/issues", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Get issues reported by the current user (citizen)
export const getMyIssues = async () => {
  const res = await API.get("/issues/my-issues");
  return res.data;
};

// Get all issues (admin only)
export const getAllIssues = async () => {
  const res = await API.get("/issues");
  return res.data;
};

// Update status of an issue (admin/volunteer)
export const updateIssueStatus = async (id, newStatus) => {
  const res = await API.put(`/issues/${id}`, { status: newStatus });
  return res.data;
};

// Get issue stats for dashboard (admin)
export const getIssueStats = async () => {
  const res = await API.get("/issues/stats");
  return res.data;
};

export default API;
