document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const sectionsNav = document.querySelector('.sections-nav');
    const mobileNav = document.querySelector('.mobile-nav');
    const cardsWithSection = document.querySelectorAll('[data-section]');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const themeToggle = document.querySelector('.theme-toggle');

    // Ocultar tela de carregamento
    window.addEventListener('load', () => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => loadingScreen.style.display = 'none', 500);
    });

    // Inicializar ícones Lucide
    lucide.createIcons();

    // GSAP
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // Definir tema inicial
    document.body.dataset.theme = 'dark';

    // Manipulador do alternador de tema
    themeToggle.addEventListener('click', () => {
        const newTheme = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
        document.body.dataset.theme = newTheme;
    });

    // Criar links de navegação dinamicamente
    cardsWithSection.forEach(card => {
        const sectionName = card.dataset.section;
        const sectionId = card.id;

        const createLink = (id, name) => {
            const link = document.createElement('a');
            link.href = `#${id}`;
            link.textContent = name;
            return link;
        };

        sectionsNav.appendChild(createLink(sectionId, sectionName));
        mobileNav.appendChild(createLink(sectionId, sectionName));
    });

    // Animação de fade-in + slide-up dos cartões
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

    // Destaque de link ativo na rolagem
    ScrollTrigger.create({
        start: 'top center',
        end: 'bottom center',
        onUpdate: self => {
            document.querySelectorAll('[data-section]').forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom >= 100) {
                    const id = section.getAttribute('id');
                    document.querySelectorAll('.sections-nav a, .mobile-nav a').forEach(a => {
                        a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
                    });
                }
            });
        }
    });

    // Rolagem suave para links de navegação
    const setupSmoothScroll = (selector) => {
        document.querySelectorAll(selector).forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = this.getAttribute('href');
                gsap.to(window, { duration: 1, scrollTo: { y: target, offsetY: 70 } });

                if (mobileNav.style.display === 'flex') {
                    mobileNav.style.display = 'none';
                    mobileMenuToggle.classList.remove('open');
                }
            });
        });
    };

    setupSmoothScroll('.sections-nav a');
    setupSmoothScroll('.mobile-nav a');
    setupSmoothScroll('.hero-cta');

    // Alternador de menu móvel
    mobileMenuToggle.addEventListener('click', () => {
        mobileMenuToggle.classList.toggle('open');
        mobileNav.style.display = mobileMenuToggle.classList.contains('open') ? 'flex' : 'none';
    });
});
