import React from 'react';
import CreatePost from '../components/CreatePost';
import PostList from '../components/PostList';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

const Home = () => {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" />;

    return (
        <div className="container">
            <CreatePost />
            <PostList />
        </div>
    );
};

export default Home;