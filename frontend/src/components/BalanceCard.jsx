import React from "react";
import "./../styles/balance.css";

const BalanceCard = ({ username, balance, profit = 0 }) => {
  return (
    <div className="balance-card">
      <div className="balance-header">
        <div>
          <h3>Welcome</h3>
          <h2>{username}</h2>
        </div>

        <div className="profile-icon">
          👤
        </div>
      </div>

      <div className="balance-content">
        <div className="balance-box">
          <span className="label">Available Balance</span>
          <h1>${balance.toFixed(2)}</h1>
        </div>

        <div className="profit-box">
          <span className="label">Today's Profit</span>

          <h2
            style={{
              color: profit >= 0 ? "#00d26a" : "#ff4d4f"
            }}
          >
            {profit >= 0 ? "+" : ""}
            ${profit.toFixed(2)}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
