import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleAuthResponse } from "../../utils/auth";
import "./Login.scss";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Server error: " + res.statusText);
      }

      const data = await res.json();
      if (data.success) {
        setMessage(
          "Login successful! " + data.user.email
        );

        handleAuthResponse(data, navigate);
      } else {
        setMessage("Login failed: " + data.message);
      }
    } catch (err: any) {
      setMessage("Login failed: " + err.message);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-btn">
          Login
        </button>
        <div className="register-link-container">
          <span>Don't have an account? </span>
          <Link to="/register" className="register-link">
            Sign up
          </Link>
        </div>
        {message && <div>{message}</div>}
      </form>
    </div>
  );
};

export default Login;
