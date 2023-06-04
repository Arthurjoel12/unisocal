import { Avatar, Box, Button, Text } from '@chakra-ui/react';
import React from 'react'
import ProfileModal from '../Miscellaneous/ProfileModal';

const UserListItem = ({ isTrue, user, addAvail, chatAvail, handleChatFunction, handleConnectFunction }) => {
    return (
        <Box
            bg="#E8E8E8"
            _hover={{
                background: "pink"
            }}
            w="100%"
            h="12%"
            display="flex"
            alignItems="center"
            color="black"
            px={2}
            py={2}
            mb={2}
            borderRadius="lg"
        >
            <ProfileModal user={user}>
                <Avatar
                    mr={2}
                    size="sm"
                    cursor="pointer"
                    name={user.name}
                    src={user.pic}
                />
            </ProfileModal>
            <Box display="flex" justifyContent="space-between" w="100%" alignItems="center">
                <Text>
                    {user.name}
                    <br />
                    <Text
                        pl={0.5}
                        fontSize={"10px"}
                    >
                        {user.headline}
                    </Text>
                </Text>
                <Box
                    display="flex"
                    flexDirection={"column"}
                >

                    {chatAvail ?
                        <Button
                            mb={1}
                            _hover={{ color: "black" }}
                            size='xs'
                            colorScheme="whatsapp"
                            variant='solid'
                            onClick={handleChatFunction}
                        >
                            Chat
                        </Button> : ""
                    }
                    {(isTrue && addAvail) ? <Button
                        size='xs'
                        _hover={{ color: "black" }}
                        colorScheme="telegram"
                        variant='solid'
                        onClick={handleConnectFunction}
                    >
                        Add/Remove
                    </Button> : ""}
                </Box>
            </Box>
        </Box>
    )
}

export default UserListItem