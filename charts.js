// Plotly charts for stats tab

window.ChartUtil = (function () {
  function premiumOverTime(trades, elementId) {
    const sorted = trades.slice().sort((a, b) =>
      (a.entryDate || "").localeCompare(b.entryDate || "")
    );
    const x = sorted.map(t => t.entryDate || "");
    const y = sorted.map(t => Number(t.premium || 0) * (t.qty || 1));
    const cum = [];
    let sum = 0;
    for (const v of y) {
      sum += v;
      cum.push(sum);
    }

    const data = [
      {
        x,
        y: cum,
        type: "scatter",
        mode: "lines+markers",
        name: "Cumulative premium",
        line: { color: "#3b5bd8" }
      }
    ];

    const layout = {
      paper_bgcolor: "#111f3f",
      plot_bgcolor: "#111f3f",
      font: { color: "#f5f7ff" },
      margin: { l: 40, r: 10, t: 30, b: 40 },
      title: "Premium collected over time"
    };

    Plotly.newPlot(elementId, data, layout, { displaylogo: false });
  }

  function strikeDistribution(trades, elementId) {
    const byStrike = {};
    for (const t of trades) {
      const s = t.strike || "";
      if (!s) continue;
      byStrike[s] = (byStrike[s] || 0) + (t.qty || 1);
    }
    const strikes = Object.keys(byStrike);
    const qtys = strikes.map(s => byStrike[s]);

    const data = [
      {
        x: strikes,
        y: qtys,
        type: "bar",
        marker: { color: "#3b5bd8" },
        name: "Contracts"
      }
    ];

    const layout = {
      paper_bgcolor: "#111f3f",
      plot_bgcolor: "#111f3f",
      font: { color: "#f5f7ff" },
      margin: { l: 40, r: 10, t: 30, b: 40 },
      title: "Strike distribution"
    };

    Plotly.newPlot(elementId, data, layout, { displaylogo: false });
  }

  return {
    premiumOverTime,
    strikeDistribution
  };
})();
