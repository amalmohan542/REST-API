const express= require("express");
const bodyparser= require("body-parser");
const ejs= require("ejs");
const mongoose= require("mongoose");
const app=express();
app.use(bodyparser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set('view engine', 'ejs');

mongoose.connect('mongodb://localhost:27017/wikiDB', {useNewUrlParser: true, useUnifiedTopology: true});
const articleSchema={
    title: String,
    content: String
};

const Article= mongoose.model("Article",articleSchema);

app.get("/articles",function(req,res){
    Article.find(function(err,foundArticles){
        if(!err){
        res.send(foundArticles);
        }
        else{
            res.send(err);
        }

    });

});

app.post("/articles",function(req,res){
    const newArticle= new Article({
        title: req.body.title,
        content: req.body.content

    });
    newArticle.save(function(err){
        if(!err){
            res.send("Sucessfully added a new article");
        }else {
            res.send(err);

        }
    });
    
    

});

app.listen(3000,function(){
    console.log("Server start listening to port 3000");
    
})