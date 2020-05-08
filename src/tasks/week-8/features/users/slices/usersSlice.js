import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import apiClient from '../../../api-client';

const fetchUsers = createAsyncThunk(
    'users/fetchUsers',
    async (thunkAPI) => {
        const response = await apiClient.get('/api/users');
        return response.data
    },
    {
        condition: () => !!apiClient.defaults.headers['Authorization'],
        dispatchConditionRejection: false
    }
);

const addToFriends = createAsyncThunk(
    'users/addToFriends',
    async (userId, thunkAPI) => {
        const response = await apiClient.post(`/api/users/${userId}/add`);
        return response.data
    },
    {
        condition: () => !!apiClient.defaults.headers['Authorization'],
        dispatchConditionRejection: false
    }
);

const usersSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        isLoading: false,
        resultMessage: null,
    },
    reducers: {
    },
    extraReducers: {

        [fetchUsers.pending]: (state) => {
            state.isLoading = true;
            state.resultMessage = null;
        },
        [fetchUsers.fulfilled]: (state, action) => {
            state.users = action.payload;
            state.resultMessage = null;
            state.isLoading = false;
        },
        [fetchUsers.rejected]: () => ({ users: [], isLoading: false }),
        [addToFriends.fulfilled]: (state) => {
            state.isLoading = false;
            state.resultMessage = null;
        },
    }
});

export { fetchUsers, addToFriends }

export default usersSlice.reducer;

