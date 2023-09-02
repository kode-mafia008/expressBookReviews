const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username, password) => {
  // Write code to check if the username and password match the records
  const user = users.find((user) => user.username === username && user.password === password);
  return !!user;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Check if username and password are provided in the request body
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required." });
  }

  // Check if the provided username is valid
  if (!isValid(username)) {
    return res.status(400).json({ message: "Invalid username." });
  }

  // Check if the provided credentials match a registered user
  if (authenticatedUser(username, password)) {
    // If authentication succeeds, create a JWT token
    const token = jwt.sign({ username }, 'your-secret-key'); // Replace with your secret key

    // Return the token in the response
    return res.status(200).json({ message: "Login successful.", token });
  } else {
    // If authentication fails, return an error message
    return res.status(401).json({ message: "Authentication failed. Invalid username or password." });
  }
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", authenticatedUser, (req, res) => {
  const {username} = req;
  const {isbn} = req.params;
  const {review} = req.query;

  // Check if the provided review query is empty
  if (!review) {
    return res.status(400).json({ message: "Review cannot be empty." });
  }

  // Initialize an array for reviews if not already present
  if (!reviews[isbn]) {
    reviews[isbn] = [];
  }

  // Check if the user has already posted a review for this ISBN
  const existingReviewIndex = reviews[isbn].findIndex((r) => r.username === username);

  if (existingReviewIndex !== -1) {
    // If the user has already posted a review, update the existing one
    reviews[isbn][existingReviewIndex].review = review;
  } else {
    // If this is a new review by the user, add it to the array
    reviews[isbn].push({ username, review });
  }

  return res.status(200).json({ message: "Review added or modified successfully." });
});


// Delete a book review route
regd_users.delete("/auth/review/:isbn", authenticatedUser, (req, res) => {
  const {username} = req;
  const {isbn} = req.params;

  if (!reviews[isbn]) {
    return res.status(404).json({ message: "No reviews found for this ISBN." });
  }

  // Filter and remove the reviews based on the session username
  reviews[isbn] = reviews[isbn].filter((review) => review.username !== username);

  return res.status(200).json({ message: "Review deleted successfully." });
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
