//imported modules
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
// express session library is used to use session in express
const session = require("express-session");
// passport library is used to manage authenticate
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

//creating and configuring server app using express
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.use(
  session({
    secret: "TheQuickBrownFoxJumps",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
// setting up databases
mongoose.connect("mongodb://localhost:27017/userDB", function (err) {
  if (err) console.log("Mongo Server is not started.");
  else console.log("Database Connected successfully.");
});

// defining collection model and schema

const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
});
userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("users", userSchema);
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// home route
app.get("/", (req, res) => {
  if (req.isAuthenticated()) res.redirect("secrets");
  else {
    res.render("home");
  }
});
//login route
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", (req, res) => {
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, function (err) {
    if (err) {
      console.log(err);
      redirect("/login");
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/secrets");
      });
    }
  });
});
// register routes
app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", (req, res) => {
  User.register(
    { username: req.body.username },
    req.body.password,
    function (err, user) {
      if (err) {
        console.log(err);
        res.redirect("/register");
      } else {
        passport.authenticate("local")(req, res, function () {
          res.redirect("/secrets");
        });
      }
    }
  );
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.get("/secrets", (req, res) => {
  if (req.isAuthenticated) {
    res.render("secrets");
  } else {
    res.redirect("/login");
    res.render("secrets");
  }
});

app.get("/submit", (req, res) => {
  res.render("submit");
});

const port = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log("Server has been started on " + port);
});
