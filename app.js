var express               = require("express"),
    seedDB                = require("./seeds"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),
    LocalStrategy         = require("passport-local"),
    expressSession        = require("express-session"),
    Comment               = require("./models/comment"),
    Campground            = require("./models/campground"),
    passportLocalMongoose = require("passport-local-mongoose");
    
var app = express();
mongoose.connect("mongodb://localhost/yelp_camp_v5");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));
seedDB();

// passport configuration
app.use(require ("express-session")({
 secret: "Timo has a dog named rusty",
 resave: false,
 saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", function(req, res){
 res.render("landing");
});
//add new camp
//INDEX: /camprounds Display a list of all campgrounds:
app.get("/campgrounds", isLoggedIn, function(req, res){
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
app.post("/campgrounds", function(req, res){
 var name = req.body.name;
 var image = req.body.image;
 var description = req.body.description;

 var newCampground = {name: name, image: image, description: description}
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
app.get("/campgrounds/new", function(req, res){
 res.render("campgrounds/new");
});

//SHOW: /dogs/:id GeT shows info about one dog
app.get("/campgrounds/:id", function(req, res){
 Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
  if(err){
   console.log("something went wrong", err);
    } else {
     console.log(foundCampground);
      res.render("campgrounds/show", {campground: foundCampground});
    }
 });
});

//===========================
// Comments Route
//===========================
app.get("/campgrounds/:id/comments/new", function(req, res) {
 Campground.findById(req.params.id, function(err, campground){
  if(err){
   console.log(err);
  } else {
   res.render("comments/new", {campground: campground});
  }
 });
});

app.post("/campgrounds/:id/comments", function(req, res){
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

// =================
// Auth Routes
// ==================

app.get("/register", function(req, res) {
    res.render("register");
});
app.post("/register", function(req, res){
   req.body.username;
   req.body.password;
   User.register(new User({username: req.body.username}), req.body.password, function(err, user){
    if(err){
     console.log(err);
     res.render("register");
    } else {
     res.redirect("/campgrounds");
    }
   });
});

app.get("/login", function(req, res) {
    res.render("login");
});
app.post("/login", passport.authenticate("local", {
 successRedirect: "/secret",
 failureRedirect: "/login"
 }), function(req, res){
});

app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/login");
});

function isLoggedIn(req, res, next){
 if(req.isAuthenticated()){
  return next();
 } 
 res.redirect("/login");
 }

app.listen(process.env.PORT, process.env.IP, function(){
 console.log("Yelp server has started!!!");
});