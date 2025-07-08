const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config");

async function pushRepo(repoName) {
  try {
    if (!repoName) throw new Error("Repo name is required.");

    const commitsPath = path.resolve(".apnaGit", repoName, "commits");

    const exists = await fs.stat(commitsPath).catch(() => null);
    if (!exists) throw new Error(`Local repo '${repoName}' not found.`);

    const commitDirs = await fs.readdir(commitsPath);
    if (commitDirs.length === 0) throw new Error(`No commits found in '${repoName}'.`);

    for (const commitID of commitDirs) {
      const commitDirPath = path.join(commitsPath, commitID);
      const files = await fs.readdir(commitDirPath);

      if (files.length === 0) {
        console.log(`Commit '${commitID}' has no files.`);
        continue;
      }

      for (const file of files) {
        const filePath = path.join(commitDirPath, file);
        const content = await fs.readFile(filePath);

        const s3Key = `repos/${repoName}/commits/${commitID}/${file}`;
        const params = {
          Bucket: S3_BUCKET,
          Key: s3Key,
          Body: content,
        };

        console.log(`Uploading → ${s3Key}`);
        await s3.upload(params).promise();
        console.log(`Pushed '${file}' from commit '${commitID}'`);
      }
    }

    console.log(`Finished pushing repo '${repoName}'`);
  } catch (err) {
    console.error("Push error:", err.message);
  }
}

module.exports = { pushRepo };