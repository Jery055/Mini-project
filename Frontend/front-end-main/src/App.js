import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./App.css";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login attempted with email:", email); // Debugging log

    if (email.endsWith("@rajagiri.edu.in")) {
      console.log("Logging in as student"); // Debugging log
      alert("You have logged in as a student!");
      navigate("/dashboard", { state: { userType: "Student" } });
    } else if (email.endsWith("@rajagiri.tech.edu.in")) {
      console.log("Logging in as teacher"); // Debugging log
      alert("You have logged in as a teacher!");
      navigate("/dashboard", { state: { userType: "Teacher" } });
    } else if (email.endsWith("@rajagiri.admin.edu.in")) {
      console.log("Logging in as approver"); // Debugging log
      alert("You have logged in as an approver!");
      navigate("/approver");
    } else {
      console.log("Invalid email"); // Debugging log
      alert("Please enter a valid college email");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="logo-section">
          <h1>RSET NOTES</h1>
          <p>Access your college notes easily</p>
        </div>
        <form className="login-form" onSubmit={handleLogin}>
          <div className="input-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your college Gmail"
              required
            />
          </div>
          <div className="input-field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="login-btn">Login</button>
        </form>
        
        <div className="footer-text">
          <p>&copy; 2024 Notes Hub</p>
        </div>
      </div>
    </div>
    
  );
}

export default App;