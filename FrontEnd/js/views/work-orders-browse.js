import { formatWorkOrderDate } from "../mock-data.js";
import { esc } from "../utils.js";

export function renderWorkOrdersBrowse(main, workOrders, onOpenOrder) {
  const sorted = [...workOrders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  const cards =
    sorted.length === 0
      ? '<p class="wo-empty">No work orders yet.</p>'
      : `<div class="wo-grid">${sorted.map(renderCard).join("")}</div>`;

  main.innerHTML = `
    <div class="wo-header">
      <h2 class="page-title">Work Orders</h2>
    </div>
    ${cards}`;

  main.querySelectorAll(".wo-card-img").forEach((img) => {
    img.addEventListener("error", () => {
      img.classList.add("placeholder");
      img.removeAttribute("src");
    });
  });

  main.querySelectorAll(".wo-card").forEach((card) => {
    card.addEventListener("click", () => onOpenOrder(card.dataset.id));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onOpenOrder(card.dataset.id);
      }
    });
  });
}

function renderCard(wo) {
  const src = wo.imageUrl ? String(wo.imageUrl).replace(/"/g, "&quot;") : "";
  const img = src
    ? `<img class="wo-card-img" src="${src}" alt="">`
    : '<div class="wo-card-img placeholder" role="img" aria-label="No photo">No photo</div>';

  return `
    <button type="button" class="wo-card" data-id="${esc(wo.id)}" aria-label="Edit work order for room ${wo.roomNumber}">
      ${img}
      <div class="wo-card-body">
        <p><strong>Room:</strong> Room #${wo.roomNumber}</p>
        <p><strong>Date:</strong> ${esc(formatWorkOrderDate(wo.createdAt))}</p>
        <p><strong>Requester:</strong> ${esc(wo.requester)}</p>
        <p><strong>Priority:</strong> ${esc(wo.priority)}</p>
        <p><strong>Category:</strong> ${esc(wo.category)}</p>
        <p><strong>Description:</strong> ${esc(wo.description)}</p>
        <p><strong>Status:</strong> ${esc(wo.status)}</p>
      </div>
    </button>`;
}
