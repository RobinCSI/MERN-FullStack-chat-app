const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const sendMessage = asyncHandler(async (req, res) => {
  //chatId, message and sender are required
  const { chatId, content } = req.body;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    //All properties as in messageModel created
    sender: req.user._id,
    content: content,
    chat: chatId,
  };

  try {
    //Message Model
    var message = await Message.create(newMessage);
    //Populate sender and message and users array in chatId
    message = await message.populate("sender", "name pic"); //.execPopulate() //execPopulate() is used because we are populating an instance of a mongoose class. In newer version of mongoose, it has been removed
    message = await message.populate("chat"); //Populating with everything inside of the chat object
    //Each chat has a list of users so we want to populate each of the user
    message = await User.populate(message, {
      //We are using User Model now
      path: "chat.users", //populating path which is chat.users
      select: "name pic email", //take name, pic and email
    });
    //Every chat model has a latest message
    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: message,
    });
    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId }) //query our db with chatId. Request.params used because it is inside our parameters
      .populate("sender", "name pic email") //after getting our object, we are populating it
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400)
    throw new Error(error.message)
  }
});

module.exports = { sendMessage, allMessages };
