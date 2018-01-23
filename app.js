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
    
// requiring routes
var commentRoutes    = require("./routes/comment"),
    campgroundRoutes = require("./routes/campground"),
    indexRoutes      = require("./routes/index")
    
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

app.use(function(req, res, next){
 res.locals.currentUser = req.user;
 next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
 console.log("Yelp server has started!!!");
});