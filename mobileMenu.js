// Mobile Menu Handler
function initializeMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu-modal');
    const closeBtn = document.querySelector('.mobile-menu-close');
    const body = document.body;

    function lockScroll() {
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            const scrollY = window.scrollY;
            body.style.position = 'fixed';
            body.style.width = '100%';
            body.style.top = `-${scrollY}px`;
        } else {
            body.style.overflow = 'hidden';
        }
    }

    function unlockScroll() {
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            const scrollY = body.style.top;
            body.style.position = '';
            body.style.top = '';
            body.style.width = '';
            window.scrollTo(0, parseInt(scrollY || '0') * -1);
        } else {
            body.style.overflow = '';
        }
    }

    function closeMenu() {
        mobileMenu?.classList.remove('active');
        unlockScroll();
    }

    hamburger?.addEventListener('click', (e) => {
        e.preventDefault();
        mobileMenu.classList.add('active');
        lockScroll();
    });

    closeBtn?.addEventListener('click', closeMenu);

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

    // Prevent touchmove on modal when open (iOS scroll fix)
    mobileMenu?.addEventListener('touchmove', (e) => {
        if (e.target === mobileMenu) {
            e.preventDefault();
        }
    }, { passive: false });
}

document.addEventListener('DOMContentLoaded', initializeMobileMenu); 