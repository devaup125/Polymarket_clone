import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import SearchBar from "../components/SearchBar";
import BalanceCard from "../components/BalanceCard";
import Trending from "../components/Trending";
import MarketCard from "../components/MarketCard";
import Portfolio from "../components/Portfolio";
import Footer from "../components/Footer";
import "../styles/app.css";

const API_URL =
  process.env.REACT_APP_API_URL || "http://127.0.0.1:5000";

function Home() {
  const [username] = useState("Devanshu");
  const [balance, setBalance] = useState(1000);

  const [markets, setMarkets] = useState([]);
  const [search, setSearch] = useState("");

  const [trades, setTrades] = useState([
    {
      market: "Bitcoin above $150K",
      outcome: "YES",
      amount: 120,
      status: "Won",
    },
    {
      market: "OpenAI GPT-6 in 2026",
      outcome: "NO",
      amount: 60,
      status: "Open",
    },
    {
      market: "India wins Cricket World Cup",
      outcome: "YES",
      amount: 80,
      status: "Lost",
    },
  ]);

    useEffect(() => {
    fetch(`${API_URL}/api/markets`)
        .then((res) => res.json())
        .then((data) => {
        setMarkets(data.markets || []);
        })
        .catch((err) => console.log(err));
    }, []);

  const handleBuy = async (marketId, side) => {
    try {
      const response = await fetch(`${API_URL}/api/trade/buy`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: username,
            market_id: marketId,
            outcome: side
            }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Trade Successful");

        setBalance((prev) => prev - 10);

        setTrades((prev) => [
          {
            market:
              markets.find((m) => m.market_id === marketId)?.title ||
              "Unknown Market",
            outcome: side,
            amount: 10,
            status: "Open",
          },
          ...prev,
        ]);
      } else {
        alert(data.error || "Trade Failed");
      }
    } catch (err) {
      console.log(err);
      alert("Server Error");
    }
  };

  const filteredMarkets = markets.filter((market) =>
    market.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <Sidebar />

      <div className="main-content">
        <Navbar username={username} balance={balance} />

        <div className="content">
          <SearchBar
            search={search}
            setSearch={setSearch}
          />

          <BalanceCard
            username={username}
            balance={balance}
          />

          <Trending markets={markets} />

          <h2 className="section-title">
            Prediction Markets
          </h2>

          <div className="market-grid">
            {filteredMarkets.length === 0 ? (
              <div className="loading">
                No markets found.
              </div>
            ) : (
              filteredMarkets.map((market) => (
                <MarketCard
                  key={market.market_id}
                  market={market}
                  onBuy={handleBuy}
                />
              ))
            )}
          </div>

          <Portfolio
            balance={balance}
            profit={125.5}
            positions={trades.length}
            trades={trades}
          />

          <Footer />
        </div>
      </div>
    </div>
  );
}

export default Home;