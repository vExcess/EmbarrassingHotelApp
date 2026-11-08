import { REVIEW } from "../mock-data.js";
import { esc } from "../utils.js";

export function renderHousekeepingHome(main, rooms, onOpenRoom, onStubMenu) {
  const rows = rooms
    .map((r) => {
      let commentHtml = "";
      if (r.displayComment) {
        if (r.displayComment === REVIEW) {
          commentHtml = `Comments: <i>${esc(r.displayComment)}</i>`;
        } else {
          commentHtml = `Comments: ${esc(r.displayComment)}`;
        }
      }
      return `<button type="button" class="row ${r.status}" data-n="${r.number}">
        <span>Room ${r.number}</span>
        <span class="comment-cell">${commentHtml}</span>
      </button>`;
    })
    .join("");

  main.innerHTML = `
    <div class="hk" id="hk">
      <button type="button" aria-haspopup="true" aria-expanded="false">
        Housekeeping Home
        <svg width="28" height="12" viewBox="0 0 34 16" aria-hidden="true"><path d="M0 0h34L17 16z" fill="currentColor"/></svg>
      </button>
      <ul>
        <li data-action="home">Housekeeping Home</li>
        <li data-action="stub">Cleaning Schedule</li>
        <li data-action="stub">Completed Rooms</li>
      </ul>
    </div>
    <div class="tbl">
      <div class="head"><span>Assigned Rooms</span><span>Comments</span></div>
      <div class="list">${rows}</div>
    </div>`;

  const hk = main.querySelector("#hk");
  const toggle = hk.querySelector("button");
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const open = hk.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open ? "true" : "false");
  });

  hk.querySelectorAll("li").forEach((li) => {
    li.addEventListener("click", () => {
      hk.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      const text = li.textContent.trim();
      if (li.dataset.action === "stub") {
        onStubMenu(text);
      }
    });
  });

  main.querySelectorAll(".row").forEach((btn) => {
    btn.addEventListener("click", () => onOpenRoom(Number(btn.dataset.n)));
  });
}
