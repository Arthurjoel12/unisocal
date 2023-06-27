import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Box,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setChats } from "../../State/ChatSlice";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";

const GroupChatModal = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [groupChatName, setGroupChatName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = useSelector((state) => state.user.token);
  const chats = useSelector((state) => state.chat.chats);
  const toast = useToast();
  const dispatch = useDispatch();

  const handleSearch = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:5000/api/user?search=${query}`,
        config
      );

      setLoading(false);
      setSearchResults(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }

    setSelectedUsers([]);
  };

  const handleSubmit = async () => {
    console.log("Group Chat Name:", groupChatName);
    console.log("Selected Users:", selectedUsers);
    if (!groupChatName.trim() || selectedUsers.length === 0) {
      toast({
        title: "Please fill all the fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const userIds = selectedUsers.map((user) => user._id);
      const requestBody = {
        name: groupChatName,
        users: userIds,
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/chat/group",
        requestBody,
        config
      );

      dispatch(setChats([data, ...chats]));
      setIsOpen(false);
      toast({
        title: "New Group Chat Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to Create the Chat!",
        description: error.response.data,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const handleDelete = (delUser) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.filter((user) => user._id !== delUser._id)
    );
  };

  const handleGroup = (userToAdd) => {
    if (selectedUsers.some((user) => user._id === userToAdd._id)) {
      toast({
        title: "User already added",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }
  
    setSelectedUsers((prevSelectedUsers) => {
      const newSelectedUsers = [...prevSelectedUsers, userToAdd];
      return newSelectedUsers;
    });
  };
  
  
  

  return (
    <>
      <span onClick={() => setIsOpen(true)}>{children}</span>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create Group Chat
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
  <FormControl>
    <FormLabel>Chat Name</FormLabel>
    <Input
      placeholder="Enter chat name"
      value={groupChatName}
      onChange={(e) => setGroupChatName(e.target.value)}
    />
  </FormControl>
  <FormControl mt={4}>
    <FormLabel>Add Users (e.g., Deno, Betty, Kamau)</FormLabel>
    <Input
      placeholder="Search for users"
      onChange={(e) => handleSearch(e.target.value)}
    />
  </FormControl>

  <Box w="100%" display="flex" flexWrap="wrap" mt={4}>
    {selectedUsers.map((user) => (
      <UserBadgeItem
        key={user._id}
        user={user}
        handleFunction={() => handleDelete(user)}
      />
    ))}
  </Box>

  {loading ? (
    <div>Loading...</div>
  ) : (
    <div> {/* Updated here */}
      {searchResults?.slice(0, 4).map((user) => (
        <React.Fragment key={user.user._id}>
          <UserListItem
            isTrue={false}
            user={user.user}
            addAvail={true}
            chatAvail={true}
            handleChatFunction={() => handleGroup(user.user)}
            handleConnectFunction={() => {}}
          />
        </React.Fragment>
      ))}
    </div>
  )}
</ModalBody>

          <ModalFooter>
            <Button onClick={handleSubmit} colorScheme="blue">
              Create Chat
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default GroupChatModal;