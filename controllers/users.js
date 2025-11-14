

const User=require("../models/user.js");




module.exports.renderSignup=(req,res)=>{
    res.render("users/signup.ejs")
}

module.exports.signup=async(req,res)=>{
    try{
    let {username,email,password}=req.body;
     let newUser=new User({username,email});
     let registeredUser=await User.register(newUser,password);
     console.log(registeredUser);
     req.login(registeredUser,(err)=>{
        if(err){
            return next();
        }
         req.flash("success","Welcome to WanderLust");
        res.redirect("/listings");
     })
   
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }

}

module.exports.renderLogin=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login=async(req,res)=>{
        req.flash("success","Welcome back to WanderLust!");
        let redirectUrl = res.locals.redirectUrl || "/listings"
        res.redirect(redirectUrl);
}

module.exports.logout=(req,res,next)=>{
    req.logOut((err)=>{
        if(err){
             return next(err);
        }
        req.flash("success","you are logged Out!");
        res.redirect("/listings");
    });
}