import React from "react";
import "../styles/market.css";

const MarketCard = ({ market, onBuy }) => {
  const yes = Math.round((market.yes_price || 0) * 100);
  const no = Math.round((market.no_price || 0) * 100);

  return (
    <div className="market-card">

      <div className="market-header">
        <h2>{market.title}</h2>

        <span className="market-category">
          {market.category}
        </span>
      </div>

      <div className="market-progress">

        <div className="progress-info">
          <span>YES {yes}%</span>
          <span>NO {no}%</span>
        </div>

        <div className="progress-bar">
          <div
            className="yes-bar"
            style={{ width: `${yes}%` }}
          ></div>
        </div>

      </div>

      <div className="market-details">

        <div>
          <small>Volume</small>
          <h4>${market.volume || "250K"}</h4>
        </div>

        <div>
          <small>Liquidity</small>
          <h4>${market.liquidity || "95K"}</h4>
        </div>

        <div>
          <small>Expires</small>
          <h4>{market.expiry || "31 Dec 2026"}</h4>
        </div>

      </div>

      <div className="market-buttons">

        <button
          className="yes-btn"
          onClick={() => onBuy(market.market_id, "YES")}
        >
          Buy YES ({yes}¢)
        </button>

        <button
          className="no-btn"
          onClick={() => onBuy(market.market_id, "NO")}
        >
          Buy NO ({no}¢)
        </button>

      </div>

    </div>
  );
};

export default MarketCard;