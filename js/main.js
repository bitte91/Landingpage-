
window.addEventListener("load", () => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    console.warn("GSAP ou ScrollTrigger não foram carregados.");
    return;
  }

  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  // Oculta a tela de carregamento suavemente
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen) {
    gsap.to(loadingScreen, {
      opacity: 0,
      duration: 0.6,
      onComplete: () => loadingScreen.remove(),
    });
  }

  // Cria uma navegação dinâmica com base nas seções existentes
  const navContainer = document.querySelector(".sections-nav");
  const sections = document.querySelectorAll("section");
  if (navContainer && sections.length) {
    sections.forEach((sec) => {
      const link = document.createElement("a");
      link.href = `#${sec.id}`;
      link.textContent =
        sec.querySelector("h2")?.textContent ||
        (sec.id.charAt(0).toUpperCase() + sec.id.slice(1));
      navContainer.appendChild(link);
    });
  }

  // Tema claro/escuro
  const themeBtn = document.querySelector(".theme-toggle");
  const root = document.documentElement;
  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      document.body.classList.toggle("light-mode");
      root.style.setProperty("--color-bg", "#F4F4F2");
      root.style.setProperty("--color-light", "#1B1B1B");
      root.style.setProperty("--color-card", "rgba(0, 0, 0, 0.05)");
    });
  }

  // Animações básicas de entrada das seções
  sections.forEach((section) => {
    gsap.from(section, {
      opacity: 0,
      y: 50,
      duration: 0.8,
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    });
  });

  // Scroll suave ao clicar em links de navegação
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId && targetId.startsWith("#")) {
        e.preventDefault();
        gsap.to(window, {
          duration: 0.8,
          scrollTo: targetId,
          ease: "power2.out",
        });
      }
    });
  });

  // Background animado leve (opcional)
  const shapes = document.querySelectorAll(".shape");
  if (shapes.length) {
    shapes.forEach((shape, i) => {
      gsap.to(shape, {
        x: `random(-50, 50)`,
        y: `random(-50, 50)`,
        duration: 10 + i * 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    });
  }

  console.log("Landing Page inicializada com sucesso!");
});
