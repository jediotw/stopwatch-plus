(() => {
  if (window.top !== window) return;
  if (document.getElementById("__stopwatch_host")) return;

  const host = document.createElement("div");
  host.id = "__stopwatch_host";

  Object.assign(host.style, {
    position: "fixed",
    top: "24px",
    right: "24px",
    left: "auto",
    bottom: "auto",
    width: "238px",
    height: "68px",
    zIndex: "2147483647",
    margin: "0",
    padding: "0"
  });

  const shadow = host.attachShadow({ mode: "open" });

  shadow.innerHTML = `
    <style>
* { box-sizing: border-box; }

#widget {
  width: 238px;
  height: 68px;
  position: relative;
  background: linear-gradient(145deg, #353a3b 0%, #25292a 55%, #202324 100%);
  border: 5px solid #25292a;
  border-radius: 16px;
  padding: 4px;
  color: #2f3535;
  font-family: Arial, Helvetica, sans-serif;
  box-shadow:
    0 1px 0 rgba(255,255,255,.16) inset,
    0 -1px 0 rgba(0,0,0,.35) inset,
    0 2px 3px rgba(0,0,0,.35),
    0 10px 24px rgba(0,0,0,.22);
}

#screen {
  width: 100%;
  height: 50px;
  border: 1px solid #7e8581;
  border-radius: 9px;
  background: linear-gradient(180deg, #e7ebe6 0%, #d9ded9 100%);
  overflow: hidden;
  box-shadow:
    0 1px 0 rgba(255,255,255,.85) inset,
    0 -1px 0 rgba(0,0,0,.10) inset,
    0 0 0 1px rgba(0,0,0,.08);
}

#idle-choice {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
  gap: 0;
}

.idle-option {
  width: 56px;
  height: 42px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #414847;
  cursor: pointer;
  display: grid;
  place-items: center;
}

.idle-option + .idle-option {
  margin-left: 20px;
}

.idle-option:hover {
  background: rgba(48,52,53,.08);
}

.idle-option:active {
  transform: translateY(1px);
}

.idle-option svg {
  width: 25px;
  height: 25px;
  stroke: currentColor;
  fill: none;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  filter: drop-shadow(0 1px 0 rgba(255,255,255,.45));
}

#idle-divider {
  width: 1px;
  height: 28px;
  background: #b5bbb6;
  box-shadow: 1px 0 0 rgba(255,255,255,.55);
}

#main {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 9px;
  gap: 0;
  cursor: grab;
  user-select: none;
}

#main:active { cursor: grabbing; }

#mode {
  width: 22px;
  height: 28px;
  flex: 0 0 22px;
  display: grid;
  place-items: center;
}

#mode svg {
  width: 20px;
  height: 20px;
  stroke: #414847;
  fill: none;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
  filter: drop-shadow(0 1px 0 rgba(255,255,255,.45));
}

#divider {
  width: 1px;
  height: 28px;
  flex: 0 0 1px;
  margin: 0 12px 0 8px;
  background: #b5bbb6;
  box-shadow: 1px 0 0 rgba(255,255,255,.55);
}

#time {
  flex: 1 1 auto;
  min-width: 0;
  font-size: 17px;
  line-height: 1;
  letter-spacing: .2px;
  white-space: nowrap;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-variant-numeric: tabular-nums;
  color: #252b2b;
  text-shadow: 0 1px 0 rgba(255,255,255,.55);
}

#action {
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  margin: 0 10px 0 12px;
  padding: 0;
  border: 0;
  border-radius: 50%;
  background: linear-gradient(145deg, #3a4041, #292e2f);
  color: #f4f6f4;
  cursor: pointer;
  display: grid;
  place-items: center;
  box-shadow:
    0 2px 3px rgba(0,0,0,.28),
    0 1px 0 rgba(255,255,255,.20) inset,
    0 -1px 0 rgba(0,0,0,.30) inset;
}

#action:hover {
  transform: translateY(-1px);
  box-shadow:
    0 3px 5px rgba(0,0,0,.30),
    0 1px 0 rgba(255,255,255,.20) inset,
    0 -1px 0 rgba(0,0,0,.30) inset;
}

#action:active { transform: translateY(0); }

#action svg { width: 17px; height: 17px; }

#menu {
  width: 22px;
  height: 32px;
  flex: 0 0 22px;
  padding: 0;
  margin: 0;
  border: 0;
  border-radius: 5px;
  background: transparent;
  color: #414847;
  cursor: pointer;
  font: 20px/20px Arial, sans-serif;
  display: grid;
  place-items: center;
}

#menu:hover { background: rgba(48,52,53,.09); }

#menu-panel, #timer-panel, #save-panel {
  position: absolute;
  top: 76px;
  right: 0;
  width: 190px;
  padding: 7px;
  background: #e6eae5;
  border: 4px solid #292b2c;
  border-radius: 11px;
  box-shadow: 0 8px 18px rgba(0,0,0,.24), 0 1px 0 rgba(255,255,255,.45) inset;
}

#menu-panel { width: 145px; padding: 5px; }

.menu-item, .primary {
  display: block; width: 100%; border: 0; border-radius: 6px; padding: 8px 9px;
  background: transparent; color: #292b2c; text-align: left; font: 12px Arial, sans-serif; cursor: pointer;
}

.menu-item:hover { background: #d2d7d2; }

.panel-title { margin: 1px 2px 7px; color: #59605d; font: 12px Arial, sans-serif; }

input, textarea {
  width: 100%; border: 1px solid #aeb5b0; border-radius: 6px; outline: none;
  background: #f5f7f4; color: #292b2c; font: 12px Arial, sans-serif; padding: 7px 8px;
}

textarea { margin-top: 6px; height: 58px; resize: none; }

.primary { margin-top: 7px; background: #292b2c; color: white; text-align: center; }

.timer-fields { display: grid; grid-template-columns: repeat(3,1fr); gap: 4px; }
.timer-fields input { text-align: center; padding: 7px 2px; }

.alert #screen {
  background: linear-gradient(180deg, #f0dfdc 0%, #e7d2cf 100%);
  border-color: #aa827d;
}

.alert #time { color: #c52f2a; text-shadow: 0 1px 0 rgba(255,255,255,.55); }

.alert #action {
  background: linear-gradient(145deg, #d95550, #b93b36);
  color: white;
}

.hidden { display: none !important; }

#history-panel {
  position: absolute; top: 76px; right: 0; width: 250px; max-height: min(360px, calc(100vh - 105px));
  overflow: hidden; padding: 8px; background: #e6eae5; border: 4px solid #292b2c; border-radius: 11px;
  box-shadow: 0 8px 18px rgba(0,0,0,.24), 0 1px 0 rgba(255,255,255,.45) inset;
}

.history-header { display:flex; align-items:center; justify-content:space-between; height:24px; margin-bottom:4px; }
.history-header .panel-title { margin:1px 2px; }
#history-close { width:24px; height:24px; padding:0; border:0; border-radius:5px; background:transparent; color:#292b2c; font:20px/20px Arial,sans-serif; cursor:pointer; }
#history-close:hover { background:#d2d7d2; }
#history-list { max-height:min(260px,calc(100vh - 200px)); overflow-y:auto; scrollbar-width:thin; padding-right:2px; }
.history-item { padding:8px 6px; border-bottom:1px solid #c5cbc6; }
.history-item:last-child { border-bottom:0; }
.history-title { color:#292b2c; font:600 12px Arial,sans-serif; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
.history-meta { margin-top:3px; color:#68706c; font:11px Arial,sans-serif; font-variant-numeric:tabular-nums; }
.history-notes { margin-top:4px; color:#555d59; font:11px/1.35 Arial,sans-serif; word-break:break-word; }
.history-empty { padding:12px 6px; color:#68706c; font:11px Arial,sans-serif; text-align:center; }
.history-export { width:100%; margin-top:7px; padding:7px 9px; border:0; border-radius:6px; background:#292b2c; color:white; font:12px Arial,sans-serif; cursor:pointer; }
.history-export:hover { opacity:.9; }

#widget { cursor:grab; touch-action:none; }
#widget:active { cursor:grabbing; }
#screen { touch-action:none; }
#menu-panel,#timer-panel,#save-panel,#history-panel { touch-action:auto; }
#widget button,#widget input,#widget textarea,#widget form { touch-action:auto; }
</style>

    <div id="widget">
      <div id="screen">
        <div id="idle-choice" class="hidden">
          <button id="idle-stopwatch" class="idle-option" type="button" aria-label="Start stopwatch" title="Start stopwatch">
            <svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="7"></circle><path d="M12 6V3"></path><path d="M9 3h6"></path><path d="M17 8l2-2"></path><path d="M12 13V9"></path></svg>
          </button>
          <div id="idle-divider"></div>
          <button id="idle-timer" class="idle-option" type="button" aria-label="Set timer" title="Set timer">
            <svg viewBox="0 0 24 24"><path d="M7 3h10"></path><path d="M7 21h10"></path><path d="M8 3c0 5 8 5 8 9s-8 4-8 9"></path><path d="M16 3c0 5-8 5-8 9s8 4 8 9"></path></svg>
          </button>
        </div>
        <div id="main">
          <div id="mode"></div>
          <div id="divider"></div>
          <div id="time">00:00:00</div>
          <button id="action" type="button" aria-label="Start"></button>
          <button id="menu" type="button" aria-label="Open menu">⋮</button>
        </div>
      </div>

      <div id="menu-panel" class="hidden">
        <button class="menu-item" id="start-stopwatch" type="button">Stopwatch</button>
        <button class="menu-item" id="open-timer" type="button">Set timer</button>
        <button class="menu-item" id="open-history" type="button">History</button>
        <button class="menu-item" id="reset" type="button">Reset</button>
      </div>

      <form id="timer-panel" class="hidden">
        <div class="panel-title">Set timer</div>
        <div class="timer-fields">
          <input id="hours" type="number" min="0" max="99" value="0" aria-label="Hours">
          <input id="minutes" type="number" min="0" max="59" value="0" aria-label="Minutes">
          <input id="seconds" type="number" min="0" max="59" value="15" aria-label="Seconds">
        </div>
        <button class="primary" type="submit">Start timer</button>
      </form>

      <form id="save-panel" class="hidden">
        <div class="panel-title">Save tracked time</div>
        <input id="title" type="text" placeholder="Title" autocomplete="off">
        <textarea id="notes" placeholder="Notes (optional)"></textarea>
        <button class="primary" type="submit">Save</button>
      </form>

      <div id="history-panel" class="hidden">
        <div class="history-header">
          <div class="panel-title">Today's history</div>
          <button id="history-close" type="button" aria-label="Close history">×</button>
        </div>
        <div id="history-list"></div>
        <button id="history-export" class="history-export" type="button">Export CSV</button>
      </div>
    </div>
  `;

  document.documentElement.appendChild(host);

  const widget = shadow.querySelector("#widget");
  const main = shadow.querySelector("#main");
  const timeEl = shadow.querySelector("#time");
  const modeEl = shadow.querySelector("#mode");
  const action = shadow.querySelector("#action");
  const menu = shadow.querySelector("#menu");
  const menuPanel = shadow.querySelector("#menu-panel");
  const timerPanel = shadow.querySelector("#timer-panel");
  const savePanel = shadow.querySelector("#save-panel");
  const historyPanel = shadow.querySelector("#history-panel");
  const historyList = shadow.querySelector("#history-list");
  const idleChoice = shadow.querySelector("#idle-choice");
  const idleStopwatch = shadow.querySelector("#idle-stopwatch");
  const idleTimer = shadow.querySelector("#idle-timer");

  let state = null;
  let localAlert = false;
  const icons = {
    stopwatch: `<svg viewBox="0 0 24 24"><circle cx="12" cy="13" r="7"></circle><path d="M12 6V3"></path><path d="M9 3h6"></path><path d="M17 8l2-2"></path><path d="M12 13V9"></path></svg>`,
    timer: `<svg viewBox="0 0 24 24"><path d="M7 3h10"></path><path d="M7 21h10"></path><path d="M8 3c0 5 8 5 8 9s-8 4-8 9"></path><path d="M16 3c0 5-8 5-8 9s8 4 8 9"></path></svg>`,
    play: `<svg viewBox="0 0 24 24"><path d="M8 5l11 7-11 7z" fill="currentColor" stroke="none"></path></svg>`,
    stop: `<svg viewBox="0 0 24 24"><rect x="7" y="7" width="10" height="10" rx="1" fill="currentColor" stroke="none"></rect></svg>`
  };

  function send(type, payload = {}) {
    return chrome.runtime.sendMessage({ type, ...payload });
  }

  function format(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const h = String(Math.floor(total / 3600)).padStart(2, "0");
    const m = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
    const s = String(total % 60).padStart(2, "0");
    return `${h}:${m}:${s}`;
  }

  function currentTime() {
    if (!state) return 0;

    if (state.mode === "stopwatch" && state.status === "running" && state.startedAt) {
      return Math.max(0, Date.now() - state.startedAt);
    }

    if (state.mode === "timer" && state.status === "running" && state.timerEndAt) {
      return Math.max(0, state.timerEndAt - Date.now());
    }

    return Math.max(0, Number(state.elapsed) || 0);
  }

  function applyPosition() {
    const position = state?.position || {};

    // Store the actual viewport coordinates instead of converting between
    // left/right while dragging. This prevents the widget from briefly
    // jumping back to its old position when state refreshes.
    const x = Number.isFinite(Number(position.left))
      ? Number(position.left)
      : Math.max(0, window.innerWidth - host.offsetWidth - (Number(position.right) || 24));
    const y = Number.isFinite(Number(position.top))
      ? Number(position.top)
      : (Number(position.top) || 24);

    const maxX = Math.max(0, window.innerWidth - host.offsetWidth);
    const maxY = Math.max(0, window.innerHeight - host.offsetHeight);

    host.style.left = `${Math.max(0, Math.min(maxX, x))}px`;
    host.style.top = `${Math.max(0, Math.min(maxY, y))}px`;
    host.style.right = "auto";
    host.style.bottom = "auto";
  }

  function render() {
    if (!state) return;

    const isIdle = state.status === "idle";

    idleChoice.classList.toggle("hidden", !isIdle);
    main.classList.toggle("hidden", isIdle);

    if (isIdle) {
      widget.classList.remove("alert");
      savePanel.classList.add("hidden");
      return;
    }

    timeEl.textContent = format(currentTime());

    modeEl.innerHTML = state.mode === "timer" ? icons.timer : icons.stopwatch;

    const running = state.status === "running";

    action.innerHTML = running ? icons.stop : icons.play;
    action.title = running ? "Stop" : "Start stopwatch";
    action.setAttribute("aria-label", running ? "Stop" : "Start stopwatch");

    const remaining =
      state.mode === "timer" && state.timerEndAt
        ? state.timerEndAt - Date.now()
        : Infinity;

    const warning =
      state.mode === "timer" &&
      state.status === "running" &&
      remaining <= 10000 &&
      remaining > 0;

    widget.classList.toggle("alert", warning);

    savePanel.classList.toggle(
      "hidden",
      !(state.status === "stopped" || state.status === "finished")
    );

    if (warning && !localAlert) {
      localAlert = true;
      honk();
    }

    if (!warning) localAlert = false;
  }

  function honk() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;

      const ctx = new AudioContext();

      [0, 0.18, 0.36].forEach((delay, i) => {
        const oscillator = ctx.createOscillator();
        const gain = ctx.createGain();
        oscillator.type = "square";
        oscillator.frequency.value = i === 1 ? 260 : 190;

        const t = ctx.currentTime + delay;

        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.exponentialRampToValueAtTime(0.16, t + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.12);

        oscillator.connect(gain).connect(ctx.destination);
        oscillator.start(t);
        oscillator.stop(t + 0.13);
      });
    } catch {}
  }

  function renderHistory() {
    historyList.innerHTML = "";

    if (!state.entries || state.entries.length === 0) {
      const empty = document.createElement("div");
      empty.className = "history-empty";
      empty.textContent = "No tracked time today.";
      historyList.appendChild(empty);
      return;
    }

    for (const entry of state.entries) {
      const item = document.createElement("div");
      item.className = "history-item";

      const title = document.createElement("div");
      title.className = "history-title";
      title.textContent = entry.title || "Untitled";

      const meta = document.createElement("div");
      meta.className = "history-meta";
      meta.textContent =
        `${format(entry.duration || 0)} · ${entry.mode === "timer" ? "Timer" : "Stopwatch"}`;

      item.appendChild(title);
      item.appendChild(meta);

      if (entry.notes) {
        const notes = document.createElement("div");
        notes.className = "history-notes";
        notes.textContent = entry.notes;
        item.appendChild(notes);
      }

      historyList.appendChild(item);
    }
  }

  async function refresh() {
    state = await send("GET_STATE");
    applyPosition();
    render();
    renderHistory();
  }

  idleStopwatch.addEventListener("click", async event => {
    event.stopPropagation();
    await send("START_STOPWATCH");
    await refresh();
  });

  idleTimer.addEventListener("click", event => {
    event.stopPropagation();
    menuPanel.classList.add("hidden");
    historyPanel.classList.add("hidden");
    savePanel.classList.add("hidden");
    timerPanel.classList.remove("hidden");
  });

  action.addEventListener("click", async event => {
    event.stopPropagation();

    if (state.status === "running") {
      await send("STOP");
    } else if (state.status === "stopped" || state.status === "finished") {
      savePanel.classList.remove("hidden");
      return;
    } else {
      await send("START_STOPWATCH");
    }

    await refresh();
  });

  menu.addEventListener("click", event => {
    event.stopPropagation();
    menuPanel.classList.toggle("hidden");
    timerPanel.classList.add("hidden");
  });

  shadow.querySelector("#start-stopwatch").addEventListener("click", async () => {
    await send("START_STOPWATCH");
    menuPanel.classList.add("hidden");
    timerPanel.classList.add("hidden");
    historyPanel.classList.add("hidden");
    await refresh();
  });

  shadow.querySelector("#open-timer").addEventListener("click", () => {
    menuPanel.classList.add("hidden");
    historyPanel.classList.add("hidden");
    timerPanel.classList.remove("hidden");
  });

  shadow.querySelector("#open-history").addEventListener("click", async () => {
    menuPanel.classList.add("hidden");
    timerPanel.classList.add("hidden");
    savePanel.classList.add("hidden");
    historyPanel.classList.remove("hidden");
    await refresh();
  });

  shadow.querySelector("#history-close").addEventListener("click", () => {
    historyPanel.classList.add("hidden");
  });

  shadow.querySelector("#history-export").addEventListener("click", async () => {
    await send("EXPORT_CSV");
  });

  shadow.querySelector("#reset").addEventListener("click", async () => {
    await send("RESET");
    menuPanel.classList.add("hidden");
    timerPanel.classList.add("hidden");
    historyPanel.classList.add("hidden");
    savePanel.classList.add("hidden");
    await refresh();
  });

  timerPanel.addEventListener("submit", async event => {
    event.preventDefault();

    const h = Math.min(99, Math.max(0, Number(shadow.querySelector("#hours").value) || 0));
    const m = Math.min(59, Math.max(0, Number(shadow.querySelector("#minutes").value) || 0));
    const s = Math.min(59, Math.max(0, Number(shadow.querySelector("#seconds").value) || 0));

    const duration = ((h * 60 + m) * 60 + s) * 1000;
    if (duration <= 0) return;

    await send("START_TIMER", { durationMs: duration });
    timerPanel.classList.add("hidden");
    historyPanel.classList.add("hidden");
    await refresh();
  });

  savePanel.addEventListener("submit", async event => {
    event.preventDefault();

    const title = shadow.querySelector("#title").value.trim();
    const notes = shadow.querySelector("#notes").value.trim();

    await send("SAVE_ENTRY", {
      title: title || "Untitled",
      notes
    });

    shadow.querySelector("#title").value = "";
    shadow.querySelector("#notes").value = "";

    await refresh();
  });

  // Press-and-hold anywhere on the widget, then drag it freely.
  // Interactive controls (buttons/inputs) remain clickable.
  let dragging = false;
  let holdTimer = null;
  let pointerId = null;
  let grabX = 0;
  let grabY = 0;
  let dragStarted = false;

  function isInteractiveTarget(target) {
    return Boolean(
      target.closest("button, input, textarea, select, option, form")
    );
  }

  function cancelHold() {
    if (holdTimer !== null) {
      clearTimeout(holdTimer);
      holdTimer = null;
    }
  }

  function startDrag(event) {
    if (!pointerId || event.pointerId !== pointerId) return;

    dragging = true;
    dragStarted = true;

    host.style.cursor = "grabbing";

    try {
      widget.setPointerCapture(pointerId);
    } catch {}

    moveDrag(event);
  }

  function beginHold(event) {
    if (event.button !== undefined && event.button !== 0) return;
    if (isInteractiveTarget(event.target)) return;

    cancelHold();

    pointerId = event.pointerId;
    dragStarted = false;

    const rect = host.getBoundingClientRect();

    grabX = event.clientX - rect.left;
    grabY = event.clientY - rect.top;

    // Hold for 180ms before entering drag mode.
    holdTimer = setTimeout(() => {
      holdTimer = null;
      startDrag(event);
    }, 180);
  }

  function moveDrag(event) {
    if (!pointerId || event.pointerId !== pointerId) return;

    if (!dragging) {
      // If the user moves substantially before the hold completes,
      // treat it as a cancelled click rather than a drag.
      return;
    }

    const x = event.clientX - grabX;
    const y = event.clientY - grabY;

    // Keep the complete widget on-screen, while allowing every visible
    // point inside the viewport to be a valid drop location.
    const maxX = Math.max(0, window.innerWidth - host.offsetWidth);
    const maxY = Math.max(0, window.innerHeight - host.offsetHeight);

    const clampedX = Math.max(0, Math.min(maxX, x));
    const clampedY = Math.max(0, Math.min(maxY, y));

    host.style.left = `${clampedX}px`;
    host.style.top = `${clampedY}px`;
    host.style.right = "auto";
    host.style.bottom = "auto";

    event.preventDefault();
  }

  async function endDrag(event) {
    if (!pointerId || event.pointerId !== pointerId) return;

    cancelHold();

    const wasDragging = dragging;

    dragging = false;
    pointerId = null;
    host.style.cursor = "";

    if (!wasDragging) return;

    const rect = host.getBoundingClientRect();
    const position = {
      left: Math.max(0, rect.left),
      top: Math.max(0, rect.top)
    };

    // Update the local state FIRST. `send()` is async, so a STATE_CHANGED
    // message can arrive before SET_POSITION finishes. If local state still
    // contains the old coordinates, refresh() would apply the old position
    // and make the widget snap back to its origin.
    state.position = position;

    // Keep the dropped position immediately and persist it in the background.
    applyPosition();
    await send("SET_POSITION", { position });
  }

  function cancelDrag(event) {
    if (!pointerId || event.pointerId !== pointerId) return;

    cancelHold();
    dragging = false;
    pointerId = null;
    host.style.cursor = "";
  }

  widget.addEventListener("pointerdown", beginHold);
  widget.addEventListener("pointermove", moveDrag);
  widget.addEventListener("pointerup", endDrag);
  widget.addEventListener("pointercancel", cancelDrag);

  // Prevent accidental text selection while dragging.
  widget.addEventListener("selectstart", event => {
    if (dragging) event.preventDefault();
  });

  // Keep the complete widget visible after a browser resize.
  window.addEventListener("resize", async () => {
    if (!state || dragging) return;

    const rect = host.getBoundingClientRect();

    const x = Math.max(
      0,
      Math.min(window.innerWidth - host.offsetWidth, rect.left)
    );

    const y = Math.max(
      0,
      Math.min(window.innerHeight - host.offsetHeight, rect.top)
    );

    host.style.left = `${x}px`;
    host.style.top = `${y}px`;
    host.style.right = "auto";

    await send("SET_POSITION", {
      position: {
        left: x,
        top: y
      }
    });
  });

  chrome.runtime.onMessage.addListener(message => {
    if (message.type === "STATE_CHANGED") refresh();
  });

  setInterval(render, 200);
  refresh();
})();
