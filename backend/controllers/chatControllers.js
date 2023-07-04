const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

//accessChat controller
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  //If the caht with this userId exists
  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }
  //If the chat exists with the user
  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } }, //eq means equal to. Req.user._id is the current user who is logged-in
      { users: { $elemMatch: { $eq: userId } } }, // userId that we have sent
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  //populating message's sender
  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name pic email",
  });
  //if the chat exists
  if (isChat.length > 0) {
    res.send(isChat[0]); //one element in the array as no other chat with 2 users
  } else {
    //we will create a chat with these 2 users
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId], //it will have both the users
    };

    //storing in database
    try {
      const createdChat = await Chat.create(chatData);

      //send the just now created chat to user
      const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      //send it
      res.status(200).send(FullChat);
    } catch (error) {
      //sending whatever error existed
      res.status(400);
      throw new Error(error.message);
    }
  }
});

//fetchChats controller
const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password") //Populating remaining fields from chatModel
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
    // .then(result=>res.send(result))
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//Group chat controller
const createGroupChat = asyncHandler(async (req, res) => {
  if (!req.body.name || !req.body.users) {
    return res.status(400).send({ message: "Please fill all the fields" });
  }
  //array of users- we are gonna send after stringifying the users array and then parse it in the backend
  var users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }
  users.push(req.user); //req.user is the currently logged in user
  //users array is created
  //Query to our database
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    //Fetch the group chat from database and send it back to our user
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      // chatName: chatName
      //since the key and value are same
      chatName: chatName,
    },
    {
      new: true, //to return updated name of group
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");
  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat not found");
  } else {
    res.json(updatedChat);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat not found");
  } else {
    res.json(added);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat not found");
  } else {
    res.json(removed);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
