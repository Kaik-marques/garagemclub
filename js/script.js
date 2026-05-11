document.addEventListener('DOMContentLoaded', () => {
    // Manual Smooth Scroll for Anchor Links (Guaranteed Anchor Effect)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#' || targetId === '') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - 60;
                const startPosition = window.pageYOffset;
                const distance = targetPosition - startPosition;
                const duration = 1200; // 1.2 seconds for a noticeable 'pulling' effect
                let start = null;

                window.requestAnimationFrame(function step(timestamp) {
                    if (!start) start = timestamp;
                    const progress = timestamp - start;
                    const percentage = Math.min(progress / duration, 1);
                    
                    // Easing function (easeInOutCubic)
                    const easing = percentage < 0.5 
                        ? 4 * percentage * percentage * percentage 
                        : 1 - Math.pow(-2 * percentage + 2, 3) / 2;
                    
                    window.scrollTo(0, startPosition + distance * easing);
                    
                    if (progress < duration) {
                        window.requestAnimationFrame(step);
                    }
                });
            }
        });
    });

    // Intersection Observer for Reveal Animations (Multi-directional & Staggered)
    const revealElements = document.querySelectorAll('.feature-item, .collection-category, .step-card, .price-card, .bonus-card, .advantage-card, .video-wrap, .reveal-trigger, .faq-item');
    
    const revealOptions = {
        threshold: 0.05, // Trigger slightly earlier for a better feel on mobile
        rootMargin: "0px 0px -30px 0px"
    };
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                // Add a small delay if multiple items are seen at once (staggered effect)
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, 100); 
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);
    
    revealElements.forEach((el) => {
        el.classList.add('reveal');
        
        // Stagger logic for children of grids
        const parent = el.parentElement;
        if (parent && (parent.classList.contains('features-grid') || parent.classList.contains('bonus-grid') || parent.classList.contains('advantages-grid'))) {
            const siblings = Array.from(parent.children);
            const index = siblings.indexOf(el);
            el.style.transitionDelay = `${index * 0.1}s`;
        }

        if (!el.classList.contains('reveal-left') && !el.classList.contains('reveal-right')) {
            el.classList.add('reveal-up');
        }
        revealObserver.observe(el);
    });

    // FAQ Toggle
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const answer = question.nextElementSibling;
            const icon = question.querySelector('svg');
            
            // Close other items
            document.querySelectorAll('.faq-item').forEach(item => {
                if (item !== faqItem) {
                    const otherAnswer = item.querySelector('.faq-answer');
                    const otherIcon = item.querySelector('.faq-question svg');
                    if (otherAnswer.style.display === 'block') {
                        otherAnswer.style.display = 'none';
                        otherIcon.style.transform = 'rotate(0deg)';
                    }
                }
            });
            
            // Toggle current item
            if (answer.style.display === 'block') {
                answer.style.display = 'none';
                icon.style.transform = 'rotate(0deg)';
            } else {
                answer.style.display = 'block';
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });

    // Sticky CTA logic for mobile
    const stickyCta = document.querySelector('.sticky-cta');
    if (stickyCta) {
        window.addEventListener('scroll', () => {
            // Show sticky CTA after scrolling past the hero (approx 600px)
            if (window.scrollY > 600) {
                stickyCta.classList.add('active');
            } else {
                stickyCta.classList.remove('active');
            }
        });
    }

    // Countdown Timer Logic
    function startCountdown() {
        const timerElement = document.getElementById('countdown');
        if (!timerElement) return;

        function updateTimer() {
            const now = new Date();
            const endOfDay = new Date();
            endOfDay.setHours(23, 59, 59, 999);

            const diff = endOfDay - now;

            if (diff <= 0) {
                timerElement.innerHTML = "00:00:00";
                return;
            }

            const h = Math.floor(diff / (1000 * 60 * 60));
            const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const s = Math.floor((diff % (1000 * 60)) / 1000);

            timerElement.innerHTML = 
                `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
        }

        updateTimer();
        setInterval(updateTimer, 1000);
    }
    
    startCountdown();

    // Sales Notification System
    const salesData = [
        "Carlos M. - Recife, PE",
        "Ana P. - São Paulo, SP",
        "Marcos R. - Curitiba, PR",
        "Juliana S. - Belo Horizonte, MG",
        "Felipe T. - Salvador, BA",
        "Ricardo G. - Porto Alegre, RS",
        "Maria L. - Brasília, DF",
        "Eduardo X. - Campinas, SP",
        "Beatriz C. - Fortaleza, CE",
        "Thiago O. - Manaus, AM"
    ];

    const notification = document.getElementById('sale-notification');
    const saleName = document.getElementById('sale-name');
    const saleClose = document.getElementById('sale-close');

    function showNotification() {
        if (!notification) return;
        
        const randomSale = salesData[Math.floor(Math.random() * salesData.length)];
        saleName.textContent = randomSale;
        
        notification.classList.add('active');
        
        // Hide after 6 seconds
        setTimeout(() => {
            notification.classList.remove('active');
        }, 6000);
    }

    if (saleClose) {
        saleClose.addEventListener('click', () => {
            notification.classList.remove('active');
        });
    }

    // Initial delay then show every 30 seconds
    setTimeout(() => {
        showNotification();
        setInterval(showNotification, 30000);
    }, 5000);

    // Upsell Modal Logic
    const btnBasico = document.getElementById('btn-basico');
    const modal = document.getElementById('upsell-modal');
    
    if (btnBasico && modal) {
        btnBasico.addEventListener('click', (e) => {
            e.preventDefault();
            if (typeof fbq === 'function') {
                fbq('track', 'InitiateCheckout');
            }
            modal.classList.add('active');
        });

        // Close modal if clicking outside the content
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    }
});
