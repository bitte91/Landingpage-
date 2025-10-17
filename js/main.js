document.addEventListener('DOMContentLoaded', () => {
    // Hide loading screen
    const loadingScreen = document.getElementById('loading-screen');
    window.addEventListener('load', () => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 500);
    });

    // Initialize Lucide icons
    lucide.createIcons();

    // GSAP Animations & Navigation
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    const sectionsNav = document.querySelector('.sections-nav');
    const mobileNav = document.querySelector('.mobile-nav');
    const sections = document.querySelectorAll('[data-section]');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const themeToggle = document.querySelector('.theme-toggle');

    // Set initial theme
    document.body.dataset.theme = 'dark';

    // Theme toggle handler
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.dataset.theme;
        document.body.dataset.theme = currentTheme === 'dark' ? 'light' : 'dark';
    });

    // Dynamically create nav links for both desktop and mobile
    sections.forEach(section => {
        const sectionName = section.dataset.section;
        const sectionId = section.id;

        const link = document.createElement('a');
        link.href = `#${sectionId}`;
        link.textContent = sectionName;
        sectionsNav.appendChild(link);

        const mobileLink = link.cloneNode(true);
        mobileNav.appendChild(mobileLink);

        // Add scroll trigger for each section to update nav
        ScrollTrigger.create({
            trigger: section,
            start: "top center",
            end: "bottom center",
            onToggle: self => {
                const targetLink = document.querySelector(`.sections-nav a[href="#${sectionId}"]`);
                if (self.isActive && targetLink) {
                    document.querySelectorAll('.sections-nav a').forEach(a => a.classList.remove('active'));
                    targetLink.classList.add('active');
                }
            }
        });
    });

    // Smooth scroll for all nav links
    const allLinks = document.querySelectorAll('.sections-nav a, .mobile-nav a, .hero-cta');
    allLinks.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');

            if (mobileNav.style.display === 'flex') {
                mobileNav.style.display = 'none';
                mobileMenuToggle.classList.remove('open');
            }

            gsap.to(window, {
                duration: 1,
                scrollTo: targetId
            });
        });
    });

    // Animate cards on scroll
    gsap.utils.toArray('.card').forEach(card => {
        gsap.fromTo(card,
            { opacity: 0, y: 50 },
            {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    // Add classes for timeline animation
    const timelineItems = document.querySelectorAll('.timeline-item-container');
    timelineItems.forEach((item, index) => {
        if (index % 2 === 0) {
            item.classList.add('left');
        } else {
            item.classList.add('right');
        }
    });

    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('open');
        const isNavVisible = mobileNav.style.display === 'flex';
        mobileNav.style.display = isNavVisible ? 'none' : 'flex';
    });
});
