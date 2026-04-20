// ===== LOADER =====
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden');
        initAnimations();
    }, 400);
});

// ===== SMOOTH CURSOR =====
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;

if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateCursor() {
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        followerX += (mouseX - followerX) * 0.08;
        followerY += (mouseY - followerY) * 0.08;

        cursor.style.left = cursorX + 'px';
        cursor.style.top = cursorY + 'px';
        follower.style.left = followerX + 'px';
        follower.style.top = followerY + 'px';

        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    document.querySelectorAll('a, button, .portfolio-card, .service-card').forEach(el => {
        el.addEventListener('mouseenter', () => follower.classList.add('hover'));
        el.addEventListener('mouseleave', () => follower.classList.remove('hover'));
    });
}

// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
    updateActiveNav();
    parallaxEffect();
});

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
    document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('open');
        document.body.style.overflow = '';
    });
});

function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.scrollY + 200;

    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-link[href="#${id}"]`);
        if (link) {
            link.classList.toggle('active', scrollY >= top && scrollY < top + height);
        }
    });
}

// ===== PARALLAX =====
function parallaxEffect() {
    const scrollY = window.scrollY;
    const heroContent = document.querySelector('.hero-content');

    if (heroContent && scrollY < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrollY * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrollY / (window.innerHeight * 0.7));
    }
}

// ===== VIDEO AUTOPLAY FALLBACK =====
const heroVideo = document.querySelector('.hero-video');
if (heroVideo) {
    heroVideo.play().catch(() => {
        document.addEventListener('click', () => heroVideo.play(), { once: true });
    });
}

// ===== SCROLL ANIMATIONS =====
function initAnimations() {
    const elements = document.querySelectorAll('[data-animate]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay || 0);
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -80px 0px'
    });

    elements.forEach(el => observer.observe(el));

    animateCounters();
}

// ===== COUNTER ANIMATION =====
function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count);
                const duration = 2500;
                const start = performance.now();

                function update(now) {
                    const progress = Math.min((now - start) / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 4);
                    entry.target.textContent = Math.floor(eased * target);
                    if (progress < 1) requestAnimationFrame(update);
                }

                requestAnimationFrame(update);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(el => observer.observe(el));
}

// ===== PORTFOLIO FILTER =====
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioCards = document.querySelectorAll('.portfolio-card');

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.dataset.filter;
        let visibleIndex = 0;

        portfolioCards.forEach(card => {
            const match = filter === 'all' || card.dataset.category === filter;

            if (match) {
                card.classList.remove('hidden');
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px) scale(0.97)';

                setTimeout(() => {
                    card.style.transition = 'opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1)';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0) scale(1)';
                }, visibleIndex * 100);

                visibleIndex++;
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                setTimeout(() => card.classList.add('hidden'), 300);
            }
        });
    });
});

// ===== TESTIMONIALS SLIDER =====
const track = document.getElementById('testimonials-track');
const dotsContainer = document.getElementById('test-dots');
const cards = track ? track.querySelectorAll('.testimonial-card') : [];
let currentSlide = 0;
let slidesPerView = 3;
let autoplayInterval;

function updateSlidesPerView() {
    if (window.innerWidth <= 768) slidesPerView = 1;
    else if (window.innerWidth <= 1024) slidesPerView = 2;
    else slidesPerView = 3;
}

function getTotalSlides() {
    return Math.max(1, cards.length - slidesPerView + 1);
}

function createDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const total = getTotalSlides();
    for (let i = 0; i < total; i++) {
        const dot = document.createElement('div');
        dot.className = 'test-dot' + (i === 0 ? ' active' : '');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
}

function goToSlide(index) {
    const total = getTotalSlides();
    currentSlide = Math.max(0, Math.min(index, total - 1));

    if (track && cards.length > 0) {
        const cardWidth = cards[0].offsetWidth + 24;
        track.style.transform = `translateX(-${currentSlide * cardWidth}px)`;
    }

    const dots = dotsContainer ? dotsContainer.querySelectorAll('.test-dot') : [];
    dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
}

function startAutoplay() {
    stopAutoplay();
    autoplayInterval = setInterval(() => {
        goToSlide((currentSlide + 1) % getTotalSlides());
    }, 5000);
}

function stopAutoplay() { clearInterval(autoplayInterval); }

document.getElementById('test-prev')?.addEventListener('click', () => {
    stopAutoplay();
    goToSlide(currentSlide - 1);
    startAutoplay();
});

document.getElementById('test-next')?.addEventListener('click', () => {
    stopAutoplay();
    goToSlide(currentSlide + 1);
    startAutoplay();
});

function initSlider() {
    updateSlidesPerView();
    createDots();
    goToSlide(0);
    startAutoplay();
}

initSlider();

window.addEventListener('resize', () => {
    updateSlidesPerView();
    createDots();
    goToSlide(Math.min(currentSlide, getTotalSlides() - 1));
});

track?.addEventListener('mouseenter', stopAutoplay);
track?.addEventListener('mouseleave', startAutoplay);

// ===== CONTACT FORM =====
document.getElementById('contact-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = this.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;

    btn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:8px;">Message envoyé !</span>';
    btn.style.background = '#059669';
    btn.style.boxShadow = '0 4px 24px rgba(5,150,105,0.3)';

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        btn.style.boxShadow = '';
        this.reset();
    }, 3000);
});

// ===== NEWSLETTER =====
document.getElementById('newsletter-form')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const input = this.querySelector('input');
    input.value = '';
    input.placeholder = 'Merci !';
    setTimeout(() => { input.placeholder = 'votre@email.com'; }, 2500);
});

// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({ top: offsetTop, behavior: 'smooth' });
        }
    });
});

// ===== TILT EFFECT on service cards =====
document.querySelectorAll('.service-card, .about-grid-item').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -4;
        const rotateY = (x - centerX) / centerX * 4;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        card.style.transition = 'transform 0.6s cubic-bezier(0.16,1,0.3,1)';
    });

    card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease-out';
    });
});
