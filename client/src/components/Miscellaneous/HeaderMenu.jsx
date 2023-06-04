import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerOverlay, Text, useDisclosure, ModalCloseButton } from '@chakra-ui/react';
import { useDispatch } from 'react-redux';
import { HamburgerIcon, LockIcon } from "@chakra-ui/icons";
import { BellIcon, ChatIcon } from "@chakra-ui/icons"
import PostModal from './PostModal';
import { useNavigate } from 'react-router-dom';
import ProfileModal from './ProfileModal';
import { setLogout } from '../../State/UserSlice';
import { setSelectedChat } from '../../State/ChatSlice';

const HeaderMenu = ({ user }) => {
    const { isOpen, onOpen, onClose } = useDisclosure();

    const dispatch = useDispatch();
    const navigate = useNavigate()

    const logout = () => {
        dispatch(setLogout())
        dispatch(setSelectedChat(null))
    }

    return (
        <>
            <Button onClick={onOpen}><HamburgerIcon /></Button>

            <Drawer size={{ base: 'lg', sm: 'xs' }} placement='right' onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <ModalCloseButton />
                    <DrawerBody
                        display='flex'
                        flexDirection='column'
                        mt={10}
                        justifyContent={'space-between'}
                    >
                        <Box>
                            <Button
                                display='flex'
                                onClick={() => navigate("/chats")}
                                p={1}
                                mb={1}
                                w='100%'
                            >
                                <ChatIcon m={1} mr={3} />
                                <Text w='30%' align='left' ml={1}>Chats</Text>
                            </Button>

                            <Button
                                display='flex'
                                p={1}
                                mb={1}
                                w='100%'
                            >
                                <BellIcon m={1} mr={3} />
                                <Text w='30%' align='left' ml={1}>Notifications</Text>
                            </Button>

                            <PostModal />
                        </Box>

                        <Box>
                            <ProfileModal user={user}>
                                <Button
                                    display='flex'
                                    p={1}
                                    mb={1}
                                    w='100%'
                                >
                                    <Avatar
                                        size="sm"
                                        cursor="pointer"
                                        name={user.name}
                                        src={user.pic}
                                        p={1}
                                    />
                                    <Text w='30%' align='left' ml={1}>My Profile</Text>
                                </Button>
                            </ProfileModal>

                            <Button
                                onClick={logout}
                                display='flex'
                                p={1}
                                mb={1}
                                w='100%'
                            >
                                <LockIcon m={1} mr={3} />
                                <Text w='30%' align='left' ml={1}>Logout</Text>
                            </Button>
                        </Box>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default HeaderMenu;