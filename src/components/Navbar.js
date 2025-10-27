import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav
      style={{
        padding: "10px",
        background: "#1976d2",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div>
        <Link to="/tasks" style={{ marginRight: "10px", color: "white" }}>
          Tasks
        </Link>
        <Link to="/profile" style={{ color: "white" }}>
          Profile
        </Link>
      </div>
      <div>
        {user ? (
          <button onClick={logout} style={{ cursor: "pointer" }}>
            Logout
          </button>
        ) : (
          <>
          <Link to="/register" style={{ marginRight: "10px", color: "white" }}>
            Register
          </Link>
          <Link to="/login" style={{ color: "white" }}>
            Login
          </Link>
          </>
        )}
      </div>
    </nav>
  );
}
