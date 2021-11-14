const express = require("express"); //importing express to create server
const bodyParser = require("body-parser"); // importing body parser to read request
const date = require(__dirname + "/date.js");
const app = express(); // Creating express server
app.set("view engine", "ejs"); //Chaning view engine to ejs
const mongoose = require("mongoose"); // importing mongoose
const _ = require("lodash");
app.use(bodyParser.urlencoded({ extended: true })); //embedding bodyParser to server
app.use(express.static("public"));
const workItems = [];
mongoose.connect(
  "mongodb+srv://" +
    process.env.MONGO_USER +
    ":" +
    process.env.MONGO_PASS +
    "@cluster0.gqpy9.mongodb.net/todolistDB"
); // Connecting to database

const itemSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Welcome to your todo list.",
});

const item2 = new Item({
  name: "Hit + to add new task.",
});

const item3 = new Item({
  name: "<--- Hit this to delete item.",
});

const listSchema = mongoose.Schema({
  name: String,
  items: [itemSchema],
});

const List = mongoose.model("lists", listSchema);
const defaultItems = [item1, item2, item3];

app.get("/", (req, res) => {
  //defining home route1
  const day = date.getDate();
  const data = Item.find({}, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      if (data.length === 0) {
        Item.insertMany(defaultItems, function (err) {
          if (err) {
            console.log(err);
          } else {
            console.log("Data has been saved successfully.");
          }
        });
        res.redirect("/");
      } else {
        res.render("list", { listTitle: day, newTask: data });
      }
    }
  });
});

app.get("/:customListName", (req, res) => {
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({ name: customListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        const customList = new List({
          name: customListName,
          items: defaultItems,
        });
        customList.save();
        res.redirect("/" + customListName);
      } else {
        res.render("list", {
          listTitle: customListName,
          newTask: foundList.items,
        });
      }
    }
  });
});

app.post("/", (req, res) => {
  const item = req.body.newTask;
  const listName = req.body.list;
  console.log(listName);
  const day = date.getDate();
  const newItem = new Item({
    name: item,
  });

  if (day.includes(listName)) {
    newItem.save();
    console.log("Work 2.0");
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, function (err, foundItems) {
      if (!err) {
        foundItems.items.push(newItem);
        foundItems.save();
        res.redirect("/" + listName);
      }
    });
  }
});

// Delete route
app.post("/delete", (req, res) => {
  const checkid = req.body.checkbox;
  const listName = req.body.list;
  const day = date.getDate();

  if (day.includes(listName)) {
    Item.findByIdAndDelete(checkid, (err) => {
      if (err) {
        console.log(err);
      }
      console.log(checkid + " Data has been deleted");
      res.redirect("/");
    });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkid } } },
      function (err, foundItem) {
        if (!err) {
          console.log("Updated Data " + foundItem);
          res.redirect("/" + listName);
        }
      }
    );
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

app.listen(port, () => console.log("Server Started at port " + port));
