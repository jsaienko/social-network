import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { fetchUsers, addToFriends } from '../slices/usersSlice';



const Users = () => {
    const dispatch = useDispatch();
    const { isLoading, users, resultMessage} = useSelector(state => state.users);

    useEffect(() => {
        dispatch(fetchUsers())
    },[dispatch]);

    const handleAddToFriends = (userId) => {
        dispatch(addToFriends(userId));
    };

    const isResultMessage = resultMessage ? <div>{resultMessage.message}</div> : null;

    if(isLoading) return <div>Loading...</div>;

    return (
        <div>
            <ul>
                {users.map( user => <li key={user._id}>
                        <h2><span>{user.first_name} </span><span>{user.last_name}</span></h2>
                        <p>{user._id}</p>
                        <button onClick={()=> handleAddToFriends(user._id)}>Add to friends</button>
                    </li>
                )}
            </ul>
            {isResultMessage}
        </div>

    );
};

export default Users;
