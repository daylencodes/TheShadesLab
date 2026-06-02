(function () {
  const markPageLoaded = () => {
    requestAnimationFrame(() => {
      document.documentElement.classList.add("is-loaded");
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", markPageLoaded);
  } else {
    markPageLoaded();
  }

  const WHATSAPP =
    "https://wa.me/6597337098?text=Hello%20The%20Shades%20Lab%2C%20I%20would%20like%20to%20enquire%20about%20your%20curtains%20and%20blinds.";
  const MESSENGER = "https://m.me/TheShadesLab";

  const header = document.getElementById("site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const navMobile = document.querySelector(".nav-mobile");
  const hero = document.querySelector(".hero");

  /* Header scroll */
  if (header && hero) {
    const onScroll = () => {
      const onHero = window.scrollY < hero.offsetHeight - 100;
      header.classList.toggle("is-scrolled", window.scrollY > 40);
      header.classList.toggle("site-header--hero", onHero);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  } else if (header) {
    window.addEventListener(
      "scroll",
      () => header.classList.toggle("is-scrolled", window.scrollY > 24),
      { passive: true }
    );
  }

  /* Mobile menu */
  const navBackdrop = document.getElementById("nav-mobile-backdrop");
  const menuClose = document.querySelector(".menu-toggle--close");
  const menuToggles = [menuToggle, menuClose].filter(Boolean);

  const setMobileMenuOpen = (open) => {
    menuToggles.forEach((btn) => {
      btn.setAttribute("aria-expanded", String(open));
      if (!btn.classList.contains("menu-toggle--close")) {
        btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      }
    });
    navMobile.classList.toggle("is-open", open);
    navMobile.setAttribute("aria-hidden", String(!open));
    document.body.classList.toggle("menu-open", open);
    document.body.style.overflow = open ? "hidden" : "";
    if (navBackdrop) {
      navBackdrop.classList.toggle("is-open", open);
      navBackdrop.hidden = !open;
      navBackdrop.setAttribute("aria-hidden", String(!open));
    }
  };

  if (menuToggle && navMobile) {
    menuToggle.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      const open = menuToggle.getAttribute("aria-expanded") === "true";
      setMobileMenuOpen(!open);
    });

    if (menuClose) {
      menuClose.addEventListener("click", (e) => {
        e.preventDefault();
        setMobileMenuOpen(false);
      });
    }

    if (navBackdrop) {
      navBackdrop.addEventListener("click", () => setMobileMenuOpen(false));
    }

    navMobile.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setMobileMenuOpen(false));
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && navMobile.classList.contains("is-open")) {
        setMobileMenuOpen(false);
      }
    });
  }

  /* Audience tabs */
  const audienceTabs = document.querySelectorAll(".audience-tab");
  const audiencePanels = document.querySelectorAll(".audience-panel");

  audienceTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const id = tab.getAttribute("data-audience");
      audienceTabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle("is-active", active);
        t.setAttribute("aria-selected", String(active));
      });
      audiencePanels.forEach((panel) => {
        const match = panel.id === `panel-${id}`;
        panel.classList.toggle("is-active", match);
        panel.hidden = !match;
      });
    });
  });

  /* Before / after sliders */
  document.querySelectorAll("[data-ba-slider]").forEach((slider) => {
    const range = slider.querySelector(".ba-range");
    const clip = slider.querySelector(".ba-clip");
    const handle = slider.querySelector(".ba-handle");
    const beforeImg = slider.querySelector(".ba-img--before");
    if (!range || !clip || !handle || !beforeImg) return;

    const setPosition = (pct) => {
      const p = Math.min(100, Math.max(0, pct));
      clip.style.width = `${p}%`;
      handle.style.left = `${p}%`;
      range.value = String(p);
    };

    const syncWidth = () => {
      const w = slider.offsetWidth;
      if (w > 0) {
        beforeImg.style.setProperty("--ba-width", `${w}px`);
      }
    };

    const update = () => setPosition(Number(range.value));

    range.addEventListener("input", update);

    let dragging = false;
    const pointerX = (e) => (e.touches ? e.touches[0].clientX : e.clientX);

    const move = (e) => {
      if (!dragging) return;
      const rect = slider.getBoundingClientRect();
      const pct = ((pointerX(e) - rect.left) / rect.width) * 100;
      setPosition(pct);
    };

    slider.addEventListener("mousedown", (e) => {
      dragging = true;
      const rect = slider.getBoundingClientRect();
      setPosition(((e.clientX - rect.left) / rect.width) * 100);
    });
    slider.addEventListener("touchstart", (e) => {
      dragging = true;
      const rect = slider.getBoundingClientRect();
      setPosition(((pointerX(e) - rect.left) / rect.width) * 100);
    }, { passive: true });

    window.addEventListener("mousemove", move);
    window.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("mouseup", () => { dragging = false; });
    window.addEventListener("touchend", () => { dragging = false; });

    window.addEventListener("resize", () => {
      syncWidth();
      update();
    });

    slider.querySelectorAll("img").forEach((img) => {
      if (img.complete) syncWidth();
      else img.addEventListener("load", syncWidth, { once: true });
    });

    if ("ResizeObserver" in window) {
      const ro = new ResizeObserver(syncWidth);
      ro.observe(slider);
    }

    syncWidth();
    update();
  });

  /* Scroll reveal */
  const revealEls = document.querySelectorAll(".reveal");
  if (revealEls.length && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -48px 0px" }
    );
    revealEls.forEach((el) => observer.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
    document.querySelectorAll(".reveal-item").forEach((el) => el.classList.add("is-visible"));
  }

  /* FAQ: one open at a time (optional polish) */
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach((item) => {
    item.addEventListener("toggle", () => {
      if (!item.open) return;
      faqItems.forEach((other) => {
        if (other !== item && other.open) other.open = false;
      });
    });
  });

  document.querySelectorAll(
    ".chat-float--whatsapp, .mobile-cta-whatsapp, .footer-chat-whatsapp, .contact-cta-whatsapp"
  ).forEach((el) => {
    el.setAttribute("href", WHATSAPP);
  });

  document.querySelectorAll(
    ".chat-float--messenger, .mobile-cta-messenger, .footer-chat-messenger, .contact-cta-messenger"
  ).forEach((el) => {
    el.setAttribute("href", MESSENGER);
  });

  /* Portfolio mosaic, filters & lightbox */
  const PORTFOLIO_ITEMS = [
    {
      type: "video",
      category: "video",
      size: "wide",
      tag: "Film",
      title: "Project showcase reel",
      thumb: "https://www.theshadeslab.com/storage/252/DUO-2048.jpg",
      vimeo: "493211807",
      url: "https://www.theshadeslab.com/projects",
    },
    {
      type: "image",
      category: "commercial",
      size: "hero",
      tag: "Commercial",
      title: "Marina One · Global shipping",
      src: "https://www.theshadeslab.com/storage/356/ONE.jpg",
      alt: "Roller blinds at Marina One office",
      url: "https://www.theshadeslab.com/projects/office-of-global-shipping-company-at-marina-one",
    },
    {
      type: "image",
      category: "commercial",
      size: "tall",
      tag: "Commercial",
      title: "CapitaSpring · Global bank",
      src: "https://www.theshadeslab.com/storage/615/JPMC-Main-building-image.jpeg",
      alt: "CapitaSpring tower with window shading",
      url: "https://www.theshadeslab.com/projects/office-of-global-bank-at-capitaspring",
    },
    {
      type: "image",
      category: "commercial",
      size: "std",
      tag: "Commercial",
      title: "DUO Tower · Pharmaceutical HQ",
      src: "https://www.theshadeslab.com/storage/332/DUO.jpg",
      alt: "DUO Tower office installation",
      url: "https://www.theshadeslab.com/projects/office-of-global-pharmaceutical-company-duo-tower",
    },
    {
      type: "image",
      category: "commercial",
      size: "std",
      tag: "Commercial",
      title: "Dentsu Singapore · Office blinds",
      src: "https://www.theshadeslab.com/storage/504/Dentsu-Singapore-blockout-roller-blinds-office.jpg",
      alt: "Dentsu office with blockout roller blinds",
      url: "https://www.theshadeslab.com/blogs/roller-blinds-in-office-replacing-the-pvc-blackout-blinds",
    },
    {
      type: "image",
      category: "hospitality",
      size: "tall",
      tag: "Hospitality",
      title: "Sofitel · Tanjong Pagar Center",
      src: "https://www.theshadeslab.com/storage/219/Sofitel---Exterior.jpg",
      alt: "Sofitel Singapore exterior",
      url: "https://www.theshadeslab.com/projects/sofitel-at-tanjong-pagar-center",
    },
    {
      type: "image",
      category: "hospitality",
      size: "std",
      tag: "Hospitality",
      title: "Mandarin Orchard Singapore",
      src: "https://www.theshadeslab.com/storage/595/Mandarin-Orchard-1.JPG",
      alt: "Mandarin Orchard hotel interior",
      url: "https://www.theshadeslab.com/projects/mandarin-orchard-hotel-singapore",
    },
    {
      type: "image",
      category: "hospitality",
      size: "std",
      tag: "Show suite",
      title: "Changi Airport show suite",
      src: "https://www.theshadeslab.com/storage/190/Jewel-Showsuite---skylight.jpg",
      alt: "Changi show suite skylight shading",
      url: "https://www.theshadeslab.com/projects/changi-airport-show-suite",
    },
    {
      type: "image",
      category: "residential",
      size: "tall",
      tag: "Residential",
      title: "GCB · Bukit Timah",
      src: "https://www.theshadeslab.com/storage/360/Gladiola-1.jpg",
      srcset:
        "https://www.theshadeslab.com/storage/360/Gladiola-1.jpg 800w, " +
        "https://www.theshadeslab.com/storage/360/Gladiola-1.jpg 1200w, " +
        "https://www.theshadeslab.com/storage/360/Gladiola-1.jpg 1600w, " +
        "https://www.theshadeslab.com/storage/360/Gladiola-1.jpg 2000w, " +
        "https://www.theshadeslab.com/storage/360/Gladiola-1.jpg 2500w",
      sizes: "(min-width: 1200px) 42vw, (min-width: 768px) 50vw, 100vw",
      width: 2500,
      height: 1875,
      objectPosition: "center 38%",
      alt: "Good Class Bungalow living room with motorised roller blinds, Bukit Timah",
      url: "https://www.theshadeslab.com/projects/high-end-residential-at-upper-thomson-road",
      photoClear: true,
    },
    {
      type: "image",
      category: "residential",
      size: "std",
      tag: "Residential",
      title: "Katong · High-end home",
      src: "https://www.theshadeslab.com/storage/325/Avon2.JPG",
      alt: "Katong residence with venetian blinds",
      url: "https://www.theshadeslab.com/projects/high-end-residential-in-katong",
    },
    {
      type: "image",
      category: "commercial",
      size: "std",
      tag: "Skylight",
      title: "Jewel Changi · Skylight systems",
      src: "https://www.theshadeslab.com/storage/251/Jewel-Skylight-2048.jpg",
      alt: "Jewel Changi skylight installation",
      url: "https://www.theshadeslab.com/skylight",
    },
  ];

  const mosaicEl = document.getElementById("portfolio-mosaic");
  if (mosaicEl) {
    mosaicEl.classList.add("reveal", "reveal-group");
  }
  const cinemaEl = document.querySelector("[data-portfolio-cinema]");
  const filterBtns = document.querySelectorAll(".portfolio-filter");
  const lightbox = document.getElementById("portfolio-lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxVideoWrap = document.getElementById("lightbox-video-wrap");
  const lightboxIframe = document.getElementById("lightbox-iframe");
  const lightboxTag = document.getElementById("lightbox-tag");
  const lightboxTitle = document.getElementById("lightbox-title");
  const lightboxLink = document.getElementById("lightbox-link");

  let activeFilter = "all";
  let lightboxIndex = 0;
  let lightboxItems = [];

  const vimeoSrc = (id, autoplay) =>
    `https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0&color=b8a066${autoplay ? "&autoplay=1" : ""}`;

  const matchesFilter = (item) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "video") return item.type === "video";
    return item.category === activeFilter;
  };

  const renderMosaic = () => {
    if (!mosaicEl) return;
    mosaicEl.innerHTML = "";

    PORTFOLIO_ITEMS.forEach((item, index) => {
      if (item.type === "video") {
        if (activeFilter !== "video") return;
      }

      const card = document.createElement("article");
      card.className = `portfolio-card portfolio-card--${item.size} reveal-item${item.type === "video" ? " portfolio-card--video" : ""}${item.photoClear ? " portfolio-card--photo-clear" : ""}`;
      if (!matchesFilter(item)) card.classList.add("is-filtered-out");
      card.dataset.category = item.category;
      card.dataset.index = String(index);

      const hit = document.createElement("button");
      hit.type = "button";
      hit.className = "portfolio-card__hit";
      hit.setAttribute("aria-label", `${item.type === "video" ? "Play" : "View"}: ${item.title}`);

      const img = document.createElement("img");
      img.src = item.thumb || item.src;
      img.alt = item.alt || item.title;
      if (item.srcset) img.srcset = item.srcset;
      if (item.sizes) img.sizes = item.sizes;
      if (item.width) img.width = item.width;
      if (item.height) img.height = item.height;
      if (item.objectPosition) img.style.objectPosition = item.objectPosition;
      img.loading = "lazy";
      img.decoding = "async";
      hit.appendChild(img);

      const shine = document.createElement("span");
      shine.className = "portfolio-card__shine";
      shine.setAttribute("aria-hidden", "true");
      hit.appendChild(shine);

      if (item.type === "video") {
        const play = document.createElement("span");
        play.className = "portfolio-card__play";
        play.setAttribute("aria-hidden", "true");
        hit.appendChild(play);
        const label = document.createElement("span");
        label.className = "portfolio-card__play-label";
        label.textContent = "Play film";
        hit.appendChild(label);
      } else {
        const zoom = document.createElement("span");
        zoom.className = "portfolio-card__zoom";
        zoom.textContent = "Expand";
        hit.appendChild(zoom);
      }

      const meta = document.createElement("div");
      meta.className = "portfolio-card__meta";
      meta.innerHTML = `<span class="portfolio-card__tag">${item.tag}</span><h3 class="portfolio-card__title">${item.title}</h3>`;
      hit.appendChild(meta);

      hit.addEventListener("click", () => openLightbox(index));
      card.appendChild(hit);
      mosaicEl.appendChild(card);
    });
  };

  const getVisibleLightboxItems = () =>
    PORTFOLIO_ITEMS.filter((item) => {
      if (activeFilter === "all") return true;
      if (activeFilter === "video") return item.type === "video";
      return item.type === "image" && item.category === activeFilter;
    });

  const openLightbox = (portfolioIndex) => {
    if (!lightbox) return;
    lightboxItems = getVisibleLightboxItems();
    const item = PORTFOLIO_ITEMS[portfolioIndex];
    lightboxIndex = lightboxItems.findIndex((i) => i === item);
    if (lightboxIndex < 0) return;
    showLightboxItem(lightboxItems[lightboxIndex]);
    lightbox.hidden = false;
    lightbox.setAttribute("aria-hidden", "false");
    lightbox.classList.add("is-open");
    document.body.classList.add("lightbox-open");
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.hidden = true;
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.classList.remove("is-open");
    document.body.classList.remove("lightbox-open");
    if (lightboxIframe) lightboxIframe.src = "";
  };

  const showLightboxItem = (item) => {
    if (!item) return;
    lightboxTag.textContent = item.tag;
    lightboxTitle.textContent = item.title;
    lightboxLink.href = item.url || "#";
    lightboxLink.hidden = !item.url;

    if (item.type === "video") {
      lightboxImg.hidden = true;
      lightboxVideoWrap.hidden = false;
      lightboxIframe.src = vimeoSrc(item.vimeo, true);
    } else {
      lightboxVideoWrap.hidden = true;
      lightboxIframe.src = "";
      lightboxImg.hidden = false;
      lightboxImg.src = item.src;
      lightboxImg.alt = item.alt || item.title;
      if (item.srcset) {
        lightboxImg.srcset = item.srcset;
        lightboxImg.sizes = "min(96vw, 1400px)";
      } else {
        lightboxImg.removeAttribute("srcset");
        lightboxImg.removeAttribute("sizes");
      }
      if (item.width) lightboxImg.width = item.width;
      if (item.height) lightboxImg.height = item.height;
    }
  };

  const stepLightbox = (dir) => {
    if (lightboxItems.length < 2) return;
    lightboxIndex = (lightboxIndex + dir + lightboxItems.length) % lightboxItems.length;
    showLightboxItem(lightboxItems[lightboxIndex]);
  };

  const applyFilter = (filter) => {
    activeFilter = filter;
    filterBtns.forEach((btn) => {
      const on = btn.dataset.filter === filter;
      btn.classList.toggle("is-active", on);
      btn.setAttribute("aria-pressed", String(on));
    });
    if (cinemaEl) {
      cinemaEl.classList.toggle("is-hidden", filter !== "all" && filter !== "video");
    }
    renderMosaic();
  };

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => applyFilter(btn.dataset.filter || "all"));
  });

  document.querySelectorAll("[data-open-video]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const videoItem = PORTFOLIO_ITEMS.find((i) => i.type === "video");
      if (videoItem) openLightbox(PORTFOLIO_ITEMS.indexOf(videoItem));
    });
  });

  if (lightbox) {
    lightbox.querySelectorAll("[data-lightbox-close]").forEach((el) => {
      el.addEventListener("click", closeLightbox);
    });
    lightbox.querySelector("[data-lightbox-prev]")?.addEventListener("click", () => stepLightbox(-1));
    lightbox.querySelector("[data-lightbox-next]")?.addEventListener("click", () => stepLightbox(1));

    document.addEventListener("keydown", (e) => {
      if (lightbox.hidden) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") stepLightbox(-1);
      if (e.key === "ArrowRight") stepLightbox(1);
    });
  }

  if (mosaicEl) {
    renderMosaic();
    mosaicEl.querySelectorAll(".portfolio-card").forEach((card, i) => {
      card.style.transitionDelay = `${Math.min(i * 0.06, 0.42)}s`;
    });
  }

  /* Tilt on portfolio cards (subtle) */
  if (mosaicEl && window.matchMedia("(hover: hover)").matches) {
    mosaicEl.addEventListener("mousemove", (e) => {
      const card = e.target.closest(".portfolio-card:not(.is-filtered-out)");
      if (!card) return;
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(900px) rotateY(${x * 4}deg) rotateX(${y * -4}deg)`;
    });
    mosaicEl.addEventListener("mouseleave", () => {
      mosaicEl.querySelectorAll(".portfolio-card").forEach((card) => {
        card.style.transform = "";
      });
    });
  }
})();
