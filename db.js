// Dexie database module
const db = new Dexie("OptionsDashboardDB");

db.version(1).stores({
  trades: "++id, ticker, type, expiry, strike, entryDate"
});

// Helper functions
async function addTradeObj(trade) {
  return db.trades.add(trade);
}

async function updateTradeObj(id, updates) {
  return db.trades.update(id, updates);
}

async function deleteTradeObj(id) {
  return db.trades.delete(id);
}

async function getAllTrades() {
  return db.trades.orderBy('entryDate').reverse().toArray();
}

window.DB = { addTradeObj, updateTradeObj, deleteTradeObj, getAllTrades };
