var express =require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

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
router.post("/", middleware.isLoggedIn, function(req, res){
 var name = req.body.name;
 var image = req.body.image;
 var description = req.body.description;
 var author = {
    id: req.user._id,
    username: req.user.username 
 };
 var newCampground = {name: name, image: image, description: description, author: author};
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
router.get("/new", middleware.isLoggedIn,function(req, res){
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

// otherwise redirect
// Edit router
router.get("/:id/edit",  middleware.checkCampgroundOwnership, function(req, res){
   Campground.findById(req.params.id, function(err, foundCampground){
    res.render("campgrounds/edit", {campground: foundCampground});
   });
});
// update router
router.put("/:id",  middleware.checkCampgroundOwnership, function(req, res){
 // find and update the correct campground
 // redirect somewhere(show page)
 Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, campground){
  if(err){
   res.redirect("/campgrounds");
  } else {
   res.redirect("/campgrounds/" + req.params.id);
  }
 });
});
// Destroy
router.delete("/:id",  middleware.checkCampgroundOwnership,  function(req, res) {
    Campground.findByIdAndRemove(req.params.id, req.body.campground, function(err, campground){
     if(err){
      return res.redirect("/campgrounds");
     }
     res.redirect("/campgrounds");
    });
});

module.exports = router;