// Utility function to attach HTML parts
async function attachPart(targetSelector, partPath) {
    try {
        const response = await fetch(partPath);
        if (!response.ok) throw new Error(`Failed to load ${partPath}`);
        const html = await response.text();
        
        const targetElement = document.querySelector(targetSelector);
        if (!targetElement) throw new Error(`Target element ${targetSelector} not found`);
        
        // Insert the HTML before the first child of body
        targetElement.insertAdjacentHTML('afterbegin', html);
        
        return true;
    } catch (error) {
        console.error('Error attaching part:', error);
        return false;
    }
}

// Initialize mobile menu functionality
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const hamburgerIcon = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');

    if (!mobileMenuButton || !mobileMenu || !hamburgerIcon || !closeIcon) return;

    mobileMenuButton.addEventListener('click', () => {
        const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
        
        mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
        mobileMenu.classList.toggle('hidden');
        hamburgerIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
            mobileMenu.classList.add('hidden');
            hamburgerIcon.classList.remove('hidden');
            closeIcon.classList.add('hidden');
            mobileMenuButton.setAttribute('aria-expanded', 'false');
        }
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    // Attach components
    await Promise.all([
        attachPart('body', '/components/navbar-part.html'),
        attachPart('body', '/components/hero-part.html')
    ]);
    
    // Initialize mobile menu after navbar is attached
    initMobileMenu();
    
    // Initialize other components
    const waitlistBtn = document.getElementById('waitlist-btn');
    if (waitlistBtn) {
        waitlistBtn.addEventListener('click', () => {
            alert("Thanks for your interest! We'll notify you when MuseBoost V3 launches.");
        });
    }

    // Optional: Add scroll-based animations
    const observerOptions = {
        threshold: 0.1
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('section').forEach(section => {
        fadeInObserver.observe(section);
    });
});
