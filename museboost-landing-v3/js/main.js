console.log('📦 Components main.js started loading');

class NavbarPart extends HTMLElement {
    constructor() {
        super();
        console.log('🏗️ NavbarPart constructor called');
    }

    async loadContent() {
        try {
            const response = await fetch('./components/navbar-part.html');
            if (!response.ok) throw new Error('Failed to load navbar');
            const html = await response.text();
            const template = document.createElement('template');
            template.innerHTML = html;
            const content = template.content.querySelector('#navbar-template');
            if (content) {
                this.appendChild(content.content.cloneNode(true));
                this.initMobileMenu();
                this.initNavbarScroll();
            }
        } catch (error) {
            console.error('Error loading navbar:', error);
        }
    }

    connectedCallback() {
        this.loadContent();
    }

    initMobileMenu() {
        const mobileMenuBtn = this.querySelector('#mobile-menu-button');
        const mobileMenu = this.querySelector('#mobile-menu');
        const hamburgerIcon = this.querySelector('#hamburger-icon');
        const closeIcon = this.querySelector('#close-icon');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
                mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
                mobileMenu.classList.toggle('hidden');
                hamburgerIcon.classList.toggle('hidden');
                closeIcon.classList.toggle('hidden');
            });
        }
    }

    initNavbarScroll() {
        let lastScroll = 0;
        const navbar = this.querySelector('nav');
        
        if (navbar) {
            window.addEventListener('scroll', () => {
                const currentScroll = window.pageYOffset;
                
                if (currentScroll <= 0) {
                    navbar.classList.remove('scroll-up');
                    return;
                }
                
                if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
                    navbar.classList.remove('scroll-up');
                    navbar.classList.add('scroll-down');
                } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
                    navbar.classList.remove('scroll-down');
                    navbar.classList.add('scroll-up');
                }
                lastScroll = currentScroll;
            });
        }
    }
}

class HeroPart extends HTMLElement {
    constructor() {
        super();
        console.log('🏗️ HeroPart constructor called');
    }

    async loadContent() {
        try {
            const response = await fetch('./components/hero-part.html');
            if (!response.ok) throw new Error('Failed to load hero');
            const html = await response.text();
            const template = document.createElement('template');
            template.innerHTML = html;
            const content = template.content.querySelector('#hero-template');
            if (content) {
                this.appendChild(content.content.cloneNode(true));
                this.initHeroButtons();
            }
        } catch (error) {
            console.error('Error loading hero:', error);
        }
    }

    connectedCallback() {
        this.loadContent();
    }

    initHeroButtons() {
        // Add hero-specific initialization here
    }
}

class CarouselPart extends HTMLElement {
    constructor() {
        super();
        console.log('🏗️ CarouselPart constructor called');
        this.currentSlide = 0;
        this.autoRotateInterval = null;
        this.totalSlides = 0;
    }

    async loadContent() {
        try {
            const response = await fetch('./components/carousel-part.html');
            if (!response.ok) throw new Error('Failed to load carousel');
            const html = await response.text();
            const template = document.createElement('template');
            template.innerHTML = html;
            const content = template.content.querySelector('#carousel-template');
            if (content) {
                this.appendChild(content.content.cloneNode(true));
                await this.initializeCarousel();
            }
        } catch (error) {
            console.error('Error loading carousel:', error);
        }
    }

    connectedCallback() {
        this.loadContent();
    }

