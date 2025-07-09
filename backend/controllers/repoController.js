const mongoose = require("mongoose")  //here we are using mongoose package not mongodb. In userController we used mongodb. Any one can be used
const Repository = require("../models/repoModel");
const User = require("../models/userModel");
const Issue = require("../models/issueModel");


async function createRepository (req, res)  {
    const { owner, name, issues, content, description, visibility } = req.body;
    try {
       if (!name) {
           return res.status(400).json({ error: "Repository name is required!" });
       } 

       if(!mongoose.Types.ObjectId.isValid(owner)) {
           return res.status(400).json({ error: "Invalid User ID!" });
       }

      const newRepository = new Repository({
        name,
        description,
        visibility,
        owner,
        content,
        issues,
      });

      const result = await newRepository.save();   //To create ->In mongodb package .insertOne but In mongoose .save()

      res.status(201).json({                       //201 means created
        message:"Repository created!",
        repositoryID: result._id,
      });
    } catch(err) {
        console.log("Error during repository creation : ", err.message);
        res.status(500).json("Server error!");
    }
};



async function getAllRepositories (req, res)  {
    try {
        const repositories = await Repository.find({})
        .populate("owner")        //populate - to fetch all owner details not only id.if populate not written there this will only give owner id
        .populate("issues");

        res.json(repositories);
    } catch(err) {
        console.error("Error during fetching repositories : ", err.message);
        res.status(500).json("Server error!");
    }
};



async function fetchRepositoryById  (req, res)  {
    const  { id } = req.params;
    try {
        const repository = await Repository.findById(id)
        .populate("owner")        //populate - to fetch all owner details not only id.if populate not written there this will only give owner id
        .populate("issues")

         if (!repository) {
            return res.status(404).json({message: "Repository not found!"});
        }

        res.json(repository);
    } catch (err) {
        console.error("Error during fetching repository : ", err.message);
        res.status(500).json("Server error!");
    }
};



async function fetchRepositoryByName  (req, res)  {
    const { name } = req.params;
    try {
        const repository = await Repository.find({ name: name })
        .populate("owner")        //populate - to fetch all owner details not only id.if populate not written there this will only give owner id
        .populate("issues");

         if (!repository) {
            return res.status(404).json({message: "Repository not found!"});
        }

        res.json(repository);
    } catch (err) {
        console.error("Error during fetching repository : ", err.message);
        res.status(500).json("Server error!");
    }
};



// below functions are only for authenticated users
async function fetchRepositoriesForCurrentUser(req, res) {
  console.log(req.params);
  const { userID } = req.params;                                        // const userID = req.params.userID => both are correct

  try {
    const repositories = await Repository.find({ owner: userID });

    if (!repositories || repositories.length == 0) {
      return res.status(404).json({ error: "User Repositories not found!" });
    }
    console.log(repositories);
    res.json({ message: "Repositories found!", repositories });
  } catch (err) {
    console.error("Error during fetching user repositories : ", err.message);
    res.status(500).json("Server error");
  }
};



async function updateRepositoryById (req, res)  {
    const { id } = req.params;
    const {content, description} = req.body;
    try {
       const repository = await Repository.findById(id);
       if(!repository) {
          return res.status(404).json({ error: "Repository not found!"});
       }
       repository.content.push(content);
       repository.description = description;

       const updatedRepository = await repository.save();

       res.json({
          message: "Repository updated successfully!",
          repository: updatedRepository,
       });
    } catch (err) {
        console.error("Error during updating repositories : ", err.message);
        res.status(500).json("Server error!");
    }
}; 



async function toggleVisibilityById  (req, res)  {
    const { id } = req.params;

    try {
       const repository = await Repository.findById(id);
       if(!repository) {
          return res.status(404).json({ error: "Repository not found!"});
       }
       
       repository.visibility = !repository.visibility;

       const updatedRepository = await repository.save();

       res.json({
          message: "Repository visibility toggled successfully!",
          repository: updatedRepository,
       });
    } catch (err) {
        console.error("Error during toggling visibility : ", err.message);
        res.status(500).json("Server error!");
    }
};



async function deleteRepositoryById  (req, res)  {
        const { id } = req.params;
        try {
           const repository = await Repository.findByIdAndDelete(id);
           if(!repository) {
              return res.status(404).json({ error: "Repository not found!" });
           }

           res.json({ message: "Repository deleted successfully!" });
        } catch(err) {
             console.error("Error during deleting repository : ", err.message);
             res.status(500).json("Server error!");
        }
};



module.exports = {
    createRepository,
    getAllRepositories,
    fetchRepositoryById,
    fetchRepositoryByName,
    fetchRepositoriesForCurrentUser,
    updateRepositoryById,
    toggleVisibilityById,
    deleteRepositoryById,
};





























