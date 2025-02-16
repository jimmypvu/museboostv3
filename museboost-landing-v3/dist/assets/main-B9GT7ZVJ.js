(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const t of r)if(t.type==="childList")for(const i of t.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&s(i)}).observe(document,{childList:!0,subtree:!0});function o(r){const t={};return r.integrity&&(t.integrity=r.integrity),r.referrerPolicy&&(t.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?t.credentials="include":r.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function s(r){if(r.ep)return;r.ep=!0;const t=o(r);fetch(r.href,t)}})();class u extends HTMLElement{constructor(){super()}async connectedCallback(){try{const o=await(await fetch("/components/navbar-part.html")).text(),t=new DOMParser().parseFromString(o,"text/html").querySelector("#navbar-template");t?(this.appendChild(t.content.cloneNode(!0)),this.initMobileMenu(),this.initNavbarScroll()):console.error("Could not find navbar template")}catch(e){console.error("Error loading navbar component:",e)}}initMobileMenu(){const e=this.querySelector("#mobile-menu-button"),o=this.querySelector("#mobile-menu"),s=this.querySelector("#hamburger-icon"),r=this.querySelector("#close-icon");e&&o&&e.addEventListener("click",()=>{const t=e.getAttribute("aria-expanded")==="true";e.setAttribute("aria-expanded",!t),o.classList.toggle("hidden"),s.classList.toggle("hidden"),r.classList.toggle("hidden")})}initNavbarScroll(){const e=this.querySelector(".navbar");e&&window.addEventListener("scroll",()=>{window.scrollY>0?e.style.backgroundColor="rgba(5, 5, 5, 0.8)":e.style.backgroundColor="rgb(5, 5, 5)"})}}class h extends HTMLElement{constructor(){super()}async connectedCallback(){try{const o=await(await fetch("/components/hero-part.html")).text(),t=new DOMParser().parseFromString(o,"text/html").querySelector("#hero-template");t?(this.appendChild(t.content.cloneNode(!0)),this.initHeroButtons()):console.error("Could not find hero template")}catch(e){console.error("Error loading hero component:",e)}}initHeroButtons(){const e=this.querySelector(".cta-button.secondary"),o=this.querySelector(".cta-button.primary");e&&e.addEventListener("click",()=>{var s;(s=document.querySelector("#about"))==null||s.scrollIntoView({behavior:"smooth"})}),o&&o.addEventListener("click",()=>{var s;(s=document.querySelector("#contact"))==null||s.scrollIntoView({behavior:"smooth"})})}}class v extends HTMLElement{constructor(){super(),console.log("CarouselPart: Constructor initialized"),this.attachShadow({mode:"open"}),this.currentSlide=0,this.autoRotateInterval=null,this.totalSlides=0}connectedCallback(){console.log("CarouselPart: Connected to DOM");try{const e=document.createElement("template");e.innerHTML=`
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
    </div>`,this.shadowRoot.appendChild(e.content.cloneNode(!0)),this.initializeCarousel(),console.log("CarouselPart: Initialization complete")}catch(e){console.error("Failed to load carousel component:",e)}}async initializeCarousel(){console.log("CarouselPart: Starting image load");try{const o=await(await fetch("/js/carousel-data.json")).json();console.log(`CarouselPart: Loaded image data: ${o.images.length} images`),o.images.sort(()=>.5-Math.random()),await Promise.all(o.images.map(i=>new Promise((c,l)=>{const n=new Image;n.onload=c,n.onerror=l,n.src=i.url})));const s=this.shadowRoot.querySelectorAll(".carousel-slides > div"),r=6;let t=0;s.forEach((i,c)=>{i.querySelectorAll("img").forEach(n=>{if(t<o.images.length){const d=o.images[t];n.src=d.url,n.alt=d.alt,t++}})}),this.showSlide(0),this.totalSlides=s.length,this.setupEventListeners(),this.startAutoRotate()}catch(e){console.error("Error loading images:",e),this.handleImageLoadError()}}showSlide(e){const o=this.shadowRoot.querySelectorAll(".carousel-slides > div"),s=this.shadowRoot.querySelectorAll("[data-slide]");o.forEach(r=>{r.style.opacity="0",r.style.zIndex="0",r.style.transition="opacity 500ms ease-in-out"}),o[e]&&(o[e].style.opacity="1",o[e].style.zIndex="1"),s.forEach((r,t)=>{t===e?(r.classList.add("active"),r.style.backgroundColor="rgba(255, 255, 255, 1)"):(r.classList.remove("active"),r.style.backgroundColor="rgba(255, 255, 255, 0.3)")}),this.currentSlide=e}setupEventListeners(){const e=this.shadowRoot.querySelector('button[aria-label="Previous slide"]');e==null||e.addEventListener("click",()=>{const l=(this.currentSlide-1+this.totalSlides)%this.totalSlides;this.showSlide(l)});const o=this.shadowRoot.querySelector('button[aria-label="Next slide"]');o==null||o.addEventListener("click",()=>{const l=(this.currentSlide+1)%this.totalSlides;this.showSlide(l)}),this.shadowRoot.querySelectorAll("[data-slide]").forEach((l,n)=>{l.addEventListener("click",()=>this.showSlide(n))});const r=this.shadowRoot.querySelectorAll("[data-modal-trigger]"),t=this.shadowRoot.querySelector("#imageModal"),i=this.shadowRoot.querySelector("#modalImage"),c=this.shadowRoot.querySelector("#closeModal");r.forEach(l=>{l.addEventListener("click",n=>{const d=l.querySelector("img");d&&(i.src=d.src,i.alt=d.alt,t.style.display="flex",document.body.style.overflow="hidden")})}),c==null||c.addEventListener("click",()=>{t.style.display="none",document.body.style.overflow=""}),t==null||t.addEventListener("click",l=>{l.target===t&&(t.style.display="none",document.body.style.overflow="")})}startAutoRotate(){console.log("CarouselPart: Starting auto-rotate"),this.stopAutoRotate(),this.autoRotateInterval=setInterval(()=>{console.log("CarouselPart: Auto-rotating to next slide");const e=(this.currentSlide+1)%this.totalSlides;this.showSlide(e)},5e3)}stopAutoRotate(){console.log("CarouselPart: Stopping auto-rotate"),this.autoRotateInterval&&(clearInterval(this.autoRotateInterval),this.autoRotateInterval=null)}handleImageLoadError(){console.log("CarouselPart: Handling image load error"),this.shadowRoot.querySelectorAll(".image-item img").forEach(o=>{o.src="https://placehold.co/600x800/FF4D8D/ffffff?text=Image+Loading+Error"})}}class m extends HTMLElement{constructor(){super()}async connectedCallback(){try{const o=await(await fetch("/components/whychooseus-part.html")).text(),t=new DOMParser().parseFromString(o,"text/html").querySelector("#whychooseus-template");t?this.appendChild(t.content.cloneNode(!0)):console.error("Could not find whychooseus template")}catch(e){console.error("Error loading whychooseus component:",e)}}}class p extends HTMLElement{constructor(){super()}async connectedCallback(){try{const o=await(await fetch("/components/reviews-part.html")).text(),t=new DOMParser().parseFromString(o,"text/html").querySelector("#reviews-template");t?this.appendChild(t.content.cloneNode(!0)):console.error("Could not find reviews template")}catch(e){console.error("Error loading reviews component:",e)}}}class f extends HTMLElement{constructor(){super()}async connectedCallback(){try{const o=await(await fetch("/components/about-part.html")).text(),t=new DOMParser().parseFromString(o,"text/html").querySelector("#about-template");t?this.appendChild(t.content.cloneNode(!0)):console.error("Could not find about template")}catch(e){console.error("Error loading about component:",e)}}}class g extends HTMLElement{constructor(){super()}async connectedCallback(){try{const o=await(await fetch("/components/footer-part.html")).text(),t=new DOMParser().parseFromString(o,"text/html").querySelector("#footer-template");t?this.appendChild(t.content.cloneNode(!0)):console.error("Could not find footer template")}catch(e){console.error("Error loading footer component:",e)}}}class w extends HTMLElement{constructor(){super()}async connectedCallback(){try{const o=await(await fetch("/components/services-part.html")).text(),t=new DOMParser().parseFromString(o,"text/html").querySelector("#services-template");t?this.appendChild(t.content.cloneNode(!0)):console.error("Could not find services template")}catch(e){console.error("Error loading services component:",e)}}}customElements.define("navbar-part",u);customElements.define("hero-part",h);customElements.define("carousel-part",v);customElements.define("whychooseus-part",m);customElements.define("reviews-part",p);customElements.define("about-part",f);customElements.define("footer-part",g);customElements.define("services-part",w);function b(){const a=document.querySelector("#mobile-menu-button"),e=document.querySelector("#mobile-menu");if(!a||!e){console.log("Mobile menu elements not found");return}a.addEventListener("click",()=>{e.classList.toggle("hidden")})}document.addEventListener("DOMContentLoaded",async()=>{console.log("DOM fully loaded"),document.querySelector("carousel-part")&&console.log("Found carousel component"),b()});
