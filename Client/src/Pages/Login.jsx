import React from "react";


function Login () {
  return (
    <>
    <div className="login-container">
      <h1 className="login-header">Chat Room Log In</h1>
      <input type="text" placeholder="Username"/>
      <br />
      <input type="text" placeholder="Password"/>
      <br />
      <button className="login-btn">Log In</button>
      <br />
      <a href="">Forgot Password?</a>
    </div>
    <div className="signup-container">
      <h1 className="">Greetings!</h1>

      <h2 className="join">Join the conversation</h2>
      <br />
      <button className="signup-btn">Sign up</button>
    </div>

      
      
    </>
  )
}

export default Login