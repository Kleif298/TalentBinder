import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleAuthResponse } from "../../utils/auth.ts";

import "./Register.scss";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password, username }),
      });
      if (!res.ok) {
        throw new Error("Server error: " + res.statusText);
      }

      const data = await res.json();
      if (data.success) {
        setMessage("Registration successful! Automated login...");
        handleAuthResponse(data, navigate);
      } else {
        setMessage("Login failed: " + data.message);
      }
    } catch (err: any) {
      setMessage("Login failed: " + err.message);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegister}>
        <h2>Register</h2>

        <div className="input-group">
          <label htmlFor="username">Username *optional</label>
          <input
            type="username"
            id="username"
            name="username"
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Create a password"
            required
          />
        </div>
        <button type="submit" className="register-btn">
          Register
        </button>
        <div className="register-link-container">
          <span>Already have an account?</span>
          <Link to="/login" className="login-link">
            Login
          </Link>
        </div>
      </form>
      {message && <div className="register-message">{message}</div>}
    </div>
  );
};

export default Register;
