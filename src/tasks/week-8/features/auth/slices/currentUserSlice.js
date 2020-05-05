import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import apiClient from '../../../api-client';

const fetchCurrentUser = createAsyncThunk(
  'currentUser/fetchCurrentUser',
  async (thunkAPI) => {
    const response = await apiClient.get('/api/me');
    return response.data
  },
  {
    condition: () => !!apiClient.defaults.headers['Authorization'],
    dispatchConditionRejection: false
  }
);

const login = createAsyncThunk(
  'currentUser/login',
  async (credentials, thunkAPI) => {
    const response = await apiClient.post('/auth', credentials);
    return response.data
  }
);

const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState: {
    user: null,
    isLoading: false
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.isLoading = false;
    }
  },
  extraReducers: {
    // Add reducers for additional action types here, and handle loading state as needed
    [fetchCurrentUser.pending]: (state) => {
      state.loading = true
    },
    [fetchCurrentUser.fulfilled]: (state, action) => {
      // Add user to the state array
      state.user = action.payload;
    },
    [login.fulfilled]: (state, action) => {
      state.user = action.payload.user;
    },
    [fetchCurrentUser.rejected]: () => ({ user: null, isLoading: false })
  }
});

export const { logout } = currentUserSlice.actions;
export { fetchCurrentUser, login }

export default currentUserSlice.reducer;
