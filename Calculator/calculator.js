// Importing express
const express = require("express");

// importing body parser to fetch details passed in request body
const bodyParser = require("body-parser");

// Creating express app
const app = express();

// using bodyparser to read details
app.use(bodyParser.urlencoded({ extended: true }));

// defining home route using get request
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// defining home route using post request
app.post("/", (req, res) => {
  res.send("Sum: " + parseInt(req.body.num1) + parseInt(req.body.num2));
});

// defining /bmicalculator using get
app.get("/bmicalculator", (req, res) => {
  res.sendFile(__dirname + "/bmiCalculator.html");
});

// defining /bmicalculator using post
app.post("/bmicalculator", (req, res) => {
  res.send(
    "You BMI is: " +
      Math.floor(Number(req.body.weight) / Math.pow(Number(req.body.height), 2))
  );
});

// starting server on port number 3000
app.listen(3000, () => console.log("Server has been started on port 3000"));
