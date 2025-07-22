// I will stote all the that I need to note down 


// 🔁 Schema vs Model:
// Term	Purpose
// Schema	Defines the structure of the data
// Model	Uses the schema to interact with the database (CRUD)


// 🔹 What is a Schema?
// In simple terms:

// A schema defines the structure of your data — like a blueprint or rulebook that tells how your data should look.


// 🔹 What is mongoose?
// mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js.

// It allows you to:

// Define schemas and models

// Easily connect to MongoDB

// Perform CRUD operations with clean syntax

// Add validation, defaults, relationships, etc.

// Note -> You have to write the command mongosh to enter the mongoshell   !important.
// If your data is stored inside the folder and you want to access it another folder then use double dots. If you want to use these data inside the in the file which is not in the another folder then then just onlly use singlr dot.

// ChatGPT said:
// We install the ejs-mate package to enhance EJS (Embedded JavaScript Templates) with support for layouts, partials, and reusable template structure, which default EJS doesn’t handle directly.

// 🔧 Without ejs-mate:
// EJS can render views, but doesn’t support layouts (like a common header, footer, navbar, etc.) natively.

// Postman is a tool used to test APIs (Application Programming Interfaces).! important

// The custom wrap async function (like catchAsync) is a helper that automatically catches errors in your async route handlers and passes them to Express’s error-handling middleware.

// catchAsync is a shortcut to automatically catch and handle errors in async functions, so you don’t have to repeat try...catch everywhere.



// ✅ What is Express Error?
// In Express.js, an "Express error" refers to any problem that happens during the request–response cycle — like:

// User inputs wrong data

// Database connection fails

// Resource not found

// Route doesn’t exist

// Server crashes


// ✅ What is error.ejs?
// error.ejs is a custom error page written in EJS (Embedded JavaScript) template format, used to display errors to users in a clean and user-friendly way — instead of just showing plain text like "Internal Server Error".


// ✅ Why Do We Use Joi Error Syntax?
// We use Joi for schema-based validation of user input (especially request body) before it reaches Mongoose or your database. It's fast, readable, and works outside the database layer.


