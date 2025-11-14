const express=require("express");
const router=express.Router({mergeParams:true});

const reviewController=require("../controllers/reviews")

const Listing=require("../models/listing.js");
const Review=require("../models/review.js");

const wrapAsync=require("../utils/wrapAsync.js");

const {validateReview, isLoggedIn,isReviewAuthor}=require("../middleware.js");




//Reviews
//post  review route

router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));

//Delete Review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));


module.exports=router;