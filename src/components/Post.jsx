import React, { useState } from 'react';
import { db } from '../config/firebase';
import { doc, updateDoc, arrayUnion, arrayRemove, addDoc, collection } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Post = ({ post }) => {
    const { user } = useAuth();
    const [comment, setComment] = useState('');
    const [showComments, setShowComments] = useState(false);

    const isLiked = post.likes?.includes(user?.uid);

    const toggleLike = async () => {
        const postRef = doc(db, "posts", post.id);
        await updateDoc(postRef, {
            likes: isLiked ? arrayRemove(user.uid) : arrayUnion(user.uid)
        });

        // Real-time Notification (simplified)
        if (!isLiked && post.uid !== user.uid) {
            addDoc(collection(db, "notifications"), {
                toUser: post.uid,
                fromUser: user.displayName,
                type: "like",
                read: false
            });
        }
    };

    const handleComment = async (e) => {
        e.preventDefault();
        const commentsRef = collection(db, "posts", post.id, "comments");
        await addDoc(commentsRef, {
            text: comment,
            username: user.displayName,
            createdAt: new Date()
        });
        setComment('');
        toast.success('Comment added');
    };

    return (
        <div className="post-card card">
            <div className="post-header">
                <img src={post.userPhoto} alt="user" className="avatar-sm" />
                <div className="post-info">
                    <strong>{post.username}</strong>
                    {post.uid !== user.uid && <button className="btn-follow">Follow</button>}
                </div>
            </div>

            <p className="post-text">{post.text}</p>
            {post.imageUrl && <img src={post.imageUrl} alt="post" className="post-image" />}

            <div className="post-actions">
                <button onClick={toggleLike} className={isLiked ? 'liked' : ''}>
                    {isLiked ? '❤️' : '🤍'} {post.likes?.length || 0}
                </button>
                <button onClick={() => setShowComments(!showComments)}>💬 Comment</button>
            </div>

            {showComments && (
                <div className="comments-section">
                    <form onSubmit={handleComment}>
                        <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write a comment..." />
                    </form>
                </div>
            )}
        </div>
    );
};

export default Post;