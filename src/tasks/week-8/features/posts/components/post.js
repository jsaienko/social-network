import React from 'react';
import {likePost} from '../slices/postsSlice';
import {useDispatch} from 'react-redux';

function Post({post}) {
    const dispatch = useDispatch();

    const addLikeToPost = (postId) => {
        console.log('postId in products.js', postId);
        dispatch(likePost(postId));
    };

    return (
        <div>
            <p>{post._id}</p>
            <h2>{post.title}</h2>
            <p><span>{post.author.first_name}</span><span>{post.author.last_name}</span></p>
            <p>Created: {post.created_at}</p>
            <p>{post.body}</p>
            <p> Likes number {post.likesNumber}</p>
            <button onClick={()=>addLikeToPost(post._id)}>Like</button>
        </div>
    );
}

export default Post;
