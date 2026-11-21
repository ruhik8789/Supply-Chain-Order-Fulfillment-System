(function () {
  const canvas = document.getElementById("present-canvas");
  if (!canvas || !window.SCM_SCREEN_HTML) return;

  Object.keys(window.SCM_SCREEN_HTML).forEach((id) => {
    const meta = window.SCM_SCREEN_META[id];
    const wrap = document.createElement("div");
    wrap.className = "artboard-wrap";
    wrap.dataset.screen = id;
    wrap.innerHTML =
      `<div class="artboard-label">` +
      `<strong>${meta.title}</strong>` +
      `<span class="chip">${meta.role}</span>` +
      `<span>/ ${meta.route}</span>` +
      `</div>` +
      `<div class="artboard">` +
      window.SCM_SCREEN_HTML[id] +
      `</div>`;
    canvas.appendChild(wrap);
  });

  document.dispatchEvent(new CustomEvent("scm-screens-rendered"));
})();