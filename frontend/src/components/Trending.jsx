import React from "react";
import "../styles/trending.css";

const Trending = ({ markets = [] }) => {
  const trendingMarkets = markets.slice(0, 4);

  return (
    <div className="trending-section">

      <div className="trending-header">
        <h2>🔥 Trending Markets</h2>
        <span>{trendingMarkets.length} Active</span>
      </div>

      <div className="trending-grid">

        {trendingMarkets.length === 0 ? (
          <p className="empty-text">No trending markets available.</p>
        ) : (
          trendingMarkets.map((market) => (
            <div
              key={market.market_id}
              className="trending-card"
            >
              <div className="trending-category">
                {market.category}
              </div>

              <h3>{market.title}</h3>

              <div className="probability">
                <span>YES</span>

                <div className="progress">
                  <div
                    className="progress-fill"
                    style={{
                      width: `${market.yes_price * 100}%`,
                    }}
                  ></div>
                </div>

                <span>{Math.round(market.yes_price * 100)}%</span>
              </div>

              <div className="market-footer">
                <div>
                  <small>Volume</small>
                  <p>${market.volume || "250K"}</p>
                </div>

                <div>
                  <small>Liquidity</small>
                  <p>${market.liquidity || "95K"}</p>
                </div>
              </div>

              <button className="trade-btn">
                View Market →
              </button>
            </div>
          ))
        )}

      </div>

    </div>
  );
};

export default Trending;