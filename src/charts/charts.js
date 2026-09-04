window.ChartUtil = window.ChartUtil || {};

ChartUtil.premiumOverTime = function(trades, divId) {
  const el = document.getElementById(divId);
  if (!el) return;

  const sorted = [...trades].sort((a,b) => new Date(a.entryDate) - new Date(b.entryDate));
  const dates = sorted.map(t => t.entryDate.slice(0,10));
  const premiums = sorted.map(t => Number(t.premium || 0) * (t.qty || 1));

  const chart = echarts.init(el);
  chart.setOption({
    title: { text: "Premium Over Time" },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: dates },
    yAxis: { type: "value" },
    series: [{ type: "line", data: premiums, smooth: true, areaStyle: {} }]
  });
};

ChartUtil.strikeDistribution = function(trades, divId) {
  const el = document.getElementById(divId);
  if (!el) return;

  const strikes = trades.map(t => Number(t.strike || 0));

  const chart = echarts.init(el);
  chart.setOption({
    title: { text: "Strike Distribution" },
    tooltip: {},
    xAxis: { type: "category", data: strikes },
    yAxis: { type: "value" },
    series: [{ type: "bar", data: strikes, itemStyle: { color: "#4caf50" } }]
  });
};

ChartUtil.campaignCashFlow = function(campaigns, legs, divId) {
  const el = document.getElementById(divId);
  if (!el) return;

  const data = campaigns.map(c => {
    const legsForC = legs.filter(l => l.campaignId === c.id);
    const metrics = window.DB.computeCampaignMetrics(legsForC);
    return { name: `${c.ticker} #${c.id}`, value: metrics.optionsNet + metrics.stockNet };
  });

  const chart = echarts.init(el);
  chart.setOption({
    title: { text: "Campaign Cash Flow" },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: data.map(d => d.name) },
    yAxis: { type: "value" },
    series: [{
      type: "bar",
      data: data.map(d => d.value),
      itemStyle: { color: p => p.value >= 0 ? "#4caf50" : "#f44336" }
    }]
  });
};

ChartUtil.campaignNetCredit = function(campaigns, legs, divId) {
  const el = document.getElementById(divId);
  if (!el) return;

  const data = campaigns.map(c => {
    const legsForC = legs.filter(l => l.campaignId === c.id);
    const metrics = window.DB.computeCampaignMetrics(legsForC);
    return { name: `${c.ticker} #${c.id}`, value: metrics.netCredit };
  });

  const chart = echarts.init(el);
  chart.setOption({
    title: { text: "Campaign Net Credit" },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: data.map(d => d.name) },
    yAxis: { type: "value" },
    series: [{
      type: "bar",
      data: data.map(d => d.value),
      itemStyle: { color: p => p.value >= 0 ? "#4caf50" : "#f44336" }
    }]
  });
};
