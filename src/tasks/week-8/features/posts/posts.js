import React, {useEffect, useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {fetchPosts, likePost} from './slices/postsSlice';

function Posts() {
    const dispatch = useDispatch();
    const { isLoading, posts } = useSelector(state => state.posts);

    console.log(posts);

    useEffect(() => {
        dispatch(fetchPosts())
    },[dispatch]);

    const addLikeToPost = (postId) => {
        console.log(`from function`);
        dispatch(likePost(postId));
    };

    return (
        <ul>
            {posts.map(post =>
                <li key={post._id}>
                    <p>{post._id}</p>
                    <h2>{post.title}</h2>
                    <p><span>{post.author.first_name}</span><span>post.author.last_name</span></p>
                    <p>Created: {post.created_at}</p>
                    <p>{post.body}</p>
                    <p>{post.likes}</p>
                    <p> Likes number {post.likesNumber}</p>
                    <button onClick={()=>addLikeToPost(post._id)}>Like</button>
                </li>)}
        </ul>
    );
}

export default Posts;
