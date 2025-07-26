const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

app.use(cookieParser());

app.get("/getcookies",(req,res)=>{
res.cookie("greet","Deepak");  // Note -> Be remeber that here greet is value and Deepak is name.
res.cookie("madein","India");
res.send("Cookies are very delicious.");
});

app.get("/",(req,res)=>{
console.log(req.cookies);  // Note you can use another name here. It means you can use deepak instead of the cookies.
});

app.listen(3000,()=>{
    console.log("Server is working properly.");
});