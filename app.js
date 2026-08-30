// Main app
const { useState, useEffect } = React;

function TradeForm({ onSave, editing, onCancel }) {
  const [ticker, setTicker] = useState(editing?.ticker || "");
  const [type, setType] = useState(editing?.type || "PUT");
  const [strike, setStrike] = useState(editing?.strike || "");
  const [expiry, setExpiry] = useState(editing?.expiry || "");
  const [premium, setPremium] = useState(editing?.premium || "");
  const [qty, setQty] = useState(editing?.qty || 1);
  const [notes, setNotes] = useState(editing?.notes || "");

  useEffect(() => {
    if (editing) {
      setTicker(editing.ticker || "");
      setType(editing.type || "PUT");
      setStrike(editing.strike || "");
      setExpiry(editing.expiry || "");
      setPremium(editing.premium || "");
      setQty(editing.qty || 1);
      setNotes(editing.notes || "");
    }
  }, [editing]);

  function submit(e) {
    e.preventDefault();
    if (!ticker) return alert("Ticker required");
    const payload = {
      ticker: ticker.toUpperCase(),
      type,
      strike,
      expiry,
      premium,
      qty: Number(qty),
      notes,
      entryDate: new Date().toISOString()
    };
    onSave(payload);
    // clear if not editing
    if (!editing) {
      setTicker(""); setStrike(""); setExpiry(""); setPremium(""); setQty(1); setNotes("");
    }
  }

  return (
    <form className="card" onSubmit={submit}>
      <div className="form-row">
        <input className="input" placeholder="Ticker" value={ticker} onChange={e=>setTicker(e.target.value)} />
        <select className="input" value={type} onChange={e=>setType(e.target.value)}>
          <option>PUT</option>
          <option>CALL</option>
        </select>
        <input className="input" placeholder="Strike" value={strike} onChange={e=>setStrike(e.target.value)} />
        <input className="input" type="date" value={expiry} onChange={e=>setExpiry(e.target.value)} />
        <input className="input" placeholder="Premium" value={premium} onChange={e=>setPremium(e.target.value)} />
        <input className="input" type="number" min="1" value={qty} onChange={e=>setQty(e.target.value)} />
      </div>

      <div style={{marginTop:10}}>
        <input className="input" style={{width:"100%"}} placeholder="Notes" value={notes} onChange={e=>setNotes(e.target.value)} />
      </div>

      <div style={{marginTop:10, display:"flex", gap:8}}>
        <button type="submit">{editing ? "Save changes" : "Add trade"}</button>
        {editing && <button type="button" className="secondary" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  );
}

function TradesTable({ trades, onEdit, onDelete }) {
  return (
    <div className="card">
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <h3 style={{margin:0}}>Trades</h3>
        <div className="small">Total: {trades.length}</div>
      </div>

      <table className="table" role="table">
        <thead>
          <tr>
            <th>Ticker</th><th>Type</th><th>Strike</th><th>Expiry</th><th>Premium</th><th>Qty</th><th>Notes</th><th></th>
          </tr>
        </thead>
        <tbody>
          {trades.map(t => (
            <tr key={t.id}>
              <td>{t.ticker}</td>
              <td>{t.type}</td>
              <td>{t.strike}</td>
              <td>{t.expiry}</td>
              <td>{t.premium}</td>
              <td>{t.qty}</td>
              <td className="small">{t.notes}</td>
              <td>
                <button className="secondary" onClick={()=>onEdit(t)}>Edit</button>
                <button style={{marginLeft:6}} onClick={()=>onDelete(t.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Summary({ trades }) {
  // Simple P/L placeholder: sum of -premium * qty
  const totalPremium = trades.reduce((s,t)=> s + (Number(t.premium || 0) * (t.qty || 1)), 0);
  return (
    <div className="card">
      <h3 style={{marginTop:0}}>Summary</h3>
      <div className="small">Open positions: {trades.length}</div>
      <div style={{marginTop:8}}>
        <strong>Cash paid for premiums</strong>
        <div className="small">${totalPremium.toFixed(2)}</div>
      </div>
    </div>
  );
}

function App() {
  const [trades, setTrades] = useState([]);
  const [editing, setEditing] = useState(null);

  useEffect(()=>{ loadTrades(); }, []);

  async function loadTrades(){
    const all = await window.DB.getAllTrades();
    setTrades(all);
  }

  async function handleAdd(trade) {
    if (editing) {
      await window.DB.updateTradeObj(editing.id, trade);
      setEditing(null);
    } else {
      await window.DB.addTradeObj(trade);
    }
    loadTrades();
  }

  async function handleDelete(id) {
    if (!confirm("Delete this trade?")) return;
    await window.DB.deleteTradeObj(id);
    loadTrades();
  }

  function handleEdit(t) {
    setEditing(t);
    window.scrollTo({top:0,behavior:"smooth"});
  }

  return (
    <div>
      <TradeForm onSave={handleAdd} editing={editing} onCancel={()=>setEditing(null)} />
      <div style={{display:"grid",gridTemplateColumns:"1fr",gap:12}}>
        <Summary trades={trades} />
        <TradesTable trades={trades} onEdit={handleEdit} onDelete={handleDelete} />
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);