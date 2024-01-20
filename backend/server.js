// import dotenv from 'dotenv'
const express = require("express");
const dotenv = require("dotenv");
const { chats } = require("./data/data");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const path = require("path");

dotenv.config();
connectDB();

const app = express();

app.use(express.json()); //To accept JSON data

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

//Deployment-----------------
const __dirname1 = path.resolve();
if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build"))); //establishing the path from my current working directory __dirname1 to the build folder of our frontend

  //API call to get the content of index.html file in dist/build folder
  app.get("*", (req, res) => { //* means to get everything
    res.sendFile(path.resolve(__dirname1, "frontend", "dist", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running successfully");
  });
}

//Deployment-----------------

//Error handling functions or middlewares
app.use(notFound); //Handling errors if none of the above URL matches the entered URL
app.use(errorHandler); //Error to handle other errors

// app.get("/api/chat", (req, res) => {
//   res.send(chats);
// });

// app.get("/api/chat/:id", (req, res) => {
//   console.log(req.params.id);
//   const singleChat = chats.find((c) => c._id == req.params.id);
//   res.send(singleChat);
// });

const PORT = process.env.PORT || 5003;
const server = app.listen(
  PORT,
  console.log(`Server started successfully on Port ${PORT}`)
); //assign our server to a variable to implement socket.io

const io = require("socket.io")(server, {
  pingTimeout: 60000, //Amount of time, it will wait before closing the connection. it will close the connection
  cors: {
    origin: "https://mern-fullstack-chat-app.onrender.com",
  },
});

//Setting up the connection with the name "connection"
io.on("connection", (socket) => {
  console.log("Socket.io connected");

  //Creating a new socket where the frontend will send data (userData will be read from the frontend) and will join a room
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  }); //creating a new socket where frontend will send some data and join a room

  //Creating a socket for joining chat
  socket.on("join chat", (room) => {
    //room as the id from frontend
    socket.join(room);
    console.log("User joined room: ", room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageReceived) => {
    var chat = newMessageReceived.chat; //To check which chat this message belongs to because I have to send it into the rooms
    if (!chat.users) return console.log("Chat.users not defined");

    chat.users.forEach((user) => {
      if (user._id == newMessageReceived.sender._id) return; //If the message is sent by us, then return i.e., dont send me back the message

      //Sending message to all other users except the sender
      socket.in(user._id).emit("message received", newMessageReceived); //in means inside that user's room (which we created with user._id), emit/send the message
    });
  });
  //Closing the socket to release the bandwidth
  socket.off("setup", () => {
    console.log("User disconnected");
    socket.leave(userData._id); //leaving the room we created for this user
  });
});
