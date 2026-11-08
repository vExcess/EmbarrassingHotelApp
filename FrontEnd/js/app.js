import { getInitialRooms, getSeedWorkOrders } from "./mock-data.js";
import { loadState, saveState } from "./state.js";
import { say } from "./utils.js";
import { renderHousekeepingHome } from "./views/housekeeping.js";
import { createRoomDetailsController } from "./views/room-details.js";
import { showWorkOrderForm } from "./views/work-order-form.js";
import { renderWorkOrdersBrowse } from "./views/work-orders-browse.js";
import { showWorkOrderEdit } from "./views/work-order-edit.js";

const main = document.getElementById("main");
const rail = document.getElementById("rail");
const scrim = document.getElementById("scrim");
const win = document.getElementById("win");
const toast = document.getElementById("toast");

const stored = loadState();
let rooms = stored?.rooms ?? getInitialRooms();
let workOrders = stored?.workOrders ?? getSeedWorkOrders();
let tab = "H";
let openRoom = null;

const timerState = { timer: null, secs: 0, lastRoom: null };

function persist() {
  saveState(rooms, workOrders);
}

function onToast(message) {
  say(toast, message);
}

function renderMain() {
  if (tab === "H") {
    renderHousekeepingHome(
      main,
      rooms,
      (n) => roomDetails.renderRoomDetails(n),
      (label) => onToast(`${label} is not part of this prototype`)
    );
  } else if (tab === "M") {
    renderWorkOrdersBrowse(main, workOrders, openWorkOrderEditor);
  } else {
    const titles = {
      F: "Front Desk Home",
      I: "Inventory Home",
    };
    main.innerHTML = `
      <p class="page-title">${titles[tab] ?? "Section"}</p>
      <p class="empty">This section is not part of the prototype yet. Choose H for Housekeeping or M for Work Orders.</p>`;
  }
}

function closeModal() {
  roomDetails.stopTimer();
  scrim.classList.remove("on");
  win.innerHTML = "";
  openRoom = null;
  renderMain();
}

function openWorkOrderEditor(id) {
  const order = workOrders.find((wo) => wo.id === id);
  if (!order) return;
  showWorkOrderEdit({
    win,
    scrim,
    order,
    onClose: closeModal,
    onSave: (updated) => {
      const i = workOrders.findIndex((wo) => wo.id === updated.id);
      if (i >= 0) workOrders[i] = updated;
      persist();
      onToast("Work order saved");
      closeModal();
    },
  });
}

const roomDetails = createRoomDetailsController({
  win,
  scrim,
  getRooms: () => rooms,
  setOpenRoom: (r) => {
    openRoom = r;
  },
  getTimerState: () => timerState,
  onRefreshMain: renderMain,
  onToast,
  onPersist: persist,
  onClose: closeModal,
  onCreateTicket: (room) => {
    openRoom = room;
    showWorkOrderForm({
      win,
      scrim,
      room,
      stopTimer: () => roomDetails.stopTimer(),
      onCloseAll: closeModal,
      onBackToRoom: (n) => roomDetails.renderRoomDetails(n),
      onSubmit: (order, roomAfter) => {
        workOrders.unshift(order);
        const r = rooms.find((x) => x.number === roomAfter.number);
        if (r) {
          r.comments = [...roomAfter.comments];
          r.displayComment = roomAfter.displayComment;
        }
        persist();
        onToast(`Work order submitted for Room ${room.number}`);
        roomDetails.renderRoomDetails(room.number);
        renderMain();
      },
    });
  },
});

rail.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  tab = btn.dataset.t;
  rail.querySelectorAll("button").forEach((x) => {
    x.classList.toggle("on", x === btn);
  });
  if (!scrim.classList.contains("on")) {
    renderMain();
  }
});

document.addEventListener("click", (e) => {
  document.querySelectorAll(".open").forEach((o) => {
    if (!o.contains(e.target)) o.classList.remove("open");
  });
});

document.getElementById("user").addEventListener("click", () => {
  onToast("Signed in as User");
});

scrim.addEventListener("click", (e) => {
  if (e.target === scrim) closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && scrim.classList.contains("on")) {
    closeModal();
  }
});

renderMain();
