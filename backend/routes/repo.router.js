const express = require("express");
const repoController = require("../controllers/repoController");

const repoRouter = express.Router();

repoRouter.post("/repo/create", repoController.createRepository);
repoRouter.get("/repo/all", repoController.getAllRepositories);
repoRouter.get("/repo/:id", repoController.fetchRepositoryById);
repoRouter.get("/repo/name/:name", repoController.fetchRepositoryByName);
repoRouter.get("/repo/user/:userID", repoController.fetchRepositoriesForCurrentUser);
repoRouter.put("/repo/update/:id", repoController.updateRepositoryById);   //to update all details-put
repoRouter.patch("/repo/toggle/:id", repoController.toggleVisibilityById); //to update one detail-patch
repoRouter.delete("/repo/delete/:id", repoController.deleteRepositoryById);

module.exports = repoRouter;




















































































