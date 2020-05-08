import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import currentUser from './features/auth/slices/currentUserSlice'
import posts from './features/posts/slices/postsSlice';
import users from './features/users/slices/usersSlice';
import friends from './features/friends-request/slices/friendsRequestSlice'
import authMiddleware from './features/auth/middlewares/auth'

const middleware = [...getDefaultMiddleware(), authMiddleware];

const store = configureStore({
    reducer: {
        currentUser,
        posts,
        users,
        friends
    },
    devTools: true,
    middleware
});

export default store;
