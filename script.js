document.addEventListener('DOMContentLoaded', () => {
    // Initialize cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Update cart count on all pages
    function updateCartCount() {
        const cartCount = document.querySelectorAll('.cart-count');
        const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
        cartCount.forEach(count => count.textContent = totalItems);
    }

    // Add to cart function
    function addToCart(product, quantity) {
        // Check if item already exists in cart
        const existingItemIndex = cart.findIndex(item => 
            item.name === product.name && 
            item.price === product.price
        );

        if (existingItemIndex > -1) {
            // Update quantity if item exists
            cart[existingItemIndex].quantity += quantity;
        } else {
            // Add new item if it doesn't exist
            const cartItem = {
                id: Date.now(),
                name: product.name,
                price: parseFloat(product.price),
                image: product.image,
                quantity: quantity
            };
            cart.push(cartItem);
        }

        // Save to localStorage and update UI
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showSuccessModal();
    }

    // Quick View Modal Handlers
    const modal = document.querySelector('.quick-view-modal');
    const closeBtn = document.querySelector('.close-modal');
    const quickViewButtons = document.querySelectorAll('.quick-view');

    function openModal(productCard) {
        const productImage = productCard.querySelector('.product-image img').src;
        const productName = productCard.querySelector('h3').textContent;
        const productCategory = productCard.querySelector('.product-category').textContent;
        const productPrice = productCard.querySelector('.product-price').textContent;

        document.getElementById('modal-product-image').src = productImage;
        document.getElementById('modal-product-name').textContent = productName;
        document.getElementById('modal-product-category').textContent = productCategory;
        document.getElementById('modal-product-price').textContent = productPrice;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Success Modal Handlers
    const successModal = document.querySelector('.cart-success-modal');
    
    function showSuccessModal() {
        successModal.classList.add('active');
        setTimeout(() => {
            document.addEventListener('click', closeSuccessModalOutside);
        }, 100);
    }

    function closeSuccessModal() {
        successModal.classList.remove('active');
        document.removeEventListener('click', closeSuccessModalOutside);
    }

    function closeSuccessModalOutside(e) {
        if (!successModal.contains(e.target)) {
            closeSuccessModal();
        }
    }

    // Event Listeners
    quickViewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const productCard = button.closest('.product-card');
            openModal(productCard);
        });
    });

    closeBtn?.addEventListener('click', closeModal);
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });

    // Quantity Selector in Quick View
    const quantityInput = document.querySelector('.quantity-input');
    const minusBtn = document.querySelector('.minus');
    const plusBtn = document.querySelector('.plus');

    minusBtn?.addEventListener('click', () => {
        let value = parseInt(quantityInput.value);
        if (value > 1) quantityInput.value = value - 1;
    });

    plusBtn?.addEventListener('click', () => {
        let value = parseInt(quantityInput.value);
        quantityInput.value = value + 1;
    });

    // Add to Cart Button Handlers
    const modalAddToCartBtn = document.querySelector('.modal-add-to-cart');
    modalAddToCartBtn?.addEventListener('click', () => {
        const productName = document.getElementById('modal-product-name').textContent;
        const productPrice = document.getElementById('modal-product-price').textContent.replace('$', '');
        const productImage = document.getElementById('modal-product-image').src;
        const quantity = parseInt(document.querySelector('.quantity-input').value);

        const product = {
            name: productName,
            price: productPrice,
            image: productImage
        };

        addToCart(product, quantity);
    });

    // Regular Add to Cart Buttons
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productCard = button.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.product-price').textContent.replace('$', '');
            const productImage = productCard.querySelector('img').src;

            const product = {
                name: productName,
                price: productPrice,
                image: productImage
            };

            addToCart(product, 1);
        });
    });

    // Success Modal Button Handlers
    const continueShoppingBtn = document.querySelector('.continue-shopping');
    const goToCartBtn = document.querySelector('.go-to-cart');

    continueShoppingBtn?.addEventListener('click', () => {
        closeSuccessModal();
        closeModal();
    });

    goToCartBtn?.addEventListener('click', () => {
        window.location.href = 'cart.html';
    });

    // Initialize cart count on page load
    updateCartCount();

    // Add logout function
    function logout() {
        firebase.auth().signOut().then(() => {
            // Clear local storage
            localStorage.removeItem('cart');
            // Redirect to login
            window.location.href = 'login.html';
        }).catch((error) => {
            console.error('Error signing out:', error);
        });
    }

    // Mobile Menu Functionality
    const hamburger = document.querySelector('.hamburger');
    const navItems = document.querySelector('.nav-items');
    const overlay = document.querySelector('.mobile-overlay');
    const mobileCloseBtn = document.querySelector('.mobile-close'); 
    const body = document.body;

    function closeMenu() {
        hamburger.classList.remove('active');
        navItems.classList.remove('active');
        overlay.classList.remove('active');
        body.style.overflow = '';
    }

    function openMenu() {
        hamburger.classList.add('active');
        navItems.classList.add('active');
        overlay.classList.add('active');
        body.style.overflow = 'hidden';
    }

    // Toggle menu
    hamburger?.addEventListener('click', () => {
        if (navItems.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    });

    // Close menu when clicking overlay
    overlay?.addEventListener('click', closeMenu);

    // Close menu when clicking close button
    closeBtn?.addEventListener('click', closeMenu);

    // Close menu when clicking links
    navItems?.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && navItems.classList.contains('active')) {
            closeMenu();
        }
    });

    const mobileMenu = document.querySelector('.mobile-menu-modal');
    // Rename to avoid redeclaration
    const modalCloseBtn = document.querySelector('.mobile-menu-close');

    // Toggle mobile menu
    hamburger?.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        body.style.overflow = 'hidden';
    });

    // Close menu function
    function closeMenu() {
        mobileMenu.classList.remove('active');
        body.style.overflow = '';
    }

    // Close with X button
    closeBtn?.addEventListener('click', closeMenu);

    // Close when clicking outside the menu
    mobileMenu?.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            closeMenu();
        }
    });

    // Close menu when clicking a link
    const menuLinks = document.querySelectorAll('.mobile-menu-items a');
    menuLinks.forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when pressing Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });
});