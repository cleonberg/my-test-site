import React from "react";
import { fmt } from "../logic/logic.js";

export default function DashboardTab({ summary }) {
  if (!summary) {
    return <div className="card">Loading…</div>;
  }

  return (
    <div className="card">
      <h3>Dashboard Summary</h3>

      <div className="summary-grid">
        <div>
          <div className="summary-label">Total Net Credit</div>
          <div>{fmt(summary.netCredit)}</div>
        </div>

        <div>
          <div className="summary-label">Open Legs</div>
          <div>{summary.openLegCount}</div>
        </div>

        <div>
          <div className="summary-label">Closed Legs</div>
          <div>{summary.closedLegCount}</div>
        </div>

        <div>
          <div className="summary-label">Active Campaigns</div>
          <div>{summary.activeCampaigns}</div>
        </div>

        <div>
          <div className="summary-label">Closed Campaigns</div>
          <div>{summary.closedCampaigns}</div>
        </div>

        <div>
          <div className="summary-label">Earliest Open</div>
          <div>{summary.earliestOpen || "-"}</div>
        </div>

        <div>
          <div className="summary-label">Latest Close</div>
          <div>{summary.latestClose || "-"}</div>
        </div>
      </div>
    </div>
  );
}
