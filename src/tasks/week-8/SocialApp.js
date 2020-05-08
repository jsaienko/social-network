import React, { useEffect, useState } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import LoginPage from "./features/auth/containers/LoginPage";
import HomePage from "./features/home/containers/HomePage";
import Posts from './features/posts/containers/posts';
import Users from './features/users/containers/users';
import FriendsList from './features/friends-request/containers/friends-list';
import ProtectedRoute from "./components/ProtectedRoute";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "./features/auth/slices/currentUserSlice";

function SocialApp() {
  const dispatch = useDispatch();
  const [hasUserRequested, setUserRequested] = useState(false);
  // fetch current user if possible
  useEffect(() =>{
      dispatch(fetchCurrentUser())
        .then(() => setUserRequested(true))
        .catch(() => setUserRequested(true))
  }
, [dispatch]);
  if (!hasUserRequested) return null;
  return (
    <div className='social-app'>
      <BrowserRouter>
        <Switch>
          <Route exact path='/'>
            <HomePage/>
          </Route>
          <Route exact path='/login'>
            <LoginPage />
          </Route>
          <ProtectedRoute path='/posts'>
            <div>Hello Protected Page</div>
            <Posts />
          </ProtectedRoute>
          <ProtectedRoute path='/users'>
            <div>Hello Protected Page</div>
            <Users />
          </ProtectedRoute>
          <ProtectedRoute path='/friends' exact>
            <div>Hello Protected Page</div>
            <FriendsList />
          </ProtectedRoute>
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default SocialApp;
