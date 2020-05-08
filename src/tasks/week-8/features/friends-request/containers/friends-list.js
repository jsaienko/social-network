import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';

import { fetchFriends, rejectFriendsRequest, confirmFriendsRequest } from '../slices/friendsRequestSlice';

function FriendsList() {
    const dispatch = useDispatch();
    const [friendsAction, setFriendsAction] = useState(null);
    const { friends, isRequestLoading} = useSelector(state => state.friends);

    const pending = friends.filter(friend => friend.status === 2);

    const getFriend = (friend) => {
        return friend.recipient
    };

    const inFriends = friends.filter(friend => friend.status === 3).map((friend) => getFriend(friend));

    useEffect(() => {
        dispatch(fetchFriends())
    },[dispatch]);

    const handleConfirm = (userId) => {
        setFriendsAction('confirm');
        dispatch(confirmFriendsRequest(userId))
    };

    const handleReject = (userId) => {
        setFriendsAction('reject');
        dispatch(rejectFriendsRequest(userId));
    };

    if(isRequestLoading) return <div>Loading...</div>;

    return (
        <div>
            <h3>Incoming requests</h3>
            <ul>
                {pending.map(friend => <li>
                    <h2><span>{friend.recipient.first_name}</span><span>{friend.recipient.last_name}</span></h2>
                    <button type='button' onClick={()=> handleConfirm(friend._id)}>Confirm</button>
                </li>)}
            </ul>
            <h3>My friends</h3>
            <ul>
                {inFriends.map(friend=> <li>
                    <h2><span>{friend.first_name}</span><span>{friend.last_name}</span></h2>
                    <button type='button' onClick={()=> handleReject(friend._id)}>Remove from friends</button>
                </li>)}
            </ul>
        </div>
    );
}

export default FriendsList;
