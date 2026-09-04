// Sync utilities: JSON/CSV import/export, encrypted + plain

window.SyncUtil = (function () {
  function downloadFile(filename, content, type = "application/json") {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function exportJsonPlain(trades) {
    downloadFile("options-trades.json", JSON.stringify(trades, null, 2));
  }

  async function exportJsonEncrypted(trades, key) {
    const payload = await window.CryptoUtil.encryptJson({ trades }, key);
    downloadFile("options-trades.enc.json", JSON.stringify(payload, null, 2));
  }

  function exportCsvPlain(trades) {
    const headers = [
      "id",
      "ticker",
      "type",
      "strike",
      "expiry",
      "premium",
      "qty",
      "notes",
      "entryDate"
    ];
    const rows = trades.map(t =>
      headers
        .map(h => {
          const v = t[h] ?? "";
          const s = String(v).replace(/"/g, '""');
          return `"${s}"`;
        })
        .join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    downloadFile("options-trades.csv", csv, "text/csv");
  }

  function parseCsv(text) {
    const lines = text.trim().split(/\r?\n/);
    if (lines.length < 2) return [];
    const headers = lines[0].split(",").map(h => h.replace(/^"|"$/g, ""));
    return lines.slice(1).map(line => {
      const cols = line.match(/("([^"]|"")*"|[^,]+)/g) || [];
      const obj = {};
      headers.forEach((h, i) => {
        let v = cols[i] || "";
        v = v.replace(/^"|"$/g, "").replace(/""/g, '"');
        obj[h] = v;
      });
      return obj;
    });
  }

  async function importJsonPlain(text, mode, db) {
    const data = JSON.parse(text);
    const trades = Array.isArray(data) ? data : data.trades || [];
    if (mode === "overwrite") {
      await db.trades.clear();
    }
    for (const t of trades) {
      if (mode === "merge" && t.id) {
        await db.trades.put(t);
      } else {
        await db.trades.add(t);
      }
    }
  }

  async function importJsonEncrypted(text, mode, db, key) {
    const payload = JSON.parse(text);
    const data = await window.CryptoUtil.decryptJson(payload, key);
    const trades = data.trades || [];
    if (mode === "overwrite") {
      await db.trades.clear();
    }
    for (const t of trades) {
      if (mode === "merge" && t.id) {
        await db.trades.put(t);
      } else {
        await db.trades.add(t);
      }
    }
  }

  async function importCsv(text, mode, db) {
    const rows = parseCsv(text);
    if (mode === "overwrite") {
      await db.trades.clear();
    }
    for (const r of rows) {
      const t = {
        ticker: r.ticker || "",
        type: r.type || "PUT",
        strike: r.strike || "",
        expiry: r.expiry || "",
        premium: r.premium || "",
        qty: Number(r.qty || 1),
        notes: r.notes || "",
        entryDate: r.entryDate || new Date().toISOString()
      };
      if (mode === "merge" && r.id) {
        t.id = Number(r.id);
        await db.trades.put(t);
      } else {
        await db.trades.add(t);
      }
    }
  }

  return {
    exportJsonPlain,
    exportJsonEncrypted,
    exportCsvPlain,
    importJsonPlain,
    importJsonEncrypted,
    importCsv
  };
})();
