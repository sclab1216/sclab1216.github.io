(function () {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function escapeHTML(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function memberInitial(name) {
    return Array.from(String(name || "SC")).slice(-2).join("");
  }

  function externalLink(url, label, className) {
    return `<a class="${escapeHTML(className || "")}" href="${escapeHTML(url)}" target="_blank" rel="noreferrer">${escapeHTML(label)}<span aria-hidden="true"> ↗</span></a>`;
  }

  function initReveal(selector) {
    const elements = Array.from(document.querySelectorAll(selector || "[data-reveal]"));
    if (!elements.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8%", threshold: 0.08 }
    );

    elements.forEach((element) => observer.observe(element));
  }

  function initMenu(buttonSelector, menuSelector) {
    const button = document.querySelector(buttonSelector);
    const menu = document.querySelector(menuSelector);
    if (!button || !menu) return;

    const close = () => {
      button.setAttribute("aria-expanded", "false");
      menu.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    };

    button.addEventListener("click", () => {
      const open = button.getAttribute("aria-expanded") !== "true";
      button.setAttribute("aria-expanded", String(open));
      menu.classList.toggle("is-open", open);
      document.body.classList.toggle("menu-open", open);
    });

    menu.querySelectorAll("a").forEach((link) => link.addEventListener("click", close));
    window.addEventListener("resize", () => {
      if (window.innerWidth > 860) close();
    });
  }

  function setCurrentYear(selector) {
    document.querySelectorAll(selector || "[data-current-year]").forEach((node) => {
      node.textContent = String(new Date().getFullYear());
    });
  }

  function formatGroup(group) {
    return {
      phd: "Ph.D.",
      masters: "M.S.",
      undergraduate: "Undergraduate"
    }[group] || group;
  }

  window.SCLabUtils = {
    content: window.SCLAB_CONTENT,
    reduceMotion,
    escapeHTML,
    memberInitial,
    externalLink,
    initReveal,
    initMenu,
    setCurrentYear,
    formatGroup
  };
})();
