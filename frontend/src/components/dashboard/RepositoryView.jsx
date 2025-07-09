import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FilePreview from "./FilePreview";
import "./RepositoryView.css";
import Navbar from "../Navbar";

const RepositoryView = () => {
  const { id } = useParams();
  const [repoInfo, setRepoInfo] = useState(null);
  const [filesByCommit, setFilesByCommit] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    // 🔄 COMBINED FETCH: First get repo info...
    fetch(`http://13.204.47.216:3000/repo/${id}`)
      .then((res) => res.json())
      .then((data) => {
        const info = data[0];
        setRepoInfo(info); // ✅ SET repoInfo before fetching files

        if (!info?.name) return; // ✅ ADDED: Safety check to prevent null access

        // 🔄 NESTED FETCH: Now get files for this repo
        return fetch(`http://13.204.47.216:3000/git/files?repoName=${info.name}`)
          .then((res) => res.json())
          .then(({ files }) => {
            if (files.length === 0) return;

            const sortedFiles = [...files].sort((a, b) =>
              a.commitID.localeCompare(b.commitID)
            );

            const latestCommitID =
              sortedFiles[sortedFiles.length - 1].commitID;

            const latestFiles = files.filter(
              (file) => file.commitID === latestCommitID
            );

            const fileMap = latestFiles.reduce((acc, file) => {
              acc[file.name] = file;
              return acc;
            }, {});

            setFilesByCommit(fileMap); // ✅ SET file state after commit filtering
          });
      })
      .catch(console.error);
  }, [id]); // ✅ SINGLE HOOK handles everything

  const handleFileClick = (file) => {
    if (selectedFile?.name === file.name) {
      setSelectedFile(null);
    } else {
      setSelectedFile(file);
    }
  };

  return (
    <>
      <Navbar />
      <div className="repo-view-wrapper">
        <div className="repo-sidebar">
          <h2 className="repo-title">{repoInfo?.name}</h2>
          <p className="repo-description">{repoInfo?.description}</p>

          <div className="file-list">
            {Object.values(filesByCommit).map((file, index) => (
              <div
                className={`file-row ${
                  selectedFile?.name === file.name ? "selected" : ""
                }`}
                key={index}
                onClick={() => handleFileClick(file)}
              >
                <span className="file-icon">
                  {file.name.includes(".") ? "📄" : "📁"}
                </span>
                <span className="file-name">{file.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="repo-content">
          {selectedFile ? (
            <FilePreview
              fileUrl={selectedFile.url}
              fileName={selectedFile.name}
            />
          ) : (
            <div className="file-preview-placeholder">
              Select a file to preview its contents.
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RepositoryView;