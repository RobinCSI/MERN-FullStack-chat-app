import { Box } from "@chakra-ui/react";
import React from "react";
import { ChatState } from "../../../Context/ChatProvider";
import SingleChat from "../../SingleChat/SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  //In smaller screens, chatbox will disappear when a chat is not selected otherwise the mychats will disappear. In medium screen and above, they will always appear as flex.

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default ChatBox;
