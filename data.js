/* =========================================================
   ChipsChaps — Menu Data
   Single source of truth, read by menu.js / cart.js / admin.js
   ========================================================= */

const DEFAULT_MENU = [
  { id:"b1", name:"Classic Beef Burger", cat:"burgers", emoji:"🍔", desc:"Juicy beef patty, cheddar, lettuce & our signature sauce.", price:8.5, oldPrice:10.0, rating:4.6, cal:540, time:"10 min", available:true },
  { id:"b2", name:"Zinger Burger", cat:"burgers", emoji:"🍔", desc:"Crispy spicy chicken fillet with mayo & fresh lettuce.", price:7.9, oldPrice:9.0, rating:4.8, cal:610, time:"12 min", available:true },
  { id:"b3", name:"Double Cheese Burger", cat:"burgers", emoji:"🍔", desc:"Two beef patties stacked high with melted double cheese.", price:10.5, oldPrice:12.5, rating:4.7, cal:780, time:"12 min", available:true },
  { id:"b4", name:"BBQ Burger", cat:"burgers", emoji:"🍔", desc:"Smoky BBQ sauce, crispy onions & beef patty.", price:9.2, oldPrice:0, rating:4.5, cal:650, time:"11 min", available:true },
  { id:"b5", name:"Chicken Burger", cat:"burgers", emoji:"🍔", desc:"Grilled chicken breast with garlic mayo & pickles.", price:7.5, oldPrice:0, rating:4.4, cal:500, time:"10 min", available:true },

  { id:"f1", name:"Loaded Fries", cat:"fries", emoji:"🍟", desc:"Golden fries topped with cheese sauce, jalapeños & beef bits.", price:6.9, oldPrice:8.5, rating:4.7, cal:610, time:"8 min", available:true },
  { id:"f2", name:"Cheese Fries", cat:"fries", emoji:"🍟", desc:"Crispy fries smothered in warm melted cheddar cheese.", price:5.5, oldPrice:0, rating:4.5, cal:520, time:"7 min", available:true },
  { id:"f3", name:"Peri Peri Fries", cat:"fries", emoji:"🍟", desc:"Spicy peri-peri seasoned fries with a fiery kick.", price:5.2, oldPrice:6.0, rating:4.6, cal:480, time:"7 min", available:true },
  { id:"f4", name:"Masala Fries", cat:"fries", emoji:"🍟", desc:"Desi-style masala spiced crispy golden fries.", price:5.0, oldPrice:0, rating:4.4, cal:470, time:"7 min", available:true },
  { id:"f5", name:"French Fries", cat:"fries", emoji:"🍟", desc:"Classic salted fries, crispy outside, fluffy inside.", price:3.9, oldPrice:0, rating:4.3, cal:410, time:"6 min", available:true },

  { id:"c1", name:"Chicken Nuggets", cat:"chicken", emoji:"🍗", desc:"Golden crispy nuggets served with dipping sauce.", price:6.0, oldPrice:7.0, rating:4.6, cal:430, time:"9 min", available:true },
  { id:"c2", name:"Chicken Wings", cat:"chicken", emoji:"🍗", desc:"Spicy glazed wings grilled to smoky perfection.", price:7.8, oldPrice:0, rating:4.7, cal:560, time:"14 min", available:true },
  { id:"c3", name:"Chicken Strips", cat:"chicken", emoji:"🍗", desc:"Tender breaded chicken strips, crunchy every bite.", price:7.2, oldPrice:8.5, rating:4.5, cal:490, time:"11 min", available:true },

  { id:"w1", name:"Chicken Wrap", cat:"wraps", emoji:"🌮", desc:"Grilled chicken, veggies & garlic sauce in soft flatbread.", price:6.5, oldPrice:0, rating:4.5, cal:520, time:"9 min", available:true },
  { id:"s1", name:"Pizza Slice", cat:"snacks", emoji:"🍕", desc:"Cheesy pepperoni pizza slice, oven baked fresh daily.", price:4.5, oldPrice:0, rating:4.4, cal:390, time:"6 min", available:false },

  { id:"d1", name:"Coke", cat:"drinks", emoji:"🥤", desc:"Ice-cold classic Coca-Cola, 500ml.", price:2.0, oldPrice:0, rating:4.6, cal:180, time:"1 min", available:true },
  { id:"d2", name:"Pepsi", cat:"drinks", emoji:"🥤", desc:"Refreshing chilled Pepsi, 500ml.", price:2.0, oldPrice:0, rating:4.5, cal:180, time:"1 min", available:true },
  { id:"d3", name:"Sprite", cat:"drinks", emoji:"🥤", desc:"Crisp lemon-lime soda, ice cold.", price:2.0, oldPrice:0, rating:4.4, cal:170, time:"1 min", available:true },
  { id:"d4", name:"Fanta", cat:"drinks", emoji:"🥤", desc:"Fruity orange fizz, chilled and refreshing.", price:2.0, oldPrice:0, rating:4.3, cal:190, time:"1 min", available:true },
  { id:"d5", name:"Milkshake", cat:"drinks", emoji:"🥤", desc:"Thick creamy milkshake, choice of chocolate or vanilla.", price:4.2, oldPrice:5.0, rating:4.8, cal:420, time:"5 min", available:true },

  { id:"e1", name:"Ice Cream", cat:"desserts", emoji:"🍰", desc:"Soft-serve vanilla swirl in a crispy waffle cone.", price:3.0, oldPrice:0, rating:4.6, cal:280, time:"3 min", available:true },
  { id:"e2", name:"Brownie", cat:"desserts", emoji:"🍰", desc:"Warm fudgy chocolate brownie with a gooey centre.", price:3.8, oldPrice:4.5, rating:4.7, cal:340, time:"4 min", available:true },
];

