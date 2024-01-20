import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import {
  Box,
  FormControl,
  IconButton,
  Input,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { getFullSender, getSender } from "../../config/ChatLogics";
import ProfileModal from "../miscellaneous/ProfileModal/ProfileModal";
import UpdateGroupChatModal from "../miscellaneous/UpdateGroupChatModal/UpdateGroupChatModal";
import axios from "axios";
import Lottie from "react-lottie";
import animationData from './../../animations/typing.json'

import styles from './SingleChat.module.css'
import ScrollableChat from "../ScrollableChat/ScrollableChat";
import io from 'socket.io-client'

const ENDPOINT="http://localhost:5003"
let socket, selectedChatCompare

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const [messages, setMessages] = useState([]); //all of our fetched messages from the backend
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState();
  const [socketConnected, setSocketConnected] = useState(false)
  const [typing, setTyping] = useState(false)
  const [isTyping, setIsTyping] = useState(false)

  const defaultOptions={
    loop:true,
    autoplay: true,
    animationData: animationData,
    rendererSettings:{
      preserveAspectRation: "xMidYMid slice"
    }
  }

   useEffect(() => {
     socket = io(ENDPOINT); //this can be used to console "socket.io connected" meaning socket is working fine
     socket.emit("setup", user); //Emitting to the setup and giving the user object
     socket.on("connected", () => setSocketConnected(true));
     socket.on("typing", ()=>setIsTyping(true))
     socket.on("stop typing", () => setIsTyping(false));

   }, []);
   
  const toast = useToast();

  const { user, selectedChat, setSelectedChat, notifications, setNotifications } = ChatState();

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      // console.log(data);
      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id) //With the id of this chat, we are creating a new room

      // console.log(messages);
    } catch (error) {
      toast({
        title: "Error occured",
        description: "Failed to load the messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  useEffect(() => {
    fetchMessages();
    selectedChatCompare=selectedChat //To keep the backup of the selected chat state. Help to decide, we need to emit the message or send the notification to the user
  }, [selectedChat]);

// console.log(notifications, "notifications");

  useEffect(() => {
    socket.on("message received", (newMessageReceived)=>{
      if(!selectedChatCompare || selectedChatCompare._id!==newMessageReceived.chat._id) //if no chat is selected or the chat that is selected doesn't match the currently selected chat to which the new message is received
      {//give notification
        if(!notifications.includes(newMessageReceived)){
          setNotifications([newMessageReceived, ...notifications])
          setFetchAgain(!fetchAgain)
        }

      }
      else{
        setMessages([...messages, newMessageReceived])
      }
    })
    }
  )
  
  async function sendMessage(e) {
    if (e.key == "Enter" && newMessage) {
      socket.emit("stop typing", selectedChat._id)
      try {
        const config = {
          headers: {
            "Content-Type": "application/json", //Because we are sending the JSON data
            Authorization: `Bearer ${user.token}`,
          },
        };
        setNewMessage("");
        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessage,
            chatId: selectedChat._id,
          },
          config
        );
        // console.log(data);
        socket.emit("new message", data)
        setMessages([...messages, data]);
      } catch (error) {
        toast({
          title: "Error occured",
          description: "Failed to send the message",
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
      }
    }
  }

 
  

  function typingHandler(e) {
    setNewMessage(e.target.value);
    if(!socketConnected) return

    if(!typing){
      setTyping(true)
      socket.emit("typing", selectedChat._id)
    }
    let lastTypingTime=new Date().getTime()

    var timerLength=3000

    setTimeout(()=>{
      var timeNow=new Date().getTime()
      var timeDiff=timeNow-lastTypingTime
      if(timeDiff>=timerLength && typing){
        socket.emit("stop typing", selectedChat._id)
        setTyping(false)
      }
    }, timerLength)
    //Typing indicator logic
  }

  return (
    <>
      {selectedChat ? (
        <>
          <Text
            fontSize={{ base: "28px", md: "30px" }}
            pb={3}
            px={2}
            w="100%"
            fontFamily="Work sans"
            display="flex"
            justifyContent={{ base: "space-between" }}
            alignItems="center"
          >
            <IconButton
              display={{ base: "flex", md: "none" }}
              icon={<ArrowBackIcon />}
              onClick={() => setSelectedChat("")}
            />
            {!selectedChat.isGroupChat ? (
              <>
                {getSender(user, selectedChat.users)}
                <ProfileModal user={getFullSender(user, selectedChat.users)} />
              </>
            ) : (
              <>
                {selectedChat.chatName.toUpperCase()}
                <UpdateGroupChatModal
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                  fetchMessages={fetchMessages}
                />
              </>
            )}
          </Text>
          <Box
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            p={3}
            bg="#E8E8E8"
            w="100%"
            h="100%"
            borderRadius="lg"
            overflowY="hidden"
          >
            {loading ? (
              <Spinner
                size="xl"
                w={20}
                h={20}
                alignSelf="center"
                margin="auto"
              />
            ) : (
              <div className={styles.messages}>
                {/* Messages */}
                <ScrollableChat messages={messages} />
                </div>
            )}
            <FormControl onKeyDown={sendMessage} isRequired mt={3}>
              {isTyping? <div>
                <Lottie options={defaultOptions} width={70} style={{marginBottom: 15, marginLeft: 0 }} />
              </div>: <></>}
              <Input
                variant="filled"
                bg="#E0E0E0"
                placeholder="Enter a message"
                onChange={typingHandler}
                value={newMessage}
              />
            </FormControl>
          </Box>
        </>
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          h="100%"
        >
          <Text fontSize="3xl" pb={3} fontFamily="Work sans">
            Click on a user to start chatting
          </Text>
        </Box>
      )}
    </>
  );
};

export default SingleChat;
