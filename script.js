document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    function updateCartCount() {
        const cartCount = document.querySelectorAll('.cart-count');
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.forEach(count => count.textContent = totalItems);
    }

    // Add to cart function
    function addToCart(product, quantity) {
        const existingItemIndex = cart.findIndex(item => 
            item.name === product.name && 
            item.price === product.price
        );

        if (existingItemIndex > -1) {
            cart[existingItemIndex].quantity += quantity;
        } else {
            cart.push({
                id: Date.now(),
                name: product.name,
                price: parseFloat(product.price),
                image: product.image,
                quantity: quantity
            });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showSuccessModal();
    }

    // Initialize cart display
    updateCartCount();
});