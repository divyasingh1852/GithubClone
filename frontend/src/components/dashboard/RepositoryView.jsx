// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import FilePreview from "./FilePreview";
// import "./RepositoryView.css";
// import Navbar from "../Navbar";

// const RepositoryView = () => {
//   const { id } = useParams();
//   const [repoInfo, setRepoInfo] = useState(null);
//   const [filesByCommit, setFilesByCommit] = useState({});
//   const [selectedFile, setSelectedFile] = useState(null);

//   useEffect(() => {
//     fetch(`${import.meta.env.VITE_API_BASE_URL}/repo/${id}`)
//       .then((res) => res.json())
//       .then((info) => {
//         setRepoInfo(info); 

//         console.log(" Repo Info Fetched:", info);

//         if (!info?.name) return; 

//         return fetch(`${import.meta.env.VITE_API_BASE_URL}/git/files?repoName=${info.name}`)
//           .then((res) => res.json())
//           .then(({ files }) => {
//             if (files.length === 0) return;

//             const sortedFiles = [...files].sort((a, b) =>
//               a.commitID.localeCompare(b.commitID)
//             );

//             const latestCommitID =
//               sortedFiles[sortedFiles.length - 1].commitID;

//             const latestFiles = files.filter(
//               (file) => file.commitID === latestCommitID
//             );

//             const fileMap = latestFiles.reduce((acc, file) => {
//               acc[file.name] = file;
//               return acc;
//             }, {});

//             setFilesByCommit(fileMap); 
//           });
//       })
//       .catch(console.error);
//   }, [id]); 

//   const handleFileClick = (file) => {
//     if (selectedFile?.name === file.name) {
//       setSelectedFile(null);
//     } else {
//       setSelectedFile(file);
//     }
//   };

//   return (
//     <>
//       <Navbar />
//       <div className="repo-view-wrapper">
//         <div className="repo-sidebar">
//           <h2 className="repo-title">{repoInfo?.name}</h2>
//           <p className="repo-description">{repoInfo?.description}</p>

//           <div className="file-list">
//             {Object.values(filesByCommit).map((file, index) => (
//               <div
//                 className={`file-row ${
//                   selectedFile?.name === file.name ? "selected" : ""
//                 }`}
//                 key={index}
//                 onClick={() => handleFileClick(file)}
//               >
//                 <span className="file-icon">
//                   {file.name.includes(".") ? "📄" : "📁"}
//                 </span>
//                 <span className="file-name">{file.name}</span>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="repo-content">
//           {selectedFile ? (
//             <FilePreview
//               fileUrl={selectedFile.url}
//               fileName={selectedFile.name}
//             />
//           ) : (
//             <div className="file-preview-placeholder">
//               Select a file to preview its contents.
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   );
// };

// export default RepositoryView;














import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FilePreview from "./FilePreview";
import "./RepositoryView.css";
import Navbar from "../Navbar";

const RepositoryView = () => {
  const { id } = useParams();
  const [repoInfo, setRepoInfo] = useState(null);
  const [filesByCommit, setFilesByCommit] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    fetch(`${import.meta.env.VITE_API_BASE_URL}/repo/${id}`, {
      headers: {
        userId: userId,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json();
          alert(err.message || "Unauthorized access");
          navigate("/"); // Redirect if not authorized
          return;
        }

        const info = await res.json();
        setRepoInfo(info);

        if (!info?.name) return;

        return fetch(`${import.meta.env.VITE_API_BASE_URL}/git/files?repoName=${info.name}`)
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

            setFilesByCommit(fileMap);
          });
      })
      .catch((err) => {
        console.error("Error fetching repository:", err);
        alert("Something went wrong.");
      });
  }, [id, navigate]);

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
