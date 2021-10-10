const express = require("express"); //importing express to create server
const bodyParser = require("body-parser"); // importing body parser to read request

const app = express(); // Creating express server
app.set("view engine", "ejs"); //Chaning view engine to ejs
app.use(bodyParser.urlencoded({ extended: true })); //embedding bodyParser to server

var items = ["Buy Food", "Cook Food", "Eat Food"];

app.get("/", (req, res) => {
  //defining home route1
  var today = new Date();
  var options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  var day = today.toLocaleDateString("en-US", options);
  res.render("list", { dayName: day, newTask: items });
});

app.post("/", (req, res) => {
  var item = req.body.newTask;
  items.push(item);
  res.redirect("/");
});
const port = process.env.PORT || 3000;
app.listen(3000, () => console.log("Server Started at port " + port));
