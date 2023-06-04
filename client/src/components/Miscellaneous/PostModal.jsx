import React, { useState } from "react";
import {
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Input,
  useToast,
  Textarea,
  Box,
  Text,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { setPosts } from "../../State/PostSlice";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

const PostModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);

  const toast = useToast();
  const dispatch = useDispatch();

  const [heading, setHeading] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [pic, setPic] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTag, setNewTag] = useState("");

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      setLoading(false);
      return;
    }

    if (
      pics.type === "image/jpg" ||
      pics.type === "image/jpeg" ||
      pics.type === "image/png"
    ) {
      setLoading(true);
      const data = new FormData();
      data.append("file", pics);
      data.append("upload_preset", "chat-app");
      data.append("cloud_name", "greens-io");
      fetch("https://api.cloudinary.com/v1_1/greens-io/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          setPic(data.url.toString());
          setLoading(false);
        })
        .catch((err) => {
          console.log(err); 
          setLoading(false);
        });
      setPic("");
    }
  };

  const handlePost = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const linkRegex = /(https?:\/\/[^\s]+)/g;
      const formattedText = content.replace(
        linkRegex,
        '<a href="$1" target="_blank">$1</a>'
      );

      const info = {
        userId: user._id,
        heading: heading,
        content: formattedText,
        pic: pic,
        tags: selectedTags,
      };

      const { data } = await axios.post(
        `http://localhost:5000/api/post/create`,
        { info },
        config
      );

      dispatch(setPosts(data.post));

      toast({
        title: data.msg,
        status: "success",
        duration: 1000,
        isClosable: true,
        position: "bottom",
      });

      setLoading(false);
      setHeading("");
      setContent("");
      setSelectedTags([]);
      onClose();
    } catch (error) {
      setLoading(false);
      toast({
        title: "Error",
        description: error.response.data.error,
        status: "error",
        duration: 1000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const handleDelete = (del) => {
    setSelectedTags(selectedTags.filter((sel) => sel !== del));
  };

  const handleTagAddFunction = () => {
    if (newTag) {
      setSelectedTags([...selectedTags, newTag]);
      setNewTag("");
    } else {
      toast({
        title: "No tag selected",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <>
      <Button
        p={1}
        mb={1}
        display={{ base: "flex", md: "none" }}
        onClick={onOpen}
        w="100%"
      >
        <AddIcon
          fontSize="sm"
          m={1}
          mr={3}
          _hover={{ cursor: "pointer", color: "red" }}
        />
        <Text w="30%" align="left">
          New Post
        </Text>
      </Button>

      <AddIcon
        display={{ base: "none", md: "inline" }}
        onClick={onOpen}
        fontSize="md"
        m={1}
        mr={3}
        _hover={{ cursor: "pointer", color: "red" }}
      />

      <Modal size="xl" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create a new post
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            alignItems="center"
          >
            <FormControl id="heading">
              <FormLabel>Heading</FormLabel>
              <Input
                id="heading"
                autoComplete="off"
                placeholder="Write a Heading"
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                mb={2}
              />
            </FormControl>
            <FormControl id="pic">
              <FormLabel>Upload a Picture</FormLabel>
              <Input
                type="file"
                p={1.5}
                accept="image/*"
                onChange={(e) => postDetails(e.target.files[0])}
                mb={2}
              />
            </FormControl>
            <FormControl id="content" isRequired>
              <FormLabel>Content</FormLabel>
              <Textarea
                id="content"
                autoComplete="off"
                placeholder="Write Some Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                mb={2}
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Tags</FormLabel>
              <Box w="100%" display="flex" flexWrap="wrap">
                {selectedTags !== null
                  ? selectedTags.map((tag, index) => (
                      <UserBadgeItem
                        key={index}
                        user={tag}
                        handleFunction={() => handleDelete(tag)}
                      />
                    ))
                  : ""}
              </Box>
              <Input
                placeholder="Add Tags eg: frontend, javascript, devops"
                autoComplete="off"
                p={1.5}
                mb={2}
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
              <Button
                size="xs"
                _hover={{ color: "black" }}
                colorScheme="telegram"
                variant="solid"
                onClick={handleTagAddFunction}
              >
                Add
              </Button>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              isLoading={loading}
              colorScheme="green"
              mr={3}
              onClick={handlePost}
            >
              Create
            </Button>
            <Button
              colorScheme="red"
              mr={3}
              onClick={() => {
                onClose();
                setSelectedTags([]);
                setNewTag("");
                setHeading("");
                setContent("");
                setPic("");
              }}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default PostModal;
