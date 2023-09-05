import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
  return (
    <div className="container-fluid" style={{ minHeight: '100vh', backgroundColor: '#333333', paddingTop: '50px' }}>
      <div className="row h-100 no-gutters">
        <div className="col-md-6 d-flex align-items-stretch p-0">
          <div className="card w-100 h-100 d-flex align-items-center" style={{ borderRight: 'none', borderRadius: '0' }}>
            <div className="card-body text-center">
              <h1 className="login-header">Chat Room Log In</h1>
              <form className="form-group">
                <input type="text" className="form-control" placeholder="Username" />
                <br />
                <input type="password" className="form-control" placeholder="Password" />
                <br />
                <button className="btn btn-primary w-50 mx-auto">Log In</button>
                <br />
                <a href="" className="d-block" style={{ marginTop: '20px' }}>Forgot Password?</a>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-6 d-flex align-items-stretch p-0">
          <div className="card w-100 h-100 d-flex align-items-center" style={{ backgroundColor: '#d3d3d3', borderLeft: 'none', borderRadius: '0' }}>
            <div className="card-body text-center">
              <h1>Greetings!</h1>
              <h2>Join the conversation</h2>
              <br />
              <button className="btn btn-secondary w-50 mx-auto">Sign up</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
