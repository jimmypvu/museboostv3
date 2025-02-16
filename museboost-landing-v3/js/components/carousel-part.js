export class CarouselPart extends HTMLElement {
    constructor() {
        super();
        console.log('CarouselPart: Constructor initialized');
        this.currentSlide = 0;
        this.autoRotateInterval = null;
        this.attachShadow({ mode: 'open' });
    }

    async connectedCallback() {
        console.log('CarouselPart: Connected to DOM');
        const template = document.getElementById('carousel-template');
        if (!template) {
            console.error('CarouselPart: Template not found');
            return;
        }
        this.shadowRoot.appendChild(template.content.cloneNode(true));
        
        this.initCarousel();
        await this.loadAndRandomizeImages();
        this.startAutoRotate();
        console.log('CarouselPart: Initialization complete');
    }

    disconnectedCallback() {
        console.log('CarouselPart: Disconnected from DOM');
        this.stopAutoRotate();
    }

    async loadAndRandomizeImages() {
        console.log('CarouselPart: Starting image load');
        try {
            const response = await fetch('/js/carousel-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('CarouselPart: Loaded image data:', data.images.length, 'images');
            
            const shuffledImages = [...data.images].sort(() => Math.random() - 0.5);
            const slides = this.shadowRoot.querySelectorAll('.carousel-slide');
            
            slides.forEach((slide, slideIndex) => {
                const images = slide.querySelectorAll('.image-item img');
                const startIdx = slideIndex * 8;
                
                images.forEach((img, imgIndex) => {
                    const imageData = shuffledImages[(startIdx + imgIndex) % shuffledImages.length];
                    if (imageData) {
                        console.log(`CarouselPart: Setting image ${startIdx + imgIndex}:`, imageData.url);
                        img.src = imageData.url;
                        img.alt = imageData.alt;
                        
                        img.onerror = () => {
                            console.error(`CarouselPart: Failed to load image: ${imageData.url}`);
                            img.src = 'https://placehold.co/600x800/FF4D8D/ffffff?text=Image+Loading+Error';
                        };
                    }
                });
            });
        } catch (error) {
            console.error('CarouselPart: Error loading images:', error);
            this.handleImageLoadError();
        }
    }

    initCarousel() {
        const prevButton = this.shadowRoot.querySelector('.carousel-arrow.prev');
        const nextButton = this.shadowRoot.querySelector('.carousel-arrow.next');
        const dots = this.shadowRoot.querySelectorAll('.carousel-dot');

        prevButton.addEventListener('click', () => {
            console.log('CarouselPart: Previous button clicked');
            this.stopAutoRotate();
            this.showSlide(this.currentSlide - 1);
            this.startAutoRotate();
        });

        nextButton.addEventListener('click', () => {
            console.log('CarouselPart: Next button clicked');
            this.stopAutoRotate();
            this.showSlide(this.currentSlide + 1);
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
        const slides = this.shadowRoot.querySelectorAll('.carousel-slide');
        const dots = this.shadowRoot.querySelectorAll('.carousel-dot');
        
        if (index >= slides.length) index = 0;
        if (index < 0) index = slides.length - 1;
        
        console.log(`CarouselPart: Showing slide ${index}`);
        this.currentSlide = index;
        
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.style.display = 'block';
                setTimeout(() => slide.style.opacity = '1', 0);
            } else {
                slide.style.opacity = '0';
                setTimeout(() => slide.style.display = 'none', 500);
            }
        });
        
        dots.forEach((dot, i) => dot.classList.toggle('active', i === index));
    }

    startAutoRotate() {
        if (this.autoRotateInterval) {
            console.log('CarouselPart: Clearing existing auto-rotate interval');
            this.stopAutoRotate();
        }
        
        console.log('CarouselPart: Starting auto-rotate');
        this.autoRotateInterval = setInterval(() => {
            console.log('CarouselPart: Auto-rotating to next slide');
            this.showSlide(this.currentSlide + 1);
        }, 5000);
    }

    stopAutoRotate() {
        if (this.autoRotateInterval) {
            console.log('CarouselPart: Stopping auto-rotate');
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
