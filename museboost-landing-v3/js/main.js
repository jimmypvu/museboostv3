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
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const template = document.createElement('template');
        template.innerHTML = `
            <link rel="stylesheet" href="/styles/normalize.css">
            <link rel="stylesheet" href="/styles/main.css">
            <nav class="navbar fixed top-0 left-0 right-0 bg-[var(--darker-bg)] text-[var(--cream-white)] shadow-md z-50 px-2">
                <div class="nav-container max-w-9xl mx-auto flex justify-between items-center h-16">
                    <div class="nav-left flex items-center">
                        <div class="mx-2 nav-brand">
                            <a href="/" class="group flex items-center space-x-2 transition-colors">
                                <span class="font-brand italic text-3xl bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] bg-clip-text text-transparent">Muse<span class="text-[var(--cream-white)]">+</span></span>
                                <span class="heart-icon inline-flex">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--cream-white)" stroke-width="1.5" class="transition-all duration-300 group-hover:stroke-[url(#heartGradient)] group-hover:scale-105">
                                        <defs>
                                            <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                                <stop offset="0%" style="stop-color:var(--primary-color)" />
                                                <stop offset="100%" style="stop-color:var(--secondary-color)" />
                                            </linearGradient>
                                        </defs>
                                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                                    </svg>
                                </span>
                            </a>
                        </div>
                    </div>

                    <div class="nav-right flex items-center">
                        <!-- Desktop Navigation -->
                        <div class="nav-links hidden md:flex items-center">
                            <a href="/services" class="text-[var(--cream-white)] hover:bg-gradient-to-r hover:from-[var(--primary-color)] hover:to-[var(--secondary-color)] hover:bg-clip-text hover:text-transparent px-3 py-2 rounded-md text-sm transition-colors relative">Services</a>
                            <a href="/creators" class="text-[var(--cream-white)] hover:bg-gradient-to-r hover:from-[var(--primary-color)] hover:to-[var(--secondary-color)] hover:bg-clip-text hover:text-transparent px-3 py-2 rounded-md text-sm transition-colors relative">Creators</a>
                            <a href="/#reviews" class="text-[var(--cream-white)] hover:bg-gradient-to-r hover:from-[var(--primary-color)] hover:to-[var(--secondary-color)] hover:bg-clip-text hover:text-transparent px-3 py-2 rounded-md text-sm transition-colors relative">Results & Reviews</a>
                            <a href="/blog" class="text-[var(--cream-white)] hover:bg-gradient-to-r hover:from-[var(--primary-color)] hover:to-[var(--secondary-color)] hover:bg-clip-text hover:text-transparent px-3 py-2 rounded-md text-sm transition-colors relative">Knowledge Base</a>
                            <a href="/#about" data-active="true" class="text-[var(--cream-white)] hover:bg-gradient-to-r hover:from-[var(--primary-color)] hover:to-[var(--secondary-color)] hover:bg-clip-text hover:text-transparent px-3 py-2 rounded-md text-sm transition-colors relative">About</a>
                        </div>

                        <button class="mx-2 cta-button primary px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-[#FF4D8D] to-[#8C54FF] text-white border-0 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_2px_5px_rgba(255,77,141,0.4),0_2px_6px_rgba(200,50,100,0.6)] relative z-[1]">
                            <a href="/#contact">
                                Contact
                            </a>
                        </button>

                        <!-- Mobile menu button -->
                        <div class="md:hidden flex items-center ml-4">
                            <button id="mobile-menu-button" class="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#8C54FF]" aria-expanded="false">
                                <span class="sr-only">Open main menu</span>
                                <!-- Hamburger icon -->
                                <svg id="hamburger-icon" class="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                                <!-- Close icon -->
                                <svg id="close-icon" class="hidden h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Mobile menu -->
                <div id="mobile-menu" class="hidden md:hidden">
                    <div class="px-2 pt-2 pb-3 space-y-1">
                        <a href="/services" class="block text-[var(--cream-white)] hover:bg-gradient-to-r hover:from-[var(--primary-color)] hover:to-[var(--secondary-color)] hover:bg-clip-text hover:text-transparent hover:bg-[#1a1a1a] px-3 py-2 rounded-md text-base transition-colors relative">Services</a>
                        <a href="/creators" class="block text-[var(--cream-white)] hover:bg-gradient-to-r hover:from-[var(--primary-color)] hover:to-[var(--secondary-color)] hover:bg-clip-text hover:text-transparent hover:bg-[#1a1a1a] px-3 py-2 rounded-md text-base transition-colors relative">Creators</a>
                        <a href="/#reviews" class="block text-[var(--cream-white)] hover:bg-gradient-to-r hover:from-[var(--primary-color)] hover:to-[var(--secondary-color)] hover:bg-clip-text hover:text-transparent hover:bg-[#1a1a1a] px-3 py-2 rounded-md text-base transition-colors relative">Results & Reviews</a>
                        <a href="/blog" class="block text-[var(--cream-white)] hover:bg-gradient-to-r hover:from-[var(--primary-color)] hover:to-[var(--secondary-color)] hover:bg-clip-text hover:text-transparent hover:bg-[#1a1a1a] px-3 py-2 rounded-md text-base transition-colors relative">Knowledge Base</a>
                        <a href="/#about" data-active="true" class="block text-[var(--cream-white)] hover:bg-gradient-to-r hover:from-[var(--primary-color)] hover:to-[var(--secondary-color)] hover:bg-clip-text hover:text-transparent hover:bg-[#1a1a1a] px-3 py-2 rounded-md text-base transition-colors relative">About</a>
                        <div class="mt-4 px-3">
                            <a href="/#contact" class="block w-full text-center px-4 py-2 border border-transparent text-sm bg-gradient-to-r from-[#FF4D8D] to-[#8C54FF] text-white hover:from-[#FF3D7D] hover:to-[#7C44FF] transition-all">
                                Contact
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
        `;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        this.initMobileMenu();
    }

    initMobileMenu() {
        const menuButton = this.shadowRoot.querySelector('#mobile-menu-button');
        const mobileMenu = this.shadowRoot.querySelector('#mobile-menu');

        if (menuButton && mobileMenu) {
            menuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }
    }
}

