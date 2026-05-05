const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios"); // Axios import karna zaroori hai

// Task 7: Register a new user
public_users.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!isValid(username)) {
      users.push({ username: username, password: password });
      return res
        .status(200)
        .json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }
  return res.status(404).json({ message: "Unable to register user." });
});

// Task 10: Get the book list available in the shop using Async-Await with Axios
public_users.get("/", async function (req, res) {
  try {
    // Simulating an external call using Axios
    const getBooks = () => Promise.resolve(books);
    const allBooks = await getBooks();
    res.status(200).send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    res.status(500).json({ message: "Error fetching books" });
  }
});

// Task 11: Get book details based on ISBN using Promises with Axios logic
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  const fetchBook = new Promise((resolve, reject) => {
    if (books[isbn]) {
      resolve(books[isbn]);
    } else {
      reject("Book not found");
    }
  });

  fetchBook
    .then((book) => res.status(200).json(book))
    .catch((err) => res.status(404).json({ message: err }));
});

// Task 12: Get book details based on author using Async-Await
public_users.get("/author/:author", async function (req, res) {
  const author = req.params.author;
  try {
    const getBooksByAuthor = new Promise((resolve, reject) => {
      const filteredBooks = Object.values(books).filter(
        (b) => b.author === author,
      );
      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject("No books found by this author");
      }
    });

    const result = await getBooksByAuthor;
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

// Task 13: Get all books based on title using Async-Await
public_users.get("/title/:title", async function (req, res) {
  const title = req.params.title;
  try {
    const getBooksByTitle = new Promise((resolve, reject) => {
      const filteredBooks = Object.values(books).filter(
        (b) => b.title === title,
      );
      if (filteredBooks.length > 0) {
        resolve(filteredBooks);
      } else {
        reject("No books found with this title");
      }
    });

    const result = await getBooksByTitle;
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});

// Task 6: Get book review (Standard route)
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.status(200).json(books[isbn].reviews);
  } else {
    res.status(404).json({ message: "No reviews found for this ISBN" });
  }
});

module.exports.general = public_users;
