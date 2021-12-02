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
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook");
const findOrCreate = require("mongoose-findorcreate");

// creating and configuring server app using express
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

// setting up use of session in server
app.use(
  session({
    secret: "TheQuickBrownFoxJumps",
    resave: false,
    saveUninitialized: false,
  })
);

// initializing sessions and passport in server
app.use(passport.initialize());
app.use(passport.session());

// Setting up Google strategy for login and register
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secrets",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

// Setting up Facebook strategy for login and register
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "https://a81b-103-107-93-63.ngrok.io/auth/facebook/secrets",
    },
    function (accessToken, refreshToken, profile, cb) {
      User.findOrCreate({ facebookId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

// setting up databases
mongoose.connect("mongodb://localhost:27017/userDB", function (err) {
  if (err) console.log("Mongo Server is not started.");
  else console.log("Database Connected successfully.");
});

// defining collection model and schema
const userSchema = new mongoose.Schema({
  username: String,
  password: String,
  googleId: String,
  facebookId: String,
  secret: String,
});
//adding passportlocalmongoose plugin for local strategy
userSchema.plugin(passportLocalMongoose);

//adding findOrCreate plugin for google and facebook strategy
userSchema.plugin(findOrCreate);

const User = new mongoose.model("users", userSchema);

// adding local strategy for login and register. It provide login and register facilities for local strategy.
passport.use(User.createStrategy());
passport.serializeUser(function (user, done) {
  done(null, user._id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

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
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      res.json({ status: "No user with this username" });
    } else if (!user) {
      res.json({ status: "Wrong Password" });
    } else {
      req.login(user, function (err) {
        if (err) {
          console.log(err);
        } else {
          res.redirect("/secrets");
        }
      });
    }
  })(req, res);
});

// register routes
app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", (req, res) => {
  // to register we use User.register and pass neccessary details
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

// route for google login
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);

// route for after google successful login
app.get(
  "/auth/google/secrets",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/secrets");
  }
);

// route for facebook
app.get("/auth/facebook", passport.authenticate("facebook"));

// route for after google successful login
app.get(
  "/auth/facebook/secrets",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/secrets");
  }
);

// route for logout
app.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/");
});

// route for secrets with authentication
app.get("/secrets", (req, res) => {
  User.find({ secret: { $ne: null } }, function (err, foundUsers) {
    if (!err) {
      if (foundUsers) {
        res.render("secrets", { foundUsers });
      }
    }
  });
});

// submit route
app.get("/submit", (req, res) => {
  if (req.isAuthenticated()) {
    res.render("submit");
  } else {
    res.redirect("/login");
  }
});
app.post("/submit", (req, res) => {
  User.findById(req.user._id, (err, user) => {
    if (!err) {
      user.secret = req.body.secret;
      user.save((err) => {
        if (err) {
          console.log("Something is not right.");
        } else {
          console.log("Your Secrets have been saved.");
          res.redirect("/secrets");
        }
      });
    }
  });
});
const port = process.env.PORT || 3000;
app.listen(3000, () => {
  console.log("Server has been started on " + port);
});
