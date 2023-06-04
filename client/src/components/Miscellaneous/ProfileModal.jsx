import React, { useEffect, useState } from "react";
import {
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Image,
  Text,
  Box,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { useSelector } from "react-redux";
import axios from "axios";
import UpdateProfileModal from "./UpdateProfileModal";
import Posts from "../Posts";

const ProfileModal = ({ user, children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const token = useSelector((state) => state.user.token);
  const loggedUser = useSelector((state) => state.user.user);
  const friends = useSelector((state) => state.friend.friends);

  const [posts, setPosts] = useState([]);
  const [postCount, setPostCount] = useState(0);

  const [name, setName] = useState();
  const [college, setCollege] = useState();
  const [email, setEmail] = useState();
  const [bio, setBio] = useState();
  const [headline, setHeadline] = useState();
  const [pic, setPic] = useState();
  const [fetchAgain, setFetchAgain] = useState(false);

  const toast = useToast();

  const userDetails = () => {
    setName(user.name.toUpperCase());
    setPic(user.pic);
    setHeadline(user.headline);
    setEmail(user.email);
    setBio(user.bio);
    setCollege(user.college);
  };
  useEffect(() => {
    userDetails();
  }, [fetchAgain]);

  const getUserPosts = async () => {
    const config = {
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const userId = user._id;

    const { data } = await axios.post(
      "http://localhost:5000/api/post/userposts",
      { userId },
      config
    );

    setPosts(data.posts);
    setPostCount(data.totalPosts);
  };

  useEffect(() => {
    getUserPosts();
  }, []);

  const handleLike = async (postId) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const ids = {
        postId: postId,
        userId: user._id,
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/post/like",
        { ids },
        config
      );

      toast({
        title: data.msg,
        status: "success",
        duration: 1000,
        isClosable: true,
        position: "top",
      });
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      {children ? (
        <span onClick={onOpen}>{children}</span>
      ) : (
        <IconButton
          display={{ base: "flex" }}
          icon={<ViewIcon />}
          onClick={onOpen}
        />
      )}
      <Modal size="full" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent h="410px">
          <ModalCloseButton bg="red" color={"black"} />

          <ModalBody
            display="flex"
            flexDirection={{ base: "column", md: "row" }}
            h={{ base: "1200px", md: "100%" }}
            bg="skyblue"
            justifyContent={"space-evenly"}
            alignItems={"center"}
            border="2px solid black"
          >
            <Box
              id="user-profile-container"
              display="flex"
              flexDir={"column"}
              bg="#F8F8F8"
              p={3}
              alignItems={"center"}
              justifyContent={{ base: "none", md: "space-between" }}
              h={{ base: "50%", md: "95%" }}
              w={{ base: "90%", md: "28%" }}
              borderRadius="lg"
              boxShadow={"dark-lg"}
              mb={{ base: "5", md: "0" }}
            >
              <Box
                display="flex"
                flexDir={{ base: "column" }}
                bg="#E8E8E8"
                p={3}
                alignItems={{ base: "center" }}
                h="90%"
                w="100%"
                borderRadius="lg"
              >
                <Box
                  id="user-info-container"
                  w={{ base: "100%" }}
                  display="flex"
                  flexDir={{ base: "column", sm: "row", md: "column" }}
                  justifyContent={{ base: "center" }}
                  alignItems={{ base: "center" }}
                  p={2}
                >
                  <Image
                    borderRadius="full"
                    boxSize={{ base: "100px", lg: "150px" }}
                    src={pic}
                    mb={2}
                    mr={2}
                  />
                  <Box
                    display={"flex"}
                    flexDir={"column"}
                    justifyContent={"center"}
                    alignItems={"center"}
                  >
                    <Text
                      fontSize={{ base: "17px", md: "25px", lg: "30px" }}
                      fontFamily="Work sans"
                    >
                      {name}
                    </Text>

                    {headline ? (
                      <Text
                        fontSize={{ base: "10px", md: "14px", lg: "16px" }}
                        mb={3}
                      >
                        {headline}
                      </Text>
                    ) : (
                      ""
                    )}
                    <Box>
                      <Text fontSize={{ base: "15px", md: "20px", lg: "25px" }}>
                        Friends: {friends !== undefined ? friends.length : ""}
                      </Text>

                      <Text
                        fontSize={{ base: "15px", md: "20px", lg: "25px" }}
                        mb={{ base: "", sm: "auto" }}
                      >
                        Posts: {postCount}
                      </Text>
                    </Box>
                  </Box>
                </Box>

                <Box
                  display={"flex"}
                  flexDirection={"column"}
                  w={{ md: "100%" }}
                  h="100%"
                  justifyContent={"space-between"}
                  alignItems="center"
                  p={2}
                >
                  <Box display="flex" mb={1}>
                    <Text
                      fontSize={{ md: "20px", lg: "24px" }}
                      fontFamily="Work sans"
                      mr={1}
                    >
                      {email}
                    </Text>
                  </Box>

                  {bio ? (
                    <Text
                      p={2}
                      align="center"
                      fontSize={{ base: "10px", sm: "14px", lg: "18px" }}
                    >
                      {bio}
                    </Text>
                  ) : (
                    ""
                  )}

                  <Text
                    fontSize={{ base: "14px", sm: "20px" }}
                    mt={{ base: "", sm: "auto" }}
                  >
                    College: {college}
                  </Text>
                </Box>
              </Box>

              {loggedUser === user ? (
                <UpdateProfileModal
                  ifUpdate={() => setFetchAgain(!fetchAgain)}
                />
              ) : (
                ""
              )}
            </Box>

            <Box
              id="user-posts"
              display="flex"
              flexDir="column"
              p={3}
              bg="#F8F8F8"
              w={{ base: "100%", md: "45%" }}
              h="100%"
              borderRadius="lg"
              overflowY="hidden"
              boxShadow={"dark-lg"}
              border={"1px solid black"}
            >
              {posts ? (
                <Stack
                  display={"flex"}
                  alignItems={"center"}
                  overflowY="scroll"
                  spacing={"3"}
                  p={{ base: 0 }}
                >
                  {posts.map((post) => (
                    <Posts
                      key={post._id}
                      post={post}
                      handleLike={handleLike}
                      handleComment={() => {}}
                      postDetailButton={true}
                    />
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
                  No Post
                </Text>
              )}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileModal;
