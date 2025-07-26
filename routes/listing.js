//  const express = require("express");
//  const router = express.Router();
//  const wrapAsync = require("../utils/wrapAsync.js");
//  const Listing = require("../models/listings.js");


// // Index Route1  --> It is responsibe for the front page of the UI
// router.get("/", wrapAsync(async(req,res,next)=>{
// const allListings = await Listing.find({});
// res.render("listings/index.ejs",{allListings});
// }));

// //2 New Route
// router.get("/new",wrapAsync(async(req,res,next)=>{
//     res.render("listings/new.ejs"); 
// })); 

// //3 Show Route

// router.get("/:id",wrapAsync(async(req,res,next)=>{
//     let {id} = req.params;
// const listing = await Listing.findById(id).populate("reviews"); // here after using .populate  --> it will replace the ids to the full review documents.
// res.render("listings/show.ejs",{listing});
// }));

// // 4Create Route
// // Note -> Here next is a midddleware.
// router.post("/", wrapAsync(async(req,res,next)=>{
//     console.log(req.body);
// const newListing = new Listing(req.body.listing);
// await newListing.save();
// res.redirect("/listings");
// }));


// // 5Edit Route
// router.get("/:id/edit", wrapAsync(async(req,res,next)=>{
// let {id} = req.params;
// const listing = await Listing.findById(id);
// res.render("listings/edit.ejs",{listing});
// }));


// // 6update Route
// router.put("/:id", wrapAsync(async(req,res,next)=>{
//     let {id} = req.params;
//     await Listing.findByIdAndUpdate(id,{...req.body.listing});
//   res.redirect(`/listings/${id}`);
// }));

// //7 Delete Route

// router.delete("/:id",wrapAsync(async(req,res,next)=>{
// let {id} = req.params;
// let deletedListing = await Listing.findByIdAndDelete(id);
// console.log(deletedListing);
// res.redirect("/listings");
// }));

//  module.exports = router;