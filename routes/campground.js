var express =require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");
var geocoder   = require("geocoder");
// index route
router.get("/", function(req, res){
  Campground.find({}, function(err, allCampgrounds){
   if(err){
    console.log("Something went wrong!");
    console.log(err);
   } else {
    console.log("Here are all the campgrounds on our DB:");
   res.render("campgrounds/index", {campgrounds: allCampgrounds, page: "campgrounds"});   
   }
  });
});

//CREATE:/dogs Post new campground to db:
router.post("/", middleware.isLoggedIn, function(req, res){
 var name = req.body.name;
 var image = req.body.image;
 var price = req.body.price;
 var description = req.body.description;
 var author = {
    id: req.user._id,
    username: req.user.username 
 };
 geocoder.geocode(req.body.location, function (err, data) {  
  if(err){
   req.flash("error", "location not found ", err.geocoder);
   return res.redirect("back");
  } 
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newCampground = {name: name, image: image, price: price, description: description, author:author, location: location, lat: lat, lng: lng};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
  });
});
//NEW:/dogs/new Displays form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res){
 res.render("campgrounds/new");
});

//SHOW: /dogs/:id GeT shows info about one dog
router.get("/:id", function(req, res){
 Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
  if(err || !foundCampground){
   console.log("something went wrong", err);
   req.flash("error", "campground does not exist!");
   res.redirect("back");
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
       if(err){
           req.flash("error", "campground not found");
       } else {
    res.render("campgrounds/edit", {campground: foundCampground});
       }
   });
});
// update router
router.put("/:id",  middleware.checkCampgroundOwnership, function(req, res){
 geocoder.geocode(req.body.campground.location, function (err, data) {
  if(err){
   req.flash("error" + "location not found " + err.geocoder);
   return res.redirect("back");
  } 
    var lat = data.results[0].geometry.location.lat;
    var lng = data.results[0].geometry.location.lng;
    var location = data.results[0].formatted_address;
    var newData = {name: req.body.campground.name, image: req.body.campground.image, price: req.body.campground.price, description: req.body.campground.description,  location: location, lat: lat, lng: lng};
    Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
        if(err){
            req.flash("error", err.message);
            res.redirect("back");
        } else {
            req.flash("success","Successfully Updated!");
            res.redirect("/campgrounds/" + campground._id);
        }
    });
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