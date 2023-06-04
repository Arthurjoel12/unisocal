import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Input,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { BellIcon, ChevronDownIcon, ChatIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { setLogout } from "../../State/UserSlice";
import ProfileModal from "./ProfileModal";
import PostModal from "./PostModal";
import HeaderMenu from "./HeaderMenu";
import ChatLoading from "../Chats/ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";
import { setChats, setSelectedChat } from "../../State/ChatSlice";
import { setFriends } from "../../State/FriendSlice";
import { useNavigate } from "react-router-dom";

const SideDrawer = () => {
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);

  const [loadingChat, setLoadingChat] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const chats = useSelector((state) => state.chat.chats);

  const logout = () => {
    dispatch(setLogout());
    dispatch(setSelectedChat(null));
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter Something in Search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
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
        `http://localhost:5000/api/user?search=${search}`,
        config
      );

      setLoading(false);
      console.log(data);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);

      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.post(
        `http://localhost:5000/api/chat`,
        { userId },
        config
      );

      !chats.find((c) => c._id === data._id) ? (
        dispatch(setChats([data, ...chats]))
      ) : (
        <></>
      );

      navigate("/chats");
      dispatch(setSelectedChat(data));
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const connectUser = async (friendId) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const id = user._id;

      const ids = { id, friendId };
      const { data } = await axios.patch(
        `http://localhost:5000/api/connect/add`,
        { ids },
        config
      );

      toast({
        title: data.msg,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });

      dispatch(setFriends({ friends: data.updatedFriends }));
    } catch (error) {
      toast({
        title: "Error in connecting user",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        borderRadius={"5px"}
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="2px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>

        <Text
          cursor={"pointer"}
          onClick={() => navigate("/home")}
          fontSize={{ base: "lg", sm: "2xl", md: "3xl" }}
          fontFamily="Work sans"
        >
          unisocial Connect
        </Text>

        <Box display={{ base: "none", md: "block" }}>
          <ChatIcon
            _hover={{ cursor: "pointer", color: "red" }}
            fontSize="2xl"
            onClick={() => navigate("/chats")}
            m={1}
            p={1}
            mr={5}
          />
          <BellIcon
            _hover={{ cursor: "pointer", color: "red" }}
            fontSize="3xl"
            m={1}
            p={1}
            mr={5}
          />

          <PostModal />

          <Menu>
            <MenuButton
              as={Button}
              bg="white"
              _hover={{ color: "red" }}
              ml={{ base: "1", lg: "5" }}
              rightIcon={<ChevronDownIcon />}
            >
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </Box>
        <Box display={{ md: "none" }}>
          <HeaderMenu user={user} />
        </Box>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
            ) : (
              searchResult?.map((filteredUser) => (
                <UserListItem
                  key={filteredUser.user._id}
                  isTrue={true}
                  user={filteredUser.user}
                  addAvail={!filteredUser.userInRequestList}
                  chatAvail={filteredUser.isTrue}
                  handleChatFunction={() => accessChat(filteredUser.user._id)}
                  handleConnectFunction={() =>
                    connectUser(filteredUser.user._id)
                  }
                />
              ))
            )}
            {loadingChat && <Spinner ml="auto" display="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
