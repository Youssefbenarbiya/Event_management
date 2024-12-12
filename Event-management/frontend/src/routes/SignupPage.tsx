import React, { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import "./SignupPage.css";

// Route Definition
export const Route = createFileRoute("/SignupPage")({
  component: SignupPage,
});
// SignupPage Component
interface SignupResponse {
  token: string;
}

function SignupPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const response = await fetch("http://localhost:9090/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      if (response.ok) {
        const data: SignupResponse = await response.json();

        localStorage.setItem("token", data.token);
        localStorage.setItem("username", username);
        localStorage.setItem("email", email);

        alert("User registered successfully!!");
        navigate({ to: "/Dashboard" });
      } else if (response.status === 400) {
        alert("User already registered. Please login.");
        navigate({ to: "/LoginPage" });
      } else {
        console.error("Signup failed");
      }
    } catch (error) {
      console.error("Error during signup:", error);
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
        <img src="/bookit.png" alt="logo" width={300} height={300} />
        <h2>Welcome to our Ticket Booking App</h2>
      </div>
      <div className={`signup-card ${isLoading ? "loading" : ""}`}>
        <h3>Sign Up</h3>
        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
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
          {isLoading ? (
            <div className="spinner"></div>
          ) : (
            <button type="submit">Sign Up</button>
          )}
        </form>
        <p>
          Already signed up? <Link to="/LoginPage">Login</Link>
        </p>
      </div>
    </div>
  );
}
