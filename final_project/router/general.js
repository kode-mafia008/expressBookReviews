const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require('axios');

// Define the route for user registration
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided in the request body
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if the username is already taken
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(409).json({ message: "Username already exists." });
  }

  // If username is available, create a new user and add it to the users array
  const newUser = { username, password };
  users.push(newUser);

  // Return a success message or user object as needed
  return res.status(201).json({ message: "User registered successfully.", user: newUser });
});


// Endpoint to get the list of books available in the shop
public_users.get('/', async (req, res) => {
  try {
    // Make an HTTP GET request using Axios to fetch the list of books
    const response = await axios.get('./booksdb.js'); // Replace with your API URL
    const books = response.data; // Assuming the API returns the list of books as JSON

    return res.status(200).json({ books });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch book list' });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {

  try {
    var searchISBN = req.params.isbn.toLowerCase();

    // Find the book with the matching ISBN
    let matchingBook = Object.values(books).find((book) => {
      return book.title.toLowerCase().includes(searchISBN);
    });

    if (matchingBook) {
      return res.status(200).json({ reviews: matchingBook });
    } else {
      // If no matching book is found, return an error message
      return res.status(404).json({ message: "Book not found" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch book details' });
  }

});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  try {
    var searchAuthor = req.params.author.toLowerCase();
    let filteredBooks = Object.values(books).filter((book) => {
      return book.author.toLowerCase().includes(searchAuthor);
    });
    return res.status(300).json({ message: filteredBooks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch book details' });
  }

});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  try {
    var searchTitle = req.params.title.toLowerCase();
    let filteredBooks = Object.values(books).filter((book) => {
      return book.title.toLowerCase().includes(searchTitle);
    });
    return res.status(300).json({ message: filteredBooks });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Failed to fetch book details' });
  }

});

public_users.get('/review/:isbn', function (req, res) {
  var searchISBN = req.params.isbn.toLowerCase();

  // Find the book with the matching ISBN
  let matchingBook = Object.values(books).find((book) => {
    return book.title.toLowerCase().includes(searchISBN);
  });

  if (matchingBook) {
    // If the book with the matching ISBN is found, return its reviews
    let bookReviews = matchingBook.reviews;
    return res.status(200).json({ reviews: bookReviews });
  } else {
    // If no matching book is found, return an error message
    return res.status(404).json({ message: "Book not found" });
  }
});

module.exports.general = public_users;
