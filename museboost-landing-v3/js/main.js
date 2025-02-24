console.log('📦 Components main.js started loading');

class NavbarPart extends HTMLElement {
    constructor() {
        super();
        console.log('🏗️ NavbarPart constructor called');
    }

    async loadContent() {
        try {
            const baseUrl = this.getAttribute('data-base-url') || '';
            const response = await fetch(`${baseUrl}/components/navbar-part.html`);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const template = doc.querySelector('#navbar-template');
            
            if (template) {
                const content = template.content.cloneNode(true);
                this.appendChild(content);
                this.initMobileMenu();
                this.initNavbarScroll();
            } else {
                console.error('Template not found in navbar-part.html');
            }
        } catch (error) {
            console.error('Error loading navbar content:', error);
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
            const baseUrl = this.getAttribute('data-base-url') || '';
            const response = await fetch(`${baseUrl}/components/hero-part.html`);
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
            const baseUrl = this.getAttribute('data-base-url') || '';
            const response = await fetch(`${baseUrl}/components/carousel-part.html`);
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
            const baseUrl = this.getAttribute('data-base-url') || '';
            const response = await fetch(`${baseUrl}/js/carousel-data.json`);
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
            const baseUrl = this.getAttribute('data-base-url') || '';
            const response = await fetch(`${baseUrl}/components/whychooseus-part.html`);
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
            const baseUrl = this.getAttribute('data-base-url') || '';
            const response = await fetch(`${baseUrl}/components/reviews-part.html`);
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
            const baseUrl = this.getAttribute('data-base-url') || '';
            const response = await fetch(`${baseUrl}/components/about-part.html`);
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
            const baseUrl = this.getAttribute('data-base-url') || '';
            const response = await fetch(`${baseUrl}/components/services-part.html`);
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
            const baseUrl = this.getAttribute('data-base-url') || '';
            const response = await fetch(`${baseUrl}/components/footer-part.html`);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const template = doc.querySelector('#footer-template');
            
            if (template) {
                const content = template.content.cloneNode(true);
                this.appendChild(content);
            } else {
                console.error('Template not found in footer-part.html');
            }
        } catch (error) {
            console.error('Error loading footer content:', error);
        }
    }

    connectedCallback() {
        this.loadContent();
    }
}

class KbPart extends HTMLElement {
    constructor() {
        super();
        console.log('🏗️ KbPart constructor called');
    }

    async loadContent() {
        try {
            const baseUrl = this.getAttribute('data-base-url') || '';
            const response = await fetch(`${baseUrl}/components/kb-part.html`);
            if (!response.ok) throw new Error('Failed to load knowledge base');
            const html = await response.text();
            const template = document.createElement('template');
            template.innerHTML = html;
            const content = template.content.querySelector('#kb-template');
            if (content) {
                this.appendChild(content.content.cloneNode(true));
                this.initSearch();
            }
        } catch (error) {
            console.error('Error loading knowledge base:', error);
        }
    }

    connectedCallback() {
        this.loadContent();
    }

    initSearch() {
        const searchInput = this.querySelector('#kb-search');
        const searchResults = this.querySelector('#search-results');
        const articles = this.querySelectorAll('.kb-article');
        
        if (searchInput && searchResults) {
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                
                if (searchTerm.length > 0) {
                    const matches = Array.from(articles).filter(article => {
                        const title = article.querySelector('h2').textContent.toLowerCase();
                        const description = article.querySelector('p').textContent.toLowerCase();
                        return title.includes(searchTerm) || description.includes(searchTerm);
                    });

                    if (matches.length > 0) {
                        searchResults.innerHTML = matches.map(article => `
                            <div class="kb-search-result p-4 border-b border-gray-700 last:border-0">
                                <h3 class="text-lg font-semibold">${article.querySelector('h2 a').textContent}</h3>
                                <p class="text-gray-400">${article.querySelector('p').textContent}</p>
                                <a href="${article.querySelector('h2 a').getAttribute('href')}" 
                                   class="text-blue-500 hover:text-blue-400 text-sm mt-2 inline-block">
                                   Read more →
                                </a>
                            </div>
                        `).join('');
                    } else {
                        searchResults.innerHTML = `<p class="text-gray-400 p-4">No results found for "${searchTerm}"</p>`;
                    }
                    searchResults.style.display = 'block';
                } else {
                    searchResults.innerHTML = '';
                    searchResults.style.display = 'none';
                }
            });
        }
    }
}

