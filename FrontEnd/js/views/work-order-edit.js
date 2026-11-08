import {
  PRIORITIES,
  CATEGORIES,
  WO_STATUSES,
  WO_PLACEHOLDER_IMAGE,
  formatWorkOrderDate,
} from "../mock-data.js";
import { esc, readFileAsDataUrl, selectOptions } from "../utils.js";

export function showWorkOrderEdit({
  win,
  scrim,
  order,
  onClose,
  onSave,
}) {
  win.innerHTML = `
    <div class="bar">
      <span id="win-title">EDIT WORK ORDER</span>
      <button type="button" aria-label="Close" id="modal-close">✕</button>
    </div>
    <div class="body wo-form-body">
      <h2 class="wo">Work Order — Room ${esc(order.roomNumber)}</h2>
      <p class="hint wo-meta">Created: ${esc(formatWorkOrderDate(order.createdAt))}</p>
      <label for="wo-edit-room">Room number</label>
      <input class="f" id="wo-edit-room" type="number" min="100" max="999" value="${order.roomNumber}">
      <label for="wo-edit-requestor">Requestor</label>
      <input class="f" id="wo-edit-requestor" autocomplete="name" value="${esc(order.requester)}">
      <label for="wo-edit-priority">Priority</label>
      <select class="f" id="wo-edit-priority">${selectOptions(PRIORITIES, order.priority, false)}</select>
      <label for="wo-edit-category">Category</label>
      <select class="f" id="wo-edit-category">${selectOptions(CATEGORIES, order.category, false)}</select>
      <label for="wo-edit-status">Status</label>
      <select class="f" id="wo-edit-status">${selectOptions(WO_STATUSES, order.status, false)}</select>
      <label for="wo-edit-details">Description</label>
      <textarea class="f" id="wo-edit-details">${esc(order.description)}</textarea>
      <div class="file-row">
        <label for="wo-edit-file" class="file-label">Replace photo (optional)</label>
        <input type="file" id="wo-edit-file" accept="image/*" aria-label="Choose photo">
        <p class="file-name" id="wo-edit-file-name"></p>
      </div>
      <p class="hint err" id="wo-edit-err" role="alert"></p>
      <div class="acts">
        <button type="button" class="btn grey" id="wo-edit-cancel">Cancel</button>
        <button type="button" class="btn sm" id="wo-edit-save">Save</button>
      </div>
    </div>`;

  scrim.classList.add("on");
  win.querySelector("#modal-close").focus();

  const err = win.querySelector("#wo-edit-err");
  const fileInput = win.querySelector("#wo-edit-file");
  const fileNameEl = win.querySelector("#wo-edit-file-name");
  let imageUrl = order.imageUrl || WO_PLACEHOLDER_IMAGE;

  fileInput.addEventListener("change", () => {
    const f = fileInput.files[0];
    fileNameEl.textContent = f ? `Selected: ${f.name}` : "";
  });

  const close = () => onClose();
  win.querySelector("#modal-close").addEventListener("click", close);
  win.querySelector("#wo-edit-cancel").addEventListener("click", close);

  win.querySelector("#wo-edit-save").addEventListener("click", async () => {
    const roomRaw = win.querySelector("#wo-edit-room").value.trim();
    const roomNumber = Number(roomRaw);
    const requester = win.querySelector("#wo-edit-requestor").value.trim();
    const priority = win.querySelector("#wo-edit-priority").value;
    const category = win.querySelector("#wo-edit-category").value;
    const status = win.querySelector("#wo-edit-status").value;
    const description = win.querySelector("#wo-edit-details").value.trim();

    const missing = [];
    if (!roomRaw || !Number.isFinite(roomNumber)) missing.push("Room number");
    if (!requester) missing.push("Requestor");
    if (!priority) missing.push("Priority");
    if (!category) missing.push("Category");
    if (!status) missing.push("Status");
    if (missing.length) {
      err.textContent = `Please complete: ${missing.join(", ")}`;
      return;
    }
    err.textContent = "";

    const file = fileInput.files[0];
    if (file && file.type.startsWith("image/")) {
      imageUrl = await readFileAsDataUrl(file);
    }

    onSave({
      ...order,
      roomNumber,
      requester,
      priority,
      category,
      status,
      description: description || order.description,
      imageUrl,
    });
  });
}
