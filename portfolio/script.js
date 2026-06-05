document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. Sticky Header Scroll Effect
    // ==========================================================================
    const header = document.getElementById('site-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ==========================================================================
    // 2. Mobile Menu Toggle
    // ==========================================================================
    const menuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('open');
            // Toggle hamburger icon between menu and close state
            const icon = menuToggle.querySelector('svg');
            if (navMenu.classList.contains('open')) {
                icon.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>';
            } else {
                icon.innerHTML = '<line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line>';
            }
        });

        // Close menu when clicking nav link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                const icon = menuToggle.querySelector('svg');
                icon.innerHTML = '<line x1="4" y1="12" x2="20" y2="12"></line><line x1="4" y1="6" x2="20" y2="6"></line><line x1="4" y1="18" x2="20" y2="18"></line>';
            });
        });
    }

    // ==========================================================================
    // 3. Dynamic Typewriter Effect
    // ==========================================================================
    const typewriterEl = document.getElementById('typewriter-text');
    const phrases = [
        "immersive web experiences",
        "secure cryptography tools",
        "interactive UI/UX designs",
        "efficient full-stack systems"
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function typeEffect() {
        const currentPhrase = phrases[phraseIdx];
        
        if (isDeleting) {
            typewriterEl.textContent = currentPhrase.substring(0, charIdx - 1);
            charIdx--;
            typingSpeed = 50; // Faster deleting
        } else {
            typewriterEl.textContent = currentPhrase.substring(0, charIdx + 1);
            charIdx++;
            typingSpeed = 100; // Normal typing
        }

        if (!isDeleting && charIdx === currentPhrase.length) {
            isDeleting = true;
            typingSpeed = 2000; // Pause at end of word
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            phraseIdx = (phraseIdx + 1) % phrases.length;
            typingSpeed = 400; // Pause before typing next word
        }

        setTimeout(typeEffect, typingSpeed);
    }

    if (typewriterEl) {
        setTimeout(typeEffect, 800);
    }

    // ==========================================================================
    // 4. Scroll Reveal Animations (Intersection Observer)
    // ==========================================================================
    const revealElements = document.querySelectorAll('.reveal-fade, .reveal-slide-left, .reveal-slide-right');
    const skillCategoryCards = document.querySelectorAll('.skills-category-card');
    const statNums = document.querySelectorAll('.stat-num');
    
    let statsAnimated = false;

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // If it's a skill category card, animate its internal skill bars
                if (entry.target.classList.contains('skills-category-card')) {
                    const fills = entry.target.querySelectorAll('.skill-bar-fill');
                    fills.forEach(fill => {
                        // Triggers transition
                        fill.style.transform = 'scaleX(1)';
                    });
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
    skillCategoryCards.forEach(card => revealObserver.observe(card));

    // Stats counter animation observer
    const statsSection = document.querySelector('.stats-grid');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            const [entry] = entries;
            if (entry.isIntersecting && !statsAnimated) {
                statNums.forEach(num => {
                    const target = parseInt(num.getAttribute('data-val'), 10);
                    let current = 0;
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // ~60fps
                    
                    const counter = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            num.textContent = target;
                            clearInterval(counter);
                        } else {
                            num.textContent = Math.floor(current);
                        }
                    }, 16);
                });
                statsAnimated = true;
                statsObserver.unobserve(statsSection);
            }
        }, {
            threshold: 0.5
        });
        
        statsObserver.observe(statsSection);
    }

    // ==========================================================================
    // 5. Active Nav Link on Scroll
    // ==========================================================================
    const sections = document.querySelectorAll('section');
    
    window.addEventListener('scroll', () => {
        let currentSectionId = 'hero';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (window.scrollY >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================================================
    // 6. Interactive Cursor Hover Glow Card Effect
    // ==========================================================================
    const projectCards = document.querySelectorAll('.project-card, .skills-category-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Set mouse position coordinates for dynamic lighting/border reflection
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

    // ==========================================================================
    // 7. Contact Form Handler & Submission Micro-Animation
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const statusMsg = document.getElementById('form-status-msg');

    if (contactForm && statusMsg) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const submitBtn = contactForm.querySelector('.btn-submit');
            const origBtnText = submitBtn.innerHTML;
            
            // Disable and show sending status
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            submitBtn.innerHTML = 'Sending... <svg class="animate-spin" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="animation: spin 1s linear infinite;"><line x1="12" y1="2" x2="12" y2="6"></line><line x1="12" y1="18" x2="12" y2="22"></line><line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line><line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line><line x1="2" y1="12" x2="6" y2="12"></line><line x1="18" y1="12" x2="22" y2="12"></line><line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line><line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line></svg>';
            
            // Simulate API request delay
            setTimeout(() => {
                // Success simulation
                statusMsg.textContent = "Thank you! Your message has been sent successfully. Vohn Carlo will get back to you soon.";
                statusMsg.className = "status-msg success";
                statusMsg.classList.remove('hidden');
                
                // Clear Form
                contactForm.reset();
                
                // Reset button
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitBtn.innerHTML = origBtnText;
                
                // Hide success message after 5 seconds
                setTimeout(() => {
                    statusMsg.classList.add('hidden');
                }, 6000);
                
            }, 1500);
        });
    }
});

// Spin keyframe helper styling injected dynamically if needed
const style = document.createElement('style');
style.textContent = `
@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
`;
document.head.appendChild(style);
