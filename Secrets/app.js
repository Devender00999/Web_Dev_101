//imported modules
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

//creating and configuring server app using express
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

// setting up databases
mongoose.connect("mongodb://localhost:27017/userDB", function (err) {
  if (err) console.log("Mongo Server is not started.");
  else console.log("Database Connected successfully.");
});

// defining collection model and schema

const userSchema = mongoose.Schema({
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
        if (data.password === password) {
          console.log(data);
          res.render("secrets");
        }
      }
    }
  });
});

// register routes
app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", (req, res) => {
  const user = new User({
    email: req.body.username,
    password: req.body.password,
  });
  user.save((err) => {
    if (!err) {
      console.log("User added");
      res.redirect("/secrets");
    } else console.log("Some error occured");
  });
});

app.get("/logout", (req, res) => {
  res.redirect("/");
});
app.get("/secrets", (req, res) => {
  res.render("secrets");
});

app.get("/submit", (req, res) => {
  res.render("submitj");
});

const port = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log("Server has been started on " + port);
});
