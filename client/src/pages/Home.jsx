import { Box } from '@chakra-ui/react';
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import SideDrawer from '../components/Miscellaneous/Header';
import RequestList from '../components/Friends/RequestList';
import { setSelectedChat } from '../State/ChatSlice';
import FilterBox from '../components/FilterBox';

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const user = useSelector((state) => state.user.user);

    useEffect(() => {
        if (!user) {
            navigate("/");
        }

        dispatch(setSelectedChat(null))
    });

    return (
        <div style={{ width: "100%" }} >
            {user && <SideDrawer />}
            <Box
                display='flex'
                flexFlow={{ base: "column", md: "row" }}
                justifyContent={{ base: "center", md: "right" }}
                w="100%"
                h={{ base: "1200px", md: "91.5vh" }}
                p="10px"
            >
                <FilterBox />
                <RequestList />
            </Box>
        </div>
    )
}

export default Home