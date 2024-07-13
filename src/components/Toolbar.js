import React from 'react';
import { useNavigate } from 'react-router-dom';

const Toolbar = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div>
            <h1>Drawing App</h1>
            {user && (
                <button onClick={handleLogout}>Logout</button>
            )}
        </div>
    );
};

export default Toolbar;
