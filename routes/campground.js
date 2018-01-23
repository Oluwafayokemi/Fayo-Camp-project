var express =require("express");
var router = express.Router();
var Campground = require("../models/campground");

// index route
router.get("/", function(req, res){
  Campground.find({}, function(err, allCampgrounds){
   if(err){
    console.log("Something went wrong!");
    console.log(err);
   } else {
    console.log("Here are all the campgrounds on our DB:");
   res.render("campgrounds/index", {campgrounds: allCampgrounds});   
   }
  });
});

//CREATE:/dogs Post new campground to db:
router.post("/", function(req, res){
 var name = req.body.name;
 var image = req.body.image;
 var description = req.body.description;

 var newCampground = {name: name, image: image, description: description};
 //create a new campground and save to db
Campground.create(newCampground, function(err, newlyCreated){
   if(err){
    console.log("Something went wrong!");
   } else {
    console.log(newlyCreated);
    res.redirect("/campgrounds");
   }
 });
});

//NEW:/dogs/new Displays form to create new campground
router.get("/new", function(req, res){
 res.render("campgrounds/new");
});

//SHOW: /dogs/:id GeT shows info about one dog
router.get("/:id", function(req, res){
 Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
  if(err){
   console.log("something went wrong", err);
    } else {
     console.log(foundCampground);
      res.render("campgrounds/show", {campground: foundCampground});
    }
 });
});

function isLoggedIn(req, res, next){
 if(req.isAuthenticated()){
  return next();
 } 
 res.redirect("/login");
 }
 
module.exports = router;