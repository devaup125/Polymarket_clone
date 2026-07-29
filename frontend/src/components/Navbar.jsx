import React from "react";
import "../styles/navbar.css";

const Navbar = ({ username, balance }) => {
  return (
    <nav className="navbar">

      <div className="navbar-logo">
        <span className="logo-icon">📈</span>
        <h2>Polymarket Clone</h2>
      </div>

      <div className="navbar-search">
        <input
          type="text"
          placeholder="Search prediction markets..."
        />
      </div>

      <div className="navbar-right">

        <button className="icon-btn">
          🔔
        </button>

        <div className="balance-pill">
          💰 ${balance.toFixed(2)}
        </div>

        <div className="profile">
          <div className="avatar">
            {username.charAt(0).toUpperCase()}
          </div>

          <div className="profile-info">
            <span className="welcome">Welcome</span>
            <span className="name">{username}</span>
          </div>
        </div>

      </div>

    </nav>
  );
};

export default Navbar;