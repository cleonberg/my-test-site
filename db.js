// Dexie database with optional encryption

const db = new Dexie("OptionsDashboardDB");

db.version(1).stores({
  trades: "++id, ticker, type, expiry, strike, entryDate"
});

window.DB = {
  async addTradeObj(trade) {
    return db.trades.add(trade);
  },
  async updateTradeObj(id, updates) {
    return db.trades.update(id, updates);
  },
  async deleteTradeObj(id) {
    return db.trades.delete(id);
  },
  async getAllTrades() {
    return db.trades.orderBy("entryDate").reverse().toArray();
  },
  async clearAll() {
    return db.trades.clear();
  },
  raw: db
};
