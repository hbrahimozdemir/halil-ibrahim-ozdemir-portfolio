document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------------------------------
    // --- Current Year Footer Update ---
    // ------------------------------------------------------------------
    const yearElement = document.getElementById('year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // ------------------------------------------------------------------
    // --- Keyboard Accessibility Helper ---
    // ------------------------------------------------------------------
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

    // ------------------------------------------------------------------
    // --- Scrolled Header Animation ---
    // ------------------------------------------------------------------
    const headerElement = document.getElementById('top');
    const handleHeaderScroll = () => {
        if (window.scrollY > 50) {
            headerElement.classList.add('scrolled');
        } else {
            headerElement.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleHeaderScroll);
    handleHeaderScroll(); // Execute once on load in case page is refreshed down

    // ------------------------------------------------------------------
    // --- Mobile Menu Toggle ---
    // ------------------------------------------------------------------
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const navMenuElement = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav__link');

    if (mobileMenuBtn && navMenuElement) {
        mobileMenuBtn.addEventListener('click', () => {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
            mobileMenuBtn.classList.toggle('active');
            navMenuElement.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.setAttribute('aria-expanded', 'false');
                mobileMenuBtn.classList.remove('active');
                navMenuElement.classList.remove('active');
            });
        });
    }

    // ------------------------------------------------------------------
    // --- Theme Switcher Logic ---
    // ------------------------------------------------------------------
    const themeBtn = document.getElementById('theme-btn');
    const themeIcon = themeBtn ? themeBtn.querySelector('i') : null;

    // Load user theme preference
    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'light') {
        document.body.classList.add('light-mode');
        if (themeIcon) {
            themeIcon.className = 'fas fa-sun';
        }
    } else {
        document.body.classList.remove('light-mode');
        if (themeIcon) {
            themeIcon.className = 'fas fa-moon';
        }
    }

    if (themeBtn && themeIcon) {
        themeBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            
            const isLight = document.body.classList.contains('light-mode');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            
            // Toggle icon classes
            themeIcon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
        });
    }

    // ------------------------------------------------------------------
    // --- Copy Email to Clipboard ---
    // ------------------------------------------------------------------
    const copyEmailBtn = document.getElementById('copy-email-btn');
    const emailTextElement = document.getElementById('email-text');
    const copyBtnText = document.getElementById('copy-btn-text');

    if (copyEmailBtn && emailTextElement && copyBtnText) {
        copyEmailBtn.addEventListener('click', () => {
            const email = emailTextElement.textContent.trim();
            
            navigator.clipboard.writeText(email).then(() => {
                // Visual feedback
                const origText = copyBtnText.textContent;
                const origIcon = copyEmailBtn.querySelector('i').className;
                
                copyBtnText.textContent = 'Copied!';
                copyEmailBtn.querySelector('i').className = 'fas fa-check';
                copyEmailBtn.style.backgroundColor = '#047857'; // Highlight state
                
                setTimeout(() => {
                    copyBtnText.textContent = origText;
                    copyEmailBtn.querySelector('i').className = origIcon;
                    copyEmailBtn.style.backgroundColor = ''; // Restore original
                }, 2000);
            }).catch(err => {
                console.error('Could not copy email to clipboard: ', err);
            });
        });
    }

    // ------------------------------------------------------------------
    // --- Back to Top Button ---
    // ------------------------------------------------------------------
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ------------------------------------------------------------------
    // --- Scroll-Linked Reveal Animation (Intersection Observer) ---
    // ------------------------------------------------------------------
    const revealElements = document.querySelectorAll('.reveal');
    
    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Reveal only once
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(element => {
            revealObserver.observe(element);
        });
    } else {
        // Fallback for older browsers
        revealElements.forEach(element => {
            element.classList.add('active');
        });
    }
});