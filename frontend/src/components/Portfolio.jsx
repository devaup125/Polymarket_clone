import React from "react";
import "../styles/portfolio.css";

const Portfolio = ({
  balance = 1000,
  profit = 125.50,
  positions = 4,
  trades = [],
}) => {
  return (
    <div className="portfolio">

      <div className="portfolio-header">
        <h2>📊 Portfolio</h2>
        <span className="status">Live</span>
      </div>

      <div className="portfolio-stats">

        <div className="stat-card">
          <h4>Total Balance</h4>
          <h2>${balance.toFixed(2)}</h2>
        </div>

        <div className="stat-card">
          <h4>Total Profit</h4>

          <h2
            style={{
              color: profit >= 0 ? "#22c55e" : "#ef4444",
            }}
          >
            {profit >= 0 ? "+" : ""}
            ${profit.toFixed(2)}
          </h2>
        </div>

        <div className="stat-card">
          <h4>Open Positions</h4>
          <h2>{positions}</h2>
        </div>

      </div>

      <div className="recent-trades">

        <h3>Recent Trades</h3>

        {trades.length === 0 ? (
          <p className="empty">
            No trades yet.
          </p>
        ) : (
          trades.map((trade, index) => (
            <div key={index} className="trade-item">

              <div>
                <strong>{trade.market}</strong>
                <p>{trade.outcome}</p>
              </div>

              <div className="trade-right">

                <span className="amount">
                  ${trade.amount}
                </span>

                <span
                  className={
                    trade.status === "Won"
                      ? "won"
                      : trade.status === "Lost"
                      ? "lost"
                      : "open"
                  }
                >
                  {trade.status}
                </span>

              </div>

            </div>
          ))
        )}

      </div>

    </div>
  );
};

export default Portfolio;