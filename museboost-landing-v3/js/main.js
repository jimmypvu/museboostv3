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

// Utility function to shuffle array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Function to randomize carousel images
async function randomizeCarouselImages() {
    try {
        const response = await fetch('/js/carousel-data.json');
        const data = await response.json();
        
        // Shuffle the image URLs
        const shuffledImages = shuffleArray([...data.images]);
        
        // Get all carousel slides
        const carouselSlides = document.querySelectorAll('carousel-part .carousel-slide');
        
        // Update image sources in each slide
        carouselSlides.forEach((slide, slideIndex) => {
            const images = slide.querySelectorAll('img');
            const startIdx = slideIndex * 8; // 8 images per slide
            
            images.forEach((img, imgIndex) => {
                const imageData = shuffledImages[(startIdx + imgIndex) % shuffledImages.length];
                img.src = imageData.url;
                img.alt = imageData.alt;
            });
        });
    } catch (error) {
        console.error('Error randomizing carousel images:', error);
    }
}

// Define the custom elements
class NavbarPart extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        try {
            const response = await fetch('/components/navbar-part.html');
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const template = doc.querySelector('#navbar-template');
            
            if (template) {
                this.appendChild(template.content.cloneNode(true));
                this.initMobileMenu();
                this.initNavbarScroll();
            } else {
                console.error('Could not find navbar template');
            }
        } catch (error) {
            console.error('Error loading navbar component:', error);
        }
    }

    initMobileMenu() {
        const menuButton = this.querySelector('#mobile-menu-button');
        const mobileMenu = this.querySelector('#mobile-menu');
        const hamburgerIcon = this.querySelector('#hamburger-icon');
        const closeIcon = this.querySelector('#close-icon');

        if (menuButton && mobileMenu) {
            menuButton.addEventListener('click', () => {
                const isExpanded = menuButton.getAttribute('aria-expanded') === 'true';
                menuButton.setAttribute('aria-expanded', !isExpanded);
                mobileMenu.classList.toggle('hidden');
                hamburgerIcon.classList.toggle('hidden');
                closeIcon.classList.toggle('hidden');
            });
        }
    }

    initNavbarScroll() {
        const navbar = this.querySelector('.navbar');
        if (navbar) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 0) {
                    navbar.style.backgroundColor = 'rgba(5, 5, 5, 0.8)';
                } else {
                    navbar.style.backgroundColor = 'rgb(5, 5, 5)';
                }
            });
        }
    }
}

class HeroPart extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        try {
            const response = await fetch('/components/hero-part.html');
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const template = doc.querySelector('#hero-template');
            
            if (template) {
                this.appendChild(template.content.cloneNode(true));
                this.initHeroButtons();
            } else {
                console.error('Could not find hero template');
            }
        } catch (error) {
            console.error('Error loading hero component:', error);
        }
    }

    initHeroButtons() {
        const learnMoreBtn = this.querySelector('.cta-button.secondary');
        const getStartedBtn = this.querySelector('.cta-button.primary');

        if (learnMoreBtn) {
            learnMoreBtn.addEventListener('click', () => {
                document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
            });
        }

        if (getStartedBtn) {
            getStartedBtn.addEventListener('click', () => {
                document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
            });
        }
    }
}

class CarouselPart extends HTMLElement {
    constructor() {
        super();
        console.log('CarouselPart: Constructor initialized');
        this.attachShadow({ mode: 'open' });
        this.currentSlide = 0;
        this.autoRotateInterval = null;
        this.totalSlides = 0;
    }

