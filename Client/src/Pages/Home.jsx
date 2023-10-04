import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

function Home({ onLogout }) {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    axios.get('/api/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
      });

    axios.get('/api/messages')
      .then(response => {
        setMessages(response.data);
      })
      .catch(error => {
        console.error("Error fetching messages:", error);
      });
  }, []);

  function handleSendMessage() {
    axios.post('/api/messages', { user_id: 1, message: newMessage })
      .then(response => {
        setMessages([...messages, response.data]);
        setNewMessage("");
      })
      .catch(error => {
        console.error("Error sending message:", error);
      });
  }

  return (
    <div className="container-fluid" style={{ height: '100vh', backgroundColor: '#333' }}>
      <Header onLogout={onLogout} />
      <Main 
        users={users} 
        messages={messages} 
        newMessage={newMessage} 
        setNewMessage={setNewMessage} 
        handleSendMessage={handleSendMessage} 
      />
    </div>
  );
}

function Header({ onLogout }) {
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    onLogout();
    navigate('/login'); 
  }

  return (
    <div className="d-flex justify-content-between p-3" style={{ backgroundColor: '#444', height: '60px' }}>
      <div className="text-white">Chat App Logo</div>
      <button className="btn btn-light" onClick={handleLogoutClick}>Logout</button>
    </div>
  );
}

function Main({ users, messages, newMessage, setNewMessage, handleSendMessage }) {
  return (
    <div className="d-flex h-100">
      <ChatList />
      <ChatWindow 
        users={users} 
        messages={messages} 
        newMessage={newMessage} 
        setNewMessage={setNewMessage} 
        handleSendMessage={handleSendMessage} 
      />
    </div>
  );
}

function ChatList() {
  return (
    <div className="w-25 p-3" style={{ backgroundColor: '#555' }}>
      <div className="text-white">Chat Room 1</div>
      <div className="text-white">Chat Room 2</div>
    </div>
  );
}

function ChatWindow({ users, messages, newMessage, setNewMessage, handleSendMessage }) {
  return (
    <div className="w-75 p-3 d-flex flex-column" style={{ backgroundColor: '#666', height: 'calc(100vh - 60px)' }}>
      <div className="flex-grow-1 mb-3" style={{ overflowY: 'auto' }}>
        {messages.map(message => (
          <div key={message.id}>
            {users.find(user => user.id === message.user_id)?.username}: {message.message}
          </div>
        ))}
      </div>
      <div className="d-flex">
        <input 
          type="text" 
          className="form-control" 
          placeholder="Type a message" 
          value={newMessage} 
          onChange={e => setNewMessage(e.target.value)} 
        />
        <button className="btn btn-primary ml-2" onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Home;
