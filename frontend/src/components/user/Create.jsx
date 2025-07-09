import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar";
import "./create.css";

const Create = () => {
  const [formData, setFormData] = useState({
    name: "",
    owner: "",
    description: "",
    visibility: true, // Boolean: true = public, false = private
    initializeReadme: false,
    gitignoreTemplate: "",
    license: "",
    content: [],
    issues: [],
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setFormData((prev) => ({
        ...prev,
        owner: userId,
      }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleVisibilityChange = (e) => {
    const value = e.target.value === "true";
    setFormData((prev) => ({
      ...prev,
      visibility: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post("https://13.204.47.216:3000/repo/create", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        alert("Repository created!");
        setFormData((prev) => ({
          ...prev,
          name: "",
          description: "",
          content: [],
          issues: [],
        }));
      } else {
        alert("Could not create repository.");
      }
    } catch (error) {
      console.error("Repo creation error:", error.message);
      alert("Server error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="create-container">
        <h1 style={{ color: "white" }}>Create a new repository</h1>
        <p className="subtitle">
          A repository contains all project files, including the revision history.
          <br />
          Already have a project repository elsewhere? <a href="#">Import a repository</a>.
        </p>
        <p className="note">Required fields are marked with an asterisk (*).</p>

        <form onSubmit={handleSubmit} className="repo-form">
          <div className="form-row">
            <div className="form-group owner">
              <label htmlFor="owner">
                Owner <span className="required">*</span>
              </label>
              <input
                type="text"
                name="owner"
                value={formData.owner}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group slash">/</div>
            <div className="form-group repo-name">
              <label htmlFor="name">
                Repository name <span className="required">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description (optional)</label>
            <textarea
              name="description"
              rows="2"
              value={formData.description}
              onChange={handleChange}
              placeholder="Write a short description"
            />
          </div>

          <hr /><br />

          <div className="form-group">
            <div className="radio-option">
              <input
                type="radio"
                name="visibility"
                value="true"
                checked={formData.visibility === true}
                onChange={handleVisibilityChange}
                id="public"
              />
              <label htmlFor="public">
                <strong>Public</strong>
                <div>Anyone on the internet can see this repository. You choose who can commit.</div>
              </label>
            </div>
            <div className="radio-option">
              <input
                type="radio"
                name="visibility"
                value="false"
                checked={formData.visibility === false}
                onChange={handleVisibilityChange}
                id="private"
              />
              <label htmlFor="private">
                <strong>Private</strong>
                <div>You choose who can see and commit to this repository.</div>
              </label>
            </div>
          </div>

          <hr /><br />

          <div className="form-group checkbox">
            <input
              type="checkbox"
              name="initializeReadme"
              checked={formData.initializeReadme}
              onChange={handleChange}
              id="readme"
            />
            <label htmlFor="readme">
              <strong>Add a README file</strong><br />
              This is where you can write a long description for your project.
            </label>
          </div>

          <div className="form-group">
            <label htmlFor="gitignoreTemplate"><strong>Add .gitignore</strong></label>
            <select
              name="gitignoreTemplate"
              value={formData.gitignoreTemplate}
              onChange={handleChange}
            >
              <option value="">None</option>
              <option value="Node">Node</option>
              <option value="React">React</option>
              <option value="Python">Python</option>
            </select>
            <p className="hint">Choose which files not to track from a list of templates.</p>
          </div>

          <div className="form-group">
            <label htmlFor="license"><strong>Choose a license</strong></label>
            <select
              name="license"
              value={formData.license}
              onChange={handleChange}
            >
              <option value="">None</option>
              <option value="MIT">MIT License</option>
              <option value="Apache-2.0">Apache 2.0</option>
              <option value="GPL-3.0">GPL v3</option>
            </select>
            <p className="hint">A license tells others what they can and can't do with your code.</p>
          </div>

          <hr />
          <p className="hint">
            You are creating a {formData.visibility ? "public" : "private"} repository in your personal account.
          </p>
          <hr />

          <button type="submit" className="create-btn" disabled={loading}>
            {loading ? "Creating..." : "Create repository"}
          </button>
        </form>
      </div>
    </>
  );
};

export default Create;





