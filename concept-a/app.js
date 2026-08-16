(function () {
  "use strict";

  const utils = window.SCLabUtils;
  const content = utils?.content || window.SCLAB_CONTENT;

  if (!content) {
    document.body.insertAdjacentHTML(
      "afterbegin",
      '<p class="noscript-message">콘텐츠 파일을 불러오지 못했습니다. data/content.js 경로를 확인해 주세요.</p>'
    );
    return;
  }

  const esc = utils?.escapeHTML || ((value) => String(value ?? ""));
  const shortInitial = utils?.memberInitial || ((value) => Array.from(String(value || "SC")).slice(-2).join(""));
  const groupLabel = utils?.formatGroup || ((value) => value);
  const reduceMotion = Boolean(utils?.reduceMotion);
  const $ = (selector, context = document) => context.querySelector(selector);
  const $$ = (selector, context = document) => Array.from(context.querySelectorAll(selector));

  function safeExternalLink(url, label, className = "") {
    return `<a class="${esc(className)}" href="${esc(url)}" target="_blank" rel="noreferrer">${esc(label)}<span aria-hidden="true">↗</span></a>`;
  }

  function formatHeroTitle(tagline) {
    const safe = esc(tagline);
    const accent = "변하는 세계";
    if (!String(tagline).includes(accent)) return safe;
    return safe.replace(accent, `<em>${accent}</em>`);
  }

  function renderGlobalContent() {
    $$('[data-short-name]').forEach((node) => {
      node.textContent = content.site.shortName;
    });

    document.title = `${content.site.shortName} — Temporal Observatory`;
    renderHero();
    renderResearch();
    renderSignals();
    renderProfessor();
    renderPeople();
    renderJoin();
    renderFooter();
  }

  function renderHero() {
    const target = $("[data-hero-copy]");

    target.innerHTML = `
      <p class="eyebrow">${esc(content.site.university)} · ${esc(content.site.department)}</p>
      <p class="hero-lab-name">SMART COMPUTING<br />LABORATORY</p>
      <h1 id="hero-title">${formatHeroTitle(content.site.taglineKo)}</h1>
      <div class="hero-actions">
        <a class="primary-button" href="#research">Research <span aria-hidden="true">↓</span></a>
        <a class="text-button" href="#join">Join the lab</a>
      </div>
    `;
  }

  function renderResearch() {
    const heading = $("[data-research-heading]");
    const tabs = $("[data-research-tabs]");

    heading.innerHTML = `
      <p class="eyebrow">Research / ${String(content.research.length).padStart(2, "0")} lenses</p>
      <h2 id="research-title">주요 <em>연구 분야</em></h2>
    `;

    tabs.innerHTML = content.research
      .map(
        (item, index) => `
          <button
            class="research-tab"
            id="research-tab-${esc(item.id)}"
            type="button"
            role="tab"
            aria-selected="${index === 0 ? "true" : "false"}"
            aria-controls="research-panel-${esc(item.id)}"
            tabindex="${index === 0 ? "0" : "-1"}"
            data-research-id="${esc(item.id)}"
          >
            <span class="research-tab-index">${String(index + 1).padStart(2, "0")}</span>
            <strong>${esc(item.titleKo)}</strong>
            <span class="research-tab-arrow" aria-hidden="true">→</span>
          </button>
        `
      )
      .join("");

    setResearch(content.research[0].id);

    const tabButtons = $$(".research-tab", tabs);
    tabButtons.forEach((button, index) => {
      button.addEventListener("click", () => setResearch(button.dataset.researchId));
      button.addEventListener("keydown", (event) => {
        let nextIndex = null;
        if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (index + 1) % tabButtons.length;
        if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (index - 1 + tabButtons.length) % tabButtons.length;
        if (event.key === "Home") nextIndex = 0;
        if (event.key === "End") nextIndex = tabButtons.length - 1;
        if (nextIndex === null) return;
        event.preventDefault();
        tabButtons[nextIndex].focus();
        setResearch(tabButtons[nextIndex].dataset.researchId);
      });
    });
  }

  function setResearch(id) {
    const item = content.research.find((entry) => entry.id === id) || content.research[0];
    const panel = $("[data-research-panel]");

    $$(".research-tab", $("[data-research-tabs]")).forEach((button) => {
      const active = button.dataset.researchId === item.id;
      button.setAttribute("aria-selected", String(active));
      button.tabIndex = active ? 0 : -1;
    });

    panel.id = `research-panel-${item.id}`;
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", `research-tab-${item.id}`);
    panel.innerHTML = `
      <div>
        <p class="panel-code">${esc(item.code)}</p>
        <h3>${esc(item.titleKo)}<span>${esc(item.titleEn)}</span></h3>
        <p class="panel-description">${esc(item.description)}</p>
      </div>
    `;

  }

  function renderSignals() {
    const heading = $("[data-signals-heading]");
    const layout = $("[data-signal-layout]");
    const featuredPublication = content.publications.find((entry) => entry.feature) || content.publications[0];
    const leadNews = content.news[0];

    heading.innerHTML = `
      <p class="eyebrow">Signals / News & publications</p>
      <h2 id="signals-title">논문 및 <em>연구 소식</em></h2>
    `;

    layout.innerHTML = `
      <article class="featured-signal">
        <div class="signal-top">
          <p class="signal-meta">
            <span>Featured / ${esc(featuredPublication.year)}</span>
            <span>${esc(leadNews.status)}</span>
          </p>
          <h3>${esc(leadNews.title)}</h3>
          <p class="paper-title">${esc(featuredPublication.title)}</p>
        </div>
        <div class="signal-bottom">
          <p class="signal-summary">${esc(leadNews.summary)}</p>
          <p class="signal-meta"><span>${esc(featuredPublication.venue)}</span><span>${esc(featuredPublication.authors)}</span></p>
          ${safeExternalLink(featuredPublication.url, "Read publication", "signal-link")}
        </div>
      </article>
      <div class="news-feed">
        <div class="feed-head"><span>Latest transmissions</span><strong>${String(content.news.length).padStart(2, "0")}</strong></div>
        ${content.news
          .map(
            (item) => `
              <article class="news-item">
                <time class="news-date" datetime="${esc(item.date.replaceAll(".", "-"))}">${esc(item.displayDate)}</time>
                <div class="news-body">
                  <h4>${esc(item.title)}</h4>
                  <p>${esc(item.summary)}</p>
                  <a href="${esc(item.url)}" target="_blank" rel="noreferrer">${esc(item.venue)} <span aria-hidden="true">↗</span></a>
                </div>
              </article>
            `
          )
          .join("")}
      </div>
      <div class="publication-index">
        <div class="publication-head"><span>Publication index</span><strong>${String(content.publications.length).padStart(2, "0")} records</strong></div>
        ${content.publications
          .map(
            (item) => `
              <a class="publication-row" href="${esc(item.url)}" target="_blank" rel="noreferrer">
                <span>${esc(item.year)}</span>
                <span class="pub-type">${esc(item.type)}</span>
                <strong>${esc(item.title)}</strong>
                <span class="pub-venue">${esc(item.venue)} · ${esc(item.authors)}</span>
                <i aria-hidden="true">↗</i>
              </a>
            `
          )
          .join("")}
      </div>
    `;
  }

  function renderProfessor() {
    const professor = content.professor;
    const target = $("[data-professor-layout]");

    target.innerHTML = `
      <div class="professor-identity">
        <img class="professor-ku-logo" src="../resource/%EA%B1%B4%EA%B5%AD%EB%8C%80%ED%95%99%EA%B5%90%20%EB%A1%9C%EA%B3%A0.jpg" alt="${esc(content.site.university)} 로고" />
        <div class="identity-axis" aria-hidden="true"></div>
        <div class="identity-name">
          <h3>${esc(professor.nameKo)}<span>${esc(professor.nameEn)} · ${esc(professor.role)}</span></h3>
          <span aria-hidden="true">YG</span>
        </div>
      </div>
      <div class="professor-content">
        <p class="eyebrow">Professor / Laboratory director</p>
        <h2 id="professor-title">${esc(professor.headline)}</h2>
        <p class="lead">${esc(professor.introduction)}</p>
        <p class="narrative">${esc(professor.narrative)}</p>
        <dl class="career-grid">
          ${professor.career
            .map(
              (item) => `<div class="career-item"><dt>${esc(item.label)}</dt><dd>${esc(item.value)}</dd></div>`
            )
            .join("")}
        </dl>
        <ul class="keyword-row" aria-label="교수 연구 키워드">
          ${professor.keywords.map((keyword) => `<li>${esc(keyword)}</li>`).join("")}
        </ul>
        <div class="professor-links">
          ${safeExternalLink(professor.officialProfile, "Konkuk profile", "primary-button")}
          <a class="text-button" href="mailto:${esc(professor.email)}">${esc(professor.email)}</a>
        </div>
      </div>
    `;
  }

  function renderPeople() {
    const heading = $("[data-people-heading]");
    const filters = $("[data-member-filters]");
    const grid = $("[data-member-grid]");
    const filterData = [
      { id: "all", label: "All" },
      { id: "phd", label: "Ph.D." },
      { id: "masters", label: "M.S." },
      { id: "undergraduate", label: "Undergraduate" }
    ];

    heading.innerHTML = `
      <p class="eyebrow">People / The observers</p>
      <h2 id="people-title">연구실 <em>구성원</em></h2>
      <p class="people-count"><strong data-visible-member-count>${String(content.members.length).padStart(2, "0")}</strong> MEMBERS / CURRENT</p>
    `;

    filters.innerHTML = filterData
      .map((filter, index) => {
        const count = filter.id === "all" ? content.members.length : content.members.filter((member) => member.group === filter.id).length;
        return `<button class="member-filter" type="button" data-filter="${esc(filter.id)}" aria-pressed="${index === 0 ? "true" : "false"}">${esc(filter.label)} · ${String(count).padStart(2, "0")}</button>`;
      })
      .join("");

    grid.innerHTML = content.members
      .map(
        (member, index) => `
          <article class="member-card" data-member-group="${esc(member.group)}">
            <div class="member-card-number">
              <span>OBSERVER / ${String(index + 1).padStart(2, "0")}</span>
              <span>${esc(groupLabel(member.group))}</span>
            </div>
            <span class="member-monogram" aria-hidden="true">${esc(shortInitial(member.name))}</span>
            <div class="member-info">
              <h3>${esc(member.name)}</h3>
              <p>${esc(member.degree)}</p>
              <span class="member-affiliation">${esc(member.affiliation)}</span>
            </div>
          </article>
        `
      )
      .join("");

    $$(".member-filter", filters).forEach((button) => {
      button.addEventListener("click", () => {
        const selected = button.dataset.filter;
        $$(".member-filter", filters).forEach((entry) => entry.setAttribute("aria-pressed", String(entry === button)));
        const visible = $$(".member-card", grid).filter((card) => {
          const show = selected === "all" || card.dataset.memberGroup === selected;
          card.hidden = !show;
          return show;
        });
        $("[data-visible-member-count]").textContent = String(visible.length).padStart(2, "0");
      });
    });
  }

  function renderJoin() {
    const join = content.join;
    const site = content.site;
    const target = $("[data-join-layout]");

    target.innerHTML = `
      <div class="join-main">
        <p class="join-eyebrow">${esc(join.eyebrow)}</p>
        <h2 id="join-title">${esc(join.title)}</h2>
        <p>${esc(join.description)}</p>
        <a class="join-email" href="mailto:${esc(join.email)}">${esc(join.email)} <span aria-hidden="true">↗</span></a>
      </div>
      <aside class="join-side" aria-label="지원 및 연락 안내">
        <ol class="join-tracks">
          ${join.tracks
            .map(
              (track, index) => `
                <li class="join-track">
                  <span>${String(index + 1).padStart(2, "0")}</span>
                  <div><h3>${esc(track.title)}</h3><p>${esc(track.text)}</p></div>
                </li>
              `
            )
            .join("")}
        </ol>
        <div class="join-checklist">
          <span>First contact checklist</span>
          <ul>${join.checklist.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>
        </div>
        <div class="join-contact">
          <span>Observatory coordinates</span>
          <address>
            ${esc(site.university)} · ${esc(site.department)}<br />
            <a href="${esc(site.mapUrl)}" target="_blank" rel="noreferrer">${esc(site.location)} ↗</a><br />
            교수 연구실 ${esc(site.professorOffice)}
          </address>
        </div>
        <p class="availability">${esc(join.availability)}</p>
      </aside>
    `;
  }

  function renderFooter() {
    const target = $("[data-site-footer]");
    target.innerHTML = `
      <div class="footer-top">
        <div class="footer-brand footer-logo-lockup">
          <img src="../resource/sclab%20%EB%A1%9C%EA%B3%A0.png" alt="${esc(content.site.name)}" />
          <img src="../resource/%EA%B1%B4%EA%B5%AD%EB%8C%80%ED%95%99%EA%B5%90%20%EB%A1%9C%EA%B3%A0.jpg" alt="${esc(content.site.university)}" />
          <span>${esc(content.site.university)} · ${esc(content.site.location)}</span>
        </div>
        <nav class="footer-nav" aria-label="출처 및 보조 메뉴">
          ${content.researchSources
            .map((source) => `<a href="${esc(source.url)}" target="_blank" rel="noreferrer">${esc(source.label)} ↗</a>`)
            .join("")}
          <a href="#top">BACK TO TOP ↑</a>
        </nav>
      </div>
      <div class="footer-bottom">
        <span>© <span data-current-year></span> ${esc(content.site.shortName)} · ${esc(content.site.department)}</span>
        <span>TEMPORAL OBSERVATORY / CONCEPT A</span>
      </div>
    `;
  }

  const graphNodes = [
    { id: "E01", x: 480, y: 270 },
    { id: "E02", x: 285, y: 145 },
    { id: "E03", x: 665, y: 142 },
    { id: "E04", x: 715, y: 342 },
    { id: "E05", x: 322, y: 390 },
    { id: "E06", x: 130, y: 280 },
    { id: "E07", x: 840, y: 250 },
    { id: "E08", x: 520, y: 455 },
    { id: "E09", x: 450, y: 78 }
  ];

  const graphEvents = [
    { time: 0.7, from: "E01", to: "E02", title: "Edge event observed", detail: "ENTITY 01 ↔ ENTITY 02 · 첫 연결 시점이 기록됩니다." },
    { time: 1.6, from: "E02", to: "E06", title: "Network state updated", detail: "ENTITY 02 ↔ ENTITY 06 · 사건 순서가 상태에 반영됩니다." },
    { time: 2.5, from: "E01", to: "E03", title: "Edge event observed", detail: "ENTITY 01 ↔ ENTITY 03 · 연속 시간 위에 관계가 추가됩니다." },
    { time: 3.4, from: "E03", to: "E09", title: "Temporal context updated", detail: "ENTITY 03 ↔ ENTITY 09 · 시점 맥락이 표현에 반영됩니다." },
    { time: 4.2, from: "E01", to: "E05", title: "Event intensity changed", detail: "ENTITY 01 ↔ ENTITY 05 · 상호작용 강도 변화가 감지됩니다." },
    { time: 5.1, from: "E05", to: "E08", title: "Edge event observed", detail: "ENTITY 05 ↔ ENTITY 08 · 새 사건이 스트림에 합류합니다." },
    { time: 6.0, from: "E01", to: "E04", title: "Network state updated", detail: "ENTITY 01 ↔ ENTITY 04 · 최신 연결로 그래프가 갱신됩니다." },
    { time: 7.1, from: "E04", to: "E07", title: "Temporal signal propagated", detail: "ENTITY 04 ↔ ENTITY 07 · 시간 신호가 이웃으로 전달됩니다." },
    { time: 8.0, from: "E02", to: "E05", title: "Relation re-observed", detail: "ENTITY 02 ↔ ENTITY 05 · 이전 맥락 위에 새 사건이 쌓입니다." },
    { time: 9.1, from: "E03", to: "E04", title: "Edge event observed", detail: "ENTITY 03 ↔ ENTITY 04 · 연결 후보의 순서가 갱신됩니다." },
    { time: 10.2, from: "E08", to: "E04", title: "Event intensity changed", detail: "ENTITY 08 ↔ ENTITY 04 · 상호작용의 시간 패턴을 관측합니다." },
    { time: 11.4, from: "E06", to: "E09", title: "Observation window complete", detail: "ENTITY 06 ↔ ENTITY 09 · 12초 관측 구간이 완성됩니다." }
  ];

  function svgElement(tag, attributes = {}) {
    const node = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, String(value)));
    return node;
  }

  function curvedPath(from, to, index) {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const bend = index % 2 === 0 ? 0.16 : -0.14;
    const cx = (from.x + to.x) / 2 - dy * bend;
    const cy = (from.y + to.y) / 2 + dx * bend;
    return `M ${from.x} ${from.y} Q ${cx.toFixed(1)} ${cy.toFixed(1)} ${to.x} ${to.y}`;
  }

  function initTemporalGraph() {
    const edgeLayer = $("[data-graph-edges]");
    const pulseLayer = $("[data-graph-pulses]");
    const nodeLayer = $("[data-graph-nodes]");
    const range = $("[data-temporal-range]");
    const scrollSection = $(".hero");
    const timeLabel = $("[data-graph-time]");
    const eventIndex = $("[data-event-index]");
    const eventTitle = $("[data-event-title]");
    const eventDetail = $("[data-event-detail]");
    const graphDuration = 12;
    let scrollFrame = 0;

    const nodeById = new Map(graphNodes.map((node) => [node.id, node]));

    graphNodes.forEach((node) => {
      const group = svgElement("g", { class: "graph-node", "data-node-id": node.id });
      group.appendChild(svgElement("circle", { class: "graph-node-glow", cx: node.x, cy: node.y, r: 30, fill: "url(#nodeGlow)" }));
      group.appendChild(svgElement("line", { class: "graph-node-cross", x1: node.x - 22, y1: node.y, x2: node.x + 22, y2: node.y }));
      group.appendChild(svgElement("line", { class: "graph-node-cross", x1: node.x, y1: node.y - 22, x2: node.x, y2: node.y + 22 }));
      group.appendChild(svgElement("circle", { class: "graph-node-core", cx: node.x, cy: node.y, r: 7 }));
      const label = svgElement("text", { class: "graph-node-label", x: node.x + 14, y: node.y - 12 });
      label.textContent = `ENTITY:${node.id.slice(1)}`;
      group.appendChild(label);
      nodeLayer.appendChild(group);
    });

    const edgeElements = graphEvents.map((event, index) => {
      const path = svgElement("path", {
        class: "graph-edge",
        d: curvedPath(nodeById.get(event.from), nodeById.get(event.to), index),
        opacity: 0,
        "data-event-time": event.time
      });
      edgeLayer.appendChild(path);
      return path;
    });

    const pulse = svgElement("circle", { class: "event-pulse", r: 4, opacity: 0 });
    pulseLayer.appendChild(pulse);

    function updateGraph(value) {
      const normalized = Math.max(0, Math.min(100, Number(value)));
      const time = (normalized / 100) * graphDuration;
      const activeIndex = graphEvents.reduce((latest, event, index) => (event.time <= time ? index : latest), -1);
      const activeEvent = graphEvents[activeIndex];

      range.value = normalized.toFixed(2);
      range.style.setProperty("--timeline-progress", `${normalized}%`);
      timeLabel.textContent = time.toFixed(1).padStart(4, "0");

      edgeElements.forEach((path, index) => {
        const visible = graphEvents[index].time <= time;
        path.style.opacity = visible ? (index === activeIndex ? "1" : "0.34") : "0";
        path.classList.toggle("is-active", index === activeIndex);
      });

      $$(".graph-node", nodeLayer).forEach((node) => {
        const isActive = activeEvent && (node.dataset.nodeId === activeEvent.from || node.dataset.nodeId === activeEvent.to);
        node.classList.toggle("is-active", Boolean(isActive));
      });

      if (activeEvent) {
        eventIndex.textContent = `EVENT ${String(activeIndex + 1).padStart(2, "0")} / ${String(graphEvents.length).padStart(2, "0")}`;
        eventTitle.textContent = activeEvent.title;
        if (eventDetail) eventDetail.textContent = activeEvent.detail;

        const activePath = edgeElements[activeIndex];
        const nextTime = graphEvents[activeIndex + 1]?.time || graphDuration;
        const segmentProgress = Math.max(0, Math.min(1, (time - activeEvent.time) / Math.max(0.2, nextTime - activeEvent.time)));
        const length = activePath.getTotalLength();
        const point = activePath.getPointAtLength(length * (reduceMotion ? 1 : segmentProgress));
        pulse.setAttribute("cx", point.x);
        pulse.setAttribute("cy", point.y);
        pulse.setAttribute("opacity", "1");
      } else {
        eventIndex.textContent = `EVENT 00 / ${String(graphEvents.length).padStart(2, "0")}`;
        eventTitle.textContent = "READY";
        if (eventDetail) eventDetail.textContent = "";
        pulse.setAttribute("opacity", "0");
      }
    }

    range.addEventListener("input", () => {
      updateGraph(range.value);
    });

    function syncGraphToScroll() {
      scrollFrame = 0;
      const rect = scrollSection.getBoundingClientRect();
      const distance = Math.max(1, scrollSection.offsetHeight - window.innerHeight * 0.42);
      const progress = Math.max(0, Math.min(1, -rect.top / distance));
      updateGraph(progress * 100);
    }

    window.addEventListener("scroll", () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(syncGraphToScroll);
    }, { passive: true });
    window.addEventListener("resize", syncGraphToScroll);

    syncGraphToScroll();
  }

  function initHeader() {
    const header = $("[data-site-header]");
    const navigationLinks = $$('.primary-nav a[href^="#"]');
    const sections = navigationLinks
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            navigationLinks.forEach((link) => {
              link.setAttribute("aria-current", String(link.getAttribute("href") === `#${entry.target.id}`));
            });
          });
        },
        { rootMargin: "-35% 0px -58%", threshold: 0 }
      );
      sections.forEach((section) => observer.observe(section));
    }
  }

  function initCursorGlow() {
    const glow = $("[data-cursor-glow]");
    if (!glow || reduceMotion || !window.matchMedia("(pointer: fine)").matches) return;
    let frame = 0;
    let x = 0;
    let y = 0;

    window.addEventListener(
      "pointermove",
      (event) => {
        x = event.clientX;
        y = event.clientY;
        if (frame) return;
        frame = window.requestAnimationFrame(() => {
          glow.style.left = `${x}px`;
          glow.style.top = `${y}px`;
          frame = 0;
        });
      },
      { passive: true }
    );
  }

  renderGlobalContent();
  initTemporalGraph();
  initHeader();
  initCursorGlow();
  utils?.initMenu(".menu-toggle", ".primary-nav");
  utils?.setCurrentYear();
  utils?.initReveal(
    "[data-reveal], .member-card, .news-item, .publication-row, .professor-identity, .professor-content, .join-main, .join-side"
  );
})();
