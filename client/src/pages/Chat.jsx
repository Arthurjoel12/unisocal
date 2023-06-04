import { Box } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ChatBox from '../components/Chats/ChatBox';
import MyChats from '../components/Chats/MyChats';
import SideDrawer from '../components/Miscellaneous/Header';

const Chat = () => {
    const navigate = useNavigate();
    const [fetchAgain, setFetchAgain] = useState(false);
    const user = useSelector((state) => state.user.user);

    useEffect(() => {
        if (!user) {
            navigate("/");
        }
    });

    return (
        <div style={{ width: "100%" }} >
            {user && <SideDrawer />}
            <Box display='flex' justifyContent="space-between" w="100%" h="91.5vh" p="10px">
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && (
                    <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
                )}
            </Box>
        </div>
    )
}

export default Chat