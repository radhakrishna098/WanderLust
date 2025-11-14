const express=require("express");

const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirctUrl } = require("../middleware.js");

const router=express.Router();

const userController=require("../controllers/users")



router.route("/signup")
.get(userController.renderSignup)
.post(wrapAsync(userController.signup));



router.route("/login")
.get(userController.renderLogin)
.post(saveRedirctUrl,
     passport.authenticate("local",
     { failureRedirect: '/login', failureFlash:true }),
     userController.login
     );


router.get("/logout",userController.logout);


module.exports=router;

// router.get("/signup",userController.renderSignup);

// router.post("/signup",wrapAsync(userController.signup));


// router.post("/login",saveRedirctUrl,
//      passport.authenticate("local",
//      { failureRedirect: '/login', failureFlash:true }),
//      userController.login
//      );