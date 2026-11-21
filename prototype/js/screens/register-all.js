(function () {
  var M = window.SCM_SCREEN_META;
  var H = window.SCM_SCREEN_HTML;
  var customerNav = [
    ["catalog", "Catalog", "catalog"],
    ["cart", "Cart", "cart"],
    ["orders", "My orders", "orders"],
  ];
  var adminNav = [
    ["dashboard", "Dashboard", "admin-dashboard"],
    ["items", "Items", "admin-items"],
    ["users", "Users", "admin-users"],
  ];
  var whNav = [
    ["orders", "Orders", "warehouse-orders"],
    ["shipments", "Shipments", "warehouse-shipment"],
  ];
  var delNav = [
    ["deliveries", "My deliveries", "deliveries"],
    ["history", "History", "deliveries"],
  ];

  function cn(nav, active, main, opts) {
    return scmAppShell(
      nav.map(function (x) {
        return { id: x[0], label: x[1], goto: x[2] };
      }),
      active,
      main,
      opts
    );
  }

  var ac = "auth-card";
  M.login = { title: "Login", role: "Public", route: "/login" };
  H.login = [
    '<section class="auth-screen">',
    '<section class="' + ac + '">',
    '<section class="auth-logo">SC</section>',
    "<h2>Sign in</h2>",
    '<p class="lead">SCM order fulfillment</p>',
    '<p><label>Email</label><br/><input type="email" value="customer@example.com" /></p>',
    '<p><label>Password</label><br/><input type="password" value="secret" /></p>',
    '<p><button type="button" class="btn btn-primary" data-goto="catalog">Sign in</button></p>',
    '<p><button type="button" class="btn-ghost" data-goto="register">Create account</button></p>',
    "</section>",
    "</section>",
  ].join("");

  M.register = { title: "Register", role: "Public", route: "/register" };
  H.register = [
    '<section class="auth-screen">',
    '<section class="' + ac + '">',
    "<h2>Create account</h2>",
    '<p><label>Name</label><br/><input value="Jane Customer" /></p>',
    '<p><label>Email</label><br/><input type="email" /></p>',
    '<p><label>Password</label><br/><input type="password" /></p>',
    '<p><button type="button" class="btn btn-primary" data-goto="login">Register</button></p>',
    '<p><button type="button" class="btn-ghost" data-goto="login">Sign in</button></p>',
    "</section>",
    "</section>",
  ].join("");

  M.catalog = { title: "Product catalog", role: "Customer", route: "/catalog" };
  H.catalog = cn(customerNav, "catalog", [
    '<header class="page-header"><h2>Shop</h2><p class="subtitle">Browse and add to cart</p>',
    '<button type="button" class="btn btn-secondary" data-goto="cart">View cart</button></header>',
    '<section class="catalog-layout"><section class="filter-panel card"><h3>Filters</h3>',
    '<p><label>Category</label><select><option>All</option></select></p>',
    '<p><label>Sort</label><select><option>Price</option></select></p></section>',
    '<section><section class="product-grid">',
    '<article class="product-card"><section class="thumb">Photo</section><section class="body">',
    '<span class="name">Widget A</span> <span class="badge badge-success">In stock</span>',
    '<span class="price">$29</span></section>',
    '<section class="footer"><button type="button" class="btn btn-primary btn-sm">Add to cart</button></section></article>',
    '<article class="product-card"><section class="thumb">Photo</section><section class="body">',
    '<span class="name">Bolt Kit</span> <span class="badge badge-warning">Low</span>',
    '<span class="price">$12</span></section>',
    '<section class="footer"><button type="button" class="btn btn-primary btn-sm">Add to cart</button></section></article>',
    '<article class="product-card"><section class="thumb">Photo</section><section class="body">',
    '<span class="name">Cable</span> <span class="badge badge-danger">Out</span>',
    '<span class="price">$8</span></section>',
    '<section class="footer"><button type="button" class="btn btn-secondary btn-sm" disabled>Add to cart</button></section></article>',
    "</section></section></section>",
  ].join(""), { cart: true, search: "Search products" });

  M.cart = { title: "Shopping cart", role: "Customer", route: "/cart" };
  H.cart = cn(customerNav, "cart", [
    '<header class="page-header"><h2>Cart</h2><button type="button" class="btn btn-primary" data-goto="checkout">Proceed to checkout</button></header>',
    '<section class="two-col"><section class="card">',
    '<table class="data-table"><thead><tr><th>Item</th><th>Qty</th><th>Total</th></tr></thead>',
    '<tbody><tr><td>Widget A · W-001</td><td><span class="qty-control"><button type="button">-</button><span>2</span><button type="button">+</button></span></td><td>$58</td></tr>',
    '<tr><td>Bolt Kit</td><td>1</td><td>$12</td></tr></tbody></table></section>',
    '<aside class="summary-panel"><h3>Summary</h3>',
    '<p class="summary-row"><span>Subtotal</span><span>$70.00</span></p>',
    '<p class="summary-row"><span>Tax</span><span>$7.00</span></p>',
    '<p class="summary-row total"><span>Total</span><span>$77.00</span></p>',
    '<button type="button" class="btn btn-primary" style="width:100%;margin-top:12px" data-goto="checkout">Checkout</button>',
    "</aside></section>",
  ].join(""), { cart: true, search: "Search products" });

  M.checkout = { title: "Checkout", role: "Customer", route: "/checkout" };
  H.checkout = cn(customerNav, "cart", [
    '<header class="page-header"><h2>Checkout</h2></header>',
    '<section class="split-65"><section class="card"><h3>Shipping</h3>',
    '<p><label>Address</label><br/><input value="123 Main St" style="width:100%" /></p>',
    '<p><label>City / ZIP</label><br/><input value="Springfield 62701" style="width:100%" /></p>',
    '<h3>Payment</h3><p><label><input type="radio" checked /> Cash on delivery</label></p>',
    '</section><aside class="summary-panel"><h3>Order</h3>',
    '<p class="summary-row total"><span>Total</span><span>$77.00</span></p>',
    '<button type="button" class="btn btn-primary" style="width:100%" data-goto="order-detail">Place order</button>',
    '<button type="button" class="btn btn-secondary" style="width:100%;margin-top:8px" data-goto="cart">Back to cart</button>',
    "</aside></section>",
  ].join(""), { cart: true, search: "Search products" });

  M.orders = { title: "My orders", role: "Customer", route: "/orders" };
  H.orders = cn(customerNav, "orders", [
    '<header class="page-header"><h2>My orders</h2></header>',
    '<table class="data-table"><thead><tr><th>Order</th><th>Date</th><th>Status</th><th>Total</th><th></th></tr></thead>',
    '<tbody><tr><td>#1042</td><td>12 Nov 2026</td><td><span class="badge badge-info">Confirmed</span></td><td>$77</td>',
    '<td><button type="button" class="btn btn-ghost btn-sm" data-goto="order-detail">View</button></td></tr>',
    '<tr><td>#1038</td><td>02 Nov 2026</td><td><span class="badge badge-success">Delivered</span></td><td>$44</td>',
    '<td><button type="button" class="btn btn-ghost btn-sm" data-goto="order-detail">View</button></td></tr></tbody></table>',
  ].join(""), { cart: true, search: "Search orders" });

  M["order-detail"] = { title: "Order detail", role: "Customer", route: "/orders/:id" };
  H["order-detail"] = cn(customerNav, "orders", [
    '<header class="page-header"><h2>Order #1042</h2>',
    '<span class="badge badge-info">Confirmed</span>',
    '<button type="button" class="btn btn-danger btn-sm" data-goto="orders">Cancel order</button></header>',
    '<section class="split-65"><section class="card"><h3>Timeline</h3><section class="timeline">',
    '<section class="timeline-step done"><span class="timeline-dot"></span><section class="timeline-body"><strong>Placed</strong><span>12 Nov 10:00 · You</span></section></section>',
    '<section class="timeline-step done current"><span class="timeline-dot"></span><section class="timeline-body"><strong>Confirmed</strong><span>12 Nov 11:30 · Warehouse</span></section></section>',
    '<section class="timeline-step"><span class="timeline-dot"></span><section class="timeline-body"><strong>Packed</strong><span>Pending</span></section></section>',
    '</section></section><aside class="card"><h3>Items</h3><p>Widget A × 2</p><p>Bolt Kit × 1</p>',
    "<h3>Tracking</h3><p>TRK-88421</p></aside></section>",
  ].join(""), { cart: true, search: "Search orders" });

  M["admin-dashboard"] = { title: "Dashboard", role: "Admin", route: "/admin/dashboard" };
  H["admin-dashboard"] = cn(adminNav, "dashboard", [
    '<header class="page-header"><h2>Dashboard</h2><p class="subtitle">Operations overview</p></header>',
    '<section class="grid-4">',
    '<article class="card metric-card"><h3>Orders today</h3><p class="value">24</p></article>',
    '<article class="card metric-card"><h3>Low stock</h3><p class="value">5</p></article>',
    '<article class="card metric-card"><h3>Pending approval</h3><p class="value">8</p></article>',
    '<article class="card metric-card"><h3>Open shipments</h3><p class="value">11</p></article>',
    "</section>",
    '<p><button type="button" class="btn btn-secondary" data-goto="admin-items">Manage items</button> ',
    '<button type="button" class="btn btn-secondary" data-goto="admin-users">Manage users</button></p>',
  ].join(""), { search: "Search admin" });

  M["admin-items"] = { title: "Items", role: "Admin", route: "/admin/items" };
  H["admin-items"] = cn(adminNav, "items", [
    '<header class="page-header"><h2>Items & inventory</h2>',
    '<button type="button" class="btn btn-primary" data-goto="admin-item-form">New item</button></header>',
    '<table class="data-table"><thead><tr><th>Name</th><th>SKU</th><th>On-hand</th><th>Reserved</th><th>Avail.</th><th></th></tr></thead>',
    '<tbody><tr class="row-warning"><td>Widget A</td><td>W-001</td><td>100</td><td>12</td><td>88</td>',
    '<td><button type="button" class="btn btn-ghost btn-sm" data-goto="admin-item-form">Edit</button></td></tr>',
    '<tr><td>Bolt Kit</td><td>B-99</td><td>3</td><td>0</td><td>3</td>',
    '<td><button type="button" class="btn btn-ghost btn-sm" data-goto="admin-item-form">Edit</button></td></tr></tbody></table>',
  ].join(""), { search: "Search SKU" });

  M["admin-item-form"] = { title: "Edit item", role: "Admin", route: "/admin/items/:id/edit" };
  H["admin-item-form"] = cn(adminNav, "items", [
    '<header class="page-header"><h2>Edit item</h2>',
    '<button type="button" class="btn btn-secondary" data-goto="admin-items">Back</button></header>',
    '<section class="card" style="max-width:560px"><p><label>Name</label><br/><input value="Widget A" style="width:100%" /></p>',
    '<p><label>SKU</label><br/><input value="W-001" readonly style="width:100%" /></p>',
    '<p><label>Price</label><br/><input value="29.00" style="width:100%" /></p>',
    '<p>On-hand 100 · Reserved 12 · Available 88</p>',
    '<button type="button" class="btn btn-primary" data-goto="admin-items">Save</button></section>',
  ].join(""), { search: "Search SKU" });

  M["admin-users"] = { title: "Users", role: "Admin", route: "/admin/users" };
  H["admin-users"] = cn(adminNav, "users", [
    '<header class="page-header"><h2>Users</h2></header>',
    '<table class="data-table"><thead><tr><th>Email</th><th>Roles</th><th>Active</th></tr></thead>',
    '<tbody><tr><td>customer@example.com</td><td><span class="badge badge-neutral">Customer</span></td><td>Yes</td></tr>',
    '<tr><td>wh@example.com</td><td><span class="badge badge-info">Warehouse</span></td><td>Yes</td></tr></tbody></table>',
    '<p><button type="button" class="btn btn-secondary" data-goto="admin-dashboard">Dashboard</button></p>',
  ].join(""), { search: "Search users" });

  M["warehouse-orders"] = { title: "Orders queue", role: "Warehouse", route: "/warehouse/orders" };
  H["warehouse-orders"] = cn(whNav, "orders", [
    '<header class="page-header"><h2>Warehouse orders</h2></header>',
    '<nav class="tabs"><button type="button" class="is-active">Pending</button><button type="button">Approved</button></nav>',
    '<table class="data-table"><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th></th></tr></thead>',
    '<tbody><tr><td>#1042</td><td>customer@example.com</td><td>$77</td><td>',
    '<button type="button" class="btn btn-ghost btn-sm" data-goto="warehouse-order-detail">Open</button> ',
    '<button type="button" class="btn btn-primary btn-sm" data-goto="warehouse-shipment">Approve</button></td></tr></tbody></table>',
  ].join(""), { search: "Search orders" });

  M["warehouse-order-detail"] = { title: "Warehouse order", role: "Warehouse", route: "/warehouse/orders/:id" };
  H["warehouse-order-detail"] = cn(whNav, "orders", [
    '<header class="page-header"><h2>Order #1042</h2>',
    '<button type="button" class="btn btn-primary" data-goto="warehouse-shipment">Create shipment</button></header>',
    '<section class="card"><p>Ship to: 123 Main St, Springfield</p><p>2 line items · $77 total</p></section>',
    '<p><button type="button" class="btn btn-secondary" data-goto="warehouse-orders">Back to queue</button></p>',
  ].join(""), { search: "Search orders" });

  M["warehouse-shipment"] = { title: "Shipment", role: "Warehouse", route: "/warehouse/shipments/:id" };
  H["warehouse-shipment"] = cn(whNav, "shipments", [
    '<header class="page-header"><h2>Shipment S-88</h2><span class="badge badge-warning">Packed</span></header>',
    '<section class="card"><p>Order #1042 · Tracking TRK-88421</p>',
    '<p><label>Warehouse</label> <select><option>WH-East</option></select></p>',
    '<p><label>Delivery agent</label> <select><option>Alex Rider</option></select></p>',
    '<p><button type="button" class="btn btn-primary" data-goto="deliveries">Dispatch</button> ',
    '<button type="button" class="btn btn-secondary" data-goto="warehouse-orders">Orders</button></p></section>',
  ].join(""), { search: "Search shipments" });

  M.deliveries = { title: "My deliveries", role: "Delivery", route: "/deliveries" };
  H.deliveries = cn(delNav, "deliveries", [
    '<header class="page-header"><h2>My deliveries</h2></header>',
    '<section class="delivery-card"><section><strong>#1042</strong> · TRK-88421<br/><span class="subtitle">123 Main St</span></section>',
    '<button type="button" class="btn btn-primary btn-sm" data-goto="delivery-detail">Open</button></section>',
    '<section class="delivery-card"><section><strong>#1039</strong> · TRK-77102<br/><span class="subtitle">45 Oak Ave</span></section>',
    '<button type="button" class="btn btn-secondary btn-sm" data-goto="delivery-detail">Open</button></section>',
  ].join(""), { search: "Search tracking" });

  M["delivery-detail"] = { title: "Delivery detail", role: "Delivery", route: "/deliveries/:id" };
  H["delivery-detail"] = cn(delNav, "deliveries", [
    '<header class="page-header"><h2>Delivery #1042</h2><span class="badge badge-info">Dispatched</span></header>',
    '<section class="card"><p>Customer: Jane Customer · COD $77</p><p>123 Main St, Springfield</p>',
    '<section class="sticky-actions">',
    '<button type="button" class="btn btn-secondary">Out for delivery</button>',
    '<button type="button" class="btn btn-primary" data-goto="deliveries">Mark delivered</button>',
    '<button type="button" class="btn btn-danger">Report failed</button>',
    "</section></section>",
  ].join(""), { search: "Search tracking" });
})();