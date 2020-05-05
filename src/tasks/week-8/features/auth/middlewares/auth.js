import { login } from '../slices/currentUserSlice'
import apiClient from "../../../api-client";

const authMiddleware = store => next => action => {
    if (action.type === login.fulfilled.toString()) {
        const { authToken } = action.payload;
        localStorage.setItem('authToken', authToken);
        apiClient.defaults.headers['Authorization'] = `Bearer ${authToken}`;
    }
    next(action);
};

export default authMiddleware
