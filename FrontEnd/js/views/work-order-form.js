import { PRIORITIES, CATEGORIES, WO_PLACEHOLDER_IMAGE } from "../mock-data.js";
import { readFileAsDataUrl } from "../utils.js";

export function showWorkOrderForm({
  win,
  scrim,
  room,
  onCloseAll,
  onBackToRoom,
  onSubmit,
  stopTimer,
}) {
  stopTimer();

  const priorityOpts = PRIORITIES.map(
    (p) => `<option value="${p}">${p}</option>`
  ).join("");
  const categoryOpts = CATEGORIES.map(
    (c) => `<option value="${c}">${c}</option>`
  ).join("");

  win.innerHTML = `
    <div class="bar">
      <span id="win-title">SUBMIT WORK ORDER</span>
      <button type="button" aria-label="Close" id="modal-close">✕</button>
    </div>
    <div class="body wo-form-body">
      <h2 class="wo">Create Work Order for: Room ${room.number}</h2>
      <label for="wo-requestor">Requestor</label>
      <input class="f" id="wo-requestor" name="requestor" autocomplete="name">
      <label for="wo-priority">Priority</label>
      <select class="f" id="wo-priority" name="priority">
        <option value=""></option>
        ${priorityOpts}
      </select>
      <label for="wo-category">Category</label>
      <select class="f" id="wo-category" name="category">
        <option value=""></option>
        ${categoryOpts}
      </select>
      <label for="wo-details">Add Details:</label>
      <textarea class="f" id="wo-details" name="details"></textarea>
      <div class="file-row">
        <input type="file" id="wo-file" accept="image/*" aria-label="Choose photo">
        <p class="file-name" id="wo-file-name"></p>
      </div>
      <p class="hint err" id="wo-err" role="alert"></p>
      <div class="acts">
        <button type="button" class="btn grey" id="wo-cancel">Cancel</button>
        <button type="button" class="btn sm" id="wo-submit">Submit</button>
      </div>
    </div>`;

  scrim.classList.add("on");
  win.querySelector("#modal-close").focus();

  const err = win.querySelector("#wo-err");
  const fileInput = win.querySelector("#wo-file");
  const fileNameEl = win.querySelector("#wo-file-name");

  fileInput.addEventListener("change", () => {
    const f = fileInput.files[0];
    fileNameEl.textContent = f ? `Selected: ${f.name}` : "";
  });

  win.querySelector("#modal-close").addEventListener("click", onCloseAll);
  win.querySelector("#wo-cancel").addEventListener("click", () =>
    onBackToRoom(room.number)
  );

  win.querySelector("#wo-submit").addEventListener("click", async () => {
    const requestor = win.querySelector("#wo-requestor").value.trim();
    const priority = win.querySelector("#wo-priority").value;
    const category = win.querySelector("#wo-category").value;
    const description = win.querySelector("#wo-details").value.trim();

    const missing = [];
    if (!requestor) missing.push("Requestor");
    if (!priority) missing.push("Priority");
    if (!category) missing.push("Category");
    if (missing.length) {
      err.textContent = `Please complete: ${missing.join(", ")}`;
      return;
    }
    err.textContent = "";

    let imageUrl = WO_PLACEHOLDER_IMAGE;
    const file = fileInput.files[0];
    if (file && file.type.startsWith("image/")) {
      imageUrl = await readFileAsDataUrl(file);
    }

    const order = {
      id: `wo-${Date.now()}`,
      roomNumber: room.number,
      createdAt: new Date().toISOString(),
      requester: requestor,
      priority,
      category,
      description: description || `${category} issue reported from housekeeping`,
      status: "Open",
      imageUrl,
    };

    room.comments.push(`Work order: ${category} (${priority})`);
    if (!room.displayComment || room.displayComment === "N/A") {
      room.displayComment = room.comments[room.comments.length - 1];
    }

    onSubmit(order, room);
  });
}
