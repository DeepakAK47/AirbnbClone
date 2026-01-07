if(process.env.NODE_ENV != "production"){
require("dotenv").config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dburl = process.env.ATLASDB_URL;
const Listing = require("./models/listings.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require('ejs-mate');
const expressLayouts = require("express-ejs-layouts");


app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.engine('ejs', ejsMate);
app.use(expressLayouts);

// Aquiring the wrapAsync function
const wrapAsync = require("./utils/wrapAsync.js");

app.set("layout", "layouts/boilerplate"); 
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

const Review = require("./models/review.js");

const session  = require("express-session");
const flash = require("connect-flash");
const MongoStore = require('connect-mongo');
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User =  require("./models/user.js");

const {isLoggedIn} = require("./middleware.js");
const {saveRedirectUrl} = require("./middleware.js");

const multer  = require("multer");
const {storage} = require("./cloudConfig.js");
const upload = multer({storage});

// Start the server only after connecting to MongoDB. If the connection fails,
// exit the process so the platform (Render) can retry the deploy.
async function startServer() {
    try {
        await mongoose.connect(dburl);
        console.log("Mongodb server is connected successfully");
        
        // Create MongoStore with the MongoDB URL
        // MongoStore will manage its own connection
const store = MongoStore.create({
    mongoUrl: dburl,
    touchAfter: 24 * 3600,
    collectionName: 'sessions'
});


const sessionConfig = {
    store,
    name: 'session',
    secret: process.env.SESSION_SECRET, // ✅ ONLY THIS
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};


        app.use(session(sessionConfig));
        
        // Initialize passport AFTER session
        app.use(passport.initialize());
        app.use(passport.session());
        
        //Passport Strategy
        passport.use(new LocalStrategy(User.authenticate()));
        passport.serializeUser(User.serializeUser());
        passport.deserializeUser(User.deserializeUser());
        
        // Initialize flash AFTER session and passport
        app.use(flash());
        app.use((req,res,next)=>{
            res.locals.success = req.flash("success");
            res.locals.error  = req.flash("error");
            res.locals.currentUser = req.user;
            next();
        });
        
        // Define routes AFTER all middleware is set up
        setupRoutes();
        
        const PORT = process.env.PORT || 8080;
        app.listen(PORT, () => {
            console.log(`App is listening on port ${PORT}`);
        });
    } catch (err) {
        console.error("Failed to connect to MongoDB:", err);
        // Exit with non-zero so the host marks the deploy as failed and can retry
        process.exit(1);
    }
}

function setupRoutes() {
    // 1. Index Route  --> It is responsibe for the front page of the UI
    app.get("/listings", wrapAsync(async(req,res,next)=>{
        const allListings = await Listing.find({});
        res.render("listings/index.ejs",{allListings});
    }));

    // Redirect common misspelling from /listenings to /listings
    app.get("/listenings", (req, res) => {
        res.redirect("/listings");
    });

    //3. New Route
    app.get("/listings/new",isLoggedIn,wrapAsync(async(req,res,next)=>{
        res.render("listings/new.ejs"); 
    })); 

    // Signup Route
    app.get("/listings/signup",(req,res)=>{
        res.render("user/signup");
    });

    // Post route for Signup
    app.post("/listings/signup",wrapAsync(async(req,res,next)=>{
        console.log(req.body);
        let{username,email,password}  = req.body;
        const newUser =  new User({email,username});
        const registeredUser = await User.register(newUser,password); 
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Welcome to Wanderlust");
            res.redirect("/listings");
        });
    }));

    // Route for login
    app.get("/listings/login",(req,res)=>{
        res.render("user/login");
    });

    // POST Route for login
    app.post("/listings/login",
        saveRedirectUrl,
        passport.authenticate("local",{
            failureRedirect : "/listings/login",
            failureFlash : true,
        }),
        async(req,res) =>{
            console.log("Login successfull, user",req.user);
            req.flash("success","Welcome to Wanderlust");
            let redirectUrl = res.locals.redirectUrl || "/listings";
            res.redirect(redirectUrl);
        }
    );

    // Route for logout
    app.get("/listings/logout",(req,res,next)=>{
        req.logout((err)=>{
            if(err){
                return next(err);
            }
            req.flash("success","Logout Successfuly!");
            res.redirect("/listings/login");
        });
    });

    //2. Show Route
    app.get("/listings/:id",wrapAsync(async(req,res,next)=>{
        let {id} = req.params;
        const listing = await Listing.findById(id).populate("reviews").populate("owner");
        res.render("listings/show.ejs",{listing});
    }));

    // Debug route
    app.get('/debug/listings', wrapAsync(async (req, res) => {
        const docs = await Listing.find({}).limit(50).select('title images image');
        res.json(docs);
    }));

    // Create Route
    app.post("/listings", isLoggedIn, upload.array("listing[image]", 5), wrapAsync(async (req, res, next) => {
        console.log(req.body);
        console.log(req.files);
        const newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;

        if (req.files && req.files.length) {
            newListing.images = req.files.map(f => ({
                url: f.path,
                filename: f.filename
            }));
        }
        await newListing.save();
        req.flash("success", "New listing is added successfully");
        res.redirect("/listings");
    }));

    // Edit Route
    app.get("/listings/:id/edit",isLoggedIn, wrapAsync(async(req,res,next)=>{
        let {id} = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/edit.ejs",{listing});
    }));

    // Update Route
    app.put("/listings/:id", isLoggedIn, upload.array("listing[image]", 5), wrapAsync(async (req, res, next) => {
        let { id } = req.params;
        let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
        if (req.files && req.files.length) {
            listing.images = req.files.map(f => ({
                url: f.path,
                filename: f.filename
            }));
            await listing.save();
        }
        req.flash("success", "Listing Edit Successfuly");
        res.redirect(`/listings/${id}`);
    }));

    // Delete Route
    app.delete("/listings/:id",isLoggedIn,wrapAsync(async(req,res,next)=>{
        let {id} = req.params;
        let deletedListing = await Listing.findByIdAndDelete(id);
        console.log(deletedListing);
        req.flash("success","Listing Deleted Successfuly");
        res.redirect("/listings");
    }));

    // Delete Route for the review
    app.delete("/listings/:id/reviews/:reviewId",isLoggedIn,wrapAsync(async(req,res)=>{
        const {id,reviewId} = req.params;
        await Listing.findByIdAndUpdate(id,{$pull:{reviews :reviewId }});
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","Review Deleted Successfuly");
        res.redirect(`/listings/${id}`);
    }));

    // Review form Route
    app.post("/listings/:id/reviews",isLoggedIn, wrapAsync(async(req,res)=>{
        let {id} = req.params;
        let listing = await Listing.findById(id);
        let newReview = new Review(req.body.review);
        listing.reviews.push(newReview);
        await newReview.save();
        await listing.save();
        req.flash("success","New Review Added successfuly");
        res.redirect(`/listings/${id}`);
    }));

    // Error handling middleware
    app.use((err,req,res,next)=>{
        let {status = 500,message="Something went wrong!"}  = err;
        req.flash("error",message);
        if(req.originalUrl === "/listings/signup"){
            return res.redirect("/listings/signup");
        }
        res.status(status).render("error.ejs",{err});
    });
}

startServer();

