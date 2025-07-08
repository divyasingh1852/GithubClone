import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import './Dashboard.css';
import Navbar from "../Navbar";

function Dashboard() {
  const [repositories, setRepositories] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);


  const navigate = useNavigate(); // ✨ ADDED


  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        const response = await fetch(`http://localhost:3000/repo/user/${userId}`);
        const data = await response.json();
        setRepositories(data.repositories);
      } catch (err) {
        console.error("Error while fetching repositories: ", err);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`http://localhost:3000/repo/all`);
        const data = await response.json();
        setSuggestedRepositories(data);
      } catch (err) {
        console.error("Error while fetching suggested repos: ", err);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      // setSearchResults(repositories);
      setSearchResults([]);
    } else {
      const filtered = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filtered);
    }
  }, [searchQuery, repositories]);

  return (
    <>
      <Navbar />
      <div className="github-homepage">
        <div className="columns">
          {/* Left: Suggested Repos */}
          <aside className="left">
            <h3>Top Repositories</h3>
           {suggestedRepositories.map((repo)=>{
          return (
            // <div key={repo._id}>


            <div
                key={repo._id}
                style={{ cursor: "pointer" }} // ✨ ADDED
                onClick={() => navigate(`/repo/${repo._id}`)} // ✨ ADDED
              >


               <h4>{repo.name}</h4>
               <h5>{repo.description}</h5>
            </div>
           );
        })}
          </aside>

          {/* Center: Your Repositories */}
          <main className="center">
            <h3>Home</h3>
            <input
              type="text"
              placeholder="Find a repository..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />

           {searchResults.map((repo)=>{
            return (
            // <div key={repo._id}>


             <div
                key={repo._id}
                style={{ cursor: "pointer" }} // ✨ ADDED
                onClick={() => navigate(`/repo/${repo._id}`)} // ✨ ADDED
              >


               <h4>{repo.name}</h4>
               <h4>{repo.description}</h4>
            </div>
           );
          })}

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
               <li>CodeQL 2.22.1 bring Rust <br/> support to public preview</li>
              <li>Agents page for GitHub Copilot coding agent</li>
              <li>Enterprise enabled policy for GitHub Models updated</li>
              <li>Copilot coding agent now has its own web browser</li>
            </ul>
          </aside>
        </div>


        {/* Footer */}
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