    async initializeCarousel() {
        try {
            // Load and shuffle images
            const response = await fetch('./js/carousel-data.json');
            if (!response.ok) throw new Error('Failed to load carousel data');
            const data = await response.json();
            const shuffledImages = this.shuffleArray([...data.images]);

            // Update carousel slides with images
            const slides = this.querySelectorAll('.carousel-slides > div');
            this.totalSlides = slides.length;
            
            slides.forEach((slide, slideIndex) => {
                const images = slide.querySelectorAll('img');
                const startIdx = slideIndex * 6; // 6 images per slide
                
                images.forEach((img, imgIndex) => {
                    const imageData = shuffledImages[(startIdx + imgIndex) % shuffledImages.length];
                    if (imageData) {
                        img.src = imageData.url;
                        img.alt = imageData.alt;
                    }
                });
            });

            // Initialize carousel controls
            this.setupEventListeners();
            this.showSlide(0);
            this.startAutoRotate();
        } catch (error) {
            console.error('Error initializing carousel:', error);
        }
    }

    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    showSlide(index) {
        const slides = this.querySelectorAll('.carousel-slides > div');
        const dots = this.querySelectorAll('[data-slide]');
        
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.style.opacity = '1';
                slide.style.zIndex = '1';
                // Animate each image in the slide
                const images = slide.querySelectorAll('[data-modal-trigger]');
                images.forEach((img) => {
                    img.style.opacity = '1';
                    img.style.transform = 'translateY(0)';
                });
            } else {
                slide.style.opacity = '0';
                slide.style.zIndex = '0';
                // Reset image animations
                const images = slide.querySelectorAll('[data-modal-trigger]');
                images.forEach((img) => {
                    img.style.opacity = '0';
                    img.style.transform = 'translateY(1rem)';
                });
            }
        });

        dots.forEach((dot, i) => {
            if (i === index) {
                dot.classList.add('active');
                dot.style.backgroundColor = 'rgba(255, 255, 255, 1)';
            } else {
                dot.classList.remove('active');
                dot.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
            }
        });

        this.currentSlide = index;
    }

    setupEventListeners() {
        // Previous button
        const prevButton = this.querySelector('button[aria-label="Previous slide"]');
        const nextButton = this.querySelector('button[aria-label="Next slide"]');
        const carousel = this.querySelector('.carousel-slides');
        let touchStartX = 0;
        let touchEndX = 0;
        
        // Touch events for mobile swipe
        if (carousel) {
            carousel.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });

            carousel.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const swipeDistance = touchEndX - touchStartX;
                
                // Minimum swipe distance threshold
                if (Math.abs(swipeDistance) > 50) {
                    this.stopAutoRotate();
                    if (swipeDistance > 0) {
                        // Swipe right - go to previous slide
                        const newIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
                        this.showSlide(newIndex);
                    } else {
                        // Swipe left - go to next slide
                        const newIndex = (this.currentSlide + 1) % this.totalSlides;
                        this.showSlide(newIndex);
                    }
                    this.startAutoRotate();
                }
            }, { passive: true });
        }

        prevButton?.addEventListener('click', () => {
            this.stopAutoRotate();
            const newIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
            this.showSlide(newIndex);
            this.startAutoRotate();
        });

        nextButton?.addEventListener('click', () => {
            this.stopAutoRotate();
            const newIndex = (this.currentSlide + 1) % this.totalSlides;
            this.showSlide(newIndex);
            this.startAutoRotate();
        });

        // Dot navigation
        const dots = this.querySelectorAll('[data-slide]');
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                this.stopAutoRotate();
                this.showSlide(index);
                this.startAutoRotate();
            });
        });

        // Modal functionality
        const modalTriggers = this.querySelectorAll('[data-modal-trigger]');
        const modal = this.querySelector('#imageModal');
        const modalImage = this.querySelector('#modalImage');
        const closeModal = this.querySelector('#closeModal');

        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', () => {
                const img = trigger.querySelector('img');
                if (img && modal && modalImage) {
                    modalImage.src = img.src;
                    modalImage.alt = img.alt;
                    modal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        if (closeModal && modal) {
            closeModal.addEventListener('click', () => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            });

            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = '';
                }
            });
        }
    }

    startAutoRotate() {
        this.stopAutoRotate();
        this.autoRotateInterval = setInterval(() => {
            const newIndex = (this.currentSlide + 1) % this.totalSlides;
            this.showSlide(newIndex);
        }, 5000);
    }

    stopAutoRotate() {
        if (this.autoRotateInterval) {
            clearInterval(this.autoRotateInterval);
            this.autoRotateInterval = null;
        }
    }
}

class WhyChooseUsPart extends HTMLElement {
    constructor() {
        super();
        console.log('🏗️ WhyChooseUsPart constructor called');
    }