const CATEGORIES = [
  { id:"all", label:"All", icon:"🍽️" },
  { id:"burgers", label:"Burgers", icon:"🍔" },
  { id:"fries", label:"Fries", icon:"🍟" },
  { id:"drinks", label:"Drinks", icon:"🥤" },
  { id:"chicken", label:"Chicken", icon:"🍗" },
  { id:"snacks", label:"Snacks", icon:"🍕" },
  { id:"wraps", label:"Wraps", icon:"🌮" },
  { id:"desserts", label:"Desserts", icon:"🍰" },
];

const DEALS = [
  {
    id:"deal1", cls:"deal-1", title:"Duo Combo", tag:"Best Seller",
    items:["1 Classic Burger","Regular Fries","Any Soft Drink"],
    price:10, oldPrice:15, save:33, endsInHours:26
  },
  {
    id:"deal2", cls:"deal-2", title:"Family Deal", tag:"Feeds 4",
    items:["4 Burgers","2 Large Fries","4 Drinks","6pc Nuggets"],
    price:45, oldPrice:58, save:22, endsInHours:50
  },
  {
    id:"deal3", cls:"deal-3", title:"Mega Deal", tag:"Most Loaded",
    items:["2 Burgers","1 Loaded Fries","2 Drinks","1 Dessert"],
    price:20, oldPrice:27, save:26, endsInHours:12
  },
];


// =========================================================
//   SAVE MENU - Backend + Local Storage dono mein save karein
// =========================================================

// =========================================================
//   SAVE MENU - Backend + Local Storage dono mein save karein
// =========================================================

// =========================================================
//   SAVE MENU - Backend + Local Storage dono mein save karein
// =========================================================

