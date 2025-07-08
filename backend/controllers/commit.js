const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require("uuid");

async function commitRepo(repoName, message) {
  try {
    if (!repoName) throw new Error("Repository name is required.");

    const repoPath = path.resolve(".apnaGit", repoName);
    const stagedPath = path.join(repoPath, "staging");
    const commitPath = path.join(repoPath, "commits");

    const commitID = uuidv4();
    const commitDir = path.join(commitPath, commitID);
    await fs.mkdir(commitDir, { recursive: true });

    const files = await fs.readdir(stagedPath);
    for (const file of files) {
      await fs.copyFile(
        path.join(stagedPath, file),
        path.join(commitDir, file)
      );
    }

    await fs.writeFile(
      path.join(commitDir, "commit.json"),
      JSON.stringify({ message, date: new Date().toISOString() }, null, 2)
    );

    console.log(`Commit ${commitID} created in '${repoName}' with message: ${message}`);
  } catch (err) {
    console.error("Error committing files:", err.message);
  }
}

module.exports = { commitRepo };











































