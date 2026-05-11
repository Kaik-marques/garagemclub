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
});
