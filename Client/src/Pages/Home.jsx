import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Home({ onLogout }) {
  return (
    <div className="container-fluid" style={{ height: '100vh', backgroundColor: '#333' }}>
      <Header onLogout={onLogout} />
      <Main />
    </div>
  );
}


function Header({ onLogout }) {
  return (
    <div className="d-flex justify-content-between p-3" style={{ backgroundColor: '#444', height: '60px' }}>
      <div className="text-white">Chat App Logo</div>
      <button className="btn btn-light" onClick={onLogout}>Logout</button>
    </div>
  );
}


function Main() {
  return (
    <div className="d-flex h-100">
      <ChatList />
      <ChatWindow />
    </div>
  );
}

function ChatList() {
  return (
    <div className="w-25 p-3" style={{ backgroundColor: '#555' }}>
      <div className="text-white">Chat Room 1</div>
      <div className="text-white">Chat Room 2</div>
      {/* Add more chat rooms as needed */}
    </div>
  );
}

function ChatWindow() {
  return (
    <div className="w-75 p-3 d-flex flex-column" style={{ backgroundColor: '#666', height: 'calc(100vh - 60px)' }}>
      <div className="flex-grow-1 mb-3" style={{ overflowY: 'auto' }}>
        {/* Add chat messages here */}
      </div>
      <div className="d-flex">
        <input type="text" className="form-control" placeholder="Type a message" />
        <button className="btn btn-primary ml-2">Send</button>
      </div>
    </div>
  );
}


export default Home;
