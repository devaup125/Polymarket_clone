import React, { useState, useEffect } from 'react';

function App() {
  const [markets, setMarkets] = useState([]);
  const [username, setUsername] = useState('trader_pro');
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch Markets
  useEffect(() => {
    fetch('/api/markets')
      .then(res => res.json())
      .then(data => {
        setMarkets(data.markets || []);
        setLoading(false);
      })
      .catch(err => console.error("Error fetching markets:", err));
  }, []);

  // Auto-Login Wallet
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!username) return;
      fetch(`/api/users/${username}`)
        .then(res => {
          if (res.status === 404) {
            return fetch('/api/users/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username })
            }).then(r => r.json());
          }
          return res.json();
        })
        .then(data => {
          if (data.balance !== undefined) setBalance(data.balance);
          else if (data.user && data.user.balance !== undefined) setBalance(data.user.balance);
        })
        .catch(err => console.error("Login error:", err));
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [username]);

  // Trade Execution
  const handleBuy = (marketId, outcome) => {
    fetch('/api/trades/buy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, market_id: marketId, outcome })
    })
    .then(res => res.json())
    .then(data => {
      if (data.error) alert("❌ Trade Failed: " + data.error);
      else setBalance(data.remaining_balance);
    });
  };

  return (
    <div style={{ fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', backgroundColor: '#0B0E14', color: '#F3F4F6', minHeight: '100vh', display: 'flex', flexDirection: 'column', WebkitFontSmoothing: 'antialiased' }}>
      
      {/* PROFESSIONAL HEADER */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 40px', backgroundColor: 'rgba(11, 14, 20, 0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1F2937', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ background: 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)', borderRadius: '12px', padding: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
            <span style={{ fontSize: '20px', lineHeight: 1 }}>🔮</span>
          </div>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '700', letterSpacing: '-0.5px', color: '#FFFFFF' }}>
            Polymarket <span style={{ color: '#6B7280', fontWeight: '500' }}>Clone</span>
          </h2>
        </div>

        {/* PRO WALLET WIDGET */}
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#151A22', border: '1px solid #222B38', borderRadius: '100px', padding: '6px 16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px' }}>👤</div>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
              style={{ background: 'transparent', border: 'none', color: '#E5E7EB', fontSize: '14px', fontWeight: '600', width: '110px', outline: 'none', cursor: 'pointer' }}
              title="Click to change profile"
            />
          </div>
          <div style={{ width: '1px', height: '20px', backgroundColor: '#2D3748', margin: '0 12px' }}></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#9CA3AF', fontSize: '14px' }}>Wallet</span>
            <strong style={{ color: '#10B981', fontSize: '15px', letterSpacing: '0.5px' }}>${balance.toFixed(2)}</strong>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main style={{ padding: '50px 40px', flex: '1', maxWidth: '1280px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '32px', margin: '0 0 8px 0', fontWeight: '800', letterSpacing: '-1px' }}>Trending Markets</h1>
            <p style={{ margin: 0, color: '#9CA3AF', fontSize: '15px' }}>Trade on the world's most highly-debated topics.</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.2)', color: '#60A5FA', padding: '6px 12px', borderRadius: '100px', fontSize: '13px', fontWeight: '600' }}>
            <div style={{ width: '8px', height: '8px', backgroundColor: '#3B82F6', borderRadius: '50%', boxShadow: '0 0 8px #3B82F6' }}></div> Live Network
          </div>
        </div>

        {loading ? (
           <div style={{ textAlign: 'center', padding: '60px', color: '#6B7280' }}>Loading live markets...</div>
        ) : markets.length === 0 ? (
          <div style={{ backgroundColor: '#151A22', padding: '60px', borderRadius: '16px', textAlign: 'center', border: '1px dashed #374151', color: '#9CA3AF' }}>
            No live markets found. Use the backend API to create one!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '24px' }}>
            {markets.map(market => (
              /* INDIVIDUAL MARKET CARD */
              <div key={market.market_id} style={{ backgroundColor: '#151A22', borderRadius: '16px', padding: '24px', border: '1px solid #1F2937', display: 'flex', flexDirection: 'column', transition: 'all 0.2s ease', cursor: 'default' }}
                   onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#374151'; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 24px -10px rgba(0,0,0,0.5)'; }}
                   onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#1F2937'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ backgroundColor: '#1F2937', color: '#D1D5DB', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {market.category}
                  </span>
                  <span style={{ color: '#10B981', fontSize: '12px', fontWeight: '600' }}>Vol: $12.4k</span>
                </div>
                
                <h4 style={{ margin: '0 0 24px 0', fontSize: '18px', fontWeight: '600', lineHeight: '1.5', color: '#F9FAFB', flexGrow: 1 }}>
                  {market.title}
                </h4>
                
                {/* TRADING BUTTONS */}
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button onClick={() => handleBuy(market.market_id, 'YES')} 
                    style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(0, 196, 107, 0.1)', color: '#00C46B', border: '1px solid rgba(0, 196, 107, 0.2)', padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0, 196, 107, 0.2)'; e.currentTarget.style.borderColor = '#00C46B'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(0, 196, 107, 0.1)'; e.currentTarget.style.borderColor = 'rgba(0, 196, 107, 0.2)'; }}>
                    <span>Yes</span>
                    <span>{market.yes_price * 100}¢</span>
                  </button>
                  
                  <button onClick={() => handleBuy(market.market_id, 'NO')} 
                    style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'rgba(242, 60, 109, 0.1)', color: '#F23C6D', border: '1px solid rgba(242, 60, 109, 0.2)', padding: '12px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', transition: 'all 0.2s' }}
                    onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(242, 60, 109, 0.2)'; e.currentTarget.style.borderColor = '#F23C6D'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'rgba(242, 60, 109, 0.1)'; e.currentTarget.style.borderColor = 'rgba(242, 60, 109, 0.2)'; }}>
                    <span>No</span>
                    <span>{market.no_price * 100}¢</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* SLEEK DEVELOPER FOOTER */}
      <footer style={{ backgroundColor: '#0B0E14', padding: '32px 40px', borderTop: '1px solid #1F2937', marginTop: 'auto' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h3 style={{ margin: '0 0 4px 0', color: '#F3F4F6', fontSize: '16px', fontWeight: '600' }}>Platform Architect</h3>
            <p style={{ margin: 0, color: '#9CA3AF', fontSize: '14px' }}>Devanshu Ranjan Upadhyay • B.Tech CSE</p>
          </div>
          
          <div style={{ display: 'flex', gap: '12px' }}>
            <a href="https://youtube.com/@sciencestudent205" target="_blank" rel="noreferrer" style={{ color: '#F3F4F6', textDecoration: 'none', backgroundColor: '#151A22', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', border: '1px solid #222B38', display: 'flex', alignItems: 'center', gap: '8px', transition: 'all 0.2s' }}
               onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#1F2937'; e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444'; }}
               onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#151A22'; e.currentTarget.style.borderColor = '#222B38'; e.currentTarget.style.color = '#F3F4F6'; }}>
              <span style={{ fontSize: '16px' }}>▶️</span> YouTube
            </a>
            <a href="#" style={{ color: '#9CA3AF', textDecoration: 'none', backgroundColor: '#151A22', padding: '8px 16px', borderRadius: '8px', fontSize: '13px', fontWeight: '600', border: '1px solid #222B38', transition: 'background-color 0.2s' }}
               onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1F2937'}
               onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#151A22'}>
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
