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
        console.log( `postId in async thunk: ${postId}`);
        const response = await apiClient.post(`/api/posts/${postId}`);
        console.log(`response: ${response}, response data: ${response.data}`);
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
            console.log( `action payload: ${action.payload}`);

        },
    }
});

export { fetchPosts, likePost }

export default postsSlice.reducer;
