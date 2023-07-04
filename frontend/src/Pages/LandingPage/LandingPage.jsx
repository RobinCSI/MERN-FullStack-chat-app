import React, { useEffect, useState } from "react";

// import { addUser } from "../../redux/usersSlice";
// import { useDispatch } from "react-redux";

import { useNavigate } from "react-router-dom";

// import io from "socket.io-client";

import styles from "./LandingPage.module.css";
import { Box, Container, Text, Tabs, Tab, TabList, TabPanels, TabPanel } from "@chakra-ui/react";
import SignUp from "../../components/SignUp/SignUp";
import Login from "../../components/Login/Login";

export default function LandingPage({ socket }) {

  const navigate=useNavigate()

  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("userInfo"))

    if(user) navigate('/chatPage')
  },[navigate])
  //   const [userName, setUserName] = useState("");
  //   const [chatRoomName, setChatRoomName] = useState("");

  //   const dispatch = useDispatch();
  //   const navigate = useNavigate();

  //   // const socket=io.connect("http://localhost:5174") //connecting frontend to backend

  //   function handleUserInput(e) {
  //     e.preventDefault();
  //     if (userName && chatRoomName) {
  //       socket.emit("join_room", {
  //         userName: userName,
  //         chatRoomName: chatRoomName,
  //       });
  //       dispatch(addUser({ chatRoom: chatRoomName, userName: userName }));
  //       navigate(`/chatPage/${chatRoomName}/${userName}`);
  //     }
  //   }

  //   function handleUserName(e) {
  //     setUserName(e.target.value);
  //   }

  //   function handleChatRoomName(e) {
  //     setChatRoomName(e.target.value);
  //   }

  return (
    <Container maxW="xl" centerContent>
      <Box
        d="flex"
        justifyContent="center"
        p="3"
        bg="lightcyan"
        w="100%"
        m="40px 0 15px 0"
        borderRadius="lg"
        borderWidth="1px"
      >
        <Text fontSize="4xl" fontFamily="Work sans" color="black">
          Real time chat app
        </Text>
      </Box>
      <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px" color='black'>
        <Tabs variant="soft-rounded" >
          <TabList>
            <Tab>Login</Tab>
            <Tab>Sign Up</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <SignUp />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
    // <div className={styles.main_container}>
    //   <div className={styles.details_container}>
    //     <h3>Enter your details to chat with other people</h3>
    //     <form onSubmit={handleUserInput} className={styles.form}>
    //       <label>
    //         Your chat name:
    //         <input type="text" onChange={handleUserName} placeholder="JDoe" />
    //       </label>
    //       <label>
    //         Chat room name:
    //         <input
    //           type="text"
    //           onChange={handleChatRoomName}
    //           placeholder="Alpha"
    //         />
    //       </label>
    //       <button type="submit">Start chatting</button>
    //     </form>
    //   </div>
    // </div>
  );
}
