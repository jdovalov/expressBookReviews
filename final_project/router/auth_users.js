const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    // Find user with specified username and password
    let user = users.find((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if valid user is found, otherwise false
    if (user) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    // verify that a username and password were provided
    if (!username || !password){
        req.status(400).json({message:"Must supply username and password"});
    }
    // 
    if ( authenticatedUser(username,password) ){
        // Generate access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60*60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User "+username+" logged in");
    }else{
        return res.status(401).json({message:"Invalid username or password."});
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const username = req.session.authorization['username'];
  books[isbn]['reviews'][username]=req.body.review;
  return res.send("Review posted successfully");
});

// Add a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    //Write your code here
    const isbn = req.params.isbn;
    const username = req.session.authorization['username'];
    delete books[isbn]['reviews'][username];
    return res.send("Deleted review");
  });
  
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
