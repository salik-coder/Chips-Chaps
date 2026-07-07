/* =========================================================
   Menu rendering & interaction
   Used by menu.html (full grid) and index.html (featured grid)
   ========================================================= */

function starString(rating){
  const full = Math.round(rating);
  let s = "";
  for(let i=0;i<5;i++) s += i < full ? "★" : "☆";
  return s;
}

function foodCardHTML(item, qty){
  const hasDiscount = item.oldPrice && item.oldPrice > item.price;
  const pct = hasDiscount ? Math.round((1 - item.price/item.oldPrice) * 100) : 0;
  const favActive = Wishlist.has(item.id) ? "active" : "";
  return `
  <article class="food-card reveal in" data-id="${item.id}">
    <div class="food-media">
      ${item.emoji}
      ${hasDiscount ? `<span class="badge discount-tag">-${pct}%</span>` : ""}
      <button class="fav-btn ${favActive}" data-fav="${item.id}" aria-label="Save to wishlist">♥</button>
    </div>
    <div class="food-card-top">
      <h3 class="food-name">${item.name}</h3>
    </div>
    <p class="food-desc">${item.desc}</p>
    <div class="food-meta">
      <span>🔥 ${item.cal} cal</span>
      <span>⏱ ${item.time}</span>
      <span><span class="avail-dot ${item.available ? "" : "out"}"></span> ${item.available ? "Available" : "Sold out"}</span>
    </div>
    <div class="rating">${starString(item.rating)} <span style="color:var(--text-soft); font-size:.78rem;">(${item.rating})</span></div>
    <div class="price-row">
      <span class="price-now">$${item.price.toFixed(2)}</span>
      ${hasDiscount ? `<span class="price-old">$${item.oldPrice.toFixed(2)}</span>` : ""}
    </div>
    <div class="card-actions">
      <div class="qty-stepper" data-qty-for="${item.id}">
        <button data-step="-1" aria-label="Decrease quantity">−</button>
        <span data-qty-val>${qty || 1}</span>
        <button data-step="1" aria-label="Increase quantity">+</button>
      </div>
      <button class="btn btn-primary btn-sm" data-add="${item.id}" ${item.available? "" : "disabled"}>
        ${item.available ? "Add to Cart" : "Sold Out"}
      </button>
    </div>
  </article>`;
}

const MenuPage = {
  state:{ cat:"all", query:"", sort:"popular", qty:{} },

  render(gridEl, menu){
    let items = menu.filter(i=>{
      const matchCat = this.state.cat === "all" || i.cat === this.state.cat;
      const matchQuery = i.name.toLowerCase().includes(this.state.query.toLowerCase());
      return matchCat && matchQuery;
    });
    switch(this.state.sort){
      case "price-asc": items.sort((a,b)=>a.price-b.price); break;
      case "price-desc": items.sort((a,b)=>b.price-a.price); break;
      case "rating": items.sort((a,b)=>b.rating-a.rating); break;
      default: items.sort((a,b)=> (Wishlist.has(b.id)?1:0) - (Wishlist.has(a.id)?1:0) || b.rating - a.rating);
    }
    if(items.length === 0){
      gridEl.innerHTML = `<div class="empty-state" style="grid-column:1/-1;">
        <div class="food-badge">🔍</div>
        <h3>No dishes found</h3>
        <p>Try a different category or search term.</p>
      </div>`;
      return;
    }
    gridEl.innerHTML = items.map(i => foodCardHTML(i, this.state.qty[i.id] || 1)).join("");
  },

  bindGrid(gridEl, menu){
    gridEl.addEventListener("click", (e)=>{
      const stepBtn = e.target.closest("[data-step]");
      if(stepBtn){
        const wrap = stepBtn.closest("[data-qty-for]");
        const id = wrap.dataset.qtyFor;
        const cur = this.state.qty[id] || 1;
        const next = Math.max(1, cur + Number(stepBtn.dataset.step));
        this.state.qty[id] = next;
        wrap.querySelector("[data-qty-val]").textContent = next;
        return;
      }
      const addBtn = e.target.closest("[data-add]");
      if(addBtn){
        const id = addBtn.dataset.add;
        const item = menu.find(m=>m.id===id);
        if(item) Cart.add(item, this.state.qty[id] || 1);
        return;
      }
      const favBtn = e.target.closest("[data-fav]");
      if(favBtn){
        const active = Wishlist.toggle(favBtn.dataset.fav);
        favBtn.classList.toggle("active", active);
        Toast.show(active ? "Added to wishlist" : "Removed from wishlist", "success");
      }
    });
  },

    async init(gridSelector, { filterRow, searchInput, sortSelect, limit } = {}){
    const gridEl = document.querySelector(gridSelector);
    if(!gridEl) return;
    let menu = await getMenu();
    if(limit) menu = menu.slice(0, limit);
    this.bindGrid(gridEl, menu);
    this.render(gridEl, menu);

    if(filterRow){
      const row = document.querySelector(filterRow);
      row?.addEventListener("click", (e)=>{
        const pill = e.target.closest(".pill");
        if(!pill) return;
        row.querySelectorAll(".pill").forEach(p=>p.classList.remove("active"));
        pill.classList.add("active");
        this.state.cat = pill.dataset.cat;
        this.render(gridEl, menu);
      });
    }
    if(searchInput){
      document.querySelector(searchInput)?.addEventListener("input", (e)=>{
        this.state.query = e.target.value;
        this.render(gridEl, menu);
      });
    }
    if(sortSelect){
      document.querySelector(sortSelect)?.addEventListener("change", (e)=>{
        this.state.sort = e.target.value;
        this.render(gridEl, menu);
      });
    }
  }
};
