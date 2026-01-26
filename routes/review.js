const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const { validateReview ,isLoggedin, isReviewAuthor} = require('../middleware.js');
const ReviewController = require('../controllers/review.js');



//post review

router.post(
  "/",isLoggedin,
  validateReview,
  wrapAsync(ReviewController.createReview)
);

//delete review
router.delete("/:reviewId",isLoggedin,isReviewAuthor, wrapAsync(ReviewController.deleteReview));

module.exports = router;