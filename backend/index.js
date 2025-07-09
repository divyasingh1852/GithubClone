const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const http = require("http");
const { Server } = require("socket.io");
const mainRouter = require("./routes/main.router");
const axios = require("axios");


const yargs = require("yargs");
const { hideBin } = require("yargs/helpers");

const { initRepo } = require("./controllers/init");
const { addRepo } = require("./controllers/add");
const { commitRepo } = require("./controllers/commit");
const { pushRepo } = require("./controllers/push");
const { pullRepo } = require("./controllers/pull");
const { revertRepo } = require("./controllers/revert");


const { s3, S3_BUCKET } = require("./config/aws-config");


dotenv.config();

yargs(hideBin(process.argv))
  .command("start", "Starts a new server", {}, startServer)
  // .command("init", "Initialise a new repository", {}, initRepo)

  .command(
  "init <repoName>",
  "Initialize a new repository",
  (yargs) => {
    yargs.positional("repoName", {
      describe: "Name of the repository to initialize",
      type: "string"
    });
  },
  (argv) => initRepo(argv.repoName) // ✅ pass the repoName argument
)

  // .command(
  //   "add <file>", 
  //   "Add a file to the repository", 
  //   (yargs) => {
  //       yargs.positional("file", {
  //          describe: "File to add to the staging area",
  //          type: "string",
  //       });
  //   },
  //   (argv) => {
  //     addRepo(argv.file);
  //   }
  // )



   .command("add <repoName> <file>", "Add a file to repo staging", (yargs) => {
    yargs
      .positional("repoName", {
        describe: "Repository name",
        type: "string"
      })
      .positional("file", {
        describe: "Path to file to add",
        type: "string"
      });
  }, (argv) => addRepo(argv.repoName, argv.file)) // ✅ CHANGED





  // .command(
  //   "commit <message>", 
  //   "Commit the staged files", 
  //   (yargs) => {
  //       yargs.positional("message", {
  //          describe: "Commit message",
  //          type: "string",
  //       });
  //   },
  //   (argv) => {
  //      commitRepo(argv.message);
  //   }
  // )


  .command("commit <repoName> <message>", "Commit staged files", yargs => {
    yargs
      .positional("repoName", {
        describe: "Repository name",
        type: "string"
      })
      .positional("message", {
        describe: "Commit message",
        type: "string"
      });
  }, argv => commitRepo(argv.repoName, argv.message)) // ✅ CHANGED




  // .command("push", "Push commits to S3", {}, pushRepo)


   .command("push <repoName>", "Push to specific repo", yargs => {
    yargs.positional("repoName", {
      describe: "Name of the repo to push",
      type: "string",
    });
  }, argv => pushRepo(argv.repoName)) // ✅ key change: pass repoName




  // .command("pull", "Pull commits to S3", {}, pullRepo)

  .command("pull <repoName>", "Pull commits for a specific repo", (yargs) => {
  yargs.positional("repoName", {
    describe: "Repository name to pull from S3",
    type: "string",
  });
}, (argv) => pullRepo(argv.repoName)) // ✅ CHANGED: pass repoName




  // .command(
  //   "revert <commitID>", 
  //   "Revert to a specific commit", 
  //   (yargs) => {
  //       yargs.positional("commitID", {
  //          describe: "Commit ID to revert to",
  //          type: "string",
  //       });
  //   },
  //  (argv) => {
  //     revertRepo(argv.commitID);
  //   }
  // )



