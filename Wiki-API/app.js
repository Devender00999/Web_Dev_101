const express = require("express"); // importing express to handle routes
const bodyParser = require("body-parser"); // importing body-parser to access data in req body
const mongoose = require("mongoose"); // importing mongoose from
const ejs = require("ejs");

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Created article Schema
mongoose.connect("mongodb://localhost:27017/wikiDB"); //Connecting to database
const articleSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, " Title is required"],
  },
  content: {
    type: String,
    required: [true, " Content is required"],
  },
});

// Created article model
const Article = mongoose.model("articles", articleSchema);

// articles api route
app
  .route("/articles")
  .get((req, res) => {
    Article.find((err, articles) => {
      if (!err) {
        res.send(articles);
      } else {
        res.send(err);
      }
    });
  })

  // articles api post route to insert item
  .post((req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const article = new Article({
      title,
      content,
    });
    article.save(function (err) {
      if (!err) {
        res.send("Data has been saved successfully");
      } else {
        res.send(err);
      }
    });
  })

  // articles api delete to delete all items
  .delete((req, res) => {
    Article.deleteMany(function (err) {
      if (!err) {
        res.send("All items has been deleted.");
      }
    });
  });

app
  .route("/articles/:articleTitle")

  // article get routes
  .get((req, res) => {
    const articleTitle = req.params.articleTitle;
    console.log(articleTitle);
    Article.findOne({ title: articleTitle }, (err, article) => {
      if (article) {
        return res.send(article);
      } else {
        return res.send("Data not found");
      }
    });
  })
  // article patch request
  .put((req, res) => {
    Article.updateOne(
      { title: req.params.articleTitle },
      { title: req.body.title, content: req.body.content },
      (err) => {
        if (!err) {
          res.send("Data has been updated");
        } else {
          res.send(err);
        }
      });
  })
  
  .patch((req, res) => {
    Article.updateOne(
      { title: req.params.articleTitle },
      { $set:req.body},
      (err) => {
        if (!err) {
          res.send("Data has been updated");
        } else {
          res.send(err);
        }
      });
  })
  .delete((req,res)=>{
      Article.deleteOne({title: req.params.articleTitle},(err, deleted)=>{
          if(!err){
            if (!deleted.deleteCount){
              res.send("Data not found");
            }
            else{
              res.send("data has been deleted");
            }

          }
          else{
            res.send(err || "");
          }
      })
  })
  ;
  

// Setting port number and starting server
const port = process.env.Port || 3000;
app.listen(3000, () => {
  console.log("Server has been started at " + port);
});

