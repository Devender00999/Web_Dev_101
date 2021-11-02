const express = require("express"); //importing express to create server
const bodyParser = require("body-parser"); // importing body parser to read request
const date = require(__dirname + "/date.js");
const app = express(); // Creating express server
app.set("view engine", "ejs"); //Chaning view engine to ejs
app.use(bodyParser.urlencoded({ extended: true })); //embedding bodyParser to server
app.use(express.static("public"));
const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];
app.get("/", (req, res) => {
  //defining home route1
  const day = date.getDate();
  res.render("list", { listTitle: day, newTask: items });
});

app.post("/", (req, res) => {
  const item = req.body.newTask;
  if (req.body.list === "Work") {
    workItems.push(item);
    res.redirect("/work");
  } else {
    items.push(item);
    console.log(req.body);
    res.redirect("/");
  }
});

// /work route
app.get("/work", (req, res) => {
  res.render("list", { listTitle: "Work List", newTask: workItems });
});

app.get("/about", (req, res) => {
  res.render("about", { message: "Hello World!" });
});

const port = process.env.PORT || 3000;

app.listen(3000, () => console.log("Server Started at port " + port));
