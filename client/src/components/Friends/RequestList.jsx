import { CheckCircleIcon, SmallCloseIcon } from "@chakra-ui/icons";
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
import { setFriends } from "../../State/FriendSlice";
import FriendList from "./FriendList";

const RequestList = () => {
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const toast = useToast();
  const dispatch = useDispatch();

  const [friendRequests, setFriendRequests] = useState([]);
  const [fetchAgain, setFetchAgain] = useState(false);

  const getFriendRequests = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.get(
        `http://localhost:5000/api/connect/list`,
        config
      );

      setFriendRequests(data);
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  const acceptOrReject = async (friendId, isTrue) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const info = {
        userId: user._id,
        friendId: friendId,
        isTrue: isTrue,
      };

      const { data } = await axios.patch(
        "http://localhost:5000/api/connect/requests",
        { info },
        config
      );

      dispatch(setFriends({ friends: data.updatedFriends }));

      setFetchAgain(!fetchAgain);

      toast({
        title: data.msg,
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    getFriendRequests();
  }, [fetchAgain]);

  return (
    <Box
      display={{ base: "none", md: "flex" }}
      flexDir="column"
      w="30%"
      h="100%"
      alignItems={"center"}
    >
      <FriendList />

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
          Requests
        </Text>
        {friendRequests.length !== 0 ? (
          <Stack overflowY="scroll">
            {friendRequests.map((request) => (
              <Box
                bg={"#E8E8E8"}
                color={"black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={request._id}
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
                  <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                    <Avatar name={request.name} src={request.pic} />

                    <Box>
                      <Heading size="sm">{request.name}</Heading>
                      <Text fontSize={"xs"}>{request.headline}</Text>
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
                    icon={<CheckCircleIcon />}
                    onClick={() => acceptOrReject(request._id, true)}
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
                    onClick={() => acceptOrReject(request._id, false)}
                  />
                </Flex>
              </Box>
            ))}
          </Stack>
        ) : (
          <Text
            align={"center"}
            bg={"red"}
            borderRadius="lg"
            color="white"
            p={1}
          >
            No new request
          </Text>
        )}
      </Box>
    </Box>
  );
};

export default RequestList;