    connectedCallback() {
        console.log('CarouselPart: Connected to DOM');
        try {
            const template = document.createElement('template');
            template.innerHTML = `
                <link rel="stylesheet" href="/styles/normalize.css">
                <link rel="stylesheet" href="/styles/main.css">
                <section class="relative overflow-hidden py-16 md:py-24 bg-[var(--dark-bg)]">
        <div class="flex flex-col items-center justify-between">
            <div class="relative min-h-[600px] max-w-[1200px] w-full px-16 mb-8">
                <button class="absolute top-1/2 -translate-y-1/2 w-12 h-12 bg-black/90 hover:bg-black rounded-full cursor-pointer z-10 flex items-center justify-center transition-colors duration-300 -left-6 shadow-lg" aria-label="Previous slide">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                
                <div class="carousel-slides relative w-full h-full">
                    <!-- Slide 1 -->
                    <div class="absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out active:opacity-100">
                        <div class="grid grid-cols-3 grid-rows-2 gap-6 aspect-[3/2] w-full max-w-[900px] mx-auto">
                            <div class="relative overflow-hidden rounded-xl cursor-pointer" data-modal-trigger>
                                <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 1" src="https://placehold.co/400x400">
                            </div>
                            <div class="relative overflow-hidden rounded-xl cursor-pointer" data-modal-trigger>
                                <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 2" src="https://placehold.co/400x400">
                            </div>
                            <div class="relative overflow-hidden rounded-xl cursor-pointer" data-modal-trigger>
                                <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 3" src="https://placehold.co/400x400">
                            </div>
                            <div class="relative overflow-hidden rounded-xl cursor-pointer" data-modal-trigger>
                                <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 4" src="https://placehold.co/400x400">
                            </div>
                            <div class="relative overflow-hidden rounded-xl cursor-pointer" data-modal-trigger>
                                <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 5" src="https://placehold.co/400x400">
                            </div>
                            <div class="relative overflow-hidden rounded-xl cursor-pointer" data-modal-trigger>
                                <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 6" src="https://placehold.co/400x400">
                            </div>
                        </div>
                    </div>

                    <!-- Slide 2 -->
                    <div class="absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out">
                        <div class="grid grid-cols-3 grid-rows-2 gap-6 aspect-[3/2] w-full max-w-[900px] mx-auto">
                            <div class="relative overflow-hidden rounded-xl cursor-pointer" data-modal-trigger>
                                <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 7" src="https://placehold.co/400x400">
                            </div>
                            <div class="relative overflow-hidden rounded-xl cursor-pointer" data-modal-trigger>
                                <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 8" src="https://placehold.co/400x400">
                            </div>
                            <div class="relative overflow-hidden rounded-xl cursor-pointer" data-modal-trigger>
                                <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 9" src="https://placehold.co/400x400">
                            </div>
                            <div class="relative overflow-hidden rounded-xl cursor-pointer" data-modal-trigger>
                                <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 10" src="https://placehold.co/400x400">
                            </div>
                            <div class="relative overflow-hidden rounded-xl cursor-pointer" data-modal-trigger>
                                <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 11" src="https://placehold.co/400x400">
                            </div>
                            <div class="relative overflow-hidden rounded-xl cursor-pointer" data-modal-trigger>
                                <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 12" src="https://placehold.co/400x400">
                            </div>
                        </div>
                    </div>

                    <!-- Slide 3 -->
                    <div class="absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out">
                        <div class="grid grid-cols-3 grid-rows-2 gap-6 aspect-[3/2] w-full max-w-[900px] mx-auto">
                            <div class="relative overflow-hidden rounded-xl cursor-pointer" data-modal-trigger>
                                <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 13" src="https://placehold.co/400x400">
                            </div>
                            <div class="relative overflow-hidden rounded-xl cursor-pointer" data-modal-trigger>
                                <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 14" src="https://placehold.co/400x400">
                            </div>
                            <div class="relative overflow-hidden rounded-xl cursor-pointer" data-modal-trigger>
                                <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 15" src="https://placehold.co/400x400">
                            </div>
                            <div class="relative overflow-hidden rounded-xl cursor-pointer" data-modal-trigger>
                                <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 16" src="https://placehold.co/400x400">
                            </div>
                            <div class="relative overflow-hidden rounded-xl cursor-pointer" data-modal-trigger>
                                <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 17" src="https://placehold.co/400x400">
                            </div>
                            <div class="relative overflow-hidden rounded-xl cursor-pointer" data-modal-trigger>
                                <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 18" src="https://placehold.co/400x400">
                            </div>
                        </div>
                    </div>

                    <!-- Slide 4 -->
                    <div class="absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out">
                        <div class="grid grid-cols-3 grid-rows-2 gap-6 aspect-[3/2] w-full max-w-[900px] mx-auto">
                            <div class="relative overflow-hidden rounded-xl cursor-pointer" data-modal-trigger>
                                <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 19" src="https://placehold.co/400x400">
                            </div>
                            <div class="relative overflow-hidden rounded-xl cursor-pointer" data-modal-trigger>
                                <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 20" src="https://placehold.co/400x400">
                            </div>
                            <div class="relative overflow-hidden rounded-xl cursor-pointer" data-modal-trigger>
                                <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 21" src="https://placehold.co/400x400">
                            </div>
                            <div class="relative overflow-hidden rounded-xl cursor-pointer" data-modal-trigger>
                                <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 22" src="https://placehold.co/400x400">
                            </div>
                            <div class="relative overflow-hidden rounded-xl cursor-pointer" data-modal-trigger>
                                <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 23" src="https://placehold.co/400x400">
                            </div>
                            <div class="relative overflow-hidden rounded-xl cursor-pointer" data-modal-trigger>
                                <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 24" src="https://placehold.co/400x400">
                            </div>
                        </div>
                    </div>

                    <!-- Slide 5 -->
                    <div class="absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out">
                        <div class="grid grid-cols-3 grid-rows-2 gap-6 aspect-[3/2] w-full max-w-[900px] mx-auto">
                            <div class="relative overflow-hidden rounded-xl cursor-pointer" data-modal-trigger>
                                <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 25" src="https://placehold.co/400x400">
                            </div>
                            <div class="relative overflow-hidden rounded-xl cursor-pointer" data-modal-trigger>
                                <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 26" src="https://placehold.co/400x400">
                            </div>
                            <div class="relative overflow-hidden rounded-xl cursor-pointer" data-modal-trigger>
                                <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 27" src="https://placehold.co/400x400">
                            </div>
                            <div class="relative overflow-hidden rounded-xl cursor-pointer" data-modal-trigger>
                                <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 28" src="https://placehold.co/400x400">
                            </div>
                            <div class="relative overflow-hidden rounded-xl cursor-pointer" data-modal-trigger>
                                <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 29" src="https://placehold.co/400x400">
                            </div>
                            <div class="relative overflow-hidden rounded-xl cursor-pointer" data-modal-trigger>
                                <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 30" src="https://placehold.co/400x400">
                            </div>
                        </div>
                    </div>
                </div>

                <button class="absolute top-1/2 -translate-y-1/2 w-12 h-12 bg-black/90 hover:bg-black rounded-full cursor-pointer z-10 flex items-center justify-center transition-colors duration-300 -right-6 shadow-lg" aria-label="Next slide">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
            
            <div class="flex justify-center gap-3">
                <button class="w-2 h-2 rounded-full bg-white/30 hover:bg-white/80 transition-colors duration-300 active" data-slide="0"></button>
                <button class="w-2 h-2 rounded-full bg-white/30 hover:bg-white/80 transition-colors duration-300" data-slide="1"></button>
                <button class="w-2 h-2 rounded-full bg-white/30 hover:bg-white/80 transition-colors duration-300" data-slide="2"></button>
                <button class="w-2 h-2 rounded-full bg-white/30 hover:bg-white/80 transition-colors duration-300" data-slide="3"></button>
                <button class="w-2 h-2 rounded-full bg-white/30 hover:bg-white/80 transition-colors duration-300" data-slide="4"></button>
            </div>
        </div>
    </section>

    <!-- Image Modal -->
    <div class="fixed inset-0 bg-black/80 z-50 hidden items-center justify-center" id="imageModal">
        <div class="relative max-w-[90vw] max-h-[90vh]">
            <button class="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-300" id="closeModal">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
            <img src="" alt="" class="max-w-full max-h-[85vh] object-contain rounded-lg" id="modalImage">
        </div>
    </div>`;
            
            this.shadowRoot.appendChild(template.content.cloneNode(true));
            
            this.initializeCarousel();
            console.log('CarouselPart: Initialization complete');
        } catch (error) {
            console.error('Failed to load carousel component:', error);
        }
    }

