import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import UserBadgeItem from "./UserAvatar/UserBadgeItem";
import axios from "axios";
import Feed from "./Feed";
import { AddIcon } from "@chakra-ui/icons";

const FilterBox = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [filteredPosts, setFilteredPosts] = useState([]);

  const toast = useToast();

  const handleTagAddFunction = () => {
    if (newTag) {
      setSelectedTags([...selectedTags, newTag]);
    } else {
      toast({
        title: "No tag selected",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "center",
      });
    }
  };

  const handleDelete = (del) => {
    setSelectedTags(selectedTags.filter((sel) => sel !== del));
  };

  useEffect(() => {
    filterPost();
  }, [selectedTags]);

  const filterPost = async () => {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    const { data } = await axios.post(
      `http://localhost:5000/api/post/searchByTags?tags=${selectedTags}`,
      config
    );

    setFilteredPosts(data);
  };

  return (
    <>
      <Box
        display={"flex"}
        flexDir={"column"}
        justifyContent={{ md: "center" }}
        w={{ base: "100%", md: "30%" }}
        h={{ base: "18%", md: "100%" }}
        alignItems={"center"}
        mb={3}
      >
        <Box
          display="flex"
          flexDir="column"
          p={3}
          bg="#F8F8F8"
          w={{ base: "100%", md: "90%", lg: "70%" }}
          h={{ base: "100%", md: "60%", lg: "70%" }}
          mr="10"
          ml="10"
          borderRadius="lg"
          overflowY="hidden"
          boxShadow={{ base: "none", md: "dark-lg" }}
        >
          <Text fontSize="2xl" align="center" mb={{ base: "2", md: "5" }}>
            Filters
          </Text>
          <FormControl>
            <FormLabel>Tags</FormLabel>
            <Box
              justifyContent={{ base: "center" }}
              alignItems={"center"}
              w="100%"
              display="flex"
              flexWrap="wrap"
            >
              {selectedTags.map((tag, index) => (
                <UserBadgeItem
                  key={index}
                  user={tag}
                  handleFunction={() => handleDelete(tag)}
                />
              ))}
            </Box>
            <Input
              autoComplete="off"
              border={"1px solid black"}
              placeholder="Add Some Tags"
              p={1.5}
              mb={2}
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
            />
            <Box w="100%" display={"flex"} justifyContent={"center"}>
              <Button
                display={"flex"}
                m={1}
                size="xs"
                _hover={{ color: "white" }}
                colorScheme="yellow"
                variant="solid"
                onClick={() => {
                  handleTagAddFunction();
                  setNewTag("");
                }}
                border={"1px solid black"}
              >
                <AddIcon mr={1} />
                <Text as="b">ADD</Text>
              </Button>
            </Box>
          </FormControl>
        </Box>
      </Box>

      <Feed filteredPosts={filteredPosts} />
    </>
  );
};

export default FilterBox;