class HeroPart extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const template = document.createElement('template');
        template.innerHTML = `
            <link rel="stylesheet" href="/styles/normalize.css">
            <link rel="stylesheet" href="/styles/main.css">
            <header class="hero relative pt-20 pb-16 md:pt-28 md:pb-24 bg-[var(--darker-bg)] text-[var(--cream-white)]">
                <div class="hero-content container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 class="italic text-4xl md:text-5xl lg:text-6xl mb-6 text-[var(--cream-white)]">
                        We are <span class="font-brand font-bold italic bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] bg-clip-text text-transparent">MuseBoost</span> Collective
                    </h1>
                    <p class="text-lg md:text-xl text-[var(--cream-white)] mb-8">
                        Empowering content creators to reach new heights<br>and maximize their earning potential
                    </p>
                    <div class="hero-buttons flex justify-center gap-6">
                        <button class="cta-button secondary px-7 py-3.5 text-base rounded-lg bg-white border border-[var(--primary-color)] text-[var(--darker-bg)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_10px_rgba(255,77,141,0.35),0_2px_6px_rgba(200,50,100,0.45)] hover:bg-[var(--off-white)] relative z-[1]">
                            Learn More 🤔
                        </button>
                        <button class="cta-button primary px-7 py-3.5 text-base rounded-lg bg-gradient-to-r from-[#FF4D8D] to-[#8C54FF] text-white border-0 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_10px_rgba(255,77,141,0.4),0_2px_6px_rgba(200,50,100,0.6)] relative z-[1]">
                            Get Started 🚀📈
                        </button>
                    </div>
                </div>

                <!-- Background decoration -->
                <div class="absolute inset-0 -z-10 overflow-hidden">
                    <div class="absolute -top-1/2 -right-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-b from-[#FF4D8D20] to-transparent blur-3xl"></div>
                    <div class="absolute -bottom-1/2 -left-1/2 w-[800px] h-[800px] rounded-full bg-gradient-to-t from-[#8C54FF20] to-transparent blur-3xl"></div>
                </div>
            </header>
        `;
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
}

class CarouselPart extends HTMLElement {
    constructor() {
        super();
        console.log('CarouselPart: Constructor initialized');
        this.attachShadow({ mode: 'open' });
        this.currentSlide = 0;
        this.autoRotateInterval = null;
    }

