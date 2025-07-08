const mongoose = require("mongoose")  //here we are using mongoose package not mongodb. In userController we used mongodb. Any one can be used
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");

async function createIssue(req, res)  {
    const { title, description } = req.body;
    const { id } = req.params;

   try {
      const issue = new Issue({
        title,
        description,
        repository: id,
      });

      await issue.save();

      res.status(201).json(issue, { message: "Issue created!"});                //201 means created
     } catch (err) {
        console.log("Error during issue creation : ", err.message);
        res.status(500).send("Server error!");
     }
};



async function updateIssueById(req, res)  {
    const { id } = req.params;
    const { title, description, status } = req.body;
    try {
        const issue = await Issue.findById(id);

        if(!issue) {
            return res.status(404).json({ error: "Issue not found!" });
        }
        
         issue.title = title;
         issue.description = description;
         issue.status = status;

         await issue.save();

         res.json(issue, { message: "Issue updated!"});
    }  catch (err) {
        console.error("Error during issue updation : ", err.message);
        res.status(500).send("Server error!");
     }
};



async function deleteIssueById(req, res) {
    const { id } = req.params;
        try {
           const issue = await Issue.findByIdAndDelete(id);
           if(!issue) {
              return res.status(404).json({ error: "Issue not found!" });
           }

           res.json({ message: "Issue deleted successfully!" });
        } catch(err) {
             console.error("Error during issue deletion : ", err.message);
             res.status(500).send("Server error!");
     }
};



async function getAllIssues(req, res)  {
    const { id } = req.params;

    try {
        const issues = await Issue.find({ repository: id })
        
        if(!issues) {
            return res.status(404).json({ error: "Issues not found!" });
        }
        res.status(200).json(issues);
    } catch(err) {
        console.error("Error during fetching issues : ", err.message);
        res.status(500).send("Server error!");
    }
};



async function getIssueById(req, res)  {
    const { id } = req.params;
    try {
        const issue = await Issue.findById(id);

        if(!issue) {
            return res.status(404).json({ error: "Issue not found!" });
        }
        
         res.json(issue);
    }  catch (err) {
        console.error("Error during fetching issue : ", err.message);
        res.status(500).send("Server error!");
     }
};


module.exports = {
    createIssue,
    updateIssueById,
    deleteIssueById,
    getAllIssues,
    getIssueById,
};





























