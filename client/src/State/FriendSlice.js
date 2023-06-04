import { createSlice } from "@reduxjs/toolkit";

const initialStateValues = {
    friends: [null],
}

const friendSlice = createSlice({
    name: "friend",
    initialState: { value: initialStateValues },
    reducers: {
        setFriends: (state, action) => {
            state.friends = action.payload.friends;
        }
    }
})

export const { setFriends } = friendSlice.actions;

export default friendSlice;