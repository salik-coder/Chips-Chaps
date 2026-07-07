/* =========================================================
   ChipsChaps — Core site behaviour
   Loaded on every page after data.js
   ========================================================= */

/* ---------- Page loader ---------- */
window.addEventListener("load", () => {
  const loader = document.querySelector(".page-loader");
  if(loader){ setTimeout(()=> loader.classList.add("hide"), 400); }
});

/* ---------- Theme (dark mode) ---------- */
const Theme = {
  key:"cc_theme",
  init(){
    const saved = localStorage.getItem(this.key) || "light";
    document.documentElement.setAttribute("data-theme", saved);
    this.reflect(saved);
  },
  toggle(){
    const cur = document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = cur === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(this.key, next);
    this.reflect(next);
  },
  reflect(mode){
    document.querySelectorAll("[data-theme-icon]").forEach(el=>{
      el.textContent = mode === "dark" ? "☀️" : "🌙";
    });
  }
};
Theme.init();

/* ---------- Toasts ---------- */
const Toast = {
  host(){
    let h = document.querySelector(".toast-host");
    if(!h){ h = document.createElement("div"); h.className="toast-host"; document.body.appendChild(h); }
    return h;
  },
  show(msg, type="success"){
    const host = this.host();
    const el = document.createElement("div");
    el.className = `toast ${type}`;
    el.innerHTML = `<span>${type==="success"?"✅":"⚠️"}</span><span>${msg}</span>`;
    host.appendChild(el);
    setTimeout(()=>{
      el.classList.add("out");
      setTimeout(()=> el.remove(), 300);
    }, 2600);
  }
};

/* ---------- Cart engine (localStorage-backed) ---------- */
const Cart = {
  key:"cc_cart",
  get(){
    try{ return JSON.parse(localStorage.getItem(this.key)) || []; }catch(e){ return []; }
  },
  save(items){
    localStorage.setItem(this.key, JSON.stringify(items));
    this.updateBadge();
    document.dispatchEvent(new CustomEvent("cart:updated", { detail:items }));
  },
  add(item, qty=1){
    const items = this.get();
    const found = items.find(i=>i.id===item.id);
    if(found){ found.qty += qty; }
    else{ items.push({ id:item.id, name:item.name, emoji:item.emoji, price:item.price, qty }); }
    this.save(items);
    Toast.show(`${item.name} added to cart`, "success");
  },
  updateQty(id, qty){
    let items = this.get();
    if(qty <= 0){ items = items.filter(i=>i.id!==id); }
    else{ const it = items.find(i=>i.id===id); if(it) it.qty = qty; }
    this.save(items);
  },
  remove(id){
    const items = this.get().filter(i=>i.id!==id);
    this.save(items);
  },
  clear(){ this.save([]); },
  count(){ return this.get().reduce((s,i)=>s+i.qty,0); },
  subtotal(){ return this.get().reduce((s,i)=>s+i.qty*i.price,0); },
  updateBadge(){
    const n = this.count();
    document.querySelectorAll("[data-cart-count]").forEach(el=>{
      el.textContent = n;
      el.style.display = n > 0 ? "flex" : "none";
    });
  }
};
Cart.updateBadge();

/* ---------- Wishlist ---------- */
const Wishlist = {
  key:"cc_wishlist",
  get(){ try{ return JSON.parse(localStorage.getItem(this.key)) || []; }catch(e){ return []; } },
  has(id){ return this.get().includes(id); },
  toggle(id){
    let items = this.get();
    if(items.includes(id)){ items = items.filter(i=>i!==id); }
    else{ items.push(id); }
    localStorage.setItem(this.key, JSON.stringify(items));
    return items.includes(id);
  }
};

/* ---------- Navbar: scroll state + mobile panel ---------- */
function initNavbar(){
  const nav = document.querySelector(".navbar");
  if(!nav) return;
  const onScroll = () => {
    if(window.scrollY > 40) nav.classList.add("scrolled");
    else nav.classList.remove("scrolled");
    const btt = document.querySelector(".back-to-top");
    if(btt){ btt.classList.toggle("show", window.scrollY > 500); }
  };
  window.addEventListener("scroll", onScroll);
  onScroll();

  const toggle = document.querySelector(".nav-toggle");
  const panel = document.querySelector(".mobile-panel");
  const scrim = document.querySelector(".scrim");
  const close = document.querySelector(".mobile-panel-close");
  const openPanel = () => { panel?.classList.add("open"); scrim?.classList.add("show"); };
  const closePanel = () => { panel?.classList.remove("open"); scrim?.classList.remove("show"); };
  toggle?.addEventListener("click", openPanel);
  close?.addEventListener("click", closePanel);
  scrim?.addEventListener("click", closePanel);

  // Highlight active link
  const path = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a, .mobile-panel a").forEach(a=>{
    const href = a.getAttribute("href");
    if(href === path) a.classList.add("active");
  });
}

/* ---------- Reveal on scroll ---------- */
function initReveal(){
  const els = document.querySelectorAll(".reveal");
  if(!("IntersectionObserver" in window)){ els.forEach(e=>e.classList.add("in")); return; }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){ entry.target.classList.add("in"); io.unobserve(entry.target); }
    });
  }, { threshold:.15 });
  els.forEach(e=>io.observe(e));
}

/* ---------- Back to top ---------- */
function initBackToTop(){
  const btn = document.querySelector(".back-to-top");
  btn?.addEventListener("click", ()=> window.scrollTo({ top:0, behavior:"smooth" }));
}

/* ---------- FAQ accordion ---------- */
function initFaq(){
  document.querySelectorAll(".faq-item").forEach(item=>{
    item.querySelector(".faq-q")?.addEventListener("click", ()=>{
      const wasOpen = item.classList.contains("open");
      document.querySelectorAll(".faq-item.open").forEach(o=>o.classList.remove("open"));
      if(!wasOpen) item.classList.add("open");
    });
  });
}

/* ---------- Live chat FAB ---------- */
function initFab(){
  const fab = document.querySelector(".fab");
  const panel = document.querySelector(".fab-panel");
  fab?.addEventListener("click", ()=> panel?.classList.toggle("open"));
}

/* ---------- Newsletter ---------- */
function initNewsletter(){
  document.querySelectorAll(".newsletter-form").forEach(f=>{
    f.addEventListener("submit", e=>{
      e.preventDefault();
      Toast.show("Subscribed! Watch your inbox for deals.", "success");
      f.reset();
    });
  });
}

document.addEventListener("DOMContentLoaded", ()=>{
  initNavbar();
  initReveal();
  initBackToTop();
  initFaq();
  initFab();
  initNewsletter();

  document.querySelectorAll("[data-theme-toggle]").forEach(b=>{
    b.addEventListener("click", ()=> Theme.toggle());
  });
});
