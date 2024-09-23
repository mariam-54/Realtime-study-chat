import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSmile } from 'react-icons/fa';

const Join = () => {
  const [username, setUsername] = useState('');
  const [room, setRoom] = useState('JavaScript'); 
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    navigate(`/chat?username=${username}&room=${room}`);
  };

  return (
    <div className="join-container">
      <header className="join-header">
        <h2>Welcome to Study Chat <FaSmile className='chat-icon'/></h2>
      </header>
      <main className="join-main">
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              placeholder="Enter username..."
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="form-control">
            <label htmlFor="room">Room</label>
            <select 
              name="room" 
              id="room" 
              value={room} 
              onChange={(e) => setRoom(e.target.value)}
            >
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
              <option value="Node.js">Node.js</option>
              <option value="React">React</option>
              <option value=".Net">.Net</option>
              <option value="Java">Java</option>
            </select>
          </div>
          <button type="submit" className="btn">Join Chat</button>
        </form>
      </main>
    </div>
  );
};

export default Join;
