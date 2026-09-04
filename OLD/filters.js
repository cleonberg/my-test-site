// Sorting, filtering, search pipeline

window.FilterUtil = (function () {
  function applySearch(trades, search) {
    if (!search) return trades;
    const q = search.toLowerCase();
    return trades.filter(t =>
      (t.ticker || "").toLowerCase().includes(q) ||
      (t.notes || "").toLowerCase().includes(q) ||
      (t.type || "").toLowerCase().includes(q)
    );
  }

  function applyFilters(trades, filters) {
    let out = trades.slice();
    if (filters.ticker) {
      const tk = filters.ticker.toUpperCase();
      out = out.filter(t => (t.ticker || "").toUpperCase().includes(tk));
    }
    if (filters.type && filters.type !== "ALL") {
      out = out.filter(t => (t.type || "") === filters.type);
    }
    if (filters.expiryFrom) {
      out = out.filter(t => (t.expiry || "") >= filters.expiryFrom);
    }
    if (filters.expiryTo) {
      out = out.filter(t => (t.expiry || "") <= filters.expiryTo);
    }
    return out;
  }

  function applySort(trades, sortBy, sortDir) {
    const dir = sortDir === "desc" ? -1 : 1;
    const out = trades.slice();
    out.sort((a, b) => {
      let va = a[sortBy];
      let vb = b[sortBy];
      if (sortBy === "entryDate" || sortBy === "expiry") {
        va = va || "";
        vb = vb || "";
        return va < vb ? -dir : va > vb ? dir : 0;
      }
      if (sortBy === "premium" || sortBy === "strike") {
        const na = Number(va || 0);
        const nb = Number(vb || 0);
        return na < nb ? -dir : na > nb ? dir : 0;
      }
      va = (va || "").toString().toUpperCase();
      vb = (vb || "").toString().toUpperCase();
      return va < vb ? -dir : va > vb ? dir : 0;
    });
    return out;
  }

  function pipeline(trades, { search, filters, sortBy, sortDir }) {
    let out = trades;
    out = applySearch(out, search);
    out = applyFilters(out, filters);
    out = applySort(out, sortBy, sortDir);
    return out;
  }

  return {
    pipeline
  };
})();
