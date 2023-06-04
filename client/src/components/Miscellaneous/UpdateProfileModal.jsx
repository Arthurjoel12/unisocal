import { Button } from "@chakra-ui/button";
import { FormControl, FormLabel } from "@chakra-ui/form-control";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/modal";
import { useToast } from "@chakra-ui/toast";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "../../State/UserSlice";
import { EditIcon } from "@chakra-ui/icons";

const UpdateProfileModal = ({ ifUpdate }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const token = useSelector((state) => state.user.token);
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const dispatch = useDispatch();
  const [pic, setPic] = useState();

  const postDetails = (pics) => {
    setLoading(true);
    if (pics === undefined) {
      toast({
        title: "Please select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      return;
    }

    if (
      pics.type === "image/jpg" ||
      pics.type === "image/jpeg" ||
      pics.type === "image/png"
    ) {
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
    } else {
      toast({
        title: "Please select an Image!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await axios.put(
        "http://localhost:5000/api/user/update",
        { pic, bio, headline },
        config
      );

      toast({
        title: data.msg,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      dispatch(setLogin({ user: data.user, token: token }));
      ifUpdate();

      setPic("");
      setBio("");
      setHeadline("");
      onClose();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast({
        title: "Enter what to update",
        status: "error",
        duration: 3000,
        isClosable: true,
        position: "top",
      });
    }
  };

  return (
    <>
      <Button onClick={onOpen} colorScheme={"blue"} display={"flex"}>
        <EditIcon mr={3} />
        Edit
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Update Profile
          </ModalHeader>
          <ModalCloseButton />

          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl id="pic">
              <FormLabel>Update your Picture</FormLabel>
              <Input
                type="file"
                mb={3}
                p={1.5}
                accept="image/*"
                onChange={(e) => postDetails(e.target.files[0])}
              />
            </FormControl>

            <FormControl>
              <Input
                placeholder="Headline"
                mb={3}
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <Input
                placeholder="Bio"
                mb={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </FormControl>

            <Button
              variant="solid"
              colorScheme="green"
              ml={1}
              isLoading={loading}
              onClick={handleUpdate}
            >
              Update
            </Button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateProfileModal;
