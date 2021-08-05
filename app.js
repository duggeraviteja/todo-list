const express = require("express");

const bodyParser = require("body-parser");

const mongoose = require("mongoose");

const app = express();

var items = [];

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended:true}));

app.use(express.static("public"));

const mongodb = mongoose.connect("mongodb://admin-ravi:raviteja7899@cluster0-shard-00-00.nvc77.mongodb.net:27017,cluster0-shard-00-01.nvc77.mongodb.net:27017,cluster0-shard-00-02.nvc77.mongodb.net:27017/BLOG?ssl=true&replicaSet=atlas-jky30g-shard-0&authSource=admin&retryWrites=true&w=majority", {useNewUrlParser: true});


// const mongodb = mongoose.connect("mongodb://admin-ravi:raviteja7899@cluster0-shard-00-00.nvc77.mongodb.net:27017,cluster0-shard-00-01.nvc77.mongodb.net:27017,cluster0-shard-00-02.nvc77.mongodb.net:27017/BLOG?ssl=true&replicaSet=atlas-jky30g-shard-0&authSource=admin&retryWrites=true&w=majority", {useNewUrlParser: true});
mongoose.set("useCreateIndex", true);



if(mongodb){
  console.log("Database connectd Successfully");
} else {
  console.log("connection Error db");
} 


const itemsSchema = {
  name : String
}
const Item = mongoose.model("Item",itemsSchema);
 const item1 =new Item({name : "welcome to todolist. "});
const defaultitems = [item1];



app.get("/", function(req, res) {

Item.find({},function(err,foundItems){

  if(foundItems.length===0){
    Item.insertMany(defaultitems,function(err)
    {
      if(err){
        console.log(err);
      }else{
        console.log("sucessfully added to db");
      }
    });

  }
  else {
      res.render("list", {listTitle :"Today",
      newListItems : foundItems});
    }
});

});
app.post("/",function(req,res)
{
  var itemName = req.body.newItem;
const item = new Item({name : itemName });
item.save();
  res.redirect("/");
})

app.post("/delete",function(req,res){
  const checkedItemId= req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId,function(err){
    if(!err){
      console.log("sucessfully delete item");
      res.redirect("/")
    }
  })
});




app.listen(3000, function() {
  console.log("server is running at port:3000");
});
