// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }
    
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

    // Back to top button functionality - Güncellendi
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (scrollToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.classList.add('active');
            } else {
                scrollToTopBtn.classList.remove('active');
            }
        });
        
        scrollToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Parallax effect on header
    window.addEventListener("scroll", () => {
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

    // Game card hover effect (static image to GIF) - Tamamen yenilendi
    const gameCards = document.querySelectorAll('.game-card');
    
    gameCards.forEach(card => {
        const staticImg = card.querySelector('.work__image');
        const gifImg = card.querySelector('.work__image-gif');
        
        if (staticImg && gifImg) {
            const gifSrc = gifImg.getAttribute('data-src');
            
            // Hover events
            card.addEventListener('mouseenter', () => {
                // Yalnızca ilk hover'da GIF'i yükle
                if (!gifImg.src || gifImg.src.indexOf('data:image') === 0) {
                    gifImg.src = gifSrc;
                }
            });
        }
    });

    // Add animations to elements when they come into view
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.work__box, .game-card, .company-card, .about__content, .contact__info');
        
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
        const menuToggle = document.querySelector('.menu-toggle');
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                const navItems = document.querySelector('.nav__items');
                navItems.classList.toggle('active');
                menuToggle.classList.toggle('active');
            });
        }
    };

    setupMobileNav();

    // Skill badges hover effect - Yeni eklendi
    const skillBadges = document.querySelectorAll('.skill-badge');
    
    skillBadges.forEach(badge => {
        badge.addEventListener('mouseenter', () => {
            badge.style.transform = 'translateY(-5px)';
            badge.style.boxShadow = 'var(--glow-secondary)';
        });
        
        badge.addEventListener('mouseleave', () => {
            badge.style.transform = 'translateY(0)';
            badge.style.boxShadow = 'none';
        });
    });

    // Glitch text effect enhancement
    const glitchTexts = document.querySelectorAll('.glitch');
    
    glitchTexts.forEach(text => {
        // Glitch data-text attribute'unu ekle
        if (text.textContent) {
            text.setAttribute('data-text', text.textContent);
        }
        
        // Random glitch effect
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
        tag.style.animationDelay = `${index * 0.1}s`;
        tag.classList.add('fadeIn');
    });

    // Game loader - Loading screen
    const gameLoader = document.querySelector('.game-loader');
    if (gameLoader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                gameLoader.style.opacity = '0';
                setTimeout(() => {
                    gameLoader.style.display = 'none';
                }, 500);
            }, 1500);
        });
    }

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
    
    // Theme toggle - Dark/Light mode (Optional)
    const themeToggle = document.querySelector('.theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            
            // Tema tercihini localStorage'da sakla
            const currentTheme = document.body.classList.contains('light-mode') ? 'light' : 'dark';
            localStorage.setItem('theme', currentTheme);
            
            // Icon değiştir
            const icon = themeToggle.querySelector('i');
            if (icon) {
                if (document.body.classList.contains('light-mode')) {
                    icon.className = 'fas fa-moon';
                } else {
                    icon.className = 'fas fa-sun';
                }
            }
        });
        
        // Sayfa yüklendiğinde kaydedilmiş tema varsa uygula
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
            const icon = themeToggle.querySelector('i');
            if (icon) {
                icon.className = 'fas fa-moon';
            }
        }
    }
});