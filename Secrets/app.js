//imported modules
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

//creating and configuring server app using express
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));
const round = 10;
// setting up databases
mongoose.connect("mongodb://localhost:27017/userDB", function (err) {
  if (err) console.log("Mongo Server is not started.");
  else console.log("Database Connected successfully.");
});

// defining collection model and schema

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = new mongoose.model("users", userSchema);

// home route
app.get("/", (req, res) => {
  res.render("home");
});
//login route
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  User.findOne({ email: username }, (err, data) => {
    if (!err) {
      if (data) {
        bcrypt.compare(password, data.password, function (err, result) {
          if (!err) {
            res.render("secrets");
          } else {
            res.send("Wrong ID or Pass");
          }
        });
      }
    }
  });
});

// register routes
app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", (req, res) => {
  bcrypt.hash(
    req.body.password,
    Number(process.env.SALTROUND),
    function (err, hash) {
      if (!err) {
        const user = new User({
          email: req.body.username,
          password: hash,
        });
        user.save((err) => {
          if (!err) {
            console.log("User added");
            res.redirect("/secrets");
          } else console.log("Some error occured");
        });
      } else {
        console.log("Error in generating hash: " + err);
      }
    }
  );
});

app.get("/logout", (req, res) => {
  res.redirect("/");
});
app.get("/secrets", (req, res) => {
  res.render("secrets");
});

app.get("/submit", (req, res) => {
  res.render("submit");
});

const port = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log("Server has been started on " + port);
});
