import {
  Button,
  FormControl,
  FormLabel,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";
import { useSelector } from "react-redux";

const CommentModal = ({ postId, handleCommentFunction }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [comment, setComment] = useState("");
  const user = useSelector((state) => state.user.user);
  const token = useSelector((state) => state.user.token);
  const toast = useToast();

  const handleComment = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const info = {
        postId: postId,
        userId: user._id,
        comment: comment,
      };

      const { data } = await axios.post(
        "http://localhost:5000/api/post/comment",
        { info },
        config
      );

      toast({
        title: data.msg,
        status: "success",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      setComment("");
      onClose();
      handleCommentFunction();
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <Button
        size={{ base: "xs", sm: "sm", md: "md" }}
        variant="solid"
        colorScheme="blue"
        _hover={{ color: "black" }}
        onClick={onOpen}
        border={"1px solid black"}
      >
        Comment
      </Button>

      <Modal size="xl" isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="40px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Add a comment
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            alignItems="center"
          >
            <FormControl id="comment" isRequired>
              <FormLabel>Comment...</FormLabel>
              <Textarea
                id="content"
                placeholder="Write Some Content"
                onChange={(e) => setComment(e.target.value)}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={() => handleComment()}>
              Add
            </Button>

            <Button colorScheme="red" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CommentModal;
