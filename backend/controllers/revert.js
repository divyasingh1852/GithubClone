const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

const readdir = promisify(fs.readdir);
const copyFile = promisify(fs.copyFile);

async function revertRepo(repoName, commitID) {
  try {
    const repoPath = path.resolve(".apnaGit", repoName);
    const commitDir = path.join(repoPath, "commits", commitID);

    const stagingDir = path.join(repoPath, "staging");
    await fs.promises.mkdir(stagingDir, { recursive: true });

    const files = await readdir(commitDir);
    for (const file of files) {
      if (file === "commit.json") continue;
      await copyFile(
        path.join(commitDir, file),
        path.join(stagingDir, file) 
      );
    }

    console.log(`⏪ Reverted '${repoName}' to commit '${commitID}'`);
  } catch (err) {
    console.error("🚨 Unable to revert:", err.message);
  }
}

module.exports = { revertRepo };


