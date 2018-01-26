var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");
// root route
router.get("/", function(req, res){
 res.render("landing");
});
// sign up register route
router.get("/register", function(req, res) {
    res.render("register", {page: "register"});
});
// create sign up form
router.post("/register", function(req, res){
   var newUser = new User({username: req.body.username});
   User.register( newUser, req.body.password, function(err, user){
    if(err){
     req.flash("error", err.message);
     return res.redirect("/register");
    }
     passport.authenticate("local")(req, res, function(){
      req.flash("success", "Successfully signed up! nice to meet you, Welcome to YelpCamp! " + req.body.username.toUpperCase());
          res.redirect("/campgrounds");
     });
   });
});

// show login form
router.get("/login", function(req, res) {
    res.render("login", {page: "login"});
});

// handling login logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});

// logout route
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;