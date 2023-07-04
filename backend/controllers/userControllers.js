const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the details");
  }
  const userExists = await User.findOne({ email }); //query of MongoDB to query our database

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    //another mongoDB query
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id), //JSON web token helps us to authorise the user in our backend and display data relevant to him. Helps us in authorisation.
    });
  } else {
    res.status(400);
    throw new Error("Failed to create user");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  console.log(user);
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id), //Json web token helps us to authorise the user in our backend and display data relevant to him. Helps us in authorisation.
    });
  } else {
    res.status(400);
    throw new Error("Incorrect email or password", user);
  }
});

// API would be like /api/user?search=robin

const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search?{
    $or: [ 
        //or operator in mongodb- need to fulfill only one expression
        {name: {$regex:req.query.search, $options:"i"}}, //i for case sensitive
        {email:{$regex: req.query.search, $options: "i"}}
    ]
  }: {};

  console.log(req.user._id);

  const users=await User.find(keyword).find({ _id: {$ne: req.user._id}})
//   .find({ _id: { $ne: req.user._id}})
  res.send(users)
//   console.log(keyword);

});

module.exports = { registerUser, authUser, allUsers };
