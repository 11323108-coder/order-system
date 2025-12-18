// 根據 Canva 菜單整理的完整品項
const menuData = [
    // CI類 (奶昔)
    { id: 1, name: "草莓優格晨光奶昔", price: 199, ingredients: "草莓、原味優格、鮮奶、蜂蜜", category: "smoothie" },
    { id: 2, name: "香蕉高纖飽足奶昔", price: 129, ingredients: "香蕉、無糖優格、鮮奶、燕麥", category: "smoothie" },
    { id: 3, name: "藍莓抗氧化奶昔", price: 149, ingredients: "藍莓、優酪乳、原味優格", category: "smoothie" },
    { id: 4, name: "芒果熱帶風味奶昔", price: 169, ingredients: "芒果、優酪乳、鮮奶", category: "smoothie" },
    { id: 5, name: "葡萄多酚抗氧化奶昔", price: 159, ingredients: "紫葡萄、優格、鮮奶", category: "smoothie" },
    { id: 6, name: "木瓜順暢腸胃奶昔", price: 139, ingredients: "木瓜、優酪乳、鮮奶", category: "smoothie" },
    { id: 7, name: "綜合莓果能量奶昔", price: 189, ingredients: "草莓、藍莓、覆盆子、原味優格、鮮奶", category: "smoothie" },
    { id: 8, name: "綠色雙果奶昔", price: 139, ingredients: "奇異果、蘋果、原味優格、優酪乳", category: "smoothie" },
    { id: 9, name: "芭樂維C高纖奶昔", price: 139, ingredients: "芭樂、優格、鮮奶", category: "smoothie" },
    { id: 10, name: "酪梨濃醇健康奶昔", price: 159, ingredients: "酪梨半顆、鮮奶、原味優格、蜂蜜", category: "smoothie" },
    { id: 11, name: "火龍果繽紛奶昔", price: 159, ingredients: "火龍果、原味優格、鮮奶", category: "smoothie" },

    // YOUNG身 (健康飲)
    { id: 12, name: "黑白吾嚐", price: 139, ingredients: "黑木耳露、白木耳露", category: "health" },
    { id: 13, name: "五黑黑", price: 169, ingredients: "黑芝麻、黑豆、黑米、黑枸杞、黑木耳", category: "health" },
    { id: 14, name: "紅紅火火", price: 169, ingredients: "紅棗、紅皮花生、紅豆、枸杞、紅糖", category: "health" },
    { id: 15, name: "果果大家族", price: 199, ingredients: "開心果、榛果、腰果、核桃、杏仁", category: "health" },
    { id: 16, name: "紫米紅豆牛奶", price: 119, ingredients: "紫米、紅豆、鮮乳", category: "health" },
    { id: 17, name: "薏仁牛奶", price: 99, ingredients: "純天然薏仁、鮮乳", category: "health" },
    { id: 18, name: "薏仁飲", price: 89, ingredients: "純天然薏仁熬煮", category: "health" },
    { id: 19, name: "桂圓紅棗茶", price: 89, ingredients: "手工熬煮桂圓紅棗", category: "health" },
    { id: 20, name: "黑豆水/紅豆水", price: 79, ingredients: "低溫慢烘豆類萃取", category: "health" }
];

const toppingsList = ["薏仁", "紫米", "紅豆", "花生", "白木耳", "桂圓", "枸杞"];

let cart = [];
let currentItem = null;
let selections = { sugar: '', ice: '', qty: 1, toppings: [] };

function renderMenu(category = 'smoothie') {
    const container = document.getElementById('menu-container');
    container.innerHTML = menuData
        .filter(item => item.category === category)
        .map(item => `
            <div class="menu-item" onclick="openModal(${item.id})">
                <div class="item-info">
                    <h3>${item.name}</h3>
                    <p class="ingredients">${item.ingredients}</p>
                    <div class="item-price">$${item.price}</div>
                </div>
                <button class="add-btn">+</button>
            </div>
        `).join('');
}

function filterCategory(cat) {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
    renderMenu(cat);
}

