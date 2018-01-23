var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

// comments new
router.get("/new", isLoggedIn, function(req, res) {
 Campground.findById(req.params.id, function(err, campground){
  if(err){
   console.log(err);
  } else {
   res.render("comments/new", {campground: campground});
  }
 });
});
// comment create
router.post("/", isLoggedIn, function(req, res){
 // lookup campground using id
 Campground.findById(req.params.id, function(err, campground) {
     if(err){
      console.log(err);
      res.redirect("/campgrounds");
     } else {
       // create new comment
      Comment.create(req.body.comment, function(err, comment){
       if(err){
        console.log(err);
       } else {
        console.log("redirect successful");
         // connect new campgound to comment
         campground.comments.push(comment._id);
         campground.save();
          // redirect campground show page
          res.redirect("/campgrounds/" + campground._id);
       }
      });
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