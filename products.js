// Sample product data
const products = [
    {
        id: 1,
        name: "Kenzo Tiger Hoodie",
        price: 299.99,
        category: "hoodies",
        image: "Images/kenzo.png",
        description: "Iconic Kenzo Tiger embroidered hoodie in premium cotton",
        featured: true
    },
    {
        id: 2,
        name: "Nike TN I Sneakers",
        price: 129.99,
        category: "sneakers",
        image: "Images/NikeTN.webp",
        description: "Stylish Nike Tuned Air I sneakers"
    },
    {
        id: 3,
        name: "Nike TN III Sneakers",
        price: 139.99,
        category: "tshirts",
        image: "Images/NikeTN3.webp",
        description: "Stylish Nike Tuned Air III sneakers"
    },
    // Add more products as needed
];

// Initialize cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];
updateCartCount();

// Render products
function renderProducts(productsToRender = products) {
    const productsGrid = document.querySelector('.products-grid');
    productsGrid.innerHTML = '';

    // First render featured products
    const featuredProducts = productsToRender.filter(p => p.featured);
    featuredProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card featured';
        productCard.innerHTML = `
            <div class="featured-badge">Featured</div>
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart-btn" data-id="${product.id}">
                    Add to Cart
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });

    // Then render non-featured products
    const regularProducts = productsToRender.filter(p => !p.featured);
    regularProducts.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <button class="add-to-cart-btn" data-id="${product.id}">
                    Add to Cart
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });

    // Add to cart functionality
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', addToCart);
    });
}

// Filter functionality
function applyFilters() {
    let filteredProducts = [...products];

    // Category filters
    const selectedCategories = Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);
    
    if (selectedCategories.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            selectedCategories.includes(product.category));
    }

    // Price filter
    const maxPrice = document.querySelector('.price-range').value;
    filteredProducts = filteredProducts.filter(product => 
        product.price <= maxPrice);

    renderProducts(filteredProducts);
}

// Add to cart function
function addToCart(e) {
    const productId = parseInt(e.target.dataset.id);
    const product = products.find(p => p.id === productId);
    
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    // Save to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();

    // Animation feedback
    const button = e.target;
    button.innerHTML = '✓ Added';
    button.style.background = '#4CAF50';
    
    setTimeout(() => {
        button.innerHTML = 'Add to Cart';
        button.style.background = '';
    }, 1500);
}

// Update cart count
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Price range display
const priceRange = document.querySelector('.price-range');
const priceValue = document.querySelector('.price-value');

priceRange.addEventListener('input', (e) => {
    priceValue.textContent = `$${e.target.value}`;
});

// Event listeners
document.querySelector('.apply-filters').addEventListener('click', applyFilters);

// Initial render
renderProducts();
