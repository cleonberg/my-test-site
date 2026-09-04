window.ChartUtil = window.ChartUtil || {};

// existing premiumOverTime, strikeDistribution stay as‑is

ChartUtil.campaignCashFlow = function(campaigns, legs, divId) {
  const data = campaigns.map(c => {
    const legsForC = legs.filter(l => l.campaignId === c.id);
    const metrics = window.DB.computeCampaignMetrics(legsForC);
    return {
      name: c.ticker + " #" + c.id,
      value: metrics.optionsNet + metrics.stockNet
    };
  });

  const el = document.getElementById(divId);
  if (!el) return;
  const chart = echarts.init(el);
  chart.setOption({
    title: { text: "Campaign Cash Flow" },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: data.map(d => d.name) },
    yAxis: { type: "value" },
    series: [{
      type: "bar",
      data: data.map(d => d.value),
      itemStyle: {
        color: params => params.value >= 0 ? "#4caf50" : "#f44336"
      }
    }]
  });
};

ChartUtil.campaignNetCredit = function(campaigns, legs, divId) {
  const data = campaigns.map(c => {
    const legsForC = legs.filter(l => l.campaignId === c.id);
    const metrics = window.DB.computeCampaignMetrics(legsForC);
    return {
      name: c.ticker + " #" + c.id,
      value: metrics.netCredit
    };
  });

  const el = document.getElementById(divId);
  if (!el) return;
  const chart = echarts.init(el);
  chart.setOption({
    title: { text: "Campaign Net Credit" },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: data.map(d => d.name) },
    yAxis: { type: "value" },
    series: [{
      type: "bar",
      data: data.map(d => d.value),
      itemStyle: {
        color: params => params.value >= 0 ? "#4caf50" : "#f44336"
      }
    }]
  });
};
