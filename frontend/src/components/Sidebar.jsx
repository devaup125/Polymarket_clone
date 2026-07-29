import React, { useState } from "react";
import "../styles/sidebar.css";

const Sidebar = () => {
  const [active, setActive] = useState("Dashboard");

  const menuItems = [
    { name: "Dashboard", icon: "🏠" },
    { name: "Markets", icon: "📈" },
    { name: "Portfolio", icon: "💼" },
    { name: "Watchlist", icon: "⭐" },
    { name: "Leaderboard", icon: "🏆" },
    { name: "Settings", icon: "⚙️" }
  ];

  return (
    <aside className="sidebar">

      <div className="sidebar-logo">
        <h2>📊 Polymarket</h2>
      </div>

      <ul className="sidebar-menu">
        {menuItems.map((item) => (
          <li
            key={item.name}
            className={active === item.name ? "active" : ""}
            onClick={() => setActive(item.name)}
          >
            <span className="icon">{item.icon}</span>
            <span>{item.name}</span>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        <button className="logout-btn">
          🚪 Logout
        </button>
      </div>

    </aside>
  );
};

export default Sidebar;