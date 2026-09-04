import { dbLocal } from "../db/dexie";
import { markDirty } from "../db/dexie";
import { pushCampaign, pushLeg } from "../sync";
import { auth } from "../auth";

// ---------- CAMPAIGNS ----------
export async function updateCampaign(id, changes) {
  const uid = auth.currentUser?.uid;

  // Check if campaign exists
  const existing = await dbLocal.campaigns.get(id);

  if (!existing) {
    // INSERT (new campaign)
    await dbLocal.campaigns.put({
      id,
      updatedAt: new Date().toISOString(),
      dirty: true,
      ...changes
    });

  } else {
    // UPDATE (existing campaign)
    await dbLocal.campaigns.update(id, {
      ...changes,
      updatedAt: new Date().toISOString(),
      dirty: true
    });
  }

  const updated = await dbLocal.campaigns.get(id);

  if (uid) {
    await pushCampaign(uid, updated);
  }

  return updated;
}

// ---------- LEGS ----------
export async function updateLeg(id, changes) {
  await markDirty("legs", id, changes);

  const updated = await dbLocal.legs.get(id);
  const uid = auth.currentUser?.uid;

  if (uid) {
    await pushLeg(uid, updated);
  }

  return updated;
}
