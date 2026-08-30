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
      entryDate: editing?.entryDate || new Date().toISOString()
    };

    onSave(payload);
    if (!editing) {
      setTicker("");
      setStrike("");
      setExpiry("");
      setPremium("");
      setQty(1);
      setNotes("");
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

function TradesFilters({ filters, search, sortBy, sortDir, onChange }) {
  return (
    <div className="card">
      <div className="settings-section-title">Filters & sorting</div>
      <div className="filters-row">
        <input
          className="input"
          placeholder="Search (ticker, notes, type)"
          value={search}
          onChange={e=>onChange({ search: e.target.value })}
        />
        <input
          className="input"
          placeholder="Ticker filter"
          value={filters.ticker}
          onChange={e=>onChange({ filters: { ...filters, ticker: e.target.value } })}
        />
        <select
          className="input"
          value={filters.type}
          onChange={e=>onChange({ filters: { ...filters, type: e.target.value } })}
        >
          <option value="ALL">All types</option>
          <option value="PUT">PUT</option>
          <option value="CALL">CALL</option>
        </select>
        <input
          className="input"
          type="date"
          value={filters.expiryFrom}
          onChange={e=>onChange({ filters: { ...filters, expiryFrom: e.target.value } })}
        />
        <input
          className="input"
          type="date"
          value={filters.expiryTo}
          onChange={e=>onChange({ filters: { ...filters, expiryTo: e.target.value } })}
        />
        <select
          className="input"
          value={sortBy}
          onChange={e=>onChange({ sortBy: e.target.value })}
        >
          <option value="entryDate">Sort by entry date</option>
          <option value="ticker">Sort by ticker</option>
          <option value="expiry">Sort by expiry</option>
          <option value="strike">Sort by strike</option>
          <option value="premium">Sort by premium</option>
        </select>
        <select
          className="input"
          value={sortDir}
          onChange={e=>onChange({ sortDir: e.target.value })}
        >
          <option value="desc">Desc</option>
          <option value="asc">Asc</option>
        </select>
      </div>
    </div>
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
  const totalPremium = trades.reduce((s,t)=> s + (Number(t.premium || 0) * (t.qty || 1)), 0);
  const byTicker = {};
  for (const t of trades) {
    const tk = t.ticker || "";
    if (!tk) continue;
    byTicker[tk] = (byTicker[tk] || 0) + (Number(t.premium || 0) * (t.qty || 1));
  }

  return (
    <div className="card">
      <h3 style={{marginTop:0}}>Summary</h3>
      <div className="small">Open positions: {trades.length}</div>
      <div style={{marginTop:8}}>
        <strong>Total premium (cash)</strong>
        <div className="small">${totalPremium.toFixed(2)}</div>
      </div>
      <div style={{marginTop:8}}>
        <strong>Premium by ticker</strong>
        <div className="small">
          {Object.keys(byTicker).length === 0 && "None yet"}
          {Object.entries(byTicker).map(([tk, val]) => (
            <div key={tk}>{tk}: ${val.toFixed(2)}</div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardTab({ trades }) {
  useEffect(() => {
    window.ChartUtil.premiumOverTime(trades, "chart-premium");
    window.ChartUtil.strikeDistribution(trades, "chart-strikes");
  }, [trades]);

  return (
    <div>
      <Summary trades={trades} />
      <div className="chart-container">
        <div id="chart-premium" style={{height:260}}></div>
      </div>
      <div className="chart-container">
        <div id="chart-strikes" style={{height:260}}></div>
      </div>
    </div>
  );
}

function StatsTab({ trades }) {
  useEffect(() => {
    window.ChartUtil.premiumOverTime(trades, "chart-premium-stats");
    window.ChartUtil.strikeDistribution(trades, "chart-strikes-stats");
  }, [trades]);

  return (
    <div>
      <div className="chart-container">
        <div id="chart-premium-stats" style={{height:260}}></div>
      </div>
      <div className="chart-container">
        <div id="chart-strikes-stats" style={{height:260}}></div>
      </div>
    </div>
  );
}

function SettingsTab({ trades, encryptionEnabled, onEncryptionChange, keyReady }) {
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState(encryptionEnabled ? "enabled" : "disabled");

  useEffect(() => {
    setMode(encryptionEnabled ? "enabled" : "disabled");
  }, [encryptionEnabled]);

  async function handleSetPassword() {
    if (!password) return alert("Enter a password");
    const key = await window.CryptoUtil.deriveKey(password);
    const raw = await window.DB.raw.trades.toArray();
    const payload = await window.CryptoUtil.encryptJson({ trades: raw }, key);
    await window.DB.clearAll();
    for (const t of raw) {
      await window.DB.addTradeObj(t);
    }
    localStorage.setItem("optionsDashboardKey", JSON.stringify({ passwordSet: true }));
    onEncryptionChange(true, key);
    alert("Encryption enabled.");
  }

  function handleDisableEncryption() {
    onEncryptionChange(false, null);
    localStorage.removeItem("optionsDashboardKey");
    alert("Encryption disabled (data remains as-is).");
  }

  async function handleExportPlainJson() {
    const raw = await window.DB.raw.trades.toArray();
    await window.SyncUtil.exportJsonPlain(raw);
  }

  async function handleExportEncryptedJson() {
    if (!keyReady) return alert("Set password first.");
    const raw = await window.DB.raw.trades.toArray();
    await window.SyncUtil.exportJsonEncrypted(raw, keyReady);
  }

  async function handleExportCsv() {
    const raw = await window.DB.raw.trades.toArray();
    window.SyncUtil.exportCsvPlain(raw);
  }

  function readFile(cb) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,.csv";
    input.onchange = () => {
      const file = input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = e => cb(file.name, e.target.result);
      reader.readAsText(file);
    };
    input.click();
  }

  async function handleImportJson(mode, encrypted) {
    readFile(async (name, text) => {
      try {
        if (encrypted) {
          if (!keyReady) return alert("Set password first.");
          await window.SyncUtil.importJsonEncrypted(text, mode, window.DB.raw, keyReady);
        } else {
          await window.SyncUtil.importJsonPlain(text, mode, window.DB.raw);
        }
        alert("Import complete.");
      } catch (e) {
        alert("Import failed: " + e.message);
      }
    });
  }

  async function handleImportCsv(mode) {
    readFile(async (name, text) => {
      try {
        await window.SyncUtil.importCsv(text, mode, window.DB.raw);
        alert("CSV import complete.");
      } catch (e) {
        alert("CSV import failed: " + e.message);
      }
    });
  }

  return (
    <div>
      <div className="card">
        <div className="settings-section-title">Encryption</div>
        <div className="small">Status: {encryptionEnabled ? "Enabled" : "Disabled"}</div>
        <div className="settings-row" style={{marginTop:8}}>
          <input
            className="input"
            type="password"
            placeholder="Set or change password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
          />
          <button onClick={handleSetPassword}>Enable / Update encryption</button>
          {encryptionEnabled && (
            <button className="secondary" onClick={handleDisableEncryption}>Disable encryption</button>
          )}
        </div>
      </div>

      <div className="card">
        <div className="settings-section-title">Export</div>
        <div className="settings-row">
          <button onClick={handleExportPlainJson}>Export JSON (plain)</button>
          <button onClick={handleExportEncryptedJson}>Export JSON (encrypted)</button>
          <button onClick={handleExportCsv}>Export CSV (plain)</button>
        </div>
      </div>

      <div className="card">
        <div className="settings-section-title">Import</div>
        <div className="small" style={{marginBottom:6}}>
          Overwrite = replace all trades. Merge = keep existing and add/update.
        </div>
        <div className="settings-row">
          <button onClick={()=>handleImportJson("overwrite", false)}>Import JSON (overwrite)</button>
          <button onClick={()=>handleImportJson("merge", false)}>Import JSON (merge)</button>
        </div>
        <div className="settings-row">
          <button onClick={()=>handleImportJson("overwrite", true)}>Import encrypted JSON (overwrite)</button>
          <button onClick={()=>handleImportJson("merge", true)}>Import encrypted JSON (merge)</button>
        </div>
        <div className="settings-row">
          <button onClick={()=>handleImportCsv("overwrite")}>Import CSV (overwrite)</button>
          <button onClick={()=>handleImportCsv("merge")}>Import CSV (merge)</button>
        </div>
      </div>
    </div>
  );
}

window.AppSetActiveTab = function(tab) {
  // This will be replaced once React mounts
  window.__pendingTab = tab;
};


function App() {
  const [trades, setTrades] = useState([]);
  const [editing, setEditing] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ ticker: "", type: "ALL", expiryFrom: "", expiryTo: "" });
  const [sortBy, setSortBy] = useState("entryDate");
  const [sortDir, setSortDir] = useState("desc");
  const [encryptionEnabled, setEncryptionEnabled] = useState(false);
  const [cryptoKey, setCryptoKey] = useState(null);

  function TabBar({ activeTab, setActiveTab }) {
    const tabs = ["dashboard", "trades", "stats", "settings"];

    return (
        <nav className="tabs">
        {tabs.map(tab => (
            <button
            key={tab}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
            >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
        ))}
        </nav>
    );
    }

    useEffect(() => {
    const interval = setInterval(() => {
      if (window.__selectedTab && window.__selectedTab !== activeTab) {
        setActiveTab(window.__selectedTab);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [activeTab]);

  useEffect(() => {
    loadTrades();
    const stored = localStorage.getItem("optionsDashboardKey");
    if (stored) {
      setEncryptionEnabled(true);
    }
  }, []);

  async function loadTrades() {
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

  function handleFiltersChange(partial) {
    if (partial.search !== undefined) setSearch(partial.search);
    if (partial.filters !== undefined) setFilters(partial.filters);
    if (partial.sortBy !== undefined) setSortBy(partial.sortBy);
    if (partial.sortDir !== undefined) setSortDir(partial.sortDir);
  }

  function handleEncryptionChange(enabled, key) {
    setEncryptionEnabled(enabled);
    setCryptoKey(key || null);
  }

  const visibleTrades = window.FilterUtil.pipeline(trades, {
    search,
    filters,
    sortBy,
    sortDir
  });

  return (
    <div>
        <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "trades" && (
        <>
            <TradeForm onSave={handleAdd} editing={editing} onCancel={()=>setEditing(null)} />
            <TradesFilters
            filters={filters}
            search={search}
            sortBy={sortBy}
            sortDir={sortDir}
            onChange={handleFiltersChange}
            />
            <TradesTable trades={visibleTrades} onEdit={handleEdit} onDelete={handleDelete} />
        </>
        )}

        {activeTab === "dashboard" && <DashboardTab trades={visibleTrades} />}
        {activeTab === "stats" && <StatsTab trades={visibleTrades} />}
        {activeTab === "settings" && (
        <SettingsTab
            trades={trades}
            encryptionEnabled={encryptionEnabled}
            onEncryptionChange={handleEncryptionChange}
            keyReady={cryptoKey}
        />
        )}
    </div>
    );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
