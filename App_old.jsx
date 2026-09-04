import React, { useState, useEffect } from "react";

import TabBar from "./components/TabBar.jsx";
import DashboardTab from "./components/DashboardTab.jsx";
import AllLegsTab from "./components/AllLegsTab.jsx";
import CampaignsTab from "./components/CampaignsTab.jsx";
import SettingsTab from "./components/SettingsTab.jsx";
import FirestoreDebug from "./components/FirestoreDebug.jsx";

import {
  loadTrades,
  loadCampaignsAndLegs,
  computeDashboardSummary,
} from "./logic/logic.js";

import dbLocal from "./db/dexie.js";
import "./styles/styles.css";

import { startAuth } from "./auth";
import {
  initialSync,
  subscribeToCampaigns,
  subscribeToLegs
} from "./sync";

export default function App() {
  const [user, setUser] = useState(null);

  // ---------- AUTH ----------
  useEffect(() => {
    const unsub = startAuth((u) => setUser(u));
    return () => unsub && unsub();
  }, []);

  // ---------- SYNC ----------
  useEffect(() => {
    if (!user) return;

    (async () => {
      await initialSync(user.uid);

      const unsubCampaigns = subscribeToCampaigns(user.uid);
      const unsubLegs = subscribeToLegs(user.uid);

      return () => {
        unsubCampaigns();
        unsubLegs();
      };
    })();
  }, [user]);

  // ---------- State ----------
  const [activeTab, setActiveTab] = useState("dashboard");

  const [trades, setTrades] = useState([]);
  const [visibleTrades, setVisibleTrades] = useState([]);

  const [campaigns, setCampaigns] = useState([]);
  const [legs, setLegs] = useState([]);

  const [selectedCampaignId, setSelectedCampaignId] = useState(null);

  const [editingLeg, setEditingLeg] = useState(null);

  const [rollSourceLeg, setRollSourceLeg] = useState(null);
  const [rollClosePrice, setRollClosePrice] = useState("");
  const [rollQty, setRollQty] = useState("");
  const [rollStrike, setRollStrike] = useState("");
  const [rollExpiry, setRollExpiry] = useState("");
  const [rollOpenPrice, setRollOpenPrice] = useState("");

  const [dashboardSummary, setDashboardSummary] = useState(null);

  // ---------- Load Data ----------
  useEffect(() => {
    async function init() {
      const t = await loadTrades();
      const { campaigns: c, legs: l } = await loadCampaignsAndLegs();

      setTrades(t);
      setVisibleTrades(t);
      setCampaigns(c);
      setLegs(l);

      if (c.length > 0) {
        setSelectedCampaignId(c[0].id);
      } else {
        setSelectedCampaignId(null);
      }

      setDashboardSummary(computeDashboardSummary(c, l));
    }

    init();
  }, [user]); // reload when user changes

  // ---------- Reload Helper ----------
  async function reloadAll() {
    const t = await loadTrades();
    const { campaigns: c, legs: l } = await loadCampaignsAndLegs();

    setTrades(t);
    setVisibleTrades(t);
    setCampaigns(c);
    setLegs(l);

    if (c.length === 0) {
      setSelectedCampaignId(null);
    }

    setDashboardSummary(computeDashboardSummary(c, l));
  }

  // ---------- Render Tabs ----------
  function renderTab() {
    switch (activeTab) {
      case "dashboard":
        return <DashboardTab summary={dashboardSummary} />;

      case "trades":
        return (
          <AllLegsTab
            legs={legs}
            setLegs={setLegs}
            loadCampaignsAndLegs={async () => {
              const { campaigns: c, legs: l } = await loadCampaignsAndLegs();
              setCampaigns(c);
              setLegs(l);
              return { campaigns: c, legs: l };
            }}
          />
        );

      case "campaigns":
        return (
          <CampaignsTab
            campaigns={campaigns}
            legs={legs}
            selectedCampaignId={selectedCampaignId}
            setSelectedCampaignId={setSelectedCampaignId}
            setCampaigns={setCampaigns}
            setLegs={setLegs}
            editingLeg={editingLeg}
            setEditingLeg={setEditingLeg}
            rollSourceLeg={rollSourceLeg}
            setRollSourceLeg={setRollSourceLeg}
            rollClosePrice={rollClosePrice}
            setRollClosePrice={setRollClosePrice}
            rollQty={rollQty}
            setRollQty={setRollQty}
            rollStrike={rollStrike}
            setRollStrike={setRollStrike}
            rollExpiry={rollExpiry}
            setRollExpiry={setRollExpiry}
            rollOpenPrice={rollOpenPrice}
            setRollOpenPrice={setRollOpenPrice}
            loadCampaignsAndLegs={async () => {
              const { campaigns: c, legs: l } = await loadCampaignsAndLegs();
              setCampaigns(c);
              setLegs(l);
              setDashboardSummary(computeDashboardSummary(c, l));
              return { campaigns: c, legs: l };
            }}
          />
        );

      case "settings":
        return <SettingsTab reloadAll={reloadAll} />;

      default:
        return <div className="card">Unknown tab.</div>;
    }
  }

  if (!user) return <div>Loading user…</div>;

  return (
    <>
      <div className="app-header">
        <FirestoreDebug />
        <div className="app-title">Options Dashboard</div>
        <div className="app-subtitle">Offline + Dexie + React</div>
      </div>

      <div className="app-container">
        <TabBar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main>{renderTab()}</main>
      </div>
    </>
  );
}
