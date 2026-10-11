
const products = [
  { id: 1, name: "Studio Headphones", category: "Tech", price: 79.99, emoji: "🎧" },
  { id: 2, name: "Everyday Sneakers", category: "Style", price: 64.99, emoji: "👟" },
  { id: 3, name: "Minimal Watch", category: "Style", price: 89.99, emoji: "⌚" },
  { id: 4, name: "Travel Backpack", category: "Lifestyle", price: 49.99, emoji: "🎒" },
  { id: 5, name: "Smart Speaker", category: "Tech", price: 54.99, emoji: "🔊" },
  { id: 6, name: "Classic Sunglasses", category: "Style", price: 29.99, emoji: "🕶️" },
  { id: 7, name: "Coffee Tumbler", category: "Lifestyle", price: 19.99, emoji: "☕" },
  { id: 8, name: "Wireless Controller", category: "Tech", price: 44.99, emoji: "🎮" }
];

const productGrid = document.querySelector("#product-grid");
const searchInput = document.querySelector("#search");
const resultCount = document.querySelector("#result-count");
const cartOverlay = document.querySelector("#cart-overlay");
const cartItems = document.querySelector("#cart-items");
const cartCount = document.querySelector("#cart-count");
const cartTotal = document.querySelector("#cart-total");

let activeCategory = "All";
const cart = new Map();

const money = (amount) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR"
  }).format(amount);

function renderProducts() {
  const query = searchInput.value.trim().toLowerCase();

  const filtered = products.filter((product) => {
    const matchesCategory =
      activeCategory === "All" || product.category === activeCategory;
    const matchesSearch =
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  resultCount.textContent = `${filtered.length} product${filtered.length === 1 ? "" : "s"} found`;

  productGrid.replaceChildren();

  if (filtered.length === 0) {
    const message = document.createElement("p");
    message.className = "empty-message";
    message.textContent = "No products found. Try another search.";
    productGrid.append(message);
    return;
  }

  filtered.forEach((product) => {
    const card = document.createElement("article");
    card.className = "product-card";

    const art = document.createElement("div");
    art.className = "product-art";
    art.setAttribute("aria-hidden", "true");

    const emoji = document.createElement("span");
    emoji.textContent = product.emoji;
    art.append(emoji);

    const category = document.createElement("p");
    category.className = "product-category";
    category.textContent = product.category;

    const name = document.createElement("h3");
    name.textContent = product.name;

    const bottom = document.createElement("div");
    bottom.className = "product-bottom";

    const price = document.createElement("span");
    price.className = "product-price";
    price.textContent = money(product.price);

    const addButton = document.createElement("button");
    addButton.className = "add-button";
    addButton.textContent = "Add to bag +";
    addButton.addEventListener("click", () => addToCart(product.id));

    bottom.append(price, addButton);
    card.append(art, category, name, bottom);
    productGrid.append(card);
  });
}

function addToCart(productId) {
  cart.set(productId, (cart.get(productId) || 0) + 1);
  renderCart();
}

function changeQuantity(productId, change) {
  const quantity = (cart.get(productId) || 0) + change;

  if (quantity <= 0) {
    cart.delete(productId);
  } else {
    cart.set(productId, quantity);
  }

  renderCart();
}

function renderCart() {
  cartItems.replaceChildren();

  let totalItems = 0;
  let totalPrice = 0;

  cart.forEach((quantity, productId) => {
    const product = products.find((item) => item.id === productId);
    if (!product) return;

    totalItems += quantity;
    totalPrice += product.price * quantity;

    const row = document.createElement("div");
    row.className = "cart-row";

    const details = document.createElement("div");
    const name = document.createElement("p");
    name.textContent = product.name;

    const price = document.createElement("p");
    price.textContent = money(product.price * quantity);

    const controls = document.createElement("div");
    controls.className = "quantity-controls";

    const decrease = document.createElement("button");
    decrease.textContent = "−";
    decrease.setAttribute("aria-label", `Remove one ${product.name}`);
    decrease.addEventListener("click", () => changeQuantity(productId, -1));

    const quantityLabel = document.createElement("span");
    quantityLabel.textContent = String(quantity);

    const increase = document.createElement("button");
    increase.textContent = "+";
    increase.setAttribute("aria-label", `Add one ${product.name}`);
    increase.addEventListener("click", () => changeQuantity(productId, 1));

    const remove = document.createElement("button");
    remove.className = "remove-button";
    remove.textContent = "Remove";
    remove.addEventListener("click", () => {
      cart.delete(productId);
      renderCart();
    });

    details.append(name, price);
    controls.append(decrease, quantityLabel, increase, remove);
    row.append(details, controls);
    cartItems.append(row);
  });

  if (totalItems === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-message";
    empty.textContent = "Your bag is empty. Let's find something you love!";
    cartItems.append(empty);
  }

  cartCount.textContent = String(totalItems);
  cartTotal.textContent = money(totalPrice);
}

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => {
    activeCategory = button.dataset.category;

    document.querySelectorAll(".filter").forEach((filter) => {
      const isActive = filter === button;
      filter.classList.toggle("active", isActive);
      filter.setAttribute("aria-pressed", String(isActive));
    });

    renderProducts();
  });
});

searchInput.addEventListener("input", renderProducts);

document.querySelector("#cart-button").addEventListener("click", () => {
  cartOverlay.hidden = false;
  document.querySelector("#close-cart").focus();
});

document.querySelector("#close-cart").addEventListener("click", () => {
  cartOverlay.hidden = true;
  document.querySelector("#cart-button").focus();
});

cartOverlay.addEventListener("click", (event) => {
  if (event.target === cartOverlay) {
    cartOverlay.hidden = true;
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !cartOverlay.hidden) {
    cartOverlay.hidden = true;
    document.querySelector("#cart-button").focus();
  }
});

document.querySelector("#checkout").addEventListener("click", () => {
  window.alert("This is a demo store. Payment and checkout are not enabled yet.");
});

renderProducts();
renderCart();
