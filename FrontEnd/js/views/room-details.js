import { REVIEW, STATUS_LABELS, SKIP_REASONS } from "../mock-data.js";
import { esc, formatTimer } from "../utils.js";

export function createRoomDetailsController({
  win,
  scrim,
  getRooms,
  setOpenRoom,
  getTimerState,
  onRefreshMain,
  onToast,
  onPersist,
  onClose,
  onCreateTicket,
}) {
  function stopTimer() {
    const ts = getTimerState();
    clearInterval(ts.timer);
    ts.timer = null;
  }

  function renderRoomDetails(roomNumber) {
    const rooms = getRooms();
    const room = rooms.find((r) => r.number === roomNumber);
    if (!room) return;
    setOpenRoom(room);

    const ts = getTimerState();
    stopTimer();
    if (ts.lastRoom !== roomNumber) {
      ts.secs = 0;
      ts.lastRoom = roomNumber;
    }

    const items = room.comments
      .map((c) => {
        if (c === REVIEW) return `<li><i>${esc(c)}</i></li>`;
        return `<li>${esc(c)}</li>`;
      })
      .join("");

    const skipOpts = SKIP_REASONS.map((r) => `<li>${esc(r)}</li>`).join("");

    win.innerHTML = `
      <div class="bar">
        <span id="win-title">ROOM DETAILS</span>
        <button type="button" aria-label="Close" id="modal-close">✕</button>
      </div>
      <div class="body">
        <span class="pill ${room.status}">${esc(STATUS_LABELS[room.status])}</span>
        <div class="cols">
          <div class="cbox">
            <h2>Comments for Room ${room.number}:</h2>
            <ul id="comment-list">
              ${items}
              <li><input id="new-comment" aria-label="Add a comment" placeholder="Add a comment" maxlength="80"></li>
            </ul>
          </div>
          <div class="side">
            <div class="timer">
              <div class="clock" id="clock" aria-live="off">${formatTimer(ts.secs)}</div>
              <button type="button" class="play" id="play-timer" aria-label="Start timer">▶</button>
            </div>
            <button type="button" class="btn" id="btn-clean">Clean</button>
            <div class="skip" id="skip-wrap">
              <button type="button" class="btn" id="btn-skip">Skip ▾</button>
              <ul>${skipOpts}</ul>
            </div>
            <button type="button" class="btn" id="btn-ticket">Create Ticket</button>
          </div>
        </div>
      </div>`;

    scrim.classList.add("on");
    const closeBtn = win.querySelector("#modal-close");
    closeBtn.focus();

    closeBtn.addEventListener("click", () => onClose());

    const input = win.querySelector("#new-comment");
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && input.value.trim()) {
        room.comments.push(input.value.trim());
        room.displayComment = room.comments[room.comments.length - 1];
        onPersist();
        renderRoomDetails(room.number);
        onRefreshMain();
        onToast("Comment added");
      }
    });

    const play = win.querySelector("#play-timer");
    const clock = win.querySelector("#clock");
    play.addEventListener("click", () => {
      if (ts.timer) {
        stopTimer();
        play.textContent = "▶";
        play.setAttribute("aria-label", "Resume timer");
        return;
      }
      const start = Date.now() - ts.secs * 1000;
      play.textContent = "❚❚";
      play.setAttribute("aria-label", "Pause timer");
      ts.timer = setInterval(() => {
        ts.secs = Math.floor((Date.now() - start) / 1000);
        clock.textContent = formatTimer(ts.secs);
      }, 200);
    });

    win.querySelector("#btn-clean").addEventListener("click", () => {
      room.status = "yel";
      if (!room.comments.includes(REVIEW)) room.comments.push(REVIEW);
      room.displayComment = REVIEW;
      stopTimer();
      onPersist();
      onRefreshMain();
      onToast(`Room ${room.number} marked clean`);
      onClose();
    });

    const skipWrap = win.querySelector("#skip-wrap");
    win.querySelector("#btn-skip").addEventListener("click", (e) => {
      e.stopPropagation();
      skipWrap.classList.toggle("open");
    });
    skipWrap.querySelectorAll("li").forEach((li) => {
      li.addEventListener("click", () => {
        const reason = li.textContent.trim();
        room.status = "yel";
        const msg = `Skipped: ${reason}`;
        room.comments.push(msg);
        room.displayComment = msg;
        onPersist();
        onRefreshMain();
        onToast(`Room ${room.number} skipped`);
        onClose();
      });
    });

    win.querySelector("#btn-ticket").addEventListener("click", () => {
      onCreateTicket(room);
    });
  }

  return { renderRoomDetails, stopTimer };
}
