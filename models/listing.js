const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: {
      type: String,
      default: "listingimage",
    },
    url: {
      type: String,
      default:
        "https://tse2.mm.bing.net/th/id/OIP.D1Sqr6pni4cPbDipu_q66QHaE7?rs=1&pid=ImgDetMain&o=7&rm=3",
      set: (v) =>
        v === " "
          ? "https://tse2.mm.bing.net/th/id/OIP.D1Sqr6pni4cPbDipu_q66QHaE7?rs=1&pid=ImgDetMain&o=7&rm=3"
          : v,
    },
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  lat: {
    type: Number,
    required: true,
    default: 0,
  },
  lng: {
    type: Number,
    required: true,
    default: 0,
  },
  category: {
    type: String,
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