    async loadContent() {
        try {
            const response = await fetch('./components/whychooseus-part.html');
            if (!response.ok) throw new Error('Failed to load why choose us');
            const html = await response.text();
            const template = document.createElement('template');
            template.innerHTML = html;
            const content = template.content.querySelector('#whychooseus-template');
            if (content) {
                this.appendChild(content.content.cloneNode(true));
            }
        } catch (error) {
            console.error('Error loading why choose us:', error);
        }
    }

    connectedCallback() {
        this.loadContent();
    }
}

class ReviewsPart extends HTMLElement {
    constructor() {
        super();
        console.log('🏗️ ReviewsPart constructor called');
    }

    async loadContent() {
        try {
            const response = await fetch('./components/reviews-part.html');
            if (!response.ok) throw new Error('Failed to load reviews');
            const html = await response.text();
            const template = document.createElement('template');
            template.innerHTML = html;
            const content = template.content.querySelector('#reviews-template');
            if (content) {
                this.appendChild(content.content.cloneNode(true));
            }
        } catch (error) {
            console.error('Error loading reviews:', error);
        }
    }

    connectedCallback() {
        this.loadContent();
    }
}

class AboutPart extends HTMLElement {
    constructor() {
        super();
        console.log('🏗️ AboutPart constructor called');
    }

    async loadContent() {
        try {
            const response = await fetch('./components/about-part.html');
            if (!response.ok) throw new Error('Failed to load about');
            const html = await response.text();
            const template = document.createElement('template');
            template.innerHTML = html;
            const content = template.content.querySelector('#about-template');
            if (content) {
                this.appendChild(content.content.cloneNode(true));
            }
        } catch (error) {
            console.error('Error loading about:', error);
        }
    }

    connectedCallback() {
        this.loadContent();
    }
}

class ServicesPart extends HTMLElement {
    constructor() {
        super();
        console.log('🏗️ ServicesPart constructor called');
    }

    async loadContent() {
        try {
            const response = await fetch('./components/services-part.html');
            if (!response.ok) throw new Error('Failed to load services section');
            const html = await response.text();
            const template = document.createElement('template');
            template.innerHTML = html;
            const content = template.content.querySelector('#services-template');
            if (content) {
                this.appendChild(content.content.cloneNode(true));
            }
        } catch (error) {
            console.error('Error loading services section:', error);
        }
    }

    connectedCallback() {
        this.loadContent();
    }
}

class FooterPart extends HTMLElement {
    constructor() {
        super();
        console.log('🏗️ FooterPart constructor called');
    }

    async loadContent() {
        try {
            const response = await fetch('./components/footer-part.html');
            if (!response.ok) throw new Error('Failed to load footer');
            const html = await response.text();
            const template = document.createElement('template');
            template.innerHTML = html;
            const content = template.content.querySelector('#footer-template');
            if (content) {
                this.appendChild(content.content.cloneNode(true));
            }
        } catch (error) {
            console.error('Error loading footer:', error);
        }
    }

    connectedCallback() {
        this.loadContent();
    }
}

// Register custom elements
console.log('🔧 Registering custom elements...');
try {
    customElements.define('navbar-part', NavbarPart);
    console.log('✅ NavbarPart registered');
    customElements.define('hero-part', HeroPart);
    console.log('✅ HeroPart registered');
    customElements.define('carousel-part', CarouselPart);
    console.log('✅ CarouselPart registered');
    customElements.define('whychooseus-part', WhyChooseUsPart);
    console.log('✅ WhyChooseUsPart registered');
    customElements.define('reviews-part', ReviewsPart);
    console.log('✅ ReviewsPart registered');
    customElements.define('about-part', AboutPart);
    console.log('✅ AboutPart registered');
    customElements.define('services-part', ServicesPart);
    console.log('✅ ServicesPart registered');
    customElements.define('footer-part', FooterPart);
    console.log('✅ FooterPart registered');
} catch (error) {
    console.error('❌ Error registering components:', error);
}

console.log('🏁 Components main.js finished loading');
