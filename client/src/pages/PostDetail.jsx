import {
  Avatar,
  Box,
  Flex,
  Heading,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Posts from "../components/Posts";
import LikeComment from "../components/LikeComment";

const PostDetail = () => {
  const postId = useParams();
  const [post, setPost] = useState();
  const [likes, setLikes] = useState(0);
  const [likedUser, setLikedUser] = useState([]);
  const [commentedUser, setCommentedUser] = useState([]);
  const [comments, setComments] = useState(0);
  const [fetchAgainLikes, setFetchAgainLikes] = useState(false);

  const token = useSelector((state) => state.user.token);
  const user = useSelector((state) => state.user.user);
  const toast = useToast();

  const currPost = async () => {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    const { data } = await axios.post(
      "http://localhost:5000/api/post/postdetail",
      { postId },
      config
    );

    setPost(data.post);
  };

  useEffect(() => {
    currPost();
  }, []);

  const handleLike = async () => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const ids = {
        postId: postId.id,
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

      setFetchAgainLikes(!fetchAgainLikes);
    } catch (error) {
      alert(error);
    }
  };

  const allLikes = async () => {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    const { data } = await axios.post(
      "http://localhost:5000/api/post/alllike",
      { postId },
      config
    );

    setLikes(data.likes);
    setLikedUser(data.likedUser);
  };

  const allComments = async () => {
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    const { data } = await axios.post(
      "http://localhost:5000/api/post/allcomments",
      { postId },
      config
    );

    setComments(data.comments);
    setCommentedUser(data.commentedUser);
  };

  useEffect(() => {
    allLikes();
  }, [fetchAgainLikes]);

  useEffect(() => {
    allComments();
  }, []);

  return (
    <Box display="flex" justifyContent={"center"} w="100%" h="1475px" p="10px">
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w={{ base: "100%", md: "60%" }}
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
        boxShadow={"dark-lg"}
      >
        {post ? (
          <Posts
            post={post}
            handleLike={handleLike}
            handleComment={allComments}
          />
        ) : (
          "No Post"
        )}

        {/* <LikeAndComments /> */}
        <Box
          display="flex"
          justifyContent={"space-between"}
          w="100%"
          h="54%"
          py={3}
          bg="white"
        >
          <Box
            id="likes"
            display="flex"
            flexDir="column"
            w="30%"
            h="100%"
            alignItems={"center"}
            border={"1px solid black"}
          >
            <LikeComment name={"Likes"} users={likedUser} count={likes} />
          </Box>

          <Box
            id="comments"
            display="flex"
            flexDir="column"
            w="68%"
            h="100%"
            alignItems={"center"}
            border={"1px solid black"}
          >
            <LikeComment
              name={"Comments"}
              users={commentedUser}
              count={comments}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default PostDetail;
