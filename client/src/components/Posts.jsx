import { Avatar, Box, Button, Card, CardBody, CardFooter, CardHeader, Flex, Heading, Image, Stack, Text, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import CommentModal from './Miscellaneous/CommentModal';
import { ViewIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import UserBadgeItem from './UserAvatar/UserBadgeItem';
import ProfileModal from "./Miscellaneous/ProfileModal"

const Posts = ({ post, handleLike, handleComment, postDetailButton }) => {
    const navigate = useNavigate();
    const [timeElapsed, setTimeElapsed] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            const time = getTimeElapsed(post.createdAt);
            setTimeElapsed(time);
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [post.createdAt]);

    const getTimeElapsed = (createdAt) => {
        if (!createdAt) {
            return '';
        }
        const now = new Date();
        const created = new Date(createdAt);
        if (isNaN(created)) {
            return '';
        }
        const diff = now - created;
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        if (days > 0) {
            return `${days}d ago`;
        } else if (hours > 0) {
            return `${hours}h ago`;
        } else if (minutes > 0) {
            return `${minutes}m ago`;
        } else {
            return `${seconds}s ago`;
        }
    };

    return (
        <Card
            w="100%"
            key={post._id}
            bg="#E8E8E8"
            border={'1px solid black'}
        >
            <Box
                display={"flex"}
                flexDir={'column'}
            >
                <Box w="100%">
                    <CardHeader>
                        <Flex spacing='4'>
                            <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>

                                <ProfileModal user={post.userId}>
                                    <Avatar
                                        key={post.userId._id}
                                        name={post.userId.name}
                                        src={post.userId.pic}
                                        cursor={'pointer'}
                                    />
                                </ProfileModal>

                                <Box>
                                    <Heading size='sm'>{post.userId.name}</Heading>
                                    <Text>{post.userId.headline}</Text>
                                </Box>
                            </Flex>
                            <Text>{timeElapsed}</Text>
                        </Flex>
                    </CardHeader>
                    <CardBody
                        pt={1}
                    >
                        <Text as="b">{post.heading}</Text>
                        <Text mt={2} textAlign={'justify'} dangerouslySetInnerHTML={{ __html: post.content }} />
                        <Box justifyContent={{ base: 'center' }} alignItems={'center'} w="100%" display="flex" flexWrap="wrap" mt={5}>
                            {post.tags.map((tag, index) => (
                                <UserBadgeItem
                                    key={index}
                                    user={tag}
                                    noCrossIcon={true}
                                    handleFunction={() => { }}
                                />
                            ))}
                        </Box>
                    </CardBody>
                </Box>
                {post.pic ?
                    <Box
                        display="flex"
                        justifyContent={"center"}
                    >
                        <Image
                            align={"center"}
                            boxSize={{ base: '350px', sm: '400px', md: '500px' }}
                            src={post.pic}
                        />
                    </Box> : ""
                }
            </Box>

            <CardFooter
                display={'flex'}
                justifyContent='space-between'
            >
                <Box>
                    <Button
                        size={{ base: 'xs', sm: 'sm', md: 'md' }}
                        variant='solid'
                        mr={5}
                        colorScheme='pink'
                        _hover={{ color: 'black' }}
                        onClick={() => handleLike(post._id)}
                        border={'1px solid black'}
                    >
                        Like
                    </Button>
                    <CommentModal postId={post._id} handleCommentFunction={() => { handleComment() }} />
                </Box>

                {
                    postDetailButton ?
                        <Button
                            size={{ base: 'xs', sm: 'sm', md: 'md' }}
                            onClick={() => navigate(`/post/${post._id}`)}
                            bg='#F8F8F8'
                            _hover={{ bg: "violet" }}
                        >
                            <ViewIcon fontSize="2xl" m={1} />
                        </Button>
                        : ""
                }
            </CardFooter>
        </Card>
    )
}

export default Posts