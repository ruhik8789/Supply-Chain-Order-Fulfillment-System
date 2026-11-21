(function () {
  const SCREENS = [
    { id: "login", group: "Public", title: "Login", role: "Public" },
    { id: "register", group: "Public", title: "Register", role: "Public" },
    { id: "catalog", group: "Customer", title: "Product catalog", role: "Customer" },
    { id: "cart", group: "Customer", title: "Shopping cart", role: "Customer" },
    { id: "checkout", group: "Customer", title: "Checkout", role: "Customer" },
    { id: "orders", group: "Customer", title: "My orders", role: "Customer" },
    { id: "order-detail", group: "Customer", title: "Order detail", role: "Customer" },
    { id: "admin-dashboard", group: "Admin", title: "Dashboard", role: "Admin" },
    { id: "admin-items", group: "Admin", title: "Items & inventory", role: "Admin" },
    { id: "admin-item-form", group: "Admin", title: "Edit item", role: "Admin" },
    { id: "admin-users", group: "Admin", title: "Users", role: "Admin" },
    { id: "warehouse-orders", group: "Warehouse", title: "Orders queue", role: "Warehouse" },
    { id: "warehouse-order-detail", group: "Warehouse", title: "Order (warehouse)", role: "Warehouse" },
    { id: "warehouse-shipment", group: "Warehouse", title: "Shipment detail", role: "Warehouse" },
    { id: "deliveries", group: "Delivery", title: "My deliveries", role: "Delivery" },
    { id: "delivery-detail", group: "Delivery", title: "Delivery detail", role: "Delivery" },
  ];

  const HOTSPOTS = {
    login: { "Sign in": "catalog", "Create account": "register", logo: "catalog" },
    register: { Register: "login", "Sign in": "login" },
    catalog: { cart: "cart", Checkout: "checkout", Orders: "orders" },
    cart: { Checkout: "checkout", Catalog: "catalog", "Proceed to checkout": "checkout" },
    checkout: { "Place order": "order-detail", Cart: "cart" },
    orders: { View: "order-detail", Catalog: "catalog" },
    "order-detail": { Orders: "orders", Cancel: "orders" },
    "admin-dashboard": { Items: "admin-items", Users: "admin-users" },
    "admin-items": { "New item": "admin-item-form", Edit: "admin-item-form" },
    "admin-item-form": { Items: "admin-items", Save: "admin-items" },
    "admin-users": { Dashboard: "admin-dashboard" },
    "warehouse-orders": { Open: "warehouse-order-detail", Approve: "warehouse-shipment" },
    "warehouse-order-detail": { "Create shipment": "warehouse-shipment", Orders: "warehouse-orders" },
    "warehouse-shipment": { Dispatch: "deliveries", Shipments: "warehouse-orders" },
    deliveries: { Open: "delivery-detail" },
    "delivery-detail": { Delivered: "deliveries", Deliveries: "deliveries" },
  };

  let mode = "preview";
  let activeId = "login";
  let zoom = 0.85;

  const sidebarList = document.getElementById("screen-list");
  const canvas = document.getElementById("present-canvas");
  const titleEl = document.getElementById("toolbar-title");
  const zoomRange = document.getElementById("zoom-range");
  const zoomLabel = document.getElementById("zoom-label");
  const btnGrid = document.getElementById("mode-grid");
  const btnPreview = document.getElementById("mode-preview");

  function groupScreens() {
    const groups = {};
    SCREENS.forEach((s) => {
      if (!groups[s.group]) groups[s.group] = [];
      groups[s.group].push(s);
    });
    return groups;
  }

  function buildSidebar() {
    sidebarList.innerHTML = "";
    const groups = groupScreens();
    Object.keys(groups).forEach((name) => {
      const section = document.createElement("div");
      section.className = "flow-group";
      section.innerHTML = `<div class="flow-group-title">${name}</div>`;
      const ul = document.createElement("ul");
      ul.className = "flow-list";
      groups[name].forEach((s) => {
        const li = document.createElement("li");
        const btn = document.createElement("button");
        btn.type = "button";
        btn.textContent = s.title;
        btn.dataset.screen = s.id;
        btn.addEventListener("click", () => goTo(s.id));
        li.appendChild(btn);
        ul.appendChild(li);
      });
      section.appendChild(ul);
      sidebarList.appendChild(section);
    });
  }

  function goTo(id) {
    if (!SCREENS.find((s) => s.id === id)) return;
    activeId = id;
    updateUI();
  }

  function setMode(next) {
    mode = next;
    btnGrid.classList.toggle("is-active", mode === "grid");
    btnPreview.classList.toggle("is-active", mode === "preview");
    canvas.classList.toggle("is-grid", mode === "grid");
    canvas.classList.toggle("is-preview", mode === "preview");
    updateUI();
  }

  function applyZoom() {
    document.querySelectorAll(".artboard").forEach((el) => {
      el.style.transform = `scale(${zoom})`;
    });
    zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
  }

  function updateSidebarActive() {
    sidebarList.querySelectorAll("button").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.screen === activeId);
    });
  }

  function updateFrames() {
    const screen = SCREENS.find((s) => s.id === activeId);
    titleEl.textContent = screen ? `${screen.title} · ${screen.role}` : "";

  document.querySelectorAll(".artboard-wrap").forEach((wrap) => {
      const id = wrap.dataset.screen;
      if (mode === "preview") {
        wrap.classList.toggle("is-hidden", id !== activeId);
      } else {
        wrap.classList.remove("is-hidden");
      }
    });

    updateSidebarActive();
    applyZoom();
    bindHotspots();
  }

  function updateUI() {
    updateFrames();
  }

  function bindHotspots() {
    document.querySelectorAll("[data-goto]").forEach((el) => {
      if (el.dataset.bound) return;
      el.dataset.bound = "1";
      el.addEventListener("click", (e) => {
        e.preventDefault();
        goTo(el.dataset.goto);
      });
    });
  }

  btnGrid.addEventListener("click", () => setMode("grid"));
  btnPreview.addEventListener("click", () => setMode("preview"));

  zoomRange.addEventListener("input", () => {
    zoom = Number(zoomRange.value) / 100;
    applyZoom();
  });

  document.addEventListener("keydown", (e) => {
    const idx = SCREENS.findIndex((s) => s.id === activeId);
    if (e.key === "ArrowRight" && idx < SCREENS.length - 1) {
      goTo(SCREENS[idx + 1].id);
    }
    if (e.key === "ArrowLeft" && idx > 0) {
      goTo(SCREENS[idx - 1].id);
    }
  });

  function init() {
    buildSidebar();
    setMode("preview");
    goTo("login");
  }

  if (document.getElementById("present-canvas")?.children.length) {
    init();
  } else {
    document.addEventListener("scm-screens-rendered", init, { once: true });
  }

  window.scmGoTo = goTo;
})();