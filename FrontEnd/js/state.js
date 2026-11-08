const STORAGE_KEY = "hotelmanager-demo-v1";

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed.rooms || !parsed.workOrders) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveState(rooms, workOrders) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ rooms, workOrders, savedAt: Date.now() })
    );
  } catch {
    /* quota or private mode */
  }
}