    async initializeCarousel() {
        console.log('CarouselPart: Starting image load');
        try {
            const response = await fetch('/js/carousel-data.json');
            const data = await response.json();
            console.log(`CarouselPart: Loaded image data: ${data.images.length} images`);

            // shuffle images
            data.images.sort(() => 0.5 - Math.random());

            // Preload all images first
            await Promise.all(data.images.map(imageData => {
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = resolve;
                    img.onerror = reject;
                    img.src = imageData.url;
                });
            }));

            const slides = this.shadowRoot.querySelectorAll('.carousel-slides > div');
            const imagesPerSlide = 6;
            let currentImageIndex = 0;

            slides.forEach((slide, slideIndex) => {
                const images = slide.querySelectorAll('img');
                
                images.forEach((img) => {
                    if (currentImageIndex < data.images.length) {
                        const imageData = data.images[currentImageIndex];
                        img.src = imageData.url;
                        img.alt = imageData.alt;
                        currentImageIndex++;
                    }
                });
            });

            // Show first slide immediately after loading
            this.showSlide(0);
            this.totalSlides = slides.length;
            this.setupEventListeners();
            this.startAutoRotate();

        } catch (error) {
            console.error('Error loading images:', error);
            this.handleImageLoadError();
        }
    }

    showSlide(index) {
        const slides = this.shadowRoot.querySelectorAll('.carousel-slides > div');
        const dots = this.shadowRoot.querySelectorAll('[data-slide]');
        
        // Hide all slides first
        slides.forEach(slide => {
            slide.style.opacity = '0';
            slide.style.zIndex = '0';
            slide.style.transition = 'opacity 500ms ease-in-out';
        });

        // Show the target slide
        if (slides[index]) {
            slides[index].style.opacity = '1';
            slides[index].style.zIndex = '1';
        }

        // Update dots
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
        // Previous button click
        const prevButton = this.shadowRoot.querySelector('button[aria-label="Previous slide"]');
        prevButton?.addEventListener('click', () => {
            const newIndex = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
            this.showSlide(newIndex);
        });

        // Next button click
        const nextButton = this.shadowRoot.querySelector('button[aria-label="Next slide"]');
        nextButton?.addEventListener('click', () => {
            const newIndex = (this.currentSlide + 1) % this.totalSlides;
            this.showSlide(newIndex);
        });

        // Dot navigation
        const dots = this.shadowRoot.querySelectorAll('[data-slide]');
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.showSlide(index));
        });

        // Modal functionality
        const modalTriggers = this.shadowRoot.querySelectorAll('[data-modal-trigger]');
        const modal = this.shadowRoot.querySelector('#imageModal');
        const modalImage = this.shadowRoot.querySelector('#modalImage');
        const closeModal = this.shadowRoot.querySelector('#closeModal');

        modalTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                const img = trigger.querySelector('img');
                if (img) {
                    modalImage.src = img.src;
                    modalImage.alt = img.alt;
                    modal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        closeModal?.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = '';
        });

        modal?.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }
        });
    }

    startAutoRotate() {
        console.log('CarouselPart: Starting auto-rotate');
        this.stopAutoRotate();
        this.autoRotateInterval = setInterval(() => {
            console.log('CarouselPart: Auto-rotating to next slide');
            const newIndex = (this.currentSlide + 1) % this.totalSlides;
            this.showSlide(newIndex);
        }, 5000);
    }

    stopAutoRotate() {
        console.log('CarouselPart: Stopping auto-rotate');
        if (this.autoRotateInterval) {
            clearInterval(this.autoRotateInterval);
            this.autoRotateInterval = null;
        }
    }

    handleImageLoadError() {
        console.log('CarouselPart: Handling image load error');
        const images = this.shadowRoot.querySelectorAll('.image-item img');
        images.forEach(img => {
            img.src = 'https://placehold.co/600x800/FF4D8D/ffffff?text=Image+Loading+Error';
        });
    }
}

class ReviewsPart extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        try {
            const response = await fetch('/components/reviews-part.html');
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const template = doc.querySelector('#reviews-template');
            
            if (template) {
                this.appendChild(template.content.cloneNode(true));
            } else {
                console.error('Could not find reviews template');
            }
        } catch (error) {
            console.error('Error loading reviews component:', error);
        }
    }
}

// Register the custom elements
customElements.define('navbar-part', NavbarPart);
customElements.define('hero-part', HeroPart);
customElements.define('carousel-part', CarouselPart);
customElements.define('reviews-part', ReviewsPart);

// Initialize mobile menu
function initMobileMenu() {
    const menuButton = document.querySelector('#mobile-menu-button');
    const mobileMenu = document.querySelector('#mobile-menu');

    if (!menuButton || !mobileMenu) {
        console.log('Mobile menu elements not found');
        return;
    }

    menuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', async () => {
    console.log('DOM fully loaded');

    // Find carousel component
    const carousel = document.querySelector('carousel-part');
    if (carousel) {
        console.log('Found carousel component');
    }

    // Initialize mobile menu
    initMobileMenu();
});
