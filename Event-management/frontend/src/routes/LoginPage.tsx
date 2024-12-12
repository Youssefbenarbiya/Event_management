import React, { useState } from "react";
import "./LoginPage.css";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

// Route Definition
export const Route = createFileRoute("/LoginPage")({
  component: LoginPage,
});
function LoginPage()  {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const response = await fetch("http://localhost:9090/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        const { token } = data;

        const username = email.split("@")[0];

        localStorage.setItem("token", token);
        localStorage.setItem("username", username);
        localStorage.setItem("email", email);

        navigate({ to: "/Dashboard" });
      } else {
        alert("Login failed, please check your credentials");
        console.error("Login failed");
      }
    } catch (error) {
      alert("Login failed, please check your credentials");
      console.error("Error during login:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      {isLoading && (
        <div className="loader-overlay">
          <div className="loader"></div>
        </div>
      )}
      <div>
        <img src="data:image/jpeg;base64,..." alt="Welcome" />
        <h2>Welcome back!</h2>
      </div>
      <div className={`signup-card ${isLoading ? "loading" : ""}`}>
        <h3>Login</h3>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>
        <p>
          New user? <Link to="/">Sign up here</Link>
        </p>
      </div>
    </div>
  );
}