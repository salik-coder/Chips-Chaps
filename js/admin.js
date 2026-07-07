/* =========================================================
   Admin dashboard — product CRUD, orders, customers, charts
   All data persisted to localStorage (cc_menu / cc_orders)
   ========================================================= */

function getOrders(){
  try{ return JSON.parse(localStorage.getItem("cc_orders")) || []; }catch(e){ return []; }
}
function saveOrders(orders){ localStorage.setItem("cc_orders", JSON.stringify(orders)); }

const Admin = {
  currentEditId:null,

  async init(){
    this.initTabs();
    await this.renderStats();
    this.renderChart();
    await this.renderDonut();
    this.renderRecentOrders();
    await this.renderProductsTable();
    this.renderOrdersTable();
    this.renderCustomersTable();
    this.bindModal();
    this.bindProductForm();
    await this.renderMessagesTable();
  },

  initTabs(){
    const links = document.querySelectorAll("[data-admin-tab]");
    const panels = document.querySelectorAll("[data-admin-panel]");
    links.forEach(link=>{
      link.addEventListener("click", (e)=>{
        e.preventDefault();
        links.forEach(l=>l.classList.remove("active"));
        link.classList.add("active");
        const target = link.dataset.adminTab;
        panels.forEach(p=> p.classList.toggle("hidden", p.dataset.adminPanel !== target));
        document.querySelector("[data-panel-title]").textContent = link.textContent.trim();
      });
    });
  },

  async renderStats(){
    const menu = await getMenu();
    const orders = getOrders();
    const revenue = orders.reduce((s,o)=>s+o.total,0);
    const customers = new Set(orders.map(o=>o.customer?.email).filter(Boolean)).size;
    const host = document.querySelector("[data-stat-cards]");
    if(!host) return;
    const cards = [
      { icon:"💰", bg:"rgba(255,176,0,.18)", label:"Total Revenue", val:`$${revenue.toFixed(2)}`, delta:"+ live", up:true },
      { icon:"🧾", bg:"rgba(230,57,70,.14)", label:"Total Orders", val:orders.length, delta:"+ live", up:true },
      { icon:"🍔", bg:"rgba(60,179,113,.16)", label:"Menu Items", val:menu.length, delta:`${menu.filter(m=>m.available).length} active`, up:true },
      { icon:"👥", bg:"rgba(10,78,163,.14)", label:"Customers", val:customers, delta:"unique", up:true },
    ];
    host.innerHTML = cards.map(c=>`
      <div class="stat-card">
        <div class="sc-top">
          <div class="sc-icon" style="background:${c.bg}">${c.icon}</div>
          <span class="sc-delta ${c.up?'up':'down'}">${c.delta}</span>
        </div>
        <div class="sc-num">${c.val}</div>
        <div class="sc-label">${c.label}</div>
      </div>
    `).join("");
  },

  renderChart(){
    const host = document.querySelector("[data-bar-chart]");
    if(!host) return;
    const orders = getOrders();
    const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
    // Derive pseudo-weekly sales from order totals (deterministic fallback demo data if empty)
    const base = [30,45,38,52,60,75,50];
    const totals = days.map((d,i)=> base[i] + orders.filter((_,oi)=> oi % 7 === i).reduce((s,o)=>s+o.total,0));
    const max = Math.max(...totals, 1);
    host.innerHTML = totals.map((v,i)=>`
      <div class="bar-col">
        <div class="bar" style="height:${(v/max*100).toFixed(0)}%"></div>
        <div class="bar-lbl">${days[i]}</div>
      </div>
    `).join("");
  },

  async renderDonut(){
    const host = document.querySelector("[data-donut]");
    if(!host) return;
    const menu = await getMenu();
    const counts = {};
    menu.forEach(m=> counts[m.cat] = (counts[m.cat]||0) + 1);
    const colors = ["#FFB000","#E63946","#2E251C","#3CB371","#0A4EA3","#FF7A30","#8E1F29"];
    const entries = Object.entries(counts);
    const total = menu.length;
    let acc = 0;
    const stops = entries.map(([cat,n],i)=>{
      const start = acc/total*360; acc += n;
      const end = acc/total*360;
      return `${colors[i%colors.length]} ${start}deg ${end}deg`;
    }).join(", ");
    host.innerHTML = `
      <div style="width:120px;height:120px;border-radius:50%;background:conic-gradient(${stops}); flex-shrink:0;"></div>
      <div>
        ${entries.map(([cat,n],i)=>`
          <div class="legend-row"><span class="legend-dot" style="background:${colors[i%colors.length]}"></span> ${cat} (${n})</div>
        `).join("")}
      </div>
    `;
  },

  renderRecentOrders(){
    const host = document.querySelector("[data-recent-orders]");
    if(!host) return;
    const orders = getOrders().slice(0,5);
    if(orders.length === 0){
      host.innerHTML = `<p>No orders yet. Orders placed at checkout will show here.</p>`;
      return;
    }
    host.innerHTML = `
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th></tr></thead>
        <tbody>
          ${orders.map(o=>`
            <tr>
              <td>#${o.id}</td>
              <td>${o.customer?.name || "Guest"}</td>
              <td>$${o.total.toFixed(2)}</td>
              <td><span class="status-chip ${o.status}">${o.status}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table></div>
    `;
  },

  async renderProductsTable() {
    const host = document.querySelector("[data-products-table]");
    if (!host) return;
    
    const menu = await getMenu();  // ✅ await lagaya
    
    host.innerHTML = `
        <div class="table-wrap"><table class="data-table">
            <thead><tr>
                <th>Item</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
            </tr></thead>
            <tbody>
                ${menu.map(m => `
                    <tr>
                        <td style="font-size:1.4rem;">${m.emoji}</td>
                        <td><b>${m.name}</b></td>
                        <td style="text-transform:capitalize;">${m.cat}</td>
                        <td>$${m.price.toFixed(2)}</td>
                        <td>★ ${m.rating}</td>
                        <td><span class="status-chip ${m.available ? 'done' : 'out'}">${m.available ? 'Active' : 'Out'}</span></td>
                        <td class="row-actions">
                            <button class="icon-action" data-edit-product="${m.id}" title="Edit">✏️</button>
                            <button class="icon-action" data-delete-product="${m.id}" title="Delete">🗑️</button>
                        </td>
                    </tr>
                `).join("")}
            </tbody>
        </table></div>
    `;
    
    // ✅ Event listeners - Edit button
    host.querySelectorAll("[data-edit-product]").forEach(b => {
        b.addEventListener("click", () => {
            const id = b.dataset.editProduct;
            console.log("Edit clicked for:", id);  // Debug
            this.openModal(id);
        });
    });
    
    // ✅ Event listeners - Delete button
    host.querySelectorAll("[data-delete-product]").forEach(b => {
        b.addEventListener("click", async () => {
            const id = b.dataset.deleteProduct;
            console.log("Delete clicked for:", id);  // Debug
            
            if (!confirm("Delete this product?")) return;
            
            const menu = await getMenu();  // ✅ await lagaya
            const updatedMenu = menu.filter(m => m.id !== id);
            await saveMenu(updatedMenu);   // ✅ await lagaya
            
            Toast.show("Product deleted", "success");
            
            // ✅ Re-render karein
            await this.renderProductsTable();
            await this.renderStats();
            await this.renderDonut();
        });
    });
},

  renderOrdersTable(){
    const host = document.querySelector("[data-orders-table]");
    if(!host) return;
    const orders = getOrders();
    if(orders.length === 0){
      host.innerHTML = `<p>No orders placed yet.</p>`;
      return;
    }
    host.innerHTML = `
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr></thead>
        <tbody>
          ${orders.map(o=>`
            <tr>
              <td>#${o.id}</td>
              <td>${o.customer?.name || "Guest"}<br><small style="color:var(--text-soft);">${o.customer?.phone || ""}</small></td>
              <td>${o.items.reduce((s,i)=>s+i.qty,0)} items</td>
              <td>$${o.total.toFixed(2)}</td>
              <td>
                <select class="sort-select" style="padding:6px 10px; font-size:.78rem;" data-order-status="${o.id}">
                  ${["pending","preparing","out","done"].map(s=>`<option value="${s}" ${o.status===s?"selected":""}>${s}</option>`).join("")}
                </select>
              </td>
            </tr>
          `).join("")}
        </tbody>
      </table></div>
    `;
    host.querySelectorAll("[data-order-status]").forEach(sel=>{
      sel.addEventListener("change", ()=>{
        const orders = getOrders();
        const o = orders.find(o=>o.id === sel.dataset.orderStatus);
        if(o){ o.status = sel.value; saveOrders(orders); Toast.show("Order status updated","success"); this.renderRecentOrders(); }
      });
    });
  },

  renderCustomersTable(){
    const host = document.querySelector("[data-customers-table]");
    if(!host) return;
    const orders = getOrders();
    const map = {};
    orders.forEach(o=>{
      const key = o.customer?.email || o.customer?.name || "guest";
      if(!map[key]) map[key] = { ...o.customer, orders:0, spent:0 };
      map[key].orders += 1;
      map[key].spent += o.total;
    });
    const list = Object.values(map);
    if(list.length === 0){ host.innerHTML = `<p>No customers yet — they'll appear after checkout.</p>`; return; }
    host.innerHTML = `
      <div class="table-wrap"><table class="data-table">
        <thead><tr><th>Name</th><th>Email</th><th>City</th><th>Orders</th><th>Total Spent</th></tr></thead>
        <tbody>
          ${list.map(c=>`
            <tr><td><b>${c.name||"Guest"}</b></td><td>${c.email||"-"}</td><td>${c.city||"-"}</td><td>${c.orders}</td><td>$${c.spent.toFixed(2)}</td></tr>
          `).join("")}
        </tbody>
      </table></div>
    `;
  },

  // ✅ Messages load karein
async renderMessagesTable() {
    const host = document.getElementById("messages-table-body");
    if (!host) return;
    
    try {
        const response = await fetch("http://localhost:5000/api/contact");
        const messages = await response.json();
        
        if (messages.length === 0) {
            host.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px;">📭 No messages yet.</td></tr>`;
            return;
        }
        
        host.innerHTML = messages.map(m => `
            <tr>
                <td style="font-size:0.85rem;">${new Date(m.createdAt).toLocaleString()}</td>
                <td><b>${m.name}</b></td>
                <td style="font-size:0.85rem;">${m.email}</td>
                <td>${m.subject}</td>
                <td style="max-width:150px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${m.message}">${m.message}</td>
                <td>
                    <span class="status-chip ${m.read ? 'done' : 'pending'}">
                        ${m.read ? '✅ Read' : '📩 New'}
                    </span>
                </td>
                <td class="row-actions">
                    <button class="icon-action" data-view-message="${m._id}" title="View Full Message">👁️</button>
                    <button class="icon-action" data-delete-message="${m._id}" title="Delete">🗑️</button>
                </td>
            </tr>
        `).join("");
        
        // ✅ View message - Mark as read + show full message
        host.querySelectorAll("[data-view-message]").forEach(btn => {
            btn.addEventListener("click", async () => {
                const id = btn.dataset.viewMessage;
                
                // Mark as read
                await fetch(`http://localhost:5000/api/contact/${id}/read`, {
                    method: "PUT"
                });
                
                // Get full message
                const res = await fetch(`http://localhost:5000/api/contact/${id}`);
                const msg = await res.json();
                
                // Show full message in alert
                alert(`📩 Message from: ${msg.name}\n📧 Email: ${msg.email}\n📌 Subject: ${msg.subject}\n\n💬 Message:\n${msg.message}\n\n📅 ${new Date(msg.createdAt).toLocaleString()}`);
                
                Toast.show("Message marked as read", "success");
                await this.renderMessagesTable();
            });
        });
        
        // ✅ Delete message
        host.querySelectorAll("[data-delete-message]").forEach(btn => {
            btn.addEventListener("click", async () => {
                if (!confirm("Delete this message?")) return;
                const id = btn.dataset.deleteMessage;
                await fetch(`http://localhost:5000/api/contact/${id}`, {
                    method: "DELETE"
                });
                Toast.show("Message deleted", "success");
                await this.renderMessagesTable();
            });
        });
        
    } catch (error) {
        console.error("Error loading messages:", error);
        host.innerHTML = `<tr><td colspan="7" style="text-align:center; color:red;">❌ Error loading messages</td></tr>`;
    }
},

  async openModal(id) {  // ✅ async add kiya
    const modal = document.querySelector("[data-product-modal]");
    const form = document.querySelector("[data-product-form]");
    this.currentEditId = id || null;
    
    if (id) {
        const menu = await getMenu();  // ✅ await lagaya
        const item = menu.find(m => m.id === id);
        if (!item) {
            Toast.show("Product not found!", "error");
            return;
        }
        
        modal.querySelector("[data-modal-title]").textContent = "Edit Product";
        form.name.value = item.name;
        form.cat.value = item.cat;
        form.emoji.value = item.emoji;
        form.desc.value = item.desc;
        form.price.value = item.price;
        form.oldPrice.value = item.oldPrice || "";
        form.cal.value = item.cal;
        form.time.value = item.time;
        form.available.checked = item.available;
    } else {
        modal.querySelector("[data-modal-title]").textContent = "Add Product";
        form.reset();
        form.available.checked = true;
    }
    modal.classList.add("open");
},
  closeModal(){ document.querySelector("[data-product-modal]")?.classList.remove("open"); },

  bindModal() {
    // ✅ Refresh messages button
    document.getElementById("refresh-messages")?.addEventListener("click", async () => {
    await this.renderMessagesTable();
    Toast.show("Messages refreshed", "success");
    });
    document.querySelector("[data-add-product-btn]")?.addEventListener("click", async () => {
        await this.openModal(null);  // ✅ await lagaya
    });
    document.querySelectorAll("[data-modal-close]").forEach(b => {
        b.addEventListener("click", () => this.closeModal());
    });
    document.querySelector("[data-product-modal]")?.addEventListener("click", (e) => {
        if (e.target === e.currentTarget) this.closeModal();
    });
},



  bindProductForm() {
    const form = document.querySelector("[data-product-form]");
    form?.addEventListener("submit", async (e) => {
        e.preventDefault();
        
        const menu = await getMenu();  // ✅ await lagaya
        
        const data = {
            name: form.name.value.trim(),
            cat: form.cat.value,
            emoji: form.emoji.value.trim() || "🍽️",
            desc: form.desc.value.trim(),
            price: parseFloat(form.price.value) || 0,
            oldPrice: parseFloat(form.oldPrice.value) || 0,
            rating: 4.5,
            cal: parseInt(form.cal.value) || 0,
            time: form.time.value.trim() || "10 min",
            available: form.available.checked,
        };
        
        if (this.currentEditId) {
            // Update existing product
            const idx = menu.findIndex(m => m.id === this.currentEditId);
            if (idx !== -1) {
                menu[idx] = { ...menu[idx], ...data };
                Toast.show("Product updated", "success");
            }
        } else {
            // Add new product
            data.id = "p" + Date.now();
            menu.push(data);
            Toast.show("Product added", "success");
        }
        
        await saveMenu(menu);  // ✅ await lagaya
        this.closeModal();
        
        // ✅ Re-render sab kuch
        await this.renderProductsTable();
        await this.renderStats();
        await this.renderDonut();
    });
}
};

document.addEventListener("DOMContentLoaded", ()=>{
  if(document.body.classList.contains("admin")) Admin.init();
});
