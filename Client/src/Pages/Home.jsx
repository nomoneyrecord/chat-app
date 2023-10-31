import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import "../App.css";

function Home({ onLogout }) {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const socketRef = useRef();

  useEffect(() => {
    axios
      .get("/api/messages")
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });

      const socketURL = process.env.REACT_APP_SOCKETIO_URL || "http://127.0.0.1:8000";
      socketRef.current = io(socketURL);
      

    socketRef.current.on("receive_message", (message) => {
      if (!messages.some((msg) => msg.id === message.clientId)) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to the server.");
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from the server.");
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  function handleSendMessage() {
    console.log("handleSendMessage is called");
    console.log("newMessage:", newMessage);

    if (newMessage.trimEnd() !== "") {
      const user_id = parseInt(localStorage.getItem("user_id"), 10);
      console.log("user_id:", user_id);

      if (isNaN(user_id)) {
        console.error("Invalid user_id:", localStorage.getItem("user_id"));
        return;
      }

      const clientMessageId = uuidv4();
      const messageData = {
        user_id,
        message: newMessage,
        clientId: clientMessageId,
      };
      socketRef.current.emit("send_message", messageData);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          id: clientMessageId,
          username: localStorage.getItem("username"),
          message: newMessage,
        },
      ]);

      setNewMessage("");
    }
  }

  return (
    <div
      className="container-fluid"
      style={{ height: "100vh", backgroundColor: "#333" }}
    >
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
    navigate("/login");
  };

  return (
    <div
      className="d-flex justify-content-between p-3"
      style={{ backgroundColor: "#444", height: "60px" }}
    >
      <div className="text-white">Chat App Logo</div>
      <button className="btn-light" style={{textAlign: 'center', display: 'block'}} onClick={handleLogoutClick}>
        Logout
      </button>
    </div>
  );
}

function Main({
  users,
  messages,
  newMessage,
  setNewMessage,
  handleSendMessage,
}) {
  return (
    <div className="d-flex h-auto text-white">
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
    <div className="w-25 p-3" style={{ backgroundColor: "#555" }}>
      <div className="text-white">Chat Room 1</div>
    </div>
  );
}

function ChatWindow({
  messages,
  newMessage,
  setNewMessage,
  handleSendMessage,
}) {
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages])

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <div
      className="w-75 p-3 d-flex flex-column"
      style={{ backgroundColor: "#666", height: "calc(100vh - 60px)" }}
    >
      <div
        className="flex-grow-1 mb-3 overflow-auto"
        style={{ maxHeight: "calc(100vh - 120px)" }}
      >
        {messages.map((message) => (
          <div key={message.id}>
            {message.username}: {message.message}
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="d-flex">
        <input
          type="text"
          className="form-control"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          required
        />
        <button className="btn btn-primary ml-2">Send</button>
      </form>
    </div>
  );
}

export default Home;
