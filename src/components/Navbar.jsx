import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Navbar = () => {
    const { user, logout } = useAuth();
    return (
        <nav className="navbar">
            <h1>Than SocialApp</h1>
            <div className="links">
                {user ? (
                    <>
                        <img src={user.photoURL} alt="avatar" className="avatar-sm" />
                        <button onClick={logout} className="btn-outline">Logout</button>
                    </>
                ) : (
                    <Link to="/login">Login</Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;