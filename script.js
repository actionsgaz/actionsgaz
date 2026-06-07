const form = document.querySelector("#quote-form");
const header = document.querySelector(".site-header");
const menuToggle = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");

const closeMobileMenu = () => {
  header?.classList.remove("is-menu-open");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Ouvrir le menu");
  mobileMenu?.setAttribute("aria-hidden", "true");
};

menuToggle?.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

  header?.classList.toggle("is-menu-open", !isOpen);
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Ouvrir le menu" : "Fermer le menu");
  mobileMenu?.setAttribute("aria-hidden", String(isOpen));
});

mobileMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", closeMobileMenu);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeMobileMenu();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 1040) {
    closeMobileMenu();
  }
});

form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const data = new FormData(form);
  const name = data.get("name")?.toString().trim();
  const phone = data.get("phone")?.toString().trim();
  const service = data.get("service")?.toString().trim();
  const message = data.get("message")?.toString().trim();

  const subject = encodeURIComponent(`Demande de rappel - ${service || "Actions Gaz"}`);
  const body = encodeURIComponent(
    [
      "Bonjour Actions Gaz,",
      "",
      "Je souhaite être rappelé rapidement.",
      "",
      `Nom : ${name || ""}`,
      `Téléphone : ${phone || ""}`,
      `Service souhaité : ${service || ""}`,
      "",
      "Message :",
      message || "",
    ].join("\n"),
  );

  window.location.href = `mailto:actionsgaz83@gmail.com?subject=${subject}&body=${body}`;
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealGroups = [
  ".services-intro",
  ".service-category",
  ".services-bottom-cta",
  ".why-media",
  ".why-copy",
  ".proof-list > div",
  ".client-intro",
  ".client-item",
  ".client-check",
  ".process-heading",
  ".process-steps article",
  ".reviews-heading",
  ".review-card",
  ".reviews-cta",
  ".contact-copy",
  ".contact-form",
];

const animatedElements = document.querySelectorAll(revealGroups.join(","));
animatedElements.forEach((element) => {
  element.classList.add("reveal-item");
});

const runFallbackAnimations = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.14,
    },
  );

  animatedElements.forEach((element) => observer.observe(element));
};

const initAnimations = () => {
  if (prefersReducedMotion) {
    document.documentElement.classList.add("reduce-motion");
    animatedElements.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const { gsap, ScrollTrigger } = window;

  if (!gsap || !ScrollTrigger) {
    runFallbackAnimations();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  gsap.set(animatedElements, {
    autoAlpha: 0,
    y: 34,
    scale: 0.98,
  });

  gsap
    .timeline({
      defaults: {
        duration: 0.8,
        ease: "power3.out",
      },
    })
    .from(".brand-mark", {
      autoAlpha: 0,
      y: -20,
      scale: 0.92,
    })
    .from(
      ".nav a, .header-call, .menu-toggle",
      {
        autoAlpha: 0,
        y: -12,
        stagger: 0.055,
      },
      "-=0.5",
    )
    .from(
      ".hero-copy .eyebrow, #hero-title, .hero-actions .btn",
      {
        autoAlpha: 0,
        y: 28,
        stagger: 0.11,
      },
      "-=0.25",
    )
    .from(
      ".hero-panel",
      {
        autoAlpha: 0,
        x: 30,
        scale: 0.96,
      },
      "-=0.45",
    );

  gsap.to(".hero", {
    backgroundPosition: "54% center",
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  gsap.utils.toArray(".section, .contact-section").forEach((section) => {
    const items = section.querySelectorAll(".reveal-item");

    if (!items.length) {
      return;
    }

    gsap.to(items, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 0.75,
      ease: "power3.out",
      stagger: 0.09,
      scrollTrigger: {
        trigger: section,
        start: "top 78%",
        once: true,
      },
    });
  });

  gsap.to(".service-icon .title-icon", {
    rotate: 360,
    duration: 16,
    ease: "none",
    repeat: -1,
    stagger: 0.8,
  });

  gsap.to(".services-bottom-cta", {
    boxShadow: "0 24px 70px rgba(242, 138, 46, 0.22)",
    borderColor: "rgba(242, 138, 46, 0.4)",
    duration: 1.8,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });
};

document.querySelectorAll(".service-category, .client-item, .review-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    if (prefersReducedMotion) {
      return;
    }

    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -8;

    if (window.gsap) {
      window.gsap.to(card, {
        rotateX: y,
        rotateY: x,
        transformPerspective: 900,
        duration: 0.22,
        ease: "power2.out",
      });
    } else {
      card.style.setProperty("--tilt-x", `${y.toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${x.toFixed(2)}deg`);
    }

    card.classList.add("is-tilting");
  });

  card.addEventListener("pointerleave", () => {
    if (window.gsap && !prefersReducedMotion) {
      window.gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.45,
        ease: "elastic.out(1, 0.45)",
      });
    }

    card.classList.remove("is-tilting");
    card.style.removeProperty("--tilt-x");
    card.style.removeProperty("--tilt-y");
  });
});

initAnimations();
