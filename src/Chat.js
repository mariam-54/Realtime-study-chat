import React, { useEffect, useRef, useState } from "react";
import Qs from "qs";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { FaSmile } from "react-icons/fa";

const Chat = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [room, setRoom] = useState("");
  const [users, setUsers] = useState([]);
  const msgInput = useRef(null);
  const chatMessages = useRef(null);
  const socket = useRef(null);

  useEffect(() => {
    // Parse username and room from the URL
    const { username, room } = Qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    });

    socket.current = io(); // Create socket connection

    // Join the specified room
    socket.current.emit("joinRoom", { username, room });

    // Listen for room users update
    socket.current.on("roomUsers", ({ room, users }) => {
      setRoom(room);
      setUsers(users);
    });

    // Listen for incoming messages from the server
    socket.current.on("message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
      chatMessages.current.scrollTop = chatMessages.current.scrollHeight;
    });

    return () => {
      socket.current.disconnect();
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const msg = msgInput.current.value.trim();

    if (!msg) return;

    const { username } = Qs.parse(window.location.search, {
      ignoreQueryPrefix: true,
    });

    // Emit message to the server
    socket.current.emit("chatMessage", { username, room, text: msg });

    // Clear the input field
    msgInput.current.value = "";
    msgInput.current.focus();
  };

  const leaveChat = () => {
    const leaveRoom = window.confirm(
      "Are you sure you want to leave the chatroom?"
    );
    if (leaveRoom) {
      navigate("/"); // Navigate back to the Join Page
    }
  };

  return (
    <div className="chat-container">
      <header className="chat-header">
        <h2>
          Welcome to Study Chat <FaSmile className="chat-icon" />
        </h2>
        <button id="leave-btn" className="btn" onClick={leaveChat}>
          Leave Room
        </button>
      </header>
      <main className="chat-main">
        <div className="chat-sidebar">
          <h3>
            <i className="fas fa-comments"></i> Room Name:
          </h3>
          <h2 id="room-name">{room}</h2>
          <h3>
            <i className="fas fa-users"></i> Users
          </h3>
          <ul id="users">
            {users.map((user) => (
              <li key={user.username}>{user.username}</li> // List of users in the room
            ))}
          </ul>
        </div>
        <div className="chat-messages" ref={chatMessages}>
          {messages.map((message, index) => (
            <div className="message" key={index}>
              <p className="meta">
                {message.username} <span>{message.time}</span>
              </p>
              <p className="text">{message.text}</p>
            </div>
          ))}
        </div>
      </main>
      <div className="chat-form-container">
        <form id="chat-form" onSubmit={handleSubmit}>
          <input
            id="msg"
            type="text"
            placeholder="Enter Message"
            required
            autoComplete="off"
            ref={msgInput}
          />
          <button className="btn">
            <i className="fas fa-paper-plane"></i> Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