async function saveMenu(menu) {
    // 1. Local storage mein save karein
    localStorage.setItem("cc_menu", JSON.stringify(menu));
    
    // 2. Get all products from backend
    let backendProducts = [];
    try {
        const response = await fetch(`${API_URL}/products`);
        backendProducts = await response.json();
    } catch (error) {
        console.error("Backend fetch error:", error);
    }
    
    // 3. Backend mein delete karein (jo frontend mein nahi hain)
    for (let backendItem of backendProducts) {
        const exists = menu.find(m => m.id === backendItem._id);
        if (!exists) {
            // Yeh product frontend mein nahi hai, isliye backend se delete karein
            try {
                await fetch(`${API_URL}/products/${backendItem._id}`, {
                    method: "DELETE"
                });
                console.log(`🗑️ Deleted from backend: ${backendItem.name}`);
            } catch (error) {
                console.error(`Delete error for ${backendItem.name}:`, error);
            }
        }
    }
    
    // 4. Backend mein add/update karein
    for (let item of menu) {
        try {
            // Check karein ke yeh product backend mein pehle se hai ya nahi
            const found = backendProducts.find(p => p._id === item.id);
            
            if (found) {
                // Agar pehle se hai toh UPDATE karein (PUT)
                await fetch(`${API_URL}/products/${found._id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: item.name,
                        category: item.cat,
                        price: item.price,
                        salePrice: item.oldPrice || 0,
                        quantity: item.available ? 10 : 0,
                        description: item.desc,
                        image: item.emoji
                    })
                });
                console.log(`✅ Updated: ${item.name}`);
            } else {
                // Agar nahi hai toh NAYA product ADD karein (POST)
                await fetch(`${API_URL}/products`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: item.name,
                        category: item.cat,
                        price: item.price,
                        salePrice: item.oldPrice || 0,
                        quantity: item.available ? 10 : 0,
                        description: item.desc,
                        image: item.emoji
                    })
                });
                console.log(`✅ Added: ${item.name}`);
            }
        } catch (error) {
            console.error(`❌ Backend sync error for ${item.name}:`, error);
        }
    }
    
    console.log("✅ Menu saved locally and synced with backend!");
}

// =========================================================
//   BACKEND API CONNECTION
//   (Is code ko sabse neeche paste karein)
// =========================================================

const API_URL = "http://localhost:5000/api";
// =========================================================
//   BACKEND SE PRODUCTS FETCH KAREIN
// =========================================================

async function fetchFromBackend() {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error("Failed to fetch");
        const products = await response.json();
        
        // Backend data ko frontend format mein convert karein
        return products.map(p => ({
            id: p._id,
            name: p.name,
            cat: p.category,
            emoji: p.image || "🍔",
            desc: p.description || "Delicious item",
            price: p.price,
            oldPrice: p.salePrice || 0,
            rating: 4.5,
            cal: 0,
            time: "10 min",
            available: p.quantity > 0
        }));
    } catch (error) {
        console.error("Backend error:", error);
        return null;
    }
}

// =========================================================
//   NAYA getMenu() - Pehle backend try karega
// =========================================================

async function getMenu() {
    // Pehle backend se fetch karein
    const backendData = await fetchFromBackend();
    if (backendData && backendData.length > 0) {
        return backendData;
    }
    
    // Agar backend se data nahi mila toh localStorage se lein (fallback)
    return getMenuFromLocalStorage();
}

// =========================================================
//   LOCAL STORAGE SE DATA (FALLBACK)
// =========================================================

function getMenuFromLocalStorage(){
    try {
        const stored = localStorage.getItem("cc_menu");
        if (stored) return JSON.parse(stored);
    } catch(e) {}
    return DEFAULT_MENU;
}

// =========================================================
//   PRODUCT ADD KARNE KE LIYE (Admin se)
// =========================================================

async function addProductToBackend(product) {
    try {
        const response = await fetch(`${API_URL}/products`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: product.name,
                category: product.cat,
                price: product.price,
                salePrice: product.oldPrice || 0,
                quantity: product.available ? 10 : 0,
                description: product.desc,
                image: product.emoji
            })
        });
        if (!response.ok) throw new Error("Failed to add product");
        return await response.json();
    } catch (error) {
        console.error("Product add nahi ho paaya:", error);
        return null;
    }
}
