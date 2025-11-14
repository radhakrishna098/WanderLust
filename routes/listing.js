const express=require("express");
const router=express.Router();

const multer  = require('multer')
const {storage}=require("../cloudConfig.js");
const upload = multer({storage })


const listingController=require("../controllers/listings");


const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");


const wrapAsync=require("../utils/wrapAsync.js");


//index create routes

router.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    
    wrapAsync(listingController.createListing));





 //New Route
 router.get("/new",isLoggedIn,listingController.renderNewForm);



//show update delete routes

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,
     isOwner,
      upload.single('listing[image]'),
     validateListing,
     wrapAsync(listingController.updateListing))
.delete(isLoggedIn,
        isOwner,
        wrapAsync(listingController.deleteListing));









//Edit
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.editListing));



module.exports=router;


//Index route
// router.get("/",wrapAsync(listingController.index));

//create
// router.post("/",isLoggedIn,
//     validateListing,
//     wrapAsync(listingController.createListing));


//update

// router.put("/:id",isLoggedIn,isOwner,
//     validateListing,
//     wrapAsync(listingController.updateListing));

// //Delete
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

//show route
// router.get("/:id",wrapAsync(listingController.showListing));