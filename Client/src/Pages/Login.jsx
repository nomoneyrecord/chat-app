import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [newUserName, setNewUsername] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [signUpError, setSignUpError] = useState("");

  const navigate = useNavigate();

  const handleClose = () => {
    setShow(false);
    setSignUpError("");
  };
  const handleShow = () => setShow(true);

  const handleSignUp = (e) => {
    e.preventDefault();
    axios
      .post("http://127.0.0.1:5000/api/register", {
        username: newUserName,
        password: newPassword,
      })
      .then((response) => {
        console.log(response.data);
        setNewUsername("");
        setNewPassword("");
        setSignUpError("");
        handleClose();
      })
      .catch((error) => {
        console.error("Error signing up:", error);
        if (error.response && error.response.data && error.response.data.msg) {
          setSignUpError(error.response.data.msg);
        } else {
          setSignUpError("Error during sign up");
        }
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    axios
      .post("http://127.0.0.1:5000/api/login", { username, password })
      .then((response) => {
        console.log(response.data);
        localStorage.setItem("token", response.data.access_token);
        localStorage.setItem("user_id", response.data.user_id ? response.data.user_id.toString() : "");
        localStorage.setItem("username", username); 
        onLogin();
        setLoading(false);
        navigate('/');
      })
      .catch((error) => {
        console.error("Error logging in:", error);
        setLoading(false);
        if(error.response && error.response.data && error.response.data.msg){
          setError(error.response.data.msg);
        } else {
        setError("Network error");
        }
      });
  };

  return (
    <div
      className="container-fluid"
      style={{
        minHeight: "100vh",
        backgroundColor: "#333333",
        paddingTop: "50px",
      }}
    >
      <div className="row h-100 no-gutters">
        <div className="col-md-6 d-flex align-items-stretch p-0">
          <div
            className="card w-100 h-100 d-flex align-items-center"
            style={{ borderRight: "none", borderRadius: "0" }}
          >
            <div className="card-body text-center">
              <h1 className="login-header">Chat Room Log In</h1>
              {signUpError && <p style={{ color: "red" }}>{signUpError}</p>}
              <form className="form-group" onSubmit={handleLogin}>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <br />
                <input
                  type="password"
                  className="form-control"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <br />
                <button
                  className="btn btn-primary w-50 mx-auto"
                  type="submit"
                  disabled={loading}
                >
                  Log In
                </button>
                <br />
                {loading && <p>Loading...</p>}
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-6 d-flex align-items-stretch p-0">
          <div
            className="card w-100 h-100 d-flex align-items-center"
            style={{
              backgroundColor: "#d3d3d3",
              borderLeft: "none",
              borderRadius: "0",
            }}
          >
            <div className="card-body text-center">
              <h1>Greetings!</h1>
              <h2>Join the conversation</h2>
              <br />
              <Button variant="secondary" onClick={handleShow}>
                Sign up
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Sign Up</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="Username"
                value={newUserName}
                onChange={(e) => setNewUsername(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit" onClick={handleSignUp}>
              Submit
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default Login;
