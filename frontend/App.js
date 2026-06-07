import React, { useState, useEffect } from 'react';

function App() {
  const [markets, setMarkets] = useState([]);
  const [username, setUsername] = useState('trader_pro');
  const [balance, setBalance] = useState(999.50);

  useEffect(() => {
    fetch('http://localhost:5000/api/markets')
      .then(res => res.json())
      .then(data => setMarkets(data.markets || []))
      .catch(err => console.error("Error fetching markets:", err));
  }, []);

  const handleBuy = (marketId, outcome) => {
    fetch('http://localhost:5000/api/trades/buy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, market_id: marketId, outcome })
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert("Trade Failed: " + data.error);
      } else {
        alert(`Successfully bought ${outcome} share!`);
        setBalance(data.remaining_balance);
      }
    });
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', backgroundColor: '#f5f7fa', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
        <h2>🔮 Polymarket Clone Dashboard</h2>
        <div style={{ background: '#fff', padding: '10px 20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
          <strong>User:</strong> {username} | <strong>Wallet:</strong> {balance} Bucks
        </div>
      </header>

      <main style={{ marginTop: '40px' }}>
        <h3>Active Prediction Markets</h3>
        {markets.length === 0 ? <p>Loading active markets...</p> : markets.map(market => (
          <div key={market.market_id} style={{ background: '#fff', padding: '24px', borderRadius: '12px', marginBottom: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
            <h4>{market.title}</h4>
            <p style={{ color: '#718096' }}>Category: {market.category}</p>
            <div style={{ display: 'flex', gap: '15px', marginTop: '15px' }}>
              <button onClick={() => handleBuy(market.market_id, 'YES')} style={{ backgroundColor: '#2f855a', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                Buy YES (${market.yes_price})
              </button>
              <button onClick={() => handleBuy(market.market_id, 'NO')} style={{ backgroundColor: '#c53030', color: 'white', border: 'none', padding: '10px 25px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                Buy NO (${market.no_price})
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;
