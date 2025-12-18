const menuData = [
    { id: 1, name: "草莓優格晨光奶昔", price: 199, ingredients: "草莓、原味優格、鮮奶、蜂蜜", category: "smoothie" },
    { id: 2, name: "香蕉高纖飽足奶昔", price: 129, ingredients: "香蕉、無糖優格、鮮奶、燕麥", category: "smoothie" },
    { id: 3, name: "藍莓抗氧化奶昔", price: 149, ingredients: "藍莓、優酪乳、原味優格", category: "smoothie" },
    { id: 4, name: "芒果熱帶風味奶昔", price: 169, ingredients: "芒果、優酪乳、鮮奶", category: "smoothie" },
    { id: 5, name: "葡萄多酚抗氧化奶昔", price: 159, ingredients: "紫葡萄、優格、鮮奶", category: "smoothie" },
    { id: 6, name: "黑白吾嚐", price: 139, ingredients: "黑木耳露、白木耳露", category: "health" },
    { id: 7, name: "五黑黑", price: 169, ingredients: "黑芝麻、黑豆、黑米、黑枸杞、黑木耳", category: "health" },
    { id: 8, name: "果果大家族", price: 199, ingredients: "開心果、榛果、腰果、核桃、杏仁", category: "health" },
    { id: 9, name: "薏仁牛奶", price: 99, ingredients: "純天然薏仁、鮮乳", category: "health" },
    { id: 10, name: "黑豆水/紅豆水", price: 79, ingredients: "低溫慢烘豆類萃取", category: "health" }
];

let cart = [];
let currentItem = null;
let selections = { sugar: '', ice: '', qty: 1 };

// 初始化菜單
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
    event.target.classList.add('active');
    renderMenu(cat);
}

function openModal(id) {
    currentItem = menuData.find(i => i.id === id);
    selections = { sugar: '', ice: '', qty: 1 };
    document.getElementById('modal-title').innerText = currentItem.name;
    document.getElementById('modal-ingredients').innerText = currentItem.ingredients;
    document.getElementById('modal-price').innerText = currentItem.price;
    document.getElementById('modal-qty').innerText = 1;
    
    // 清除選中狀態
    document.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('selected'));
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

function updateQty(delta) {
    selections.qty = Math.max(1, selections.qty + delta);
    document.getElementById('modal-qty').innerText = selections.qty;
    document.getElementById('modal-price').innerText = currentItem.price * selections.qty;
}

function addToCart() {
    if (!selections.sugar || !selections.ice) {
        alert('請選擇甜度與冰量');
        return;
    }
    cart.push({
        ...currentItem,
        ...selections,
        orderTime: new Date().getTime()
    });
    updateCartUI();
    closeModal();
}

function updateCartUI() {
    document.getElementById('cart-count').innerText = cart.length;
    const cartItems = document.getElementById('cart-items');
    let total = 0;
    
    cartItems.innerHTML = cart.map((item, index) => {
        total += item.price * item.qty;
        return `
            <div class="cart-item">
                <div>
                    <strong>${item.name}</strong><br>
                    <small>${item.sugar} / ${item.ice} x ${item.qty}</small>
                </div>
                <div>
                    $${item.price * item.qty}
                    <i class="fas fa-trash" onclick="removeFromCart(${index})" style="color:red; margin-left:10px;"></i>
                </div>
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
    const orderData = { id: orderId, items: cart, status: 'pending', time: new Date().toLocaleString() };
    
    // 儲存至 localStorage (模擬資料庫)
    const history = JSON.parse(localStorage.getItem('orders') || '[]');
    history.push(orderData);
    localStorage.setItem('orders', JSON.stringify(history));

    document.getElementById('order-id').innerText = orderId;
    document.getElementById('order-success').style.display = 'block';
    cart = [];
    updateCartUI();
    toggleCart();
}

// 初始化頁面
renderMenu();
