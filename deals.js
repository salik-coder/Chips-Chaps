/* =========================================================
   Deals page — countdown timers + combo add-to-cart
   ========================================================= */

async function renderDeals(){
  const grid = document.querySelector("[data-deals-grid]");
  if(!grid) return;
  grid.innerHTML = DEALS.map(d => `
    <div class="deal-card ${d.cls} reveal in" data-deal="${d.id}" data-ends="${d.endsInHours}">
      <div>
        <span class="badge badge-gold deal-tag">${d.tag}</span>
        <h3 style="margin-top:14px; color:inherit;">${d.title}</h3>
        <ul class="deal-items">${d.items.map(i=>`<li>${i}</li>`).join("")}</ul>
      </div>
      <div>
        <div class="deal-price-row">
          <span class="deal-price-now">$${d.price}</span>
          <span class="deal-price-old">$${d.oldPrice}</span>
        </div>
        <div class="deal-save">Save ${d.save}%</div>
        <div class="countdown" data-countdown="${d.id}"></div>
        <button class="btn btn-secondary btn-block" style="margin-top:18px;" data-add-deal="${d.id}">Order This Deal</button>
      </div>
    </div>
  `).join("");

  grid.querySelectorAll("[data-countdown]").forEach(cd=>{
    const card = cd.closest("[data-ends]");
    const endsAt = Date.now() + Number(card.dataset.ends) * 3600 * 1000;
    const tick = () => {
      const diff = Math.max(0, endsAt - Date.now());
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      cd.innerHTML = `
        <div class="cd-box"><span class="cd-num">${String(h).padStart(2,"0")}</span><span class="cd-label">Hrs</span></div>
        <div class="cd-box"><span class="cd-num">${String(m).padStart(2,"0")}</span><span class="cd-label">Min</span></div>
        <div class="cd-box"><span class="cd-num">${String(s).padStart(2,"0")}</span><span class="cd-label">Sec</span></div>
      `;
    };
    tick();
    setInterval(tick, 1000);
  });

  grid.addEventListener("click", (e)=>{
    const btn = e.target.closest("[data-add-deal]");
    if(!btn) return;
    const deal = DEALS.find(d=>d.id===btn.dataset.addDeal);
    if(deal) Cart.add({ id:deal.id, name:deal.title, emoji:"🍱", price:deal.price }, 1);
  });
}

document.addEventListener("DOMContentLoaded", async () => {  // ✅ async 
    await renderDeals();  // ✅ await 
});