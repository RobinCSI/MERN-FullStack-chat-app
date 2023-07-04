import {
  Box,
  Button,
  FormControl,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { ChatState } from "../../../Context/ChatProvider";
import axios from "axios";
import UserListItem from "./../../UserAvatar/UserListItem";
import UserBadgeItem from "../../UserAvatar/UserBadgeItem";

const GroupChatModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]); //Users selected to be added in a group
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState();

  const toast = useToast();

  const { user, chats, setChats } = ChatState();

  async function handleSearch(query) {
    setSearch(query);
    if (!query) return;
    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      console.log(data);
      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to load the search results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }

  function handleAddUser(userToAdd) {
    //Add users to our selectedUsers
    if (selectedUsers.includes(userToAdd)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
    setSelectedUsers([...selectedUsers, userToAdd]);
  }

  function handleDelete(user) {
    const remainingUsers=selectedUsers.filter(u=>u._id!==user._id)
    setSelectedUsers(remainingUsers)
  }

  async function handleSubmit(){
    console.log(selectedUsers)
    if(!groupChatName || selectedUsers.length==0){
      toast({
        title: "Please fill all the details",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top"
      })
      return;
    }
    try {
      const config={
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      }
      //API call
      const {data}=await axios.post("/api/chat/group", {name: groupChatName, users: JSON.stringify(selectedUsers.map(u=>u._id))}, config)
      setChats([data,...chats]) //To add our new chat at the top of chats array
      onClose()
      toast({
        title: "New group chat created",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      toast({
        title: "Failed to create the chat",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    }
  }

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create group chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                mb={3}
                placeholder="Chat name"
                onChange={(e) => setGroupChatName(e.target.value)}
              ></Input>
            </FormControl>
            <FormControl>
              <Input
                mb={3}
                placeholder="Add users e.g., Robin"
                onChange={(e) => handleSearch(e.target.value)}
              ></Input>
            </FormControl>
            <Box w="100%" display="flex" flexWrap="wrap">
              {selectedUsers.map((user) => (
                <UserBadgeItem
                  key={user._id}
                  user={user}
                  deleteUser={() => handleDelete(user)}
                />
              ))}
            </Box>
            {loading ? (
              <div>loading</div>
            ) : (
              searchResult
                ?.slice(0, 4)
                .map((user) => (
                  <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => handleAddUser(user)}
                  />
                ))
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              Create chat
            </Button>
            {/* <Button variant="ghost">Secondary Action</Button> */}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;
