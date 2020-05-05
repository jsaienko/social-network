import React from 'react';
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from "react-redux";

function ProtectedRoute({ children, ...rest }) {
  const currentUser = useSelector(state => state.currentUser.user);
  const isAuthenticated = !!currentUser;
  return (
    <Route
      {...rest}
      render={props =>
        isAuthenticated
          ? children
          : <Redirect to='/login'/>
      }
    />
  );
}

export default ProtectedRoute;
