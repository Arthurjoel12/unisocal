import { ChatIcon, SmallCloseIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Box,
  Flex,
  Heading,
  IconButton,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setChats, setSelectedChat } from "../../State/ChatSlice";
import { setFriends } from "../../State/FriendSlice";
import ProfileModal from "../Miscellaneous/ProfileModal";

const FriendList = () => {
  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);
  const friends = useSelector((state) => state.friend.friends);
  const chats = useSelector((state) => state.chat.chats);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const getUserFriends = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        "http://localhost:5000/api/connect/friends",
        config
      );

      dispatch(setFriends({ friends: data }));
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    getUserFriends();
  }, []);

  const disConnectUser = async (friendId) => {
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
        duration: 2000,
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

  const accessChat = async (userId) => {
    try {
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

      if (chats !== undefined) {
        !chats.find((c) => c._id === data._id) ? (
          dispatch(setChats([data, ...chats]))
        ) : (
          <></>
        );
      }

      navigate("/chats");
      dispatch(setSelectedChat(data));
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

  return (
    <Box
      display="flex"
      flexDir="column"
      p={3}
      bg="#F8F8F8"
      w={{ md: "90%", lg: "70%" }}
      h={{ md: "50%", lg: "50%" }}
      mb="10"
      mr="10"
      ml="10"
      borderRadius="lg"
      overflowY="hidden"
      boxShadow={"dark-lg"}
    >
      <Text fontSize="2xl" align="center" mb="5">
        Friends
      </Text>
      {friends !== undefined && friends.length !== 0 ? (
        <Stack overflowY="scroll">
          {friends.map((friend) => (
            <Box
              bg={"#E8E8E8"}
              color={"black"}
              px={3}
              py={2}
              borderRadius="lg"
              key={friend._id}
              backgroundImage="linear-gradient(gold,#a0995d)"
              backgroundSize="0 100%"
              backgroundRepeat="no-repeat"
              transition={".4s"}
              _hover={{
                backgroundSize: "100% 100%",
              }}
              border={"1px solid black"}
            >
              <Flex spacing="4">
                <Flex flex="1" gap="2" alignItems="center" flexWrap="wrap">
                  <ProfileModal user={friend}>
                    <Avatar
                      name={friend.name}
                      src={friend.pic}
                      cursor={"pointer"}
                    />
                  </ProfileModal>

                  <Box>
                    <Text as="b" noOfLines={1}>
                      {friend.name}
                    </Text>
                    <Text fontSize={"xs"}>{friend.headline}</Text>
                  </Box>
                </Flex>

                <IconButton
                  mt={1}
                  variant="ghost"
                  colorScheme="gray"
                  aria-label="See menu"
                  _hover={{
                    background: "green",
                  }}
                  icon={<ChatIcon />}
                  onClick={() => accessChat(friend._id)}
                />

                <IconButton
                  mt={1}
                  variant="ghost"
                  colorScheme="gray"
                  aria-label="See menu"
                  _hover={{
                    background: "red",
                  }}
                  icon={<SmallCloseIcon />}
                  onClick={() => disConnectUser(friend._id)}
                />
              </Flex>
            </Box>
          ))}
        </Stack>
      ) : (
        <Text align={"center"} bg={"red"} borderRadius="lg" color="white" p={1}>
          No Friends
        </Text>
      )}
    </Box>
  );
};

export default FriendList;
