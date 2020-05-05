import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import currentUser from './features/auth/slices/currentUserSlice'
import posts from './features/posts/slices/postsSlice';
import authMiddleware from './features/auth/middlewares/auth'

const middleware = [...getDefaultMiddleware(), authMiddleware];

const store = configureStore({
    reducer: {
        currentUser,
        posts,
    },
    devTools: true,
    middleware
});

export default store;