.command("revert <repoName> <commitID>", "Revert to a specific commit", yargs => {
  yargs
    .positional("repoName", { type: "string", describe: "Repo name" })
    .positional("commitID", { type: "string", describe: "Commit ID to revert to" });
}, argv => revertRepo(argv.repoName, argv.commitID))// ✅ Pass both arguments



  .demandCommand(1, "You need at least one command")
  .help().argv;



 function startServer() {
    const app = express();
    const port = process.env.PORT || 3000;

    app.use(bodyParser.json());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    const mongoURI = process.env.MONGODB_URI;

    mongoose
       .connect(mongoURI)
       .then(() => console.log("MongoDB connected!"))
       .catch((err)=>console.error("Unable to connect : ", err));

    app.use(cors({ origin: "*" }));
    
    app.use("/", mainRouter);




     // Git routes for frontend interaction
  // app.post("/git/init", async (_, res) => {
  //   await initRepo();
  //   res.json({ message: "✅ Repo initialized" });
  // });


  app.post("/git/init", async (req, res) => {
  const { repoName } = req.body;
  await initRepo(repoName);
  res.json({ message: `✅ Repo '${repoName}' initialized` });
});

  app.post("/git/add", async (req, res) => {
    await addRepo(req.body.filePath);
    res.json({ message: "File added to staging" });
  });

  app.post("/git/commit", async (req, res) => {
   // await commitRepo(req.body.message);
     await commitRepo(req.body.repoName, req.body.message); // ✅ CHANGED

    res.json({ message: "Commit created" });
  });


  app.post("/git/push", async (_, res) => {
    //await pushRepo();
      await pushRepo(req.body.repoName); // ✅ ADDED if frontend calls push
    res.json({ message: "Pushed to S3" });
  });


  // app.post("/git/pull", async (_, res) => {
  //   await pullRepo();
  //   res.json({ message: "Pulled from S3" });
  // });



app.post("/git/pull", async (req, res) => {
  const { repoName } = req.body;
  await pullRepo(repoName); // pass repo name to scoped pull logic
  res.json({ message: `Pulled commits for '${repoName}' from S3` });
});




  // app.post("/git/revert", async (req, res) => {
  //   await revertRepo(req.body.commitID);
  //   res.json({ message: " Reverted to commit" });
  // });


app.post("/git/revert", async (req, res) => {
  const { repoName, commitID } = req.body; // ✅ Extract both from request
  await revertRepo(repoName, commitID);    // ✅ Pass both to function
  res.json({ message: `⏪ Reverted '${repoName}' to commit '${commitID}'` });
});




  // app.get("/git/files", async (req, res) => {
  //   try {
  //     const result = await s3
  //       .listObjectsV2({
  //         Bucket: S3_BUCKET,
  //         Prefix: "commits/",
  //       })
  //       .promise();

  //     const files = result.Contents
  //       .filter((obj) => !obj.Key.endsWith("/"))
  //       .map((obj) => ({
  //         name: obj.Key.split("/").pop(),
  //         commitID: obj.Key.split("/")[1],
  //         url: s3.getSignedUrl("getObject", {
  //           Bucket: S3_BUCKET,
  //           Key: obj.Key,
  //           Expires: 300,
  //         }),
  //       }));
  //     res.json({ files });
  //   } catch (err) {
  //     console.error("S3 listing error:", err.message);
  //     res.status(500).json({ error: "Failed to list pushed files" });
  //   }
  // });


app.get("/git/files", async (req, res) => {
  const { repoName } = req.query;
  const prefix = `repos/${repoName}/commits/`; // ✅ ADDED: scoped prefix

  try {
    const result = await s3.listObjectsV2({ Bucket: S3_BUCKET, Prefix: prefix }).promise();

    const files = result.Contents
      .filter(obj => !obj.Key.endsWith("/"))
      .map(obj => ({
        name: obj.Key.split("/").pop(),
        commitID: obj.Key.split("/")[3],
        url: s3.getSignedUrl("getObject", {
          Bucket: S3_BUCKET,
          Key: obj.Key,
          Expires: 300
        }),
      }));

    res.json({ files });
  } catch (err) {
    console.error("S3 error:", err.message);
    res.status(500).json({ error: "Could not fetch files" });
  }
});






app.get("/proxy-file", async (req, res) => {
  const fileUrl = req.query.url;

  try {
    const response = await axios.get(fileUrl, {
      responseType: "arraybuffer", // <== key fix
    });

    const contentType = response.headers["content-type"];
    res.setHeader("Content-Type", contentType);
    res.send(response.data);
  } catch (error) {
    console.error("Proxy error:", error.message);
    res.status(500).send("Failed to fetch file.");
  }
});








    let user = "test";
    const httpServer = http.createServer(app);
    const io = new Server(httpServer, {
       cors: {
          origin: "*",
          methods: ["GET", "POST"],
       },
    });

    io.on("connection", (socket)=>{
       socket.on("joinRoom", (userID)=>{
          user = userID;
          console.log("=====");
          console.log(user);
          console.log("=====");
          socket.join(userID);
       });
    });

   const db = mongoose.connection;

   db.once("open", async () => {
      console.log("CRUD operations called");
      // CRUD operations
   });


   httpServer.listen(port, '0.0.0.0', () => {
      console.log(`Server is running on PORT ${port}`);
   });

 }






























