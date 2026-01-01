import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const { signInGoogle, user } = useAuth();
    const navigate = useNavigate();

    if (user) navigate('/');

    return (
        <div className="login-page">
            <h1>Welcome to SocialApp</h1>
            <button onClick={signInGoogle} className="btn-google">Sign in with Google</button>
        </div>
    );
};

export default Login;