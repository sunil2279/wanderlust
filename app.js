if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

let express = require("express");
let mongoose = require("mongoose");
const ejs = require("ejs");
const path = require("path");
const methodOverRide = require("method-override");
let app = express();
const ejsmate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');

const listingRouter = require('./routes/listing.js');
const reviewRouter = require('./routes/review.js');
const userRouter = require('./routes/user.js');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user.js')


app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverRide("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "public")));
app.use(flash());

let MONGO_URL = process.env.ATLASDB_URL;

app.get("/", (req, res) => {
  res.redirect("/listings");
});

const store = MongoStore.create({
  mongoUrl : MONGO_URL,
  crypto:{
    secret:process.env.SECRET
  },
  touchAfter:24 * 3600
});

store.on("error",() => {
  console.log("ERROR IN MONGO SESSION STORE",err);
})

const sessionOptions = {
  store,
  secret : process.env.SECRET,
  saveUninitialized : true,
  resave : false,
  cookie : {
    expires : Date.now() + 1000 * 60 * 60 * 24 * 3,
    maxAge : 1000 * 60 * 60 * 24 * 3,
    httpOnly:true
  }
}


app.use(session(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


async function main() {
  mongoose.connect(MONGO_URL);
}
main()
.then(() => {
  console.log("db connect successfuly");
})
.catch((err) => console.log(err));



app.use((req,res,next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.curruser = req.user;
  next();
});

//allListings
app.use("/listings",listingRouter);
//review
app.use("/listings/:id/reviews",reviewRouter);
//user
app.use("/",userRouter);


app.all("/*path", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});
app.use((err, req, res, next) => {
  let { status = 404, message = "data not found" } = err;
  res.status(status).render("error.ejs", { message });
});
app.listen(8080, () => {
  console.log("app is listing on port 8080");
});
