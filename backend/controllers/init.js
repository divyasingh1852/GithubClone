const fs = require("fs").promises;
const path = require("path");

async function initRepo(repoName) {
  try {
    if (!repoName) throw new Error("Please provide a repository name");

    const repoPath = path.resolve(process.cwd(), ".apnaGit", repoName); 
    const commitsPath = path.join(repoPath, "commits");

    await fs.mkdir(commitsPath, { recursive: true });

    await fs.writeFile(
      path.join(repoPath, "config.json"),
      JSON.stringify({ bucket: process.env.S3_BUCKET, repoName }, null, 2)
    );

    console.log(`Repository '${repoName}' initialized in .apnaGit/${repoName}`);
  } catch (err) {
    console.error("Error initializing repository:", err.message);
  }
}

module.exports = { initRepo };









