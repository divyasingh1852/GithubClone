const fs = require("fs").promises;
const path = require("path");

async function addRepo(repoName, filePath) {
  try {
    if (!repoName || !filePath) throw new Error("Missing repo name or file path");

    const stagingPath = path.resolve(".apnaGit", repoName, "staging");
    await fs.mkdir(stagingPath, { recursive: true });

    const fileName = path.basename(filePath);
    const destination = path.join(stagingPath, fileName);

    await fs.copyFile(path.resolve(filePath), destination);

    console.log(`File '${fileName}' added to '${repoName}' staging area`);
  } catch (err) {
    console.error("Error adding file:", err.message);
  }
}

module.exports = { addRepo };











