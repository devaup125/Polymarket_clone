import React, { useState, useEffect } from 'react';

function App() {
  const [markets, setMarkets] = useState([]);
  const [username] = useState('trader_pro');
  const [balance, setBalance] = useState(999.50);

  useEffect(() => {
    fetch('/api/markets')
      .then(res => res.json())
      .then(data => setMarkets(data.markets || []))
      .catch(err => console.error("Error fetching markets:", err));
  }, []);

  const handleBuy = (marketId, outcome) => {
    fetch('/api/trades/buy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, market_id: marketId, outcome })
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) {
        alert("❌ Trade Failed: " + data.error);
      } else {
        alert(`✅ Successfully bought ${outcome} share!`);
        setBalance(data.remaining_balance);
      }
    });
  };

  return (
    <div style={{ fontFamily: '"Inter", sans-serif', backgroundColor: '#0f172a', color: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Dynamic Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 50px', background: 'linear-gradient(90deg, #1e293b 0%, #0f172a 100%)', borderBottom: '1px solid #334155', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ margin: 0, fontSize: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '28px' }}>🔮</span> Polymarket Clone
        </h2>
        <div style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '10px 20px', borderRadius: '12px', border: '1px solid #334155', display: 'flex', gap: '20px', alignItems: 'center' }}>
          <span>👤 <span style={{ color: '#94a3b8' }}>{username}</span></span>
          <div style={{ width: '1px', height: '20px', background: '#334155' }}></div>
          <span>💰 <strong style={{ color: '#10b981', fontSize: '18px' }}>{balance.toFixed(2)}</strong> Bucks</span>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ padding: '40px 50px', flex: '1', maxWidth: '1200px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h3 style={{ fontSize: '22px', margin: 0 }}>Trending Markets</h3>
          <span style={{ background: '#3b82f6', color: 'white', padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 'bold' }}>Live Updates</span>
        </div>

        {markets.length === 0 ? (
          <div style={{ background: '#1e293b', padding: '40px', borderRadius: '16px', textAlign: 'center', border: '1px dashed #475569', color: '#94a3b8' }}>
            No live markets found. Use the backend API to create one!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '25px' }}>
            {markets.map(market => (
              <div key={market.market_id} style={{ background: '#1e293b', borderRadius: '16px', padding: '25px', border: '1px solid #334155', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                  <span style={{ background: 'rgba(59, 130, 246, 0.2)', color: '#60a5fa', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {market.category}
                  </span>
                  <span style={{ color: '#10b981', fontSize: '12px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '50%' }}></div> Active
                  </span>
                </div>
                
                <h4 style={{ margin: '0 0 25px 0', fontSize: '18px', lineHeight: '1.4' }}>{market.title}</h4>
                
                <div style={{ display: 'flex', gap: '15px' }}>
                  <button 
                    onClick={() => handleBuy(market.market_id, 'YES')} 
                    style={{ flex: 1, backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#34d399', border: '1px solid #10b981', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', transition: 'all 0.2s' }}
                    onMouseOver={(e) => { e.target.style.backgroundColor = '#10b981'; e.target.style.color = 'white'; }}
                    onMouseOut={(e) => { e.target.style.backgroundColor = 'rgba(16, 185, 129, 0.1)'; e.target.style.color = '#34d399'; }}
                  >
                    Buy YES (₵{market.yes_price})
                  </button>
                  <button 
                    onClick={() => handleBuy(market.market_id, 'NO')} 
                    style={{ flex: 1, backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#f87171', border: '1px solid #ef4444', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', transition: 'all 0.2s' }}
                    onMouseOver={(e) => { e.target.style.backgroundColor = '#ef4444'; e.target.style.color = 'white'; }}
                    onMouseOut={(e) => { e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'; e.target.style.color = '#f87171'; }}
                  >
                    Buy NO (₵{market.no_price})
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Developer Footer */}
      <footer style={{ backgroundColor: '#020617', padding: '40px 20px', borderTop: '1px solid #1e293b', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
          <h3 style={{ margin: 0, color: '#f8fafc', fontSize: '20px' }}>Platform Architect</h3>
          
          <div style={{ textAlign: 'center', color: '#94a3b8' }}>
            <p style={{ margin: '5px 0', fontSize: '16px' }}>
              Developed by <strong style={{ color: '#38bdf8' }}>Devanshu Ranjan Upadhyay</strong>
            </p>
            <p style={{ margin: '5px 0', fontSize: '14px' }}>
              🎓 B.Tech Computer Science Engineering
            </p>
          </div>

          <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
            <a href="https://youtube.com/@sciencestudent205" target="_blank" rel="noreferrer" style={{ color: '#f1f5f9', textDecoration: 'none', background: '#dc2626', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
              ▶️ @sciencestudent205
            </a>
            <a href="#" style={{ color: '#cbd5e1', textDecoration: 'none', background: '#1e293b', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', border: '1px solid #334155' }}>
              GitHub
            </a>
            <a href="#" style={{ color: '#cbd5e1', textDecoration: 'none', background: '#1e293b', padding: '8px 16px', borderRadius: '8px', fontSize: '14px', border: '1px solid #334155' }}>
              LinkedIn
            </a>
          </div>
          <p style={{ margin: '20px 0 0 0', fontSize: '12px', color: '#475569' }}>
            © {new Date().getFullYear()} Polymarket Clone Demo. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