    connectedCallback() {
        console.log('CarouselPart: Connected to DOM');
        try {
            const template = document.createElement('template');
            template.innerHTML = `
                <link rel="stylesheet" href="/styles/normalize.css">
                <link rel="stylesheet" href="/styles/main.css">
                <section class="relative overflow-hidden py-8 bg-[var(--dark-bg)]">
        <div class="relative min-h-[500px] max-w-[1200px] mx-auto px-16">
            <button class="absolute top-1/2 -translate-y-1/2 w-12 h-12 bg-black/90 hover:bg-black rounded-full cursor-pointer z-10 flex items-center justify-center transition-colors duration-300 -left-6 shadow-lg" aria-label="Previous slide">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            
            <div class="carousel-slides relative w-full h-full">
                <!-- Slide 1 -->
                <div class="absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out active:opacity-100">
                    <div class="grid grid-cols-3 grid-rows-2 gap-4 aspect-[3/2] w-full max-w-[1000px] mx-auto">
                        <div class="relative overflow-hidden rounded-xl">
                            <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 1" loading="lazy" src="https://placehold.co/400x400">
                        </div>
                        <div class="relative overflow-hidden rounded-xl">
                            <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 2" loading="lazy" src="https://placehold.co/400x400">
                        </div>
                        <div class="relative overflow-hidden rounded-xl">
                            <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 3" loading="lazy" src="https://placehold.co/400x400">
                        </div>
                        <div class="relative overflow-hidden rounded-xl">
                            <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 4" loading="lazy" src="https://placehold.co/400x400">
                        </div>
                        <div class="relative overflow-hidden rounded-xl">
                            <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 5" loading="lazy" src="https://placehold.co/400x400">
                        </div>
                        <div class="relative overflow-hidden rounded-xl">
                            <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 6" loading="lazy" src="https://placehold.co/400x400">
                        </div>
                    </div>
                </div>

                <!-- Slide 2 -->
                <div class="absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out">
                    <div class="grid grid-cols-3 grid-rows-2 gap-4 aspect-[3/2] w-full max-w-[1000px] mx-auto">
                        <div class="relative overflow-hidden rounded-xl">
                            <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 7" loading="lazy" src="https://placehold.co/400x400">
                        </div>
                        <div class="relative overflow-hidden rounded-xl">
                            <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 8" loading="lazy" src="https://placehold.co/400x400">
                        </div>
                        <div class="relative overflow-hidden rounded-xl">
                            <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 9" loading="lazy" src="https://placehold.co/400x400">
                        </div>
                        <div class="relative overflow-hidden rounded-xl">
                            <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 10" loading="lazy" src="https://placehold.co/400x400">
                        </div>
                        <div class="relative overflow-hidden rounded-xl">
                            <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 11" loading="lazy" src="https://placehold.co/400x400">
                        </div>
                        <div class="relative overflow-hidden rounded-xl">
                            <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 12" loading="lazy" src="https://placehold.co/400x400">
                        </div>
                    </div>
                </div>

                <!-- Slide 3 -->
                <div class="absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out">
                    <div class="grid grid-cols-3 grid-rows-2 gap-4 aspect-[3/2] w-full max-w-[1000px] mx-auto">
                        <div class="relative overflow-hidden rounded-xl">
                            <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 13" loading="lazy" src="https://placehold.co/400x400">
                        </div>
                        <div class="relative overflow-hidden rounded-xl">
                            <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 14" loading="lazy" src="https://placehold.co/400x400">
                        </div>
                        <div class="relative overflow-hidden rounded-xl">
                            <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 15" loading="lazy" src="https://placehold.co/400x400">
                        </div>
                        <div class="relative overflow-hidden rounded-xl">
                            <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 16" loading="lazy" src="https://placehold.co/400x400">
                        </div>
                        <div class="relative overflow-hidden rounded-xl">
                            <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 17" loading="lazy" src="https://placehold.co/400x400">
                        </div>
                        <div class="relative overflow-hidden rounded-xl">
                            <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 18" loading="lazy" src="https://placehold.co/400x400">
                        </div>
                    </div>
                </div>

                <!-- Slide 4 -->
                <div class="absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out">
                    <div class="grid grid-cols-3 grid-rows-2 gap-4 aspect-[3/2] w-full max-w-[1000px] mx-auto">
                        <div class="relative overflow-hidden rounded-xl">
                            <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 19" loading="lazy" src="https://placehold.co/400x400">
                        </div>
                        <div class="relative overflow-hidden rounded-xl">
                            <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 20" loading="lazy" src="https://placehold.co/400x400">
                        </div>
                        <div class="relative overflow-hidden rounded-xl">
                            <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 21" loading="lazy" src="https://placehold.co/400x400">
                        </div>
                        <div class="relative overflow-hidden rounded-xl">
                            <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 22" loading="lazy" src="https://placehold.co/400x400">
                        </div>
                        <div class="relative overflow-hidden rounded-xl">
                            <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 23" loading="lazy" src="https://placehold.co/400x400">
                        </div>
                        <div class="relative overflow-hidden rounded-xl">
                            <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 24" loading="lazy" src="https://placehold.co/400x400">
                        </div>
                    </div>
                </div>

                <!-- Slide 5 -->
                <div class="absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out">
                    <div class="grid grid-cols-3 grid-rows-2 gap-4 aspect-[3/2] w-full max-w-[1000px] mx-auto">
                        <div class="relative overflow-hidden rounded-xl">
                            <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 25" loading="lazy" src="https://placehold.co/400x400">
                        </div>
                        <div class="relative overflow-hidden rounded-xl">
                            <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 26" loading="lazy" src="https://placehold.co/400x400">
                        </div>
                        <div class="relative overflow-hidden rounded-xl">
                            <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 27" loading="lazy" src="https://placehold.co/400x400">
                        </div>
                        <div class="relative overflow-hidden rounded-xl">
                            <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 28" loading="lazy" src="https://placehold.co/400x400">
                        </div>
                        <div class="relative overflow-hidden rounded-xl">
                            <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 29" loading="lazy" src="https://placehold.co/400x400">
                        </div>
                        <div class="relative overflow-hidden rounded-xl">
                            <img class="w-full h-full object-cover transition-transform duration-300 hover:scale-105" alt="Creator 30" loading="lazy" src="https://placehold.co/400x400">
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
        <div class="flex justify-center gap-2 mt-4">
            <button class="w-2 h-2 rounded-full bg-white/50 hover:bg-white transition-colors duration-300 active:bg-white" data-slide="0"></button>
            <button class="w-2 h-2 rounded-full bg-white/50 hover:bg-white transition-colors duration-300" data-slide="1"></button>
            <button class="w-2 h-2 rounded-full bg-white/50 hover:bg-white transition-colors duration-300" data-slide="2"></button>
            <button class="w-2 h-2 rounded-full bg-white/50 hover:bg-white transition-colors duration-300" data-slide="3"></button>
            <button class="w-2 h-2 rounded-full bg-white/50 hover:bg-white transition-colors duration-300" data-slide="4"></button>
        </div>
    </section>
            `;
            
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

            this.setupEventListeners();
            this.startAutoRotate();

        } catch (error) {
            console.error('Error loading images:', error);
            this.handleImageLoadError();
        }
    }

