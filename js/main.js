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
    const cardsWithSection = document.querySelectorAll('[data-section]');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const themeToggle = document.querySelector('.theme-toggle');
    const horizontalScrollContainer = document.querySelector('.horizontal-scroll-container');

    // Set initial theme
    document.body.dataset.theme = 'dark';

    // Theme toggle handler
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.dataset.theme;
        document.body.dataset.theme = currentTheme === 'dark' ? 'light' : 'dark';
    });

    let sections = [];
    // Dynamically create nav links for both desktop and mobile
    cardsWithSection.forEach((card, index) => {
        const sectionName = card.dataset.section;
        if (!card.id) card.id = sectionName;
        sections.push({id: `#${card.id}`, element: card, index: index});

        // Desktop nav
        const link = document.createElement('a');
        link.href = `#${card.id}`;
        link.textContent = sectionName;
        link.dataset.target = `#${card.id}`;
        sectionsNav.appendChild(link);

        // Mobile nav
        const mobileLink = link.cloneNode(true);
        mobileNav.appendChild(mobileLink);
    });

    ScrollTrigger.matchMedia({
        "(min-width: 769px)": function() {
            // Horizontal scroll animation
            let tween = gsap.to(horizontalScrollContainer, {
                x: () => -(horizontalScrollContainer.scrollWidth - document.documentElement.clientWidth) + "px",
                ease: "none",
                scrollTrigger: {
                    trigger: horizontalScrollContainer,
                    pin: true,
                    scrub: 1,
                    end: () => "+=" + (horizontalScrollContainer.scrollWidth - document.documentElement.clientWidth),
                    onUpdate: self => {
                        const progress = self.progress;
                        const sectionIndex = Math.floor(progress * sections.length);
                        document.querySelectorAll('.sections-nav a').forEach(a => a.classList.remove('active'));
                        if(sections[sectionIndex]){
                            const activeLink = document.querySelector(`.sections-nav a[data-target="${sections[sectionIndex].id}"]`);
                            if(activeLink) activeLink.classList.add('active');
                        }
                    }
                }
            });

            // Smooth scroll for nav links (desktop)
            document.querySelectorAll('.sections-nav a').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    const target = this.getAttribute('href');
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: {
                            x: target,
                            offsetX: (document.documentElement.clientWidth - document.querySelector(target).offsetWidth) / 2
                        }
                    });
                });
            });

            // Card fade-in + slide-up animation (desktop)
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
                            containerAnimation: tween,
                            start: 'left 80%',
                            toggleActions: 'play none none none'
                        }
                    }
                );
            });

            // Special trigger for the last section
            ScrollTrigger.create({
                trigger: ".bento-grid-container",
                containerAnimation: tween,
                start: "right right",
                onEnter: () => {
                    document.querySelectorAll('.sections-nav a').forEach(a => a.classList.remove('active'));
                    const lastLink = document.querySelector('.sections-nav a:last-child');
                    if(lastLink) lastLink.classList.add('active');
                },
                onEnterBack: () => {
                    document.querySelectorAll('.sections-nav a').forEach(a => a.classList.remove('active'));
                    const secondLastLink = document.querySelector('.sections-nav a:nth-last-child(2)');
                    if(secondLastLink) secondLastLink.classList.add('active');
                }
            });
        },
        "(max-width: 768px)": function() {
            // Smooth scroll for nav links (mobile)
            document.querySelectorAll('.mobile-nav a').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (mobileNav.style.display === 'flex') {
                        mobileNav.style.display = 'none'; // Hide mobile nav on click
                        mobileMenuToggle.classList.remove('open');
                    }
                    const target = this.getAttribute('href');
                    gsap.to(window, {
                        duration: 1,
                        scrollTo: target
                    });
                });
            });

            // Card fade-in + slide-up animation (mobile)
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
                            start: 'top 80%',
                            toggleActions: 'play none none none'
                        }
                    }
                );
            });
        }
    });

    // Mobile menu toggle
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('open');
        const isNavVisible = mobileNav.style.display === 'flex';
        mobileNav.style.display = isNavVisible ? 'none' : 'flex';
    });
});
