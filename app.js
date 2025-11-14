if(process.env.NODE_ENV != "production"){
    
require('dotenv').config({ quiet: true })
}


const express=require("express");
const app=express();
const mongoose=require("mongoose");

const session=require("express-session");

const MongoStore = require('connect-mongo');
const flash=require("connect-flash");

const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");

const path = require('path');
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const port = 8080;


const ExpressError=require("./utils/ExpressError.js");


//requiring listing route
const listingRouter=require("./routes/listing.js");
//requiring listing route
const reviewRouter=require("./routes/review.js");
//user Router
const userRouter=require("./routes/user.js");


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

// const MONGO_URL='mongodb://127.0.0.1:27017/wanderlust'

const dbUrl=process.env.MONGO_ATLAS;

main()
.then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main() {
  await mongoose.connect(dbUrl);

}

const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET,
    },
    touchAfter:24*3600
});

store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
})

const sessionOptions={
    store,
     secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{ 
        expires:Date.now() + 7 * 24 * 60 * 60 *1000,
        maxAge:7 * 24 * 60 * 60 *1000,
        httpOnly:true,
        },
};



// app.get("/",(req,res)=>{
//     res.send("req working");
// });

//session middleware
app.use(session(sessionOptions));
app.use(flash());

//passport usage
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
   res.locals.success=req.flash("success");
   res.locals.error=req.flash("error");
   res.locals.currUser=req.user;

   next();
});

// app.get("/demouser",async(req,res)=>{
//     let fakeUser=new User({
//         email:"radha@gmail.com",
//         username:"radha"
//     });

//     let newUser=await User.register(fakeUser,"hello");
//     res.send(newUser);
// })


//listing route
app.use("/listings",listingRouter);

//review route
app.use("/listings/:id/reviews",reviewRouter);

//user route
app.use("/",userRouter);







app.all("*",(req,res,next)=>{
    next( new ExpressError(404,"Page not Found!"));
});



app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something Went Wrong!"}=err;
   res.status(statusCode).render("error.ejs",{err});
    // res.status(statusCode).send(message);
   
});

app.listen(port,()=>{
    console.log("server running");
});

// app.get("/testlisting",async(req,res)=>{
//     let sampleListing=new Listing({
//         title:"my new villa",
//         description:"by beach",
//         price:1200,
//         location:"Goa",
//        country:"India",
//     });
//    await sampleListing.save();
//    console.log("sample listing was saved");
//    res.send("sucessful testing");
// });