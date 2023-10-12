import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

console.log("Home mounted");

function Home({ onLogout }) {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    console.log("Fetching messages...")
    axios.get('/api/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => {
        console.error("Error fetching users:", error);
      });

    axios.get('/api/messages')
      .then(response => {
        console.log('Received messages:', response.data);
        setMessages(response.data);
      })
      .catch(error => {
        console.error("Error fetching messages:", error);
      });
  }, []);

  function handleSendMessage() {
    console.log('handleSendMessage is called')
    console.log('newMessage:', newMessage); 
    if (newMessage.trimEnd() !== "") {  
      const user_id = parseInt(localStorage.getItem("user_id"), 10);
      console.log('user_id:', user_id);
      if (isNaN(user_id)) {
        console.error("Invalid user_id:", localStorage.getItem("user_id"));
        return; 
      }
      console.log({ user_id, message: newMessage });
      axios.post('/api/messages', { user_id, message: newMessage })
        .then(response => {
          setMessages([...messages, response.data]);
          setNewMessage("");
        })
        .catch(error => {
          console.error("Error sending message:", error);
          console.log(error.response);
        });
    }
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
    <div className="d-flex h-auto text-white" >
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
    </div>
  );
}

function ChatWindow({ users, messages, newMessage, setNewMessage, handleSendMessage }) {

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <div className="w-75 p-3 d-flex flex-column" style={{ backgroundColor: '#666', height: 'calc(100vh - 60px)' }}>
      <div className="flex-grow-1 mb-3 overflow-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
        {messages.map(message => (
          <div key={message.id}>
            {message.username}: {message.message}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="d-flex">
        <input 
          type="text" 
          className="form-control" 
          placeholder="Type a message" 
          value={newMessage} 
          onChange={e => setNewMessage(e.target.value)} 
        />
        <button className="btn btn-primary ml-2" onClick={handleSendMessage}>Send</button>
      </form>
    </div>
  );
}


export default Home;
