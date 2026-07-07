/* =========================================================
   Cart page — item list, coupon, totals
   ========================================================= */

const TAX_RATE = 0.05;
const DELIVERY_FEE = 2.5;
const COUPONS = { "CHIPS10": 0.10, "WELCOME20": 0.20 };

function getAppliedCoupon(){
  try{ return JSON.parse(sessionStorage.getItem("cc_coupon")); }catch(e){ return null; }
}

function cartTotals(){
  const subtotal = Cart.subtotal();
  const coupon = getAppliedCoupon();
  const discount = coupon ? subtotal * coupon.rate : 0;
  const afterDiscount = subtotal - discount;
  const tax = afterDiscount * TAX_RATE;
  const delivery = subtotal > 0 ? DELIVERY_FEE : 0;
  const total = afterDiscount + tax + delivery;
  return { subtotal, discount, tax, delivery, total, coupon };
}

function renderCartPage(){
  const listEl = document.querySelector("[data-cart-list]");
  const summaryEl = document.querySelector("[data-cart-summary]");
  if(!listEl) return;
  const items = Cart.get();

  if(items.length === 0){
    listEl.innerHTML = `
      <div class="empty-state ticket">
        <div class="food-badge">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Looks like you haven't added anything yet. Let's fix that!</p>
        <a href="menu.html" class="btn btn-primary">Browse Menu</a>
      </div>`;
  }else{
    listEl.innerHTML = items.map(i => `
      <div class="cart-item" data-id="${i.id}">
        <div class="cart-item-media">${i.emoji}</div>
        <div>
          <div class="cart-item-name">${i.name}</div>
          <div class="cart-item-price">$${i.price.toFixed(2)} each</div>
        </div>
        <div class="qty-stepper" data-qty-for="${i.id}">
          <button data-step="-1" aria-label="Decrease">−</button>
          <span data-qty-val>${i.qty}</span>
          <button data-step="1" aria-label="Increase">+</button>
        </div>
        <button class="remove-btn" data-remove="${i.id}" aria-label="Remove item">✕</button>
      </div>
    `).join("");
  }

  if(summaryEl){
    const t = cartTotals();
    summaryEl.innerHTML = `
      <h3>Order Summary</h3>
      <div class="summary-row"><span>Subtotal</span><span>$${t.subtotal.toFixed(2)}</span></div>
      ${t.coupon ? `<div class="summary-row" style="color:#1E7A38;"><span>Coupon (${t.coupon.code})</span><span>-$${t.discount.toFixed(2)}</span></div>` : ""}
      <div class="summary-row"><span>Tax (5%)</span><span>$${t.tax.toFixed(2)}</span></div>
      <div class="summary-row"><span>Delivery Fee</span><span>$${t.delivery.toFixed(2)}</span></div>
      <div class="summary-row total"><span>Total</span><span>$${t.total.toFixed(2)}</span></div>
      <a href="checkout.html" class="btn btn-primary btn-block" style="margin-top:18px;" ${items.length===0 ? 'aria-disabled="true" onclick="return false;" ' : ''}>
        Proceed to Checkout →
      </a>
    `;
  }
}

document.addEventListener("DOMContentLoaded", ()=>{
  const listEl = document.querySelector("[data-cart-list]");
  if(!listEl) return;

  renderCartPage();

  listEl.addEventListener("click", (e)=>{
    const step = e.target.closest("[data-step]");
    if(step){
      const id = step.closest("[data-qty-for]").dataset.qtyFor;
      const items = Cart.get();
      const it = items.find(i=>i.id===id);
      if(it){ Cart.updateQty(id, it.qty + Number(step.dataset.step)); renderCartPage(); }
      return;
    }
    const remove = e.target.closest("[data-remove]");
    if(remove){
      Cart.remove(remove.dataset.remove);
      Toast.show("Item removed", "success");
      renderCartPage();
    }
  });

  const couponForm = document.querySelector("[data-coupon-form]");
  couponForm?.addEventListener("submit", (e)=>{
    e.preventDefault();
    const input = couponForm.querySelector("input");
    const code = input.value.trim().toUpperCase();
    if(COUPONS[code]){
      sessionStorage.setItem("cc_coupon", JSON.stringify({ code, rate:COUPONS[code] }));
      Toast.show(`Coupon ${code} applied!`, "success");
    }else{
      Toast.show("Invalid coupon code", "error");
    }
    renderCartPage();
    input.value = "";
  });

  document.addEventListener("cart:updated", renderCartPage);
});
