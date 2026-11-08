export function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])
  );
}

export function say(toastEl, message) {
  toastEl.textContent = message;
  toastEl.classList.add("on");
  clearTimeout(say._t);
  say._t = setTimeout(() => toastEl.classList.remove("on"), 2200);
}

export function formatTimer(secs) {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function selectOptions(values, selected, includeBlank) {
  const blank = includeBlank ? '<option value=""></option>' : "";
  const opts = values
    .map((v) => {
      const sel = v === selected ? " selected" : "";
      return `<option value="${v.replace(/"/g, "&quot;")}"${sel}>${v}</option>`;
    })
    .join("");
  return blank + opts;
}
