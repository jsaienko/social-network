// A wrapper for <Route> that redirects to the login
// screen if you're not yet authenticated.
import React from 'react';
import { Route, Redirect } from "react-router-dom";
import { useSelector } from "react-redux";
import { getCurrentUser } from "../features/auth/selectors/currentUser";

export default function ProtectedRoute({ children, ...rest }) {
  const currentUser = useSelector(getCurrentUser);
  const isAuthenticated = !!currentUser;
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuthenticated
          ? children
          : <Redirect to={{ pathname: 'login', state: { from: location } }} />
      }
    />
  );
}
