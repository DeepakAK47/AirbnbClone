if(process.env.NODE_ENV != "production"){
require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listings.js");  // Be carefull use single dot if it is outside only one directory.
const path = require("path");
// Aquiring the wrapAsync function
const wrapAsync = require("./utils/wrapAsync.js");
// Aquiring AppError file

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


const methodOverride = require("method-override");
app.use(methodOverride("_method"));

const ejsMate = require('ejs-mate');
app.engine('ejs', ejsMate);

const expressLayouts = require("express-ejs-layouts");
app.use(expressLayouts);
app.set("layout", "layouts/boilerplate"); 

const Review = require("./models/review.js");

const session  = require("express-session");
const flash = require("connect-flash");


app.use(session({
secret : "Deepak Singh",
resave : false,
saveUninitialized : true,
cookie : {secure : false,
    expires : Date.now() + 1000*60*60*24*3,
    maxAge  :  1000*60*60*24*3,
    httpOnly : true,
}
}));

// app.use(flash());
// app.use((req,res,next)=>{
//     res.locals.success = req.flash("success");
//     res.locals.error  = req.flash("error");
//     res.locals.currentUser = req.user;
//     next();
// });


const passport = require("passport");
const LocalStrategy = require("passport-local");
const User =  require("./models/user.js");

app.use(passport.initialize());
app.use(passport.session());

//Passport Strategy
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const {isLoggedIn} = require("./middleware.js");
const {saveRedirectUrl} = require("./middleware.js")


// Note --> It is the route fro creating the form signup.
// const userRouter =  require("./routes/user.js");
// app.use("/",userRouter);


// It is the code for starting our server. 
const multer  = require("multer");

const {storage} = require("./cloudConfig.js");
const upload = multer({storage});



app.use(flash());
app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error  = req.flash("error");
    res.locals.currentUser = req.user;
    next();
});

const MONGO_URL = "mongodb://127.0.0.1:27017/Deepak";

main()
.then(()=>{
    console.log("Mongodb server is connected successfuly");
})
    .catch((err)=>{
        console.log(err);
})

async function main(){
    await mongoose.connect(MONGO_URL);
}



// Setting our API's Route
// app.get("/", (req,res)=>{
//     res.send("Deepak is working on the Airbnb clone project");  // It is lsiteing at when call it at localhost:8080
// });

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

// Index Route  --> It is responsibe for the front page of the UI
app.get("/listings", wrapAsync(async(req,res,next)=>{
const allListings = await Listing.find({});
res.render("listings/index.ejs",{allListings});
}));

// Redirect common misspelling from /listenings to /listings
app.get("/listenings", (req, res) => {
    res.redirect("/listings");
});

// New Route
app.get("/listings/new",isLoggedIn,wrapAsync(async(req,res,next)=>{
    res.render("listings/new.ejs"); 
})); 

// Signup Route
app.get("/listings/signup",(req,res)=>{
    res.render("user/signup");
});

// Post route for Signup

app.post("/listings/signup",wrapAsync(async(req,res)=>{
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
    successRedirect : "/listings",
    successFlash :  " Welcome to Wanderlust"
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

// Show Route

app.get("/listings/:id",wrapAsync(async(req,res,next)=>{
    let {id} = req.params;
const listing = await Listing.findById(id).populate("reviews").populate("owner");
// here after using .populate  --> it will replace the ids to the full review documents.
res.render("listings/show.ejs",{listing});
}));

// Create Route
// Note -> Here next is a midddleware.

// Create Route - accept up to 5 images for a listing
app.post("/listings", isLoggedIn, upload.array("listing[image]", 5), wrapAsync(async (req, res, next) => {
    console.log(req.body);
    console.log(req.files);
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;

    // If files were uploaded, map them into the images array
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


// update Route
app.put("/listings/:id", isLoggedIn, upload.array("listing[image]", 5), wrapAsync(async (req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing }, { new: true });
    // if images are uploaded, replace the images array (or you could push to keep existing)
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
app.delete("/listings/:id/reviews/:reviewId",isLoggedIn,async(req,res)=>{
    const {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews :reviewId }});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted Successfuly");
    res.redirect(`/listings/${id}`);
});


// Riview form Route
app.post("/listings/:id/reviews",isLoggedIn, async(req,res)=>{
let listing = await Listing.findById(req.params.id);
let newReview = new Review(req.body.review);
listing.reviews.push(newReview);
await newReview.save();
await listing.save();
req.flash("success","New Review Added successfuly");
res.redirect(`/listings`);
});

// It is the route if the client sent the request to an invakid api
// app.all("*",(req,res,next)=>{
//     next(new expressError(404,"Page not found!"));
// });

//   Route for the middleware --> This is responsible when you enter the wrong input in the any form like as string intead of the number.




app.use((err,req,res,next)=>{
    let {status = 500,message="Something went wrong!"}  = err;
    req.flash("error",message);
    if(req.originalUrl === "/listings/signup"){
        return res.redirect("/listings/signup");
    }
    res.status(status).render("error.ejs",{err});
});


app.listen(8080,()=>{
    console.log("App is listening on the port of 8080");  // It is used for starting the server.
});
