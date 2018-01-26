var express               = require("express"),
    seedDB                = require("./seeds"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    bodyParser            = require("body-parser"),
    User                  = require("./models/user"),
    flash                 = require("connect-flash"),
    LocalStrategy         = require("passport-local"),
    methodOverride        = require("method-override"),
    expressSession        = require("express-session"),
    Comment               = require("./models/comment"),
    Campground            = require("./models/campground"),
    passportLocalMongoose = require("passport-local-mongoose");
    
// requiring routes
var commentRoutes    = require("./routes/comment"),
    campgroundRoutes = require("./routes/campground"),
    indexRoutes      = require("./routes/index");
    
var app = express();
// mongoose.connect("mongodb://localhost/yelp_camp_v13");
mongoose.connect("mongodb://fayokemi:Excellence@ds217138.mlab.com:17138/yelpcamp");

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended:true}));
// seedDB();
app.use(methodOverride("_method"));
app.use(flash());


// passport configuration
app.use(require ("express-session")({
 secret: "Timo has a dog named rusty",
 resave: false,
 saveUninitialized: false
}));
app.locals.moment     = require('moment');
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
 res.locals.currentUser = req.user;
 res.locals.error = req.flash("error");
 res.locals.success = req.flash("success");
 
 next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT, process.env.IP, function(){
 console.log("Yelp server has started!!!");
});