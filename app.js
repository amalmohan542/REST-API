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

////////////////////////////Request targeting all articles/////////////////////////////////////////

app.route("/articles")
.get(function(req,res){
    Article.find(function(err,foundArticles){
        if(!err){
        res.send(foundArticles);
        }
        else{
            res.send(err);
        }

    });

})
.post(function(req,res){
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
})
.delete(function(req,res){
    Article.deleteMany(function(err){
        if(!err){
            res.send("Sucessfully Deleted all documents.");
        }
        else{
            res.send(err);
        }

    });

});

/////////////////////////////////Request targeting specific article/////////////////////////////
app.route("/articles/:articleTitle")
.get(function(req,res){
    Article.findOne({title: req.params.articleTitle},function(err,foundArticle){
        if(foundArticle){
            res.send(foundArticle);
            }
            else{
                res.send("No article found matching the given title");
            }
    });

})
.put(function(req,res){
    Article.update(
        {title: req.params.articleTitle},
        {title: req.body.title,content: req.body.content},
        {overwrite: true},
        function(err){
            if(!err){
                res.send("Sucessfully article updated.")
            }
        }
        );

})
.patch(function(req,res){
    Article.update(
        {title: req.params.articleTitle},
        {$set: req.body},
        function(err){
            if(!err){
                res.send("Sucessfully updated article.");
            }else{
                res.send(err);
            }
        }

    );

})
.delete(function(req,res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Sucessfully deleted the corresponding article.");

            }else{
                res.send(err);
            }
        }

    )
});

;

app.listen(3000,function(){
    console.log("Server start listening to port 3000");
    
})