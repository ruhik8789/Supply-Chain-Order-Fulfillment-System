window.SCM_SCREEN_META = window.SCM_SCREEN_META || {};
window.SCM_SCREEN_HTML = window.SCM_SCREEN_HTML || {};

function scmNav(items, active) {
  return items
    .map(
      (it) =>
        `<button type="button" class="nav-item${it.id === active ? " is-active" : ""}" data-goto="${it.goto}">${it.label}</button>`
    )
    .join("");
}

function scmTopbar(opts) {
  const cart = opts.cart
    ? `<a class="cart-pill hotspot" href="#" data-goto="cart">Cart <span class="badge">3</span></a>`
    : "";
  return (
    `<header class="topbar">` +
    `<div class="logo-mark">SC</div>` +
    `<span class="logo-text">SCM Fulfillment</span>` +
    `<div class="topbar-search"><input type="search" placeholder="${opts.search || "Search"}" /></div>` +
    `<div class="topbar-actions">` +
    cart +
    `<button type="button" class="avatar" aria-label="Profile">JK</button>` +
    `</div></header>`
  );
}

function scmAppShell(navItems, activeNav, mainHtml, topOpts) {
  return (
    `<div class="app-chrome">` +
    scmTopbar(topOpts || {}) +
    `<div class="app-body">` +
    `<aside class="sidenav">` +
    scmNav(navItems, activeNav) +
    `</aside>` +
    `<div class="main-content">` +
    mainHtml +
    `</div></div></div>`
  );
}