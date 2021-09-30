// Importing express
const express = require("express");

// creating express application
const app = express();

app.use(express.json());
// defining root of website
app.get("/", (req, res) => {
  res.send("<h1>Hello World!. I am the first Server</h1>");
});

// listening to server on port 3000
app.listen(3000, () => console.log("Server Started on port 3000..."));
// app.listen(5000, () => console.log("Server Started on port 4000..."));
