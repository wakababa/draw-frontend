import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import LoginForm from './components/LoginForm';
import { createRoom } from './services/apiService';
import { getRecentRooms, getMyRooms } from './services/roomService';
import { getRecentRooms as getUserRecentRooms } from './services/userService';

const App = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    return (
        <Router>
            <Routes>
                <Route path="/" element={<HomePage user={user} />} />
                <Route path="/login" element={<LoginForm setUser={setUser} />} />
                <Route path="/room/:roomId" element={<RoomPage user={user} />} />
            </Routes>
        </Router>
    );
};

const HomePage = ({ user }) => {
    const navigate = useNavigate();
    const [recentRooms, setRecentRooms] = useState([]);
    const [myRooms, setMyRooms] = useState([]);
    const [userRecentRooms, setUserRecentRooms] = useState([]);

    useEffect(() => {
        const fetchRooms = async () => {
            if (user) {
                const recent = await getRecentRooms();
                const my = await getMyRooms();
                const userRecent = await getUserRecentRooms();
                setRecentRooms(recent);
                setMyRooms(my);
                setUserRecentRooms(userRecent);
            }
        };

        fetchRooms();
    }, [user]);

    const handleCreateRoom = async () => {
        try {
            const { roomId } = await createRoom();
            navigate(`/room/${roomId}`);
        } catch (error) {
            console.error('Failed to create room:', error);
        }
    };

    return (
        <div>
            <Toolbar />
            {user ? (
                <>
                    <button onClick={handleCreateRoom}>Create Room</button>
                    <button onClick={() => {
                        const id = prompt('Enter Room ID:');
                        if (id) {
                            navigate(`/room/${id}`);
                        }
                    }}>Join Room</button>
                    <h2>Recent Rooms</h2>
                    <ul>
                        {recentRooms.map(room => (
                            <li key={room._id}>
                                <a href={`/room/${room.roomId}`}>{room.roomId}</a>
                            </li>
                        ))}
                    </ul>
                    <h2>My Rooms</h2>
                    <ul>
                        {myRooms.map(room => (
                            <li key={room._id}>
                                <a href={`/room/${room.roomId}`}>{room.roomId}</a>
                            </li>
                        ))}
                    </ul>
                    <h2>Recently Joined Rooms</h2>
                    <ul>
                        {userRecentRooms.map(room => (
                            <li key={room._id}>
                                <a href={`/room/${room.roomId}`}>{room.roomId}</a>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <p>Please <a href="/login">login</a> to create or join rooms.</p>
            )}
        </div>
    );
};

const RoomPage = ({ user }) => {
    const { roomId } = useParams();

    if (!user) {
        return <p>Please <a href="/login">login</a> to access this room.</p>;
    }

    return (
        <div>
            <Toolbar />
            <Canvas roomId={roomId} />
        </div>
    );
};

export default App;
