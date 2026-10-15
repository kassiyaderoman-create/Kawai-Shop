const tg = window.Telegram.WebApp;
tg.expand(); // Mini App'ni to'liq ekranga yozish

// KAWAI SHOP Mahsulotlari ro'yxati
const products = [
  { id: 1, title: "Bleach Zip-Hudi", price: 190000, category: "hoodie", img: "https://via.placeholder.com/150/1a1d2e/ff7597?text=Bleach+Hoodie" },
  { id: 2, title: "Anime Tumor / Uzuk", price: 55000, category: "aksessuar", img: "https://via.placeholder.com/150/1a1d2e/ff7597?text=Tumor+Uzuk" },
  { id: 3, title: "Genshin Impact Haykalcha", price: 210000, category: "haykal", img: "https://via.placeholder.com/150/1a1d2e/ff7597?text=Genshin+Figurka" },
  { id: 4, title: "Anime Stikerlar Paketi", price: 25000, category: "kantselariya", img: "https://via.placeholder.com/150/1a1d2e/ff7597?text=Stikerlar" }
];

let cart = [];

// Mahsulotlarni ekranga chiqarish
function renderProducts(filter = 'all') {
  const container = document.getElementById('products-container');
  container.innerHTML = '';

  const filtered = filter === 'all' ? products : products.filter(p => p.category === filter);

  filtered.forEach(p => {
    container.innerHTML += `
      <div class="product-card">
        <img src="${p.img}" class="product-img" alt="${p.title}">
        <div class="product-info">
          <div class="product-title">${p.title}</div>
          <div class="product-price">${p.price.toLocaleString()} so'm</div>
          <button class="add-btn" onclick="addToCart(${p.id})">+ Savatchaga</button>
        </div>
      </div>
    `;
  });
}

// Savatchaga qo'shish
function addToCart(id) {
  const item = products.find(p => p.id === id);
  cart.push(item);
  updateCartUI();
  tg.HapticFeedback.impactOccurred('light'); // Vibratsiya effekti
}

// Savatchani yangilash
function updateCartUI() {
  document.getElementById('cart-count').innerText = cart.length;
  const itemsContainer = document.getElementById('cart-items-container');
  itemsContainer.innerHTML = '';

  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    itemsContainer.innerHTML += `
      <div class="cart-item">
        <div>
          <strong>${item.title}</strong>
          <br><small>${item.price.toLocaleString()} so'm</small>
        </div>
        <button onclick="removeFromCart(${index})" style="background:none; border:none; color:red;">❌</button>
      </div>
    `;
  });

  document.getElementById('cart-total-price').innerText = total.toLocaleString() + " so'm";
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartUI();
}

function filterProducts(cat) {
  document.querySelectorAll('.cat-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
  renderProducts(cat);
}

function toggleCartModal() {
  const modal = document.getElementById('cart-modal');
  modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

// Buyurtmani Telegram Botga yuborish
function sendOrder() {
  if (cart.length === 0) {
    alert("Savatchangiz bo'sh!");
    return;
  }

  const orderData = {
    user: tg.initDataUnsafe?.user || { first_name: "Xaridor" },
    items: cart,
    total: cart.reduce((sum, item) => sum + item.price, 0)
  };

  // Telegramga ma'lumot jo'natish
  tg.sendData(JSON.stringify(orderData));
  tg.close();
}

// Dastlabki yuklash
renderProducts();