const DEFAULT_STATE = {
  mode: "stopwatch",
  status: "idle",
  startedAt: null,
  elapsed: 0,
  timerDuration: 0,
  timerEndAt: null,
  position: { right: 24, top: 24 },
  entries: []
};

function isToday(timestamp) {
  const date = new Date(timestamp);
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

async function getState() {
  const data = await chrome.storage.local.get("stopwatch");

  const state = {
    ...DEFAULT_STATE,
    ...(data.stopwatch || {})
  };

  const entries = (state.entries || []).filter(entry =>
    isToday(entry.createdAt)
  );

  if (entries.length !== (state.entries || []).length) {
    state.entries = entries;
    await chrome.storage.local.set({ stopwatch: state });
  }

  return state;
}

async function scheduleMidnightCleanup() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0);

  await chrome.alarms.clear("stopwatch-midnight");
  await chrome.alarms.create("stopwatch-midnight", {
    when: midnight.getTime()
  });
}

async function updateState(patch) {
  const state = await getState();
  await chrome.storage.local.set({
    stopwatch: { ...state, ...patch }
  });
}

function formatDurationForCsv(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = String(Math.floor(total / 3600)).padStart(2, "0");
  const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
  const s = String(total % 60).padStart(2, "0");
  return `${h}:${m}:${s}`;
}

async function broadcast() {
  const tabs = await chrome.tabs.query({});
  for (const tab of tabs) {
    if (tab.id) {
      chrome.tabs.sendMessage(tab.id, { type: "STATE_CHANGED" }).catch(() => {});
    }
  }
}

chrome.runtime.onInstalled.addListener(async () => {
  const data = await chrome.storage.local.get("stopwatch");

  if (!data.stopwatch) {
    await chrome.storage.local.set({
      stopwatch: DEFAULT_STATE
    });
  }

  await getState();
  await scheduleMidnightCleanup();
});

chrome.runtime.onStartup.addListener(async () => {
  await getState();
  await scheduleMidnightCleanup();
});

chrome.alarms.onAlarm.addListener(async alarm => {
  if (alarm.name === "stopwatch-midnight") {
    await getState();
    await scheduleMidnightCleanup();
    await broadcast();
    return;
  }

  if (alarm.name !== "stopwatch-timer") return;

  const state = await getState();

  if (state.mode !== "timer" || state.status !== "running") return;

  await updateState({
    status: "finished",
    elapsed: state.timerDuration,
    timerEndAt: null
  });

  await broadcast();
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  (async () => {
    const state = await getState();

    switch (message.type) {
      case "GET_STATE":
        sendResponse(state);
        return;

      case "START_STOPWATCH":
        await chrome.alarms.clear("stopwatch-timer");

        await updateState({
          mode: "stopwatch",
          status: "running",
          startedAt: Date.now(),
          elapsed: 0,
          timerDuration: 0,
          timerEndAt: null
        });

        await broadcast();
        sendResponse({ ok: true });
        return;

      case "STOP":
        if (state.mode === "timer") {
          await chrome.alarms.clear("stopwatch-timer");

          const remaining = state.timerEndAt
            ? Math.max(0, state.timerEndAt - Date.now())
            : state.elapsed;

          const elapsed = Math.max(0, state.timerDuration - remaining);

          await updateState({
            status: "stopped",
            elapsed,
            timerEndAt: null
          });
        } else {
          const elapsed = state.startedAt
            ? Date.now() - state.startedAt
            : state.elapsed;

          await updateState({
            status: "stopped",
            elapsed,
            startedAt: null
          });
        }

        await broadcast();
        sendResponse({ ok: true });
        return;

      case "START_TIMER": {
        const duration = Math.max(1000, Number(message.durationMs));
        const endAt = Date.now() + duration;

        await chrome.alarms.clear("stopwatch-timer");
        await chrome.alarms.create("stopwatch-timer", { when: endAt });

        await updateState({
          mode: "timer",
          status: "running",
          startedAt: null,
          elapsed: duration,
          timerDuration: duration,
          timerEndAt: endAt
        });

        await broadcast();
        sendResponse({ ok: true });
        return;
      }

      case "RESET":
        await chrome.alarms.clear("stopwatch-timer");
        await updateState({
          mode: "stopwatch",
          status: "idle",
          startedAt: null,
          elapsed: 0,
          timerDuration: 0,
          timerEndAt: null
        });
        await broadcast();
        sendResponse({ ok: true });
        return;

      case "EXPORT_CSV": {
        const entries = state.entries || [];

        const escapeCsv = value => {
          const text = String(value ?? "");
          return `"${text.replace(/"/g, '""')}"`;
        };

        const rows = [
          ["Title", "Notes", "Duration", "Mode", "Created At"],
          ...entries.map(entry => [
            entry.title || "",
            entry.notes || "",
            formatDurationForCsv(entry.duration || 0),
            entry.mode === "timer" ? "Timer" : "Stopwatch",
            new Date(entry.createdAt).toLocaleString()
          ])
        ];

        const csv = rows
          .map(row => row.map(escapeCsv).join(","))
          .join("\\n");

        const dataUrl =
          "data:text/csv;charset=utf-8," +
          encodeURIComponent("\\ufeff" + csv);

        await chrome.downloads.download({
          url: dataUrl,
          filename: `stopwatch-${new Date().toISOString().slice(0, 10)}.csv`,
          saveAs: true
        });

        sendResponse({ ok: true });
        return;
      }

      case "SAVE_ENTRY": {
        const entry = {
          id: crypto.randomUUID(),
          title: String(message.title || "Untitled").trim(),
          notes: String(message.notes || "").trim(),
          duration: state.elapsed,
          mode: state.mode,
          createdAt: Date.now()
        };

        await updateState({
          entries: [entry, ...state.entries].slice(0, 100),
          mode: "stopwatch",
          status: "idle",
          startedAt: null,
          elapsed: 0,
          timerDuration: 0,
          timerEndAt: null
        });

        await broadcast();
        sendResponse({ ok: true });
        return;
      }

      case "SET_POSITION":
        await updateState({ position: message.position });
        sendResponse({ ok: true });
        return;

      default:
        sendResponse({ ok: false });
    }
  })();

  return true;
});