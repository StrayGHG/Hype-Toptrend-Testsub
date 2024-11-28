document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.querySelector('.cart-items');
    const subtotalElement = document.querySelector('.subtotal');
    const totalElement = document.querySelector('.total');
    const shippingElement = document.querySelector('.shipping');
    
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    function updateCartDisplay() {
        // Clear current display
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <i class="fas fa-shopping-cart"></i>
                    <p>Your cart is empty</p>
                    <a href="products.html" class="checkout-btn" style="display: inline-block; margin-top: 1rem;">
                        Continue Shopping
                    </a>
                </div>
            `;
            updateSummary(0);
            return;
        }

        // Add each item to the display
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <div class="item-price">$${item.price}</div>
                </div>
                <div class="item-quantity">
                    <button class="quantity-btn minus" data-id="${item.id}">-</button>
                    <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                    <button class="quantity-btn plus" data-id="${item.id}">+</button>
                </div>
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });

        // Update summary
        updateSummary();
    }

    function updateSummary(subtotal = calculateSubtotal()) {
        const shipping = subtotal > 0 ? 10 : 0; // $10 shipping if cart not empty
        const total = subtotal + shipping;

        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        shippingElement.textContent = `$${shipping.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
    }

    function calculateSubtotal() {
        return cart.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }

    function updateCartCount() {
        const cartCount = document.querySelectorAll('.cart-count');
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.forEach(count => count.textContent = totalItems);
    }

    // Event Listeners
    cartItemsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('minus') || 
            e.target.classList.contains('plus')) {
            const id = e.target.dataset.id;
            const item = cart.find(item => item.id === parseInt(id));
            
            if (e.target.classList.contains('minus') && item.quantity > 1) {
                item.quantity--;
            } else if (e.target.classList.contains('plus')) {
                item.quantity++;
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
            updateCartCount();
        }
        
        if (e.target.classList.contains('remove-item') || 
            e.target.closest('.remove-item')) {
            const id = e.target.dataset.id || e.target.closest('.remove-item').dataset.id;
            cart = cart.filter(item => item.id !== parseInt(id));
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
            updateCartCount();
        }
    });

    cartItemsContainer.addEventListener('change', (e) => {
        if (e.target.classList.contains('quantity-input')) {
            const id = e.target.dataset.id;
            const newQuantity = parseInt(e.target.value);
            
            if (newQuantity < 1) {
                e.target.value = 1;
                return;
            }
            
            const item = cart.find(item => item.id === parseInt(id));
            item.quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartDisplay();
            updateCartCount();
        }
    });

    // Initialize cart display
    updateCartDisplay();
    updateCartCount();
}); 

// Shopping Cart functions
class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
        this.user = firebase.auth().currentUser;
    }

    // Add item
    async addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({...product, quantity});
        }

        await this.saveCart();
    }

    // Remove item
    async removeItem(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        await this.saveCart();
    }

    // Update quantity
    async updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            await this.saveCart();
        }
    }

    // Save cart
    async saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        
        if (this.user) {
            try {
                await firebase.database()
                    .ref(`users/${this.user.uid}/cart`)
                    .set(this.items);
            } catch (error) {
                console.error('Error saving cart:', error);
            }
        }
    }

    // Calculate total
    getTotal() {
        return this.items.reduce((total, item) => {
            return total + (item.price * item.quantity);
        }, 0);
    }
}

// Initialize cart
const cart = new ShoppingCart(); 