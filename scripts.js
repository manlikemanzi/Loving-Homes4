document.addEventListener('DOMContentLoaded', () => {
    const links = document.querySelectorAll('.nav-links a');
    const navbar = document.querySelector('.navbar');
    const revealEls = document.querySelectorAll('.reveal');
    const chips = document.querySelectorAll('.chip');
    const bookingForm = document.getElementById('booking-form');
    const bookingMessage = document.getElementById('booking-message');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.querySelector('.nav-links');
    let slideIndex = 0;

    const pageMap = {
        home: 'index.html',
        services: 'services.html',
        about: 'about.html',
        contact: 'contact.html'
    };

    window.navigateTo = (id) => {
        const destination = pageMap[id];
        if (destination) {
            window.location.href = destination;
        }
    };

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            if (navMenu) navMenu.classList.remove('open');
        });
    });

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
        });
    }

    function runCarousel() {
        const slides = document.querySelectorAll('.carousel-slide');
        if(slides.length === 0) return;
        
        slides.forEach(s => s.classList.remove('active'));
        slideIndex = (slideIndex + 1) % slides.length;
        slides[slideIndex].classList.add('active');
    }

    setInterval(runCarousel, 5000);

    // Navbar subtle shrink on scroll
    window.addEventListener('scroll', () => {
        const offset = window.scrollY || window.pageYOffset;
        if (!navbar) return;
        if (offset > 30) {
            navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.08)';
            navbar.style.transform = 'translateY(-2px)';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.transform = 'translateY(0)';
        }
    });

    // Scroll reveal using IntersectionObserver
    if ('IntersectionObserver' in window && revealEls.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = entry.target.dataset.delay || 0;
                    entry.target.style.transitionDelay = `${delay}ms`;
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.18 });

        revealEls.forEach(el => observer.observe(el));
    } else {
        // Fallback if IntersectionObserver not supported
        revealEls.forEach(el => el.classList.add('visible'));
    }

    // Package filter chips
    if (chips.length) {
        chips.forEach(chip => {
            chip.addEventListener('click', () => {
                const filter = chip.dataset.filter || 'all';
                chips.forEach(c => c.classList.remove('chip-active'));
                chip.classList.add('chip-active');

                const cards = document.querySelectorAll('.package-card');
                cards.forEach(card => {
                    const type = card.dataset.type || 'all';
                    const shouldShow = filter === 'all' || type === filter;
                    card.style.opacity = shouldShow ? '1' : '0';
                    card.style.pointerEvents = shouldShow ? 'auto' : 'none';
                    card.style.transform = shouldShow ? '' : 'translateY(20px)';
                });
            });
        });
    }

    // Booking form fake submission with friendly feedback
    if (bookingForm && bookingMessage) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(bookingForm);
            const owner = (formData.get('owner') || '').toString().trim();
            const pet = (formData.get('pet') || '').toString().trim();
            const email = (formData.get('email') || '').toString().trim();

            if (!owner || !pet || !email) {
                bookingMessage.textContent = 'Please fill in owner, pet and email so our concierge can reach you.';
                bookingMessage.classList.remove('success');
                bookingMessage.classList.add('error');
                return;
            }

            bookingMessage.textContent = `Thank you, ${owner}! Our team will confirm ${pet}'s stay at this email: ${email}.`;
            bookingMessage.classList.remove('error');
            bookingMessage.classList.add('success');
            bookingForm.reset();
        });
    }
});