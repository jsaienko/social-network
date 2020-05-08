import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import apiClient from '../../../api-client';

const fetchFriends = createAsyncThunk(
    'friends/fetchUserFriend',
    async (thunkAPI) => {
        const response = await apiClient.get('/api/friends');
        return response.data
    },
    {
        condition: () => !!apiClient.defaults.headers['Authorization'],
        dispatchConditionRejection: false
    }
);

const confirmFriendsRequest = createAsyncThunk(
    'friends/confirm',
    async (userId, thunkAPI) => {
        const response = await apiClient.post(`/api/friends/${userId}/confirm`);
        return response.data
    },
    {
        condition: () => !!apiClient.defaults.headers['Authorization'],
        dispatchConditionRejection: false
    }
);

const rejectFriendsRequest = createAsyncThunk(
    'friends/reject',
    async (userId, thunkAPI) => {
        const response = await apiClient.post(`/api/friends/${userId}/reject`);
        return response.data
    },
    {
        condition: () => !!apiClient.defaults.headers['Authorization'],
        dispatchConditionRejection: false
    }
);

const friendsRequestSlice = createSlice({
    name: 'friendsRequest',
    initialState: {
        friends: [],
        isRequestLoading: false,
    },
    reducers: {
    },
    extraReducers: {
        [fetchFriends.pending]: (state) => {
            state.isRequestLoading = true;
        },
        [fetchFriends.fulfilled]: (state, action) => {
            state.friends = action.payload;
            state.isRequestLoading = false;
        },
        [fetchFriends.rejected]: () => ({ friends: [], isLoading: false}),
        [confirmFriendsRequest.pending]: (state) => {
            state.isRequestLoading = true;
        },
        [confirmFriendsRequest.rejected]: () => ({ isLoading: false} ),
        [confirmFriendsRequest.fulfilled]: (state, action) => {
            state.isRequestLoading = false;
            state.friends = action.payload;
        },
        [rejectFriendsRequest.pending]: (state) => {
            state.isRequestLoading = true;
        },
        [rejectFriendsRequest.rejected]: () => ({ isLoading: false}),
        [rejectFriendsRequest.fulfilled]: (state, action) => {
            state.isRequestLoading = false;
            state.friends = action.payload;
        },
    }
});

export { fetchFriends, confirmFriendsRequest, rejectFriendsRequest}

export default friendsRequestSlice.reducer;

