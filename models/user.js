const { Schema, model } = require("mongoose");
const { createHmac, randomBytes } = require("crypto");

const {createToken}= require("../services/authentication");

const userSchema = new Schema( 
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    profileImageURL: {
      type: String,
      default: "/images/default/png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      //mtlb sirf yehi do values mein se koi hoga
      default: "USER",
    },
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;
  if (!user.isModified("password")) return;

  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

  this.salt = salt;
  this.password = hashedPassword;

  next();
});

userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
  const user = await this.findOne({ email });
  if (!user) throw new Error("User not found!");

  const salt = user.salt;
  const hashedPassword = user.password;

  const userProvided = createHmac("sha256", salt)
    .update(password)
    .digest("hex");

  if (hashedPassword !== userProvided) throw new Error("Incorrect Password!");

  const token= createToken(user);
  return token;
});

const User = model("user", userSchema);
module.exports = User;
// This code defines a Mongoose schema for a User model, including password hashing and matching functionality.

