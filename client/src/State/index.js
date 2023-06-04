import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./UserSlice";
import chatSlice from "./ChatSlice";
import storage from "redux-persist/lib/storage"
import {
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import friendSlice from "./FriendSlice";
import postSlice from "./PostSlice";

const rootReducer = combineReducers({
    user: userSlice.reducer,
    chat: chatSlice.reducer,
    friend: friendSlice.reducer,
    post: postSlice.reducer
})

const persistConfig = { key: "root", storage, version: 1 };
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
        serializableCheck: {
            ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
    })
});

export default store;