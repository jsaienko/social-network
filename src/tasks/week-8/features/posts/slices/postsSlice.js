import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import apiClient from '../../../api-client';

const fetchPosts = createAsyncThunk(
    'posts/fetchPosts',
    async (thunkAPI) => {
        const response = await apiClient.get('/api/posts');
        return response.data
    },
    {
        condition: () => !!apiClient.defaults.headers['Authorization'],
        dispatchConditionRejection: false
    }
);

const likePost = createAsyncThunk(
    'posts/likePost',
    async (postId, thunkAPI) => {
        const response = await apiClient.post(`/api/posts/${postId}/like`);
        return response.data
    },
    {
        condition: () => !!apiClient.defaults.headers['Authorization'],
        dispatchConditionRejection: false
    }
);

const postsSlice = createSlice({
    name: 'posts',
    initialState: {
        posts: [],
        isLoading: false
    },
    reducers: {
    },
    extraReducers: {

        [fetchPosts.pending]: (state) => {
            state.isLoading = true
        },
        [fetchPosts.fulfilled]: (state, action) => {

            state.posts = action.payload;
            state.isLoading = false;
        },
        [fetchPosts.rejected]: () => ({ posts: [], isLoading: false }),
        [likePost.pending]: (state) => {
            state.isLoading = true;
        },
        [likePost.fulfilled]: (state, action) => {
            state.isLoading = false;
            let likedPost = state.posts.find(post=> post._id === action.payload._id);
            let index = state.posts.indexOf(likedPost);

            if (index !== -1) {
                state.posts[index].likes = action.payload.likes;
                state.posts[index].likesNumber = action.payload.likesNumber;
            }

        },
    }
});

export { fetchPosts, likePost }

export default postsSlice.reducer;
