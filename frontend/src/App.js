import React, { useState, useEffect } from "react";

const API_URL = "https://polymarket-clone-2.onrender.com";

function App() {
  const [markets, setMarkets] = useState([]);
  const [username, setUsername] = useState("trader_pro");
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/markets`)
      .then(r => r.json())
      .then(data => {
        setMarkets(data.markets || []);
        setLoading(false);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!username) return;
      fetch(`${API_URL}/api/users/${username}`)
        .then(res => {
          if (res.status === 404) {
            return fetch(`${API_URL}/api/users/register`, {
              method: "POST",
              headers: {"Content-Type":"application/json"},
              body: JSON.stringify({username})
            }).then(r => r.json());
          }
          return res.json();
        })
        .then(data => {
          if (data.balance !== undefined) setBalance(data.balance);
          else if (data.user?.balance !== undefined) setBalance(data.user.balance);
        });
    },500);
    return ()=>clearTimeout(t);
  }, [username]);

  const handleBuy = (marketId,outcome) => {
    fetch(`${API_URL}/api/trades/buy`,{
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({username,market_id:marketId,outcome})
    })
    .then(r=>r.json())
    .then(data=>{
      if(data.error) alert(data.error);
      else setBalance(data.remaining_balance);
    });
  };

  return (
    <div style={{padding:30,fontFamily:"Arial",background:"#0B0E14",color:"white",minHeight:"100vh"}}>
      <h1>Polymarket Clone</h1>
      <input value={username} onChange={e=>setUsername(e.target.value)} />
      <p>Balance: ${balance.toFixed(2)}</p>
      {loading ? <p>Loading...</p> :
        markets.map(m=>(
          <div key={m.market_id} style={{border:"1px solid #555",padding:15,marginBottom:15}}>
            <h3>{m.title}</h3>
            <p>{m.category}</p>
            <button onClick={()=>handleBuy(m.market_id,"YES")}>YES {m.yes_price*100}¢</button>
            <button onClick={()=>handleBuy(m.market_id,"NO")} style={{marginLeft:10}}>NO {m.no_price*100}¢</button>
          </div>
        ))
      }
    </div>
  );
}

export default App;
