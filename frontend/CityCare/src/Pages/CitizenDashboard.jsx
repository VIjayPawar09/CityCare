import React,{ useEffect, useState } from "react";
import { useAuth } from "../Context/AuthContext";
import API from "../Services/api";
import { Link } from "react-router-dom";

function CitizenDashboard() {
  const { user } = useAuth();
  const [issues, setIssues] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    photo: null,
  });

  // Fetch issues reported by the logged-in user
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await API.get("/issues/my-issues");
        setIssues(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchIssues();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "photo") {
      setFormData({ ...formData, photo: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("location", formData.location);
    data.append("photo", formData.photo);

    try {
      await API.post("/issues", data);
      alert("Issue reported successfully!");
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Failed to report issue");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name}</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 bg-white p-4 rounded-lg shadow-md space-y-4"
      >
        <Link to="/report" className="text-blue-500 text-xl font-semibold underline">
          Report a new issue
        </Link>

        {/* <h2 className="text-xl font-semibold">Report an Issue</h2> */}
        <input
          type="text"
          name="title"
          placeholder="Issue title"
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="file"
          name="photo"
          onChange={handleChange}
          accept="image/*"
          className="w-full"
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Submit Issue
        </button>
      </form>

      <div>
        <h2 className="text-xl font-semibold mb-2">Your Reported Issues</h2>
        {issues.length === 0 ? (
          <p>No issues reported yet.</p>
        ) : (
          <ul className="grid gap-4">
            {issues.map((issue) => (
              <li key={issue._id} className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold">{issue.title}</h3>
                <p>{issue.description}</p>
                <p className="text-sm text-gray-600">
                  Location: {issue.location}
                </p>
                <p className="text-sm font-medium text-yellow-700">
                  Status: {issue.status}
                </p>
                {issue.image && (
                  <img
                    src={`http://localhost:5000/uploads/${issue.image}`}
                    alt="issue"
                    className="mt-2 rounded h-40 object-cover"
                  />
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CitizenDashboard;
