 /* =============================================================
   CONSTRUCTO — main.js
   GSAP + ScrollTrigger driven interactions, shared across pages
   ============================================================= */
document.addEventListener("DOMContentLoaded", () => {

  gsap.registerPlugin(ScrollTrigger);

  /* ---------------- NAV SCROLL STATE ---------------- */
  const nav = document.querySelector(".site-nav");
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------------- MOBILE NAV / HAMBURGER (fresh) ---------------- */
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  const scrim = document.querySelector(".nav-scrim");

  const setMenuState = (isOpen) => {
    if (!toggle || !links) return;

    toggle.classList.toggle("is-open", isOpen);
    toggle.setAttribute("aria-expanded", String(isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    links.classList.toggle("is-open", isOpen);
    scrim?.classList.toggle("is-visible", isOpen);
    document.body.classList.toggle("nav-locked", isOpen);
  };

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const isOpen = links.classList.contains("is-open");
      setMenuState(!isOpen);
    });

    links.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => setMenuState(false));
    });

    scrim?.addEventListener("click", () => setMenuState(false));

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") setMenuState(false);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 880) setMenuState(false);
    });
  }

  /* ---------------- TAPE MEASURE SCROLL INDICATOR ---------------- */
  const fill = document.querySelector(".tape-measure .fill");
  const marker = document.querySelector(".tape-measure .marker");
  if (fill) {
    ScrollTrigger.create({
      trigger: document.body,
      start: "top top",
      end: "bottom bottom",
      onUpdate: self => {
        const pct = self.progress * 100;
        fill.style.height = pct + "%";
        marker.style.top = pct + "%";
      }
    });
  }

  /* ---------------- HERO INTRO TIMELINE ---------------- */
  const hero = document.querySelector(".hero, .page-banner");
  if (hero) {
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
    tl.to(".hero-kicker", { opacity: 1, duration: .01 })
      .from(".hero-kicker", { yPercent: 120, duration: .8 }, 0.1)
      .from(".hero h1 .line span, .page-banner h1 .word span", {
        opacity: 0, y: 36, duration: 1.1, stagger: .08
      }, 0.15)
      .from(".hero-sub, .crumb", { opacity: 0, y: 24, duration: .9 }, 0.5)
      .from(".hero-actions, .hero-actions *", { opacity: 0, y: 20, duration: .8, stagger: .08 }, 0.65)
      .from(".hero-note", { opacity: 0, y: 18, duration: .7 }, 0.72)
      .from(".hero-stats .stat", { opacity: 0, y: 20, duration: .7, stagger: .1 }, 0.8)
      .from(".hero-panel", { opacity: 0, y: 24, scale: .96, duration: 1 }, 0.82)
      .from(".hero-ring, .panel-metrics > div", { opacity: 0, y: 12, duration: .7, stagger: .08 }, 0.9)
      .from(".hero-media img", { scale: 1.15, duration: 1.8, ease: "power2.out" }, 0)
      .from(".hero-scroll", { opacity: 0, duration: .8 }, 1);
  }

  /* ---------------- GENERIC SCROLL REVEALS ---------------- */
  gsap.utils.toArray(".reveal-up").forEach((el, i) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1, ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%" },
      delay: (i % 3) * 0.08
    });
  });

  /* stagger children within a container marked .reveal-group */
  gsap.utils.toArray(".reveal-group").forEach(group => {
    const items = group.children;
    gsap.from(items, {
      opacity: 0, y: 46, duration: .9, ease: "power3.out", stagger: .12,
      scrollTrigger: { trigger: group, start: "top 82%" }
    });
  });

  /* section eyebrow + heading split reveal */
  gsap.utils.toArray(".section-head").forEach(head => {
    gsap.from(head.querySelectorAll(".eyebrow, h2, p"), {
      opacity: 0, y: 30, duration: .8, ease: "power3.out", stagger: .1,
      scrollTrigger: { trigger: head, start: "top 88%" }
    });
  });

  /* hazard divider draws in */
  gsap.utils.toArray(".hazard").forEach(el => {
    gsap.from(el, {
      scaleX: 0, transformOrigin: "left center", duration: 1.1, ease: "power3.inOut",
      scrollTrigger: { trigger: el, start: "top 95%" }
    });
  });

  /* ---------------- COUNTERS ---------------- */
  gsap.utils.toArray("[data-count]").forEach(el => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || "";
    const obj = { val: 0 };
    ScrollTrigger.create({
      trigger: el,
      start: "top 90%",
      once: true,
      onEnter: () => {
        gsap.to(obj, {
          val: target, duration: 2, ease: "power2.out",
          onUpdate: () => {
            el.textContent = (target % 1 === 0 ? Math.floor(obj.val) : obj.val.toFixed(1)) + suffix;
          }
        });
      }
    });
  });

  /* ---------------- PROCESS / SERVICE CARD PARALLAX-ISH TILT ---------------- */
  const supportsHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (supportsHover) {
    gsap.utils.toArray(".project-card, .service-card, .blog-card").forEach(card => {
      card.addEventListener("mousemove", e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        gsap.to(card, { rotateX: y * -4, rotateY: x * 6, duration: .5, ease: "power2.out", transformPerspective: 800 });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: .6, ease: "power3.out" });
      });
    });
  }

  /* ---------------- PROJECT FILTER ---------------- */
  const filterBtns = document.querySelectorAll(".project-filter button");
  const projectCards = document.querySelectorAll(".project-card");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const cat = btn.dataset.filter;
      projectCards.forEach(card => {
        const show = cat === "all" || card.dataset.category === cat;
        gsap.to(card, {
          opacity: show ? 1 : 0,
          scale: show ? 1 : 0.9,
          duration: .4, ease: "power2.out",
          onStart: () => { if (show) card.style.display = ""; },
          onComplete: () => { if (!show) card.style.display = "none"; }
        });
      });
    });
  });

  /* ---------------- TESTIMONIAL SLIDER ---------------- */
  const track = document.querySelector(".testi-track");
  if (track) {
    const cards = track.children;
    let index = 0;
    const go = dir => {
      index = (index + dir + cards.length) % cards.length;
      const card = cards[index];
      const offset = card.offsetLeft;
      gsap.to(track, { scrollLeft: offset, duration: .7, ease: "power3.inOut" });
    };
    document.querySelector(".testi-next")?.addEventListener("click", () => go(1));
    document.querySelector(".testi-prev")?.addEventListener("click", () => go(-1));
  }

  /* ---------------- FAQ ACCORDION ---------------- */
  document.querySelectorAll(".faq-q").forEach(q => {
    q.addEventListener("click", () => {
      const item = q.closest(".faq-item");
      const answer = item.querySelector(".faq-a");
      const isOpen = item.classList.contains("is-open");
      document.querySelectorAll(".faq-item.is-open").forEach(open => {
        if (open !== item) {
          open.classList.remove("is-open");
          open.querySelector(".faq-a").style.maxHeight = null;
        }
      });
      if (isOpen) {
        item.classList.remove("is-open");
        answer.style.maxHeight = null;
      } else {
        item.classList.add("is-open");
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });

  /* ---------------- CONTACT FORM ---------------- */
  const form = document.querySelector(".contact-form");
  if (form) {
    form.addEventListener("submit", e => {
      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }
      e.preventDefault();
      const status = form.querySelector(".form-status");
      status.textContent = "Sending your message...";
      gsap.fromTo(status, { opacity: 0 }, { opacity: 1, duration: .4 });
      setTimeout(() => {
        status.textContent = "Thanks — your message has been sent. We'll be in touch within one business day.";
        form.reset();
      }, 900);
    });
  }

  /* ---------------- CTA magnetic button (desktop hover only) ---------------- */
  if (supportsHover) {
    document.querySelectorAll(".btn-primary").forEach(btn => {
      btn.addEventListener("mousemove", e => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        gsap.to(btn, { x: x * 0.25, y: y * 0.4, duration: .4, ease: "power2.out" });
      });
      btn.addEventListener("mouseleave", () => {
        gsap.to(btn, { x: 0, y: 0, duration: .5, ease: "elastic.out(1, .4)" });
      });
    });
  }

});