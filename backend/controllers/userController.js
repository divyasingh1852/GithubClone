const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { MongoClient, ReturnDocument } = require("mongodb");   //here mongodb package is used not mongoose . any one can be used
const dotenv = require("dotenv");
var ObjectId = require("mongodb").ObjectId;

dotenv.config();
const uri = process.env.MONGODB_URI;

let client;

async function connectClient() {
    if(!client){
        client = new MongoClient(uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
       });
       await client.connect();
    }
}

async function signup (req, res)  {
    const { username, password, email } = req.body;
    try {
        await connectClient();
        const db = client.db("githubclone");   //name of database in .env file 
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({username});
        if (user) {
            return res.status(400).json({message: "User already exists!"});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = {
           username,
           password: hashedPassword,
           email,
           repositories : [],
           followedUsers : [],
           starRepos : []
        }

        const result = await usersCollection.insertOne(newUser);    //in mongodb package .insertOne but in mongoose .save()

        const token = jwt.sign({id:result.insertId}, process.env.JWT_SECRET_KEY, {expiresIn:"1h"});
        res.json({token, userId:result.insertId});
    } catch(err) {
        console.log("Error during signup : ", err.message);
        res.status(500).send("Server error!");
    }
};



async function login (req, res) {
    const { email, password } = req.body;
    try {
        await connectClient();
        const db = client.db("githubclone");  
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({ email });
        if (!user) {
            return res.status(400).json({message: "Invalid credential!"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({message: "Invalid credential!"});
        }

       const token = jwt.sign({id:user._id}, process.env.JWT_SECRET_KEY, {expiresIn:"1h"});
       res.json({token, userId:user._id});
    } catch(err){
       console.log("Error during login : ", err.message);
       res.status(500).send("Server error!");
    };
};



async function getAllUsers (req, res) {
    try {
        await connectClient();
        const db = client.db("githubclone");   
        const usersCollection = db.collection("users");

        const users = await usersCollection.find({}).toArray();  //find everything. To fetch multiple data convert into array
        res.json(users);
    }catch(err){
       console.log("Error during login : ", err.message);
       res.status(500).send("Server error!");
    };
};



async function getUserProfile (req, res) {
    const currentID = req.params.id;

     try {
        await connectClient();
        const db = client.db("githubclone");           
        const usersCollection = db.collection("users");

        const user = await usersCollection.findOne({     //here we are using mongodb package above so .findOne . If we use mongoose package then .findById
           _id: new ObjectId(currentID)                    //since currentID is string
        
        });

         if (!user) {
            return res.status(404).json({message: "User not found!"});
        }

       res.send(user);
     } catch(err){
       console.log("Error during fetching : ", err.message);
       res.status(500).send("Server error!");
    };
};




async function updateUserProfile(req, res) {
  const currentID = req.params.id;
  const { email, password } = req.body;

  try {
    if (!ObjectId.isValid(currentID)) {
      return res.status(400).json({ message: "Invalid user ID format." });
    }

    const idObj = new ObjectId(currentID);

    await connectClient();
    const db = client.db("githubclone");
    const usersCollection = db.collection("users");

    let updateFields = {};
    if (email) updateFields.email = email;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      updateFields.password = hashedPassword;
    }

    if (Object.keys(updateFields).length === 0) {
      console.log("No fields provided to update.");
      return res.status(400).json({ message: "Provide email or password to update." });
    }

    const result = await usersCollection.updateOne(
      { _id: idObj },
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "User not found!" });
    }

     const updatedUser = await usersCollection.findOne({ _id: idObj });
    console.log("User updated successfully.");

    res.status(200).json({ message: "User profile updated successfully!" , updatedUser});
  } catch (err) {
    console.log("Error during updating:", err.message);
    res.status(500).send("Server error!");
  }
}



async function deleteUserProfile (req, res) {
     const currentID = req.params.id;

    try {
        await connectClient();
        const db = client.db("githubclone");          
        const usersCollection = db.collection("users");

        const result = await usersCollection.deleteOne({
          _id: new ObjectId(currentID),       
              
        });

        if (result.deleteCount == 0) {
          return res.status(404).json({ message: "User not found!" });
        }

        res.json({ message: "User Profile Deleted!" });
    } catch(err){
       console.log("Error during deleting : ", err.message);
       res.status(500).send("Server error!");
    };
};


module.exports = {
    getAllUsers,
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile,
};

























































