function openModal(id) {
    currentItem = menuData.find(i => i.id === id);
    selections = { sugar: '', ice: '', qty: 1, toppings: [] };
    
    document.getElementById('modal-title').innerText = currentItem.name;
    document.getElementById('modal-ingredients').innerText = currentItem.ingredients;
    
    // 生成配料按鈕
    const toppingContainer = document.getElementById('topping-options');
    if(toppingContainer) {
        toppingContainer.innerHTML = toppingsList.map(t => 
            `<button class="opt-btn" onclick="toggleTopping('${t}')">${t}</button>`
        ).join('');
    }

    updateModalPrice();
    document.getElementById('item-modal').style.display = 'block';
}

function selectOption(type, value) {
    selections[type] = value;
    const btns = document.getElementById(`${type}-options`).querySelectorAll('.opt-btn');
    btns.forEach(b => {
        b.classList.remove('selected');
        if (b.innerText === value) b.classList.add('selected');
    });
}

function toggleTopping(name) {
    const index = selections.toppings.indexOf(name);
    if (index > -1) {
        selections.toppings.splice(index, 1);
    } else {
        selections.toppings.push(name);
    }
    
    const btns = document.getElementById('topping-options').querySelectorAll('.opt-btn');
    btns.forEach(b => {
        if (selections.toppings.includes(b.innerText)) b.classList.add('selected');
        else b.classList.remove('selected');
    });

    updateModalPrice();
}

function updateModalPrice() {
    const count = selections.toppings.length;
    let toppingFee = 0;
    if (count > 0) {
        // 菜單規則：任選三種 $50，其餘一個 $20
        toppingFee = (count === 3) ? 50 : count * 20;
    }
    
    const unitPrice = currentItem.price + toppingFee;
    document.getElementById('modal-qty').innerText = selections.qty;
    document.getElementById('modal-price').innerText = unitPrice * selections.qty;
}

function updateQty(delta) {
    selections.qty = Math.max(1, selections.qty + delta);
    updateModalPrice();
}

function addToCart() {
    if (!selections.sugar || !selections.ice) {
        alert('請選擇甜度與冰量');
        return;
    }
    cart.push({ ...currentItem, ...selections });
    updateCartUI();
    closeModal();
}

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const cartItems = document.getElementById('cart-items');
    let total = 0;
    
    cartItems.innerHTML = cart.map((item, index) => {
        const toppingFee = (item.toppings.length === 3) ? 50 : item.toppings.length * 20;
        const itemTotal = (item.price + toppingFee) * item.qty;
        total += itemTotal;
        
        return `
            <div class="cart-item">
                <div style="flex:1">
                    <strong>${item.name}</strong><br>
                    <small>${item.sugar}/${item.ice}${item.toppings.length > 0 ? ' +'+item.toppings.join(',') : ''} x ${item.qty}</small>
                </div>
                <div>$${itemTotal} <i class="fas fa-trash" onclick="removeFromCart(${index})" style="color:#e74c3c;margin-left:8px"></i></div>
            </div>
        `;
    }).join('');
    document.getElementById('total-amount').innerText = total;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function toggleCart() {
    document.getElementById('cart-drawer').classList.toggle('active');
}

function closeModal() {
    document.getElementById('item-modal').style.display = 'none';
}

function submitOrder() {
    if (cart.length === 0) return alert('購物車是空的');
    const orderId = 'YOUNG-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    
    let orderText = `【YOUNG 新訂單】\n編號：${orderId}\n------------------\n`;
    let total = 0;
    cart.forEach(item => {
        const toppingFee = (item.toppings.length === 3) ? 50 : item.toppings.length * 20;
        orderText += `● ${item.name} (${item.sugar}/${item.ice})\n   ${item.toppings.length > 0 ? '加料:'+item.toppings.join(',') : '原味'} x ${item.qty}\n`;
        total += (item.price + toppingFee) * item.qty;
    });
    orderText += `------------------\n總計：$${total} 元`;

    document.getElementById('order-id').innerText = orderId;
    document.getElementById('order-success').style.display = 'block';

    const lineUrl = `https://line.me/R/msg/text/?${encodeURIComponent(orderText)}`;
    setTimeout(() => {
        if(confirm("訂單已產生！是否透過 Line 傳送給店家？")) {
            window.location.href = lineUrl;
        }
    }, 500);

    cart = [];
    updateCartUI();
    toggleCart();
}

renderMenu();
