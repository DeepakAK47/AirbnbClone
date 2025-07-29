
module.exports.isLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl =  req.originalUrl;
        req.flash("error","you must be login!");
        return res.redirect("/listings/login");
    }
    next();
};

module.exports.saveRedirectUrl =  (req,res,next) =>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl  = req.session.redirectUrl;
    };
    next();
};

// module.exports.isOwner = async (req,res,next) => { 
//     let {id} = req.params;
//     let listing = await Listing.findById(id);
//     if(!listing.owner.equals(res.locals.currentUser._id)){
//         req.flash("error","You have not parmission for this!");
//         return res.redirect(`/listings/${id}`);
//     }
// };