const express = require("express") // importing express to handle routes
const bodyParser = require("body-parser") // importing body-parser to access data in req body
const mongoose = require("mongoose") // importing mongoose from
const ejs = require("ejs")

const app = express();
app.set("view engine", 'ejs')
app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended:true}))

//todo
mongoose.connect("mongodb://localhost:27017/wikiDB"); //Connecting to database
const articleSchema = mongoose.Schema({
    title:{
        type:String, 
        required: true
    }
});

const Article = mongoose.model("articles", articleSchema);



// articles api route
app.get("/api/articles", (req,res)=>{
    Article.find((err, articles)=>{
        if (!err){
            res.send(articles);
        }else{
            res.send(err)
        }
    })
})

// Setting port number and starting server
const port = process.env.Port || 3000;
app.listen(3000, ()=>{
    console.log("Server has been started at "+port)
});