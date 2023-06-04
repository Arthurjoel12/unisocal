import { Avatar, Box, Flex, Heading, Stack, Text } from '@chakra-ui/react'
import React from 'react'

const LikeComment = ({ name, users, count }) => {

    return (
        <Box
            display="flex"
            flexDir="column"
            p={3}
            bg="#F8F8F8"
            w="100%"
            h="80%"
            borderRadius="lg"
            overflowY="hidden"
        >
            <Text fontSize='2xl' align="center" mb="2">{name}: {count}</Text>
            {users ? (
                <Stack overflowY="scroll">
                    {users.map((user) => (
                        <Box
                            bg={"#E8E8E8"}
                            color={"black"}
                            px={3}
                            py={2}
                            borderRadius="lg"
                            key={user._id}
                        >

                            <Flex spacing='4'>
                                <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
                                    <Avatar name={user.userId.name} src={user.userId.pic} />

                                    <Box>
                                        <Heading size='sm'>{user.userId.name}</Heading>
                                        <Text fontSize={'xs'}>{user.userId.headline}</Text>
                                    </Box>
                                </Flex>
                            </Flex>
                            {
                                name === 'Comments' ?
                                    <Box p={2}>
                                        {user.commentText}
                                    </Box>
                                    : ""
                            }
                        </Box>
                    ))}
                </Stack>
            ) : 'No ' + name
            }
        </Box>
    )
}

export default LikeComment