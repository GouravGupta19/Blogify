const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const checkForAuthenticationCookie = require("./middlewares/authentication");
const path = require("path");
const Blog = require("./models/blog");

const PORT = process.env.PORT || 3000;

// mongoose.connect("mongodb://localhost:27017/blogify").then((e) => {
//   console.log("DB connected");
// });

mongoose.connect(process.env.MONGO_URL).then((e) => {
  console.log("DB connected");
});

const userRoute = require("./routes/user");
const blogRoute = require("./routes/blog");

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use(express.static(path.resolve("./public")));
app.use(express.json());

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({}).sort({ createdAt: -1 });
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.use("/user", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => {
  console.log(`server listening to port: ${PORT}`);
});
