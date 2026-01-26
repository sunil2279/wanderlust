const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const { isLoggedin, isOwner, validateListing } = require("../middleware.js");
const ListingController = require("../controllers/listing.js");

//root
router
  .route("/")
  .get(wrapAsync(ListingController.index))
  .post(
    isLoggedin,
    validateListing,
    upload.single("listing[image][url]"),
    wrapAsync(ListingController.createListing)
  );

//new route
router.get("/new", isLoggedin, ListingController.renderNewListing);

router
  .route("/:id")
  .get(wrapAsync(ListingController.showListing))
  .put(
    isLoggedin,
    isOwner,
    upload.single("listing[image][url]"),
    validateListing,
    wrapAsync(ListingController.updateListing)
  )
  .delete(isLoggedin, isOwner, wrapAsync(ListingController.destroyListing));

//edit
router.get(
  "/:id/edit",
  isLoggedin,
  isOwner,
  wrapAsync(ListingController.renderEditForm)
);

module.exports = router;