    setupEventListeners() {
        const prevButton = this.shadowRoot.querySelector('button[aria-label="Previous slide"]');
        const nextButton = this.shadowRoot.querySelector('button[aria-label="Next slide"]');
        const dots = this.shadowRoot.querySelectorAll('button[data-slide]');

        if (!prevButton || !nextButton) {
            console.error('Navigation buttons not found');
            return;
        }

        prevButton.addEventListener('click', () => {
            console.log('CarouselPart: Prev button clicked');
            this.stopAutoRotate();
            this.showPreviousSlide();
            this.startAutoRotate();
        });

        nextButton.addEventListener('click', () => {
            console.log('CarouselPart: Next button clicked');
            this.stopAutoRotate();
            this.showNextSlide();
            this.startAutoRotate();
        });

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                console.log(`CarouselPart: Dot ${index} clicked`);
                this.stopAutoRotate();
                this.showSlide(index);
                this.startAutoRotate();
            });
        });
    }

    showSlide(index) {
        console.log(`CarouselPart: Showing slide ${index}`);
        const slides = this.shadowRoot.querySelectorAll('.carousel-slides > div');
        const dots = this.shadowRoot.querySelectorAll('button[data-slide]');

        slides.forEach(slide => {
            slide.style.opacity = '0';
            slide.style.pointerEvents = 'none';
        });
        dots.forEach(dot => dot.classList.remove('active'));

        slides[index].style.opacity = '1';
        slides[index].style.pointerEvents = 'auto';
        dots[index].classList.add('active');
        this.currentSlide = index;
    }

    showNextSlide() {
        const slides = this.shadowRoot.querySelectorAll('.carousel-slides > div');
        const nextIndex = (this.currentSlide + 1) % slides.length;
        this.showSlide(nextIndex);
    }

    showPreviousSlide() {
        const slides = this.shadowRoot.querySelectorAll('.carousel-slides > div');
        const prevIndex = (this.currentSlide - 1 + slides.length) % slides.length;
        this.showSlide(prevIndex);
    }

    startAutoRotate() {
        console.log('CarouselPart: Starting auto-rotate');
        this.stopAutoRotate();
        this.autoRotateInterval = setInterval(() => {
            console.log('CarouselPart: Auto-rotating to next slide');
            this.showNextSlide();
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

// Register the custom elements
customElements.define('navbar-part', NavbarPart);
customElements.define('hero-part', HeroPart);
customElements.define('carousel-part', CarouselPart);

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
