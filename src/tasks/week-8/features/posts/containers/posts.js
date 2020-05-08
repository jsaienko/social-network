import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts } from '../slices/postsSlice';
import Post from '../components/post';

function Posts() {
    const dispatch = useDispatch();
    const { isLoading, posts } = useSelector(state => state.posts);

    useEffect(() => {
        dispatch(fetchPosts())
    },[dispatch]);


    return (
        <ul>
            {posts.map(post => <Post key={post._id} post={post} />)}
        </ul>
    );
}

export default Posts;
