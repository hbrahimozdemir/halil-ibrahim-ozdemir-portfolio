// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('year').textContent = new Date().getFullYear();
    
    // Keyboard navigation accessibility
    const handleFirstTab = (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('user-is-tabbing');
            window.removeEventListener('keydown', handleFirstTab);
            window.addEventListener('mousedown', handleMouseDownOnce);
        }
    };

    const handleMouseDownOnce = () => {
        document.body.classList.remove('user-is-tabbing');
        window.removeEventListener('mousedown', handleMouseDownOnce);
        window.addEventListener('keydown', handleFirstTab);
    };

    window.addEventListener('keydown', handleFirstTab);

    // Back to top button functionality
    const backToTopButton = document.querySelector(".back-to-top");
    let isBackToTopRendered = false;

    const alterStyles = (isBackToTopRendered) => {
        backToTopButton.style.visibility = isBackToTopRendered ? "visible" : "hidden";
        backToTopButton.style.opacity = isBackToTopRendered ? 1 : 0;
        backToTopButton.style.transform = isBackToTopRendered ? "scale(1)" : "scale(0)";
    };

    window.addEventListener("scroll", () => {
        if (window.scrollY > 700) {
            isBackToTopRendered = true;
            alterStyles(isBackToTopRendered);
        } else {
            isBackToTopRendered = false;
            alterStyles(isBackToTopRendered);
        }

        // Parallax effect on header
        const header = document.querySelector('.header');
        const scrollValue = window.scrollY;
        if (header) {
            header.style.backgroundPosition = `center ${scrollValue * 0.5}px`;
        }

        // Animate on scroll
        animateOnScroll();
    });

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Image hover effect (static to GIF)
    document.querySelectorAll('.work__image').forEach(img => {
        const staticSrc = img.src;
        const gifSrc = img.getAttribute('data-hover');
        
        if (gifSrc) {
            // Preload GIF
            const preloadImg = new Image();
            preloadImg.src = gifSrc;
            
            img.addEventListener('mouseover', () => {
                img.src = gifSrc;
            });

            img.addEventListener('mouseout', () => {
                img.src = staticSrc;
            });
        }
    });

    // Add animations to elements when they come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.work__box, .client-card, .about__content, .contact__info');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animate-fadeInUp');
            }
        });
    };

    animateOnScroll(); // Run on initial load

    // Mobile nav toggle
    const setupMobileNav = () => {
        const navToggle = document.querySelector('.nav-toggle');
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                const navItems = document.querySelector('.nav__items');
                navItems.classList.toggle('nav__items--visible');
                navToggle.classList.toggle('nav-toggle--active');
            });
        }
    };

    setupMobileNav();

    // Glitch text effect enhancement
    const glitchTexts = document.querySelectorAll('.glitch-text');
    
    glitchTexts.forEach(text => {
        setInterval(() => {
            text.classList.add('glitch-active');
            setTimeout(() => {
                text.classList.remove('glitch-active');
            }, 1000);
        }, Math.random() * 10000 + 5000);
    });

    // Skill tags animation
    const skillTags = document.querySelectorAll('.skill-tag');
    
    skillTags.forEach((tag, index) => {
        tag.classList.add('delay-' + (index % 5 + 1));
    });

    // Preload background images for smooth transitions
    const preloadBackgroundImages = () => {
        const images = [
            './images/header.jpg',
            './images/contact-bg.jpg'
        ];
        
        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    };
    
    preloadBackgroundImages();
});
