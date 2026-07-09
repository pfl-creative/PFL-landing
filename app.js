/* ==========================================================================
   Prompt Fashion Lab — Interactive Scripts
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Custom Cursor for Desktop ---
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');
    
    // Check if device supports hover (i.e. not a touch-only device)
    const hasMouse = window.matchMedia('(hover: hover)').matches;
    
    if (hasMouse && cursor && follower) {
        document.body.classList.add('cursor-active');
        
        let mouseX = 0, mouseY = 0;
        let followerX = 0, followerY = 0;
        
        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Position the main cursor dot
            cursor.style.left = `${mouseX}px`;
            cursor.style.top = `${mouseY}px`;
        });
        
        // Follower trailing animation (lag effect)
        const renderFollower = () => {
            // Linear interpolation for smooth trailing
            followerX += (mouseX - followerX) * 0.15;
            followerY += (mouseY - followerY) * 0.15;
            
            follower.style.left = `${followerX}px`;
            follower.style.top = `${followerY}px`;
            
            requestAnimationFrame(renderFollower);
        };
        renderFollower();
        
        // Add hover effects for interactive elements
        const registerHoverTargets = () => {
            const hoverTargets = document.querySelectorAll(
                'a, button, .btn, .accordion-trigger, .collage-item, .after-control-btn, .checklist-card, .who-card, .product-card-new, .grid-item-new'
            );
            hoverTargets.forEach(target => {
                target.addEventListener('mouseenter', () => {
                    document.body.classList.add('hovering-link');
                });
                target.addEventListener('mouseleave', () => {
                    document.body.classList.remove('hovering-link');
                });
            });
        };
        registerHoverTargets();
    }

    // --- 2. Mobile Navigation Overlay ---
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileOverlay = document.querySelector('.mobile-nav-overlay');
    const mobileLinks = document.querySelectorAll('.mobile-link');
    
    if (menuToggle && mobileOverlay) {
        menuToggle.addEventListener('click', () => {
            const isOpen = document.body.classList.toggle('mobile-menu-open');
            mobileOverlay.classList.toggle('active', isOpen);
        });
        
        // Close menu when clicking a link
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                document.body.classList.remove('mobile-menu-open');
                mobileOverlay.classList.remove('active');
            });
        });
    }

    // --- 3. Smart Header (Hide on Scroll Down, Show on Scroll Up) ---
    const header = document.querySelector('.site-header');
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        if (!header) return;
        
        const currentScrollY = window.scrollY;
        
        // Add subtle class when page is scrolled
        if (currentScrollY > 50) {
            header.style.backgroundColor = 'rgba(244, 241, 234, 0.95)';
            header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.02)';
        } else {
            header.style.backgroundColor = 'rgba(244, 241, 234, 0.8)';
            header.style.boxShadow = 'none';
        }
        
        // Scroll direction checking
        if (currentScrollY > lastScrollY && currentScrollY > 150) {
            header.classList.add('nav-hidden');
        } else {
            header.classList.remove('nav-hidden');
        }
        
        lastScrollY = currentScrollY;
    });

    // --- 4. Intersection Observer for Fade In Up Animations ---
    const fadeElements = document.querySelectorAll('.fade-in-up');
    
    if (fadeElements.length > 0) {
        const revealCallback = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target);
                }
            });
        };
        
        const revealObserver = new IntersectionObserver(revealCallback, {
            root: null,
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px'
        });
        
        fadeElements.forEach(element => {
            revealObserver.observe(element);
        });
    }

    // --- 5. Interactive Before & After Tabs switcher ---
    const tabButtons = document.querySelectorAll('.after-control-btn');
    const afterImages = document.querySelectorAll('.after-img');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetStyle = button.getAttribute('data-style');
            
            // Update buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update images
            afterImages.forEach(img => {
                img.classList.remove('active');
                if (img.id === `after-img-${targetStyle}`) {
                    img.classList.add('active');
                }
            });
        });
    });

    // --- 6. FAQ Accordion ---
    const accordionTriggers = document.querySelectorAll('.accordion-trigger');
    
    accordionTriggers.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const isExpanded = trigger.getAttribute('aria-expanded') === 'true';
            const content = trigger.nextElementSibling;
            
            // Close all other accordions first
            accordionTriggers.forEach(otherTrigger => {
                if (otherTrigger !== trigger) {
                    otherTrigger.setAttribute('aria-expanded', 'false');
                    otherTrigger.nextElementSibling.style.maxHeight = null;
                }
            });
            
            // Toggle current accordion
            if (isExpanded) {
                trigger.setAttribute('aria-expanded', 'false');
                content.style.maxHeight = null;
            } else {
                trigger.setAttribute('aria-expanded', 'true');
                content.style.maxHeight = `${content.scrollHeight}px`;
            }
        });
    });

    // --- 7. Toast & Simulated Checkout Notifier ---
    const toast = document.getElementById('toast');
    const toastMsg = toast ? toast.querySelector('.toast-message') : null;
    const checkoutButtons = document.querySelectorAll('.btn-buy-new, .btn-cta-checkout');
    
    const showToast = (message, duration = 5000) => {
        if (!toast || !toastMsg) return;
        
        toastMsg.innerHTML = message; // Using HTML to allow emoji formatting or linebreaks
        toast.classList.add('active');
        
        setTimeout(() => {
            toast.classList.remove('active');
        }, duration);
    };
    
    checkoutButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productName = btn.getAttribute('data-product') || 'แพ็กเกจพรอมต์';
            const price = btn.getAttribute('data-price') || '59';
            const orderId = `PFL-${Math.floor(100000 + Math.random() * 900000)}`;
            
            showToast(`🛒 <strong>จองสิทธิ์สำเร็จ:</strong> ${productName} (ราคาพิเศษ ${price} บาท)<br>รหัสยืนยันคำสั่งรับจำลองของคุณคือ <strong>${orderId}</strong>`);
        });
    });
});
