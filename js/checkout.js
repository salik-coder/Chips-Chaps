/* =========================================================
   Checkout page — order summary + validation + place order
   ========================================================= */

document.addEventListener("DOMContentLoaded", ()=>{
  const summaryEl = document.querySelector("[data-checkout-summary]");
  if(!summaryEl) return;

  const items = Cart.get();
  if(items.length === 0){
    summaryEl.innerHTML = `<p>Your cart is empty. <a href="menu.html" style="color:var(--red); font-weight:700;">Go to menu →</a></p>`;
  }else{
    const t = cartTotals();
    summaryEl.innerHTML = `
      ${items.map(i=>`
        <div class="mini-item">
          <span>${i.emoji} ${i.name} × ${i.qty}</span>
          <b>$${(i.price*i.qty).toFixed(2)}</b>
        </div>`).join("")}
      <div class="summary-row" style="margin-top:10px;"><span>Subtotal</span><span>$${t.subtotal.toFixed(2)}</span></div>
      ${t.coupon ? `<div class="summary-row" style="color:#1E7A38;"><span>Coupon</span><span>-$${t.discount.toFixed(2)}</span></div>` : ""}
      <div class="summary-row"><span>Tax</span><span>$${t.tax.toFixed(2)}</span></div>
      <div class="summary-row"><span>Delivery</span><span>$${t.delivery.toFixed(2)}</span></div>
      <div class="summary-row total"><span>Total</span><span>$${t.total.toFixed(2)}</span></div>
    `;
  }

  // Payment method toggle
  document.querySelectorAll(".pay-option").forEach(opt=>{
    opt.addEventListener("click", ()=>{
      document.querySelectorAll(".pay-option").forEach(o=>o.classList.remove("active"));
      opt.classList.add("active");
      opt.querySelector("input").checked = true;
    });
  });

  const form = document.querySelector("[data-checkout-form]");
  form?.addEventListener("submit", (e)=>{
    e.preventDefault();
    if(Cart.get().length === 0){
      Toast.show("Your cart is empty", "error");
      return;
    }
    if(!form.checkValidity()){
      form.reportValidity();
      return;
    }
    const orderId = "CC" + Math.floor(100000 + Math.random()*900000);
    const order = {
      id:orderId,
      items:Cart.get(),
      total:cartTotals().total,
      customer:{
        name: form.querySelector("#c-name").value,
        phone: form.querySelector("#c-phone").value,
        email: form.querySelector("#c-email").value,
        address: form.querySelector("#c-address").value,
        city: form.querySelector("#c-city").value,
      },
      status:"pending",
      date:new Date().toISOString(),
    };
    const orders = JSON.parse(localStorage.getItem("cc_orders") || "[]");
    orders.unshift(order);
    localStorage.setItem("cc_orders", JSON.stringify(orders));
    sessionStorage.removeItem("cc_coupon");
    Cart.clear();

    const modal = document.querySelector("[data-success-modal]");
    if(modal){
      modal.querySelector("[data-order-id]").textContent = orderId;
      modal.classList.add("open");
    }
  });
});
