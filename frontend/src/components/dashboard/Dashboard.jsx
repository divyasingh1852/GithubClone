// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import './dashboard.css';
// import Navbar from "../Navbar";

// function Dashboard() {
//   const [repositories, setRepositories] = useState([]);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [suggestedRepositories, setSuggestedRepositories] = useState([]);
//   const [searchResults, setSearchResults] = useState([]);
//   const [loading, setLoading] = useState(true); 

//   const navigate = useNavigate();

//   useEffect(() => {
//     const userId = localStorage.getItem("userId");

//     const fetchRepositories = async () => {
//       try {
//         const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/repo/user/${userId}`);
//         const data = await response.json();
//         setRepositories(data.repositories);
//       } catch (err) {
//         console.error("Error while fetching repositories: ", err);
//       }
//     };

//     const fetchSuggestedRepositories = async () => {
//       try {
//         setLoading(true); 
//         const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/repo/all`);
//         const data = await response.json();
//         setSuggestedRepositories(data);
//       } catch (err) {
//         console.error("Error while fetching suggested repos: ", err);
//       } finally {
//         setLoading(false); 
//       }
//     };

//     fetchRepositories();
//     fetchSuggestedRepositories();
//   }, []);

//   useEffect(() => {
//     if (searchQuery === "") {
//       setSearchResults([]);
//     } else {
//       const filtered = repositories.filter((repo) =>
//         repo.name.toLowerCase().startsWith(searchQuery.trim().toLowerCase()) 
//       );
//       setSearchResults(filtered);
//     }
//   }, [searchQuery, repositories]);

//   return (
//     <>
//       <Navbar />
//       <div className="github-homepage">
//         <div className="columns">
//           <aside className="left">
//             <h3>Top Repositories</h3>
//             {loading ? (
//               <div>Loading Top Repositories...</div> 
//             ) : (
//               suggestedRepositories.map((repo) => (
//                 <div
//                   key={repo._id}
//                   style={{ cursor: "pointer" }}
//                   onClick={() => navigate(`/repo/${repo._id}`)}
//                 >
//                   <h4>{repo.name}</h4>
//                   <h5>{repo.description}</h5>
//                 </div>
//               ))
//             )}
//           </aside>

//           <main className="center">
//             <h3>Home</h3>
//             <input
//               type="text"
//               placeholder="Find a repository..."
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               className="search-input"
//             />

//             {searchResults.map((repo) => {
//               return(

//               <div
//                 key={repo._id}
//                 style={{ cursor: "pointer" }}
//                 onClick={() => navigate(`/repo/${repo._id}`)}
//               >
//                 <h4>{repo.name}</h4>
//                 <h5>{repo.description}</h5>
//               </div>
//               );
//             })}

//             <h3>Trending repositories · <a href="#">See more</a></h3>
//             <ul className="trending-list">
//               <li>
//                 <strong>@bytedance</strong>/trae-agent
//                 <div className="lang">Python • 2.7k</div>
//               </li>
//               <li>
//                 <strong>@coleam00</strong>/context-engineering-intro
//                 <div className="lang">2.1k</div>
//               </li>
//               <li>
//                 <strong>@kishanrajput23</strong>/Love-Babbar-Web-Development-Course
//                 <div className="lang">HTML • 59</div>
//               </li>
//             </ul>
//           </main>

//           <aside className="right">
//             <h3>Latest Changes</h3>
//             <ul className="events-list">
//               <li>CodeQL 2.22.1 bring Rust support to public preview</li>
//               <li>Agents page for GitHub Copilot coding agent</li>
//               <li>Enterprise enabled policy for GitHub Models updated</li>
//               <li>Copilot coding agent now has its own web browser</li>
//             </ul>
//           </aside>
//         </div>

//         <footer className="footer">
//           <div>© 2025 GitHub, Inc.</div>
//           <ul className="footer-links">
//             <li>Terms</li>
//             <li>Privacy</li>
//             <li>Security</li>
//             <li>Status</li>
//             <li>Docs</li>
//             <li>Contact</li>
//             <li>Manage cookies</li>
//             <li>Do not share my personal information</li>
//           </ul>
//         </footer>
//       </div>
//     </>
//   );
// }

// export default Dashboard;










import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './dashboard.css';
import Navbar from "../Navbar";

function Dashboard() {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/repo/user/${userId}`);
        const data = await response.json();
        setRepositories(data.repositories || []);
      } catch (err) {
        console.error("Error while fetching repositories: ", err);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/repo/all`);
        const data = await response.json();
        setSuggestedRepositories(data || []);
      } catch (err) {
        console.error("Error while fetching suggested repos: ", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults([]);
    } else {
      const filtered = repositories.filter((repo) =>
        repo.name.toLowerCase().startsWith(searchQuery.trim().toLowerCase())
      );
      setSearchResults(filtered);
    }
  }, [searchQuery, repositories]);

  return (
    <>
      <Navbar />
      <div className="github-homepage">
        <div className="columns">
          <aside className="left">
            <h3>Top Repositories</h3>
            {loading ? (
              <div>Loading Top Repositories...</div>
            ) : (
              suggestedRepositories.map((repo) => (
                <div
                  key={repo._id}
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(`/repo/${repo._id}`)}
                >
                  <h4>{repo.name}</h4>
                  <h5>{repo.description}</h5>
                </div>
              ))
            )}
          </aside>

          <main className="center">
            <h3>Home</h3>

            <div className="search-container">
              <input
                type="text"
                placeholder="Find a repository..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {searchQuery && searchResults.length > 0 && (
                <div className="search-dropdown">
                  {searchResults.map((repo) => (
                    <div
                      key={repo._id}
                      className="search-result"
                      onClick={() => navigate(`/repo/${repo._id}`)}
                    >
                      <strong>{repo.name}</strong>
                      <p className="repo-desc">{repo.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <h3>Trending repositories · <a href="#">See more</a></h3>
            <ul className="trending-list">
              <li>
                <strong>@bytedance</strong>/trae-agent
                <div className="lang">Python • 2.7k</div>
              </li>
              <li>
                <strong>@coleam00</strong>/context-engineering-intro
                <div className="lang">2.1k</div>
              </li>
              <li>
                <strong>@kishanrajput23</strong>/Love-Babbar-Web-Development-Course
                <div className="lang">HTML • 59</div>
              </li>
            </ul>
          </main>

          <aside className="right">
            <h3>Latest Changes</h3>
            <ul className="events-list">
              <li>CodeQL 2.22.1 bring Rust support to public preview</li>
              <li>Agents page for GitHub Copilot coding agent</li>
              <li>Enterprise enabled policy for GitHub Models updated</li>
              <li>Copilot coding agent now has its own web browser</li>
            </ul>
          </aside>
        </div>

        <footer className="footer">
          <div>© 2025 GitHub, Inc.</div>
          <ul className="footer-links">
            <li>Terms</li>
            <li>Privacy</li>
            <li>Security</li>
            <li>Status</li>
            <li>Docs</li>
            <li>Contact</li>
            <li>Manage cookies</li>
            <li>Do not share my personal information</li>
          </ul>
        </footer>
      </div>
    </>
  );
}

export default Dashboard;



















