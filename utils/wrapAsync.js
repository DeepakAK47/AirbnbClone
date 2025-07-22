// We will define the wrapAsync function here to catch the error 
// Note ==> The main purpose of definding this function is it avoid the write again try and catch function .
module.exports = function (fn){
    return function(req,res,next){
        fn(req,res,next).catch(next);
    };
};