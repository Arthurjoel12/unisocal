import { createSlice } from "@reduxjs/toolkit";

const initialStateValues = {
    posts: []
}

const postSlice = createSlice({
    name: "post",
    initialState: { value: initialStateValues },
    reducers: {
        setPosts: (state, action) => {
            state.posts = action.payload;
        }
    }
})

export const { setPosts } = postSlice.actions;

export default postSlice;