import React, { useCallback, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom'
import { useDispatch } from "react-redux";
import { login } from "../slices/currentUserSlice";

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { from } = location.state || { from: { pathname: "/" } };

  const submitForm = useCallback(e => {
    e.stopPropagation();
    e.preventDefault();
    dispatch(login({ email, password }))
      .then(() => history.replace(from))
  }, [email, password]);

  return (
    <div className='login-page'>
      <form onSubmit={submitForm}>
        <div>Login form</div>
        <input type="text" value={email} onChange={e => setEmail(e.target.value)}/>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)}/>
        <input type="submit"/>
      </form>
    </div>
  );
}

export default LoginPage;
