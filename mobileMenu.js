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
            body.style.top = `-${scrollY}px`;
            body.style.width = '100%';
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

    // Event Listeners
    hamburger?.addEventListener('click', () => {
        mobileMenu.classList.add('active');
        lockScroll();
    });

    closeBtn?.addEventListener('touchend', (e) => {
        e.preventDefault();
        closeMenu();
    });

    closeBtn?.addEventListener('click', closeMenu);

    mobileMenu?.addEventListener('click', (e) => {
        if (e.target === mobileMenu) {
            closeMenu();
        }
    });

    mobileMenu?.addEventListener('touchmove', (e) => {
        if (e.target === mobileMenu) {
            e.preventDefault();
        }
    }, { passive: false });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && mobileMenu?.classList.contains('active')) {
            closeMenu();
        }
    });

    // Handle iOS safe areas
    const setIOSSafeAreas = () => {
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            document.documentElement.style.setProperty(
                '--safe-area-inset-top',
                `${window.screen.height - window.innerHeight}px`
            );
        }
    };

    window.addEventListener('resize', setIOSSafeAreas);
    setIOSSafeAreas();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeMobileMenu); 