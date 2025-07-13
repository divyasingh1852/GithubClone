import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FilePreview.css";

const FilePreview = ({ fileUrl, fileName }) => {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
     const BASE_URL = import.meta.env.VITE_API_BASE_URL;
     console.log(" Base URL:", BASE_URL);           
     console.log(" File URL:", fileUrl);              

    const fetchFile = async () => {
      try {
         const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/proxy-file`, {
          params: { url: fileUrl },
        });

        if (typeof response.data === "object") {
          setContent(JSON.stringify(response.data, null, 2));
        } else {
          setContent(response.data);
        }
      } catch (err) {
        console.error("Error loading file:", err.message);
        setError(" Error loading file.");
      }
    };

    if (fileUrl) fetchFile();
  }, [fileUrl]);

  if (error) return <div className="file-error">{error}</div>;

  return (
    <div className="file-preview-container">
      <div className="file-header">📄 {fileName}</div>
      <pre className="file-content">{content}</pre>
    </div>
  );
};

export default FilePreview;
