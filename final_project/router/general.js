const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // verify that a username and password were provided
    if (!username || !password){
        req.status(400).json({message:"Unable to register user: supply username and password."});
    }

    // Check if the user does not already exist
    if (users.find((user)=>(user.username==username))) {
        return res.status(404).json({message: "Unable to register user: user already exists."});
    }

    // Add the new user to the users array
    users.push({"username": username, "password": password});
    return res.status(200).json({message: "User registered successfully! Please log in."});

});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.send(JSON.stringify(books,null,4));
});

public_users.get('/books',function (req, res) {
    const get_books = new Promise((resolve,reject)=>{
        resolve(res.send(JSON.stringify(books,null,4)));
    });
    get_books.then(console.log("get /books completed"));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.send(books[isbn]);
 });
  
public_users.get('/books/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    const get_books = new Promise((resolve,reject)=>{
        resolve(res.send(books[isbn]));
    });
    get_books.then(console.log("get /books/isbn/"+isbn+" completed"));
});

// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    booksByAuthor = {};
    Object.keys(books).forEach((isbn)=>{
        if ( books[isbn].author.toLowerCase()==author.toLowerCase() )
        {
            booksByAuthor[isbn]=books[isbn];
        }
    });
    return res.send(JSON.stringify(booksByAuthor));
});

public_users.get('/books/author/:author',function (req, res) {
    const author = req.params.author;
    const get_books = new Promise((resolve,reject)=>{
        booksByAuthor = {};
        Object.keys(books).forEach((isbn)=>{
            if ( books[isbn].author.toLowerCase()==author.toLowerCase() )
            {
                booksByAuthor[isbn]=books[isbn];
            }
        });
        resolve(res.send(JSON.stringify(booksByAuthor)));
    });
    get_books.then(console.log("get /books/author/"+author+" completed"));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    booksWithTitle = {};
    Object.keys(books).forEach((isbn)=>{
        if ( books[isbn].title.toLowerCase()==title.toLowerCase() )
        {
            booksWithTitle[isbn]=books[isbn];
        }
    });
    return res.send(JSON.stringify(booksWithTitle));
});

public_users.get('/books/title/:title',function (req, res) {
    const title = req.params.title;
    const get_books = new Promise((resolve,reject)=>{
        booksWithTitle = {};
        Object.keys(books).forEach((isbn)=>{
            if ( books[isbn].title.toLowerCase()==title.toLowerCase() )
            {
                booksWithTitle[isbn]=books[isbn];
            }
        });
        resolve(res.send(JSON.stringify(booksWithTitle)));
    });
    get_books.then(console.log("get /books/title/"+title+" completed"));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    return res.send(JSON.stringify(books[isbn]["reviews"]));
});

module.exports.general = public_users;