class KbArticlePart extends HTMLElement {
    constructor() {
        super();
        console.log('🏗️ KbArticlePart constructor called');
    }

    async loadContent() {
        try {
            const baseUrl = this.getAttribute('data-base-url') || '';
            const response = await fetch(`${baseUrl}/components/kb-article-part.html`);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const template = doc.querySelector('#kb-article-template');
            
            if (template) {
                const content = template.content.cloneNode(true);
                this.appendChild(content);
            } else {
                console.error('Template not found in kb-article-part.html');
            }
        } catch (error) {
            console.error('Error loading kb-article content:', error);
        }
    }

    connectedCallback() {
        this.loadContent();
    }
}

class KbArticle1Percent extends HTMLElement {
    constructor() {
        super();
        console.log('🏗️ KbArticle1Percent constructor called');
    }

    async loadContent() {
        try {
            const baseUrl = this.getAttribute('data-base-url') || '';
            const response = await fetch(`${baseUrl}/components/kb-article-1percent.html`);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const template = doc.querySelector('#kb-article-template');
            
            if (template) {
                const content = template.content.cloneNode(true);
                this.appendChild(content);
            } else {
                console.error('Template not found in kb-article-1percent.html');
            }
        } catch (error) {
            console.error('Error loading kb-article content:', error);
        }
    }

    connectedCallback() {
        this.loadContent();
    }
}

class KbArticle5Tips extends HTMLElement {
    constructor() {
        super();
        console.log('🏗️ KbArticle5Tips constructor called');
    }

    async loadContent() {
        try {
            const baseUrl = this.getAttribute('data-base-url') || '';
            const response = await fetch(`${baseUrl}/components/kb-article-5tips.html`);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const template = doc.querySelector('#kb-article-template');
            
            if (template) {
                const content = template.content.cloneNode(true);
                this.appendChild(content);
            } else {
                console.error('Template not found in kb-article-5tips.html');
            }
        } catch (error) {
            console.error('Error loading kb-article content:', error);
        }
    }

    connectedCallback() {
        this.loadContent();
    }
}

class KbArticleMaximizingEarnings extends HTMLElement {
    constructor() {
        super();
        console.log('🏗️ KbArticleMaximizingEarnings constructor called');
    }

    async loadContent() {
        try {
            const baseUrl = this.getAttribute('data-base-url') || '';
            const response = await fetch(`${baseUrl}/components/kb-article-maximizingearnings.html`);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const template = doc.querySelector('#kb-article-template');
            
            if (template) {
                const content = template.content.cloneNode(true);
                this.appendChild(content);
            } else {
                console.error('Template not found in kb-article-maximizingearnings.html');
            }
        } catch (error) {
            console.error('Error loading kb-article content:', error);
        }
    }

    connectedCallback() {
        this.loadContent();
    }
}

class KbArticleCollaboration extends HTMLElement {
    constructor() {
        super();
        console.log('🏗️ KbArticleCollaboration constructor called');
    }

    async loadContent() {
        try {
            const baseUrl = this.getAttribute('data-base-url') || '';
            const response = await fetch(`${baseUrl}/components/kb-article-collaboration.html`);
            const text = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(text, 'text/html');
            const template = doc.querySelector('#kb-article-template');
            
            if (template) {
                const content = template.content.cloneNode(true);
                this.appendChild(content);
            } else {
                console.error('Template not found in kb-article-collaboration.html');
            }
        } catch (error) {
            console.error('Error loading kb-article content:', error);
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
    customElements.define('hero-part', HeroPart);
    customElements.define('carousel-part', CarouselPart);
    customElements.define('whychooseus-part', WhyChooseUsPart);
    customElements.define('reviews-part', ReviewsPart);
    customElements.define('about-part', AboutPart);
    customElements.define('services-part', ServicesPart);
    customElements.define('footer-part', FooterPart);
    customElements.define('kb-part', KbPart);
    customElements.define('kb-article-part', KbArticlePart);
    customElements.define('kb-article-1percent', KbArticle1Percent);
    customElements.define('kb-article-5tips', KbArticle5Tips);
    customElements.define('kb-article-maximizingearnings', KbArticleMaximizingEarnings);
    customElements.define('kb-article-collaboration', KbArticleCollaboration);
    console.log('✅ Custom elements registered');
} catch (error) {
    console.error('❌ Error registering custom elements:', error);
}

console.log('🏁 Components main.js finished loading');
