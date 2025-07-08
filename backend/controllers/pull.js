const fs = require("fs").promises;
const path = require("path");
const { s3, S3_BUCKET } = require("../config/aws-config");

async function pullRepo(repoName) {
  try {
    if (!repoName) throw new Error("Repository name is required to pull");

    const prefix = `repos/${repoName}/commits/`;

    const data = await s3.listObjectsV2({
      Bucket: S3_BUCKET,
      Prefix: prefix,
    }).promise();

    const objects = data.Contents;

    for (const object of objects) {
      const key = object.Key;
      if (key.endsWith("/")) continue; 

      const parts = key.split("/");
      const commitID = parts[3];
      const fileName = parts[4];

      const localCommitDir = path.resolve(".apnaGit", repoName, "commits", commitID);
      await fs.mkdir(localCommitDir, { recursive: true });

      const fileContent = await s3.getObject({ Bucket: S3_BUCKET, Key: key }).promise();
      await fs.writeFile(path.join(localCommitDir, fileName), fileContent.Body);

      console.log(`Pulled '${fileName}' → '${repoName}' → commit '${commitID}'`);
    }

    console.log(`All commits for '${repoName}' pulled from S3`);
  } catch (err) {
    console.error("Pull failed:", err.message);
  }
}

module.exports = { pullRepo };