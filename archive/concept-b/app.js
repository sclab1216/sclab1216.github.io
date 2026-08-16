(function () {
  "use strict";

  const utils = window.SCLabUtils;
  const content = utils && utils.content;

  if (!content) {
    document.body.innerHTML =
      '<main class="noscript-message">콘텐츠 파일을 불러오지 못했습니다. data/content.js 경로를 확인해 주세요.</main>';
    return;
  }

  const escapeHTML = utils.escapeHTML;
  const e = (value) => escapeHTML(value);
  const mailto = (email) => `mailto:${encodeURIComponent(String(email || ""))}`;
  const external = (url, label, className) =>
    `<a class="${e(className || "")}" href="${e(url)}" target="_blank" rel="noreferrer">${e(label)}</a>`;

  const stageLabels = ["T₀ · Event stream", "T₁ · Context binding", "T₂ · Decision-ready"];
  const stageNotes = [
    "발생한 사건과 시간의 흔적을 읽습니다.",
    "관계에 의미와 맥락을 결합합니다.",
    "분석 결과를 의사결정에 사용한다."
  ];

  const nodeLayout = {
    ctdg: { x: 154, y: 126 },
    tkg: { x: 632, y: 120 },
    ontology: { x: 653, y: 410 },
    mission: { x: 145, y: 421 },
    center: { x: 400, y: 268 }
  };

  const relationSets = [
    [
      { from: "ctdg", to: "center", labelFrom: "ctdg", tag: 0 },
      { from: "tkg", to: "center", labelFrom: "tkg", tag: 0 }
    ],
    [
      { from: "ctdg", to: "tkg", labelFrom: "ctdg", tag: 1 },
      { from: "tkg", to: "ontology", labelFrom: "ontology", tag: 0 },
      { from: "ontology", to: "center", labelFrom: "ontology", tag: 1 }
    ],
    [
      { from: "ctdg", to: "center", labelFrom: "ctdg", tag: 2 },
      { from: "tkg", to: "center", labelFrom: "tkg", tag: 1 },
      { from: "ontology", to: "center", labelFrom: "ontology", tag: 2 },
      { from: "mission", to: "center", labelFrom: "mission", tag: 2 },
      { from: "ontology", to: "mission", labelFrom: "mission", tag: 0 }
    ]
  ];

  function researchById(id) {
    return content.research.find((item) => item.id === id) || content.research[0];
  }

  function renderHeader() {
    const target = document.querySelector("#site-header");
    target.innerHTML = `
      <div class="header-inner">
        <a class="brand" href="#atlas" aria-label="${e(content.site.name)} 처음으로">
          <img src="../../resource/sclab%20로고.png" alt="${e(content.site.shortName)}" />
          <span class="brand-edition"><span>Smart Computing Lab</span><span>Konkuk University</span></span>
        </a>
        <nav class="site-nav" id="site-nav" aria-label="주요 메뉴">
          <a href="#research">Research</a>
          <a href="#publications">Dispatches</a>
          <a href="#professor">Professor</a>
          <a href="#people">People</a>
          <a href="#join">Join</a>
        </nav>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
          <span class="sr-only">메뉴 열기</span><span aria-hidden="true"></span>
        </button>
      </div>`;
  }

  function edgeMarkup(edge, stage, index) {
    const from = nodeLayout[edge.from];
    const to = nodeLayout[edge.to];
    const research = researchById(edge.labelFrom);
    const label = research.code.split("/").pop().trim();
    const midX = (from.x + to.x) / 2;
    const midY = (from.y + to.y) / 2 - 8;
    const key = `${stage}-${index}`;
    return `
      <line class="atlas-edge" data-stage="${stage}" data-edge-topic="${e(edge.labelFrom)}"
        id="edge-${key}" x1="${from.x}" y1="${from.y}" x2="${to.x}" y2="${to.y}" />
      <text class="edge-label" data-stage="${stage}" data-edge-topic="${e(edge.labelFrom)}"
        x="${midX}" y="${midY}">${e(label)}</text>`;
  }

  function nodeMarkup(research, index) {
    const position = nodeLayout[research.id];
    const code = research.code.split("/").pop().trim();
    const subtitle = research.titleKo.length > 13 ? research.titleKo.slice(0, 12) + "…" : research.titleKo;
    return `
      <g class="atlas-node${index === 0 ? " is-selected" : ""}" data-topic="${e(research.id)}"
        role="button" tabindex="0" aria-pressed="${index === 0 ? "true" : "false"}"
        aria-label="${e(research.titleKo)} 지식 노드 선택"
        transform="translate(${position.x} ${position.y})">
        <circle class="node-halo" r="48"></circle>
        <circle class="node-core" r="39"></circle>
        <text class="node-code" y="-2">${e(code)}</text>
        <text class="node-subtitle" y="14">${e(subtitle)}</text>
      </g>`;
  }

  function renderAtlas() {
    const target = document.querySelector("#atlas");
    const newest = content.news[0];
    const allEdges = relationSets
      .map((relations, stage) => relations.map((edge, index) => edgeMarkup(edge, stage, index)).join(""))
      .join("");

    target.innerHTML = `
      <div class="atlas-topline">
        <p class="eyebrow">${e(content.site.university)} · ${e(content.site.department)}</p>
      </div>
      <div class="atlas-layout">
        <div class="atlas-copy">
          <p class="index-label">CTDG · TEMPORAL KNOWLEDGE GRAPH · ONTOLOGY</p>
          <h1 class="atlas-title" id="atlas-title"><span>Smart Computing</span><span>Laboratory</span></h1>
          <p class="tagline">${e(content.site.taglineKo)}</p>
        </div>
        <div class="atlas-interface">
          <div class="atlas-interface-header">
            <div>
              <p class="micro-label">TKG / ONTOLOGY</p>
            </div>
          </div>
          <div class="atlas-canvas-wrap">
            <svg class="atlas-svg" id="atlas-svg" viewBox="0 0 800 540" role="group"
              aria-label="SCLab 연구 분야의 시간 변화형 의미 관계 지도">
              <line class="atlas-axis" x1="50" y1="268" x2="750" y2="268"></line>
              <line class="atlas-axis" x1="400" y1="44" x2="400" y2="490"></line>
              <g class="atlas-relations">${allEdges}</g>
              <line class="time-cursor" id="time-cursor" x1="170" y1="45" x2="170" y2="490"></line>
              <text class="time-cursor-label" id="time-cursor-label" x="178" y="62">T₀</text>
              <g class="atlas-nodes">
                ${content.research.map(nodeMarkup).join("")}
                <g class="atlas-node is-center" aria-hidden="true" transform="translate(${nodeLayout.center.x} ${nodeLayout.center.y})">
                  <circle class="node-core" r="50"></circle>
                  <text class="node-code" y="-3">${e(content.site.shortName)}</text>
                  <text class="node-subtitle" y="14">KNOWLEDGE CORE</text>
                </g>
              </g>
            </svg>
            <div class="atlas-readout" id="atlas-readout" aria-live="polite"></div>
          </div>
          <div class="time-control">
            <label for="time-slider">
              <span class="micro-label">Time state</span>
              <output id="time-output" for="time-slider">${e(stageLabels[0])}</output>
            </label>
            <div class="slider-wrap">
              <div class="time-ticks" aria-hidden="true"><span>Events</span><span>Context</span><span>Action</span></div>
              <input class="time-slider" id="time-slider" type="range" min="0" max="2" step="1" value="0"
                aria-label="의미 지도의 시간 단계" aria-valuetext="${e(stageLabels[0])}" />
            </div>
          </div>
        </div>
      </div>
      <article class="latest-strip" aria-label="최신 소식">
        <span class="index-label">Latest signal</span>
        <time datetime="${e(newest.date.replaceAll(".", "-"))}">${e(newest.displayDate)}</time>
        <p class="latest-strip-title">${e(newest.title)}</p>
        ${external(newest.url, "Read note ↗", "")}
      </article>`;
  }

  function renderResearch() {
    const target = document.querySelector("#research");
    target.innerHTML = `
      <header class="section-heading" data-reveal>
        <div>
          <p class="eyebrow">01—04 / Field notes</p>
          <h2 id="research-title">Research <em>fields</em></h2>
        </div>
      </header>
      <div class="field-grid">
        ${content.research
          .map(
            (item, index) => `
              <article class="field-card" id="field-${e(item.id)}" data-field="${e(item.id)}" data-reveal>
                <div class="field-card-head">
                  <span class="field-number">${String(index + 1).padStart(2, "0")}</span>
                  <span class="field-code">${e(item.code)}</span>
                </div>
                <h3>${e(item.titleKo)}<span>${e(item.titleEn)}</span></h3>
                <p class="field-short">${e(item.short)}</p>
                <div class="field-details" id="field-details-${e(item.id)}">
                  <div class="field-details-inner">
                    <p class="field-description">${e(item.description)}</p>
                  </div>
                </div>
                <button class="field-toggle" type="button" aria-expanded="false"
                  aria-controls="field-details-${e(item.id)}">
                  <span>Open field notes</span><span aria-hidden="true">＋</span>
                </button>
              </article>`
          )
          .join("")}
      </div>`;
  }

  function renderDispatches() {
    const target = document.querySelector("#publications");
    const featured = content.publications.find((item) => item.feature) || content.publications[0];
    const archive = content.publications.filter((item) => item !== featured);

    target.innerHTML = `
      <div class="dispatches-inner">
        <header class="dispatch-heading" data-reveal>
          <div>
            <p class="eyebrow">Research dispatches / peer-reviewed signals</p>
            <h2 id="publications-title">Ideas in <em>motion</em></h2>
          </div>
          <p class="issue">Issue ${e(featured.year)} / ${String(content.publications.length).padStart(2, "0")} records</p>
        </header>
        <div class="dispatch-grid">
          <article class="featured-paper" data-reveal>
            <div class="paper-meta"><span>Featured paper</span><span>${e(featured.type)}</span></div>
            <h3>${e(featured.title)}</h3>
            <p class="authors">${e(featured.authors)}</p>
            <p class="venue">${e(featured.venue)}</p>
            ${external(featured.url, "Open publication", "arrow-link")}
          </article>
          <div class="dispatch-side">
            <div class="news-list" aria-label="연구실 뉴스">
              ${content.news
                .map(
                  (item) => `
                    <article class="news-card" data-reveal>
                      <div class="news-card-meta"><time datetime="${e(item.date.replaceAll(".", "-"))}">${e(item.displayDate)}</time><span>${e(item.status)}</span></div>
                      <h3>${e(item.title)}</h3>
                      <p>${e(item.summary)}</p>
                      <p class="news-record"><strong>${e(item.publicationTitle)}</strong><br />${e(item.venue)}</p>
                      ${external(item.url, "Full record ↗", "")}
                    </article>`
                )
                .join("")}
            </div>
            <div class="publication-index" data-reveal>
              <h3 class="micro-label">Selected publication index</h3>
              ${archive
                .map(
                  (item) => `
                    <a class="publication-row" href="${e(item.url)}" target="_blank" rel="noreferrer">
                      <span class="publication-year">${e(item.year)}</span>
                      <span><span class="publication-title">${e(item.title)}</span><span class="publication-venue">${e(item.type)} · ${e(item.authors)} · ${e(item.venue)}</span></span>
                      <span aria-hidden="true">↗</span>
                    </a>`
                )
                .join("")}
            </div>
          </div>
        </div>
      </div>`;
  }

  function renderProfessor() {
    const target = document.querySelector("#professor");
    const professor = content.professor;
    const nameParts = professor.nameEn.split(/[-\s]+/).filter(Boolean);
    target.innerHTML = `
      <div class="professor-frame">
        <div class="professor-poster" data-reveal>
          <div class="poster-top">
            <span class="eyebrow">Director / Profile No. 01</span>
            <img src="../../resource/%EA%B1%B4%EA%B5%AD%EB%8C%80%ED%95%99%EA%B5%90%20%EB%A1%9C%EA%B3%A0.jpg" alt="${e(content.site.university)} 로고" />
          </div>
          <p class="poster-name" aria-hidden="true">${nameParts.map((part) => `<span>${e(part)}</span>`).join("")}</p>
          <div class="poster-role"><span>${e(professor.role)}</span><span>${e(professor.researchArea)}</span></div>
        </div>
        <div class="professor-copy" data-reveal>
          <div class="professor-heading-line">
            <p class="eyebrow">Professor / laboratory director</p><p class="micro-label">Konkuk · Seoul</p>
          </div>
          <h2 id="professor-title">${e(professor.nameKo)} <em>${e(professor.nameEn)}</em></h2>
          <p class="professor-headline">${e(professor.headline)}</p>
          <div class="professor-body">
            <p>${e(professor.introduction)}</p>
            <p>${e(professor.narrative)}</p>
          </div>
          <dl class="career-list">
            ${professor.career.map((item) => `<div class="career-row"><dt>${e(item.label)}</dt><dd>${e(item.value)}</dd></div>`).join("")}
          </dl>
          <ul class="keyword-line" aria-label="교수 연구 키워드">
            ${professor.keywords.map((keyword) => `<li>${e(keyword)}</li>`).join("")}
          </ul>
          <div class="professor-links">
            ${external(professor.officialProfile, "Official profile", "arrow-link")}
            <a class="arrow-link" href="${mailto(professor.email)}">${e(professor.email)}</a>
          </div>
        </div>
      </div>`;
  }

  function renderPeople() {
    const target = document.querySelector("#people");
    const groups = [
      { id: "all", label: "All" },
      { id: "phd", label: "Ph.D." },
      { id: "masters", label: "M.S." },
      { id: "undergraduate", label: "Undergraduate" }
    ];

    target.innerHTML = `
      <header class="people-heading" data-reveal>
        <div><p class="eyebrow">People directory / Current members</p><h2 id="people-title">People</h2></div>
        <p class="people-count" aria-label="총 ${content.members.length}명">${String(content.members.length).padStart(2, "0")}</p>
      </header>
      <div class="people-toolbar" role="group" aria-label="과정별 구성원 필터" data-reveal>
        ${groups
          .map((group, index) => {
            const count = group.id === "all" ? content.members.length : content.members.filter((member) => member.group === group.id).length;
            return `<button class="people-filter" type="button" data-filter="${e(group.id)}" aria-pressed="${index === 0 ? "true" : "false"}">${e(group.label)} · ${count}</button>`;
          })
          .join("")}
      </div>
      <div class="member-list" aria-live="polite">
        ${content.members
          .map(
            (member, index) => `
              <article class="member-row" data-group="${e(member.group)}" data-reveal>
                <span class="member-index">${String(index + 1).padStart(2, "0")}</span>
                <h3 class="member-name">${e(member.name)} <span>${e(utils.formatGroup(member.group))}</span></h3>
                <p class="member-degree">${e(member.degree)}</p>
                <p class="member-affiliation">${e(member.affiliation)}</p>
              </article>`
          )
          .join("")}
      </div>`;
  }

  function renderJoin() {
    const target = document.querySelector("#join");
    const join = content.join;
    target.innerHTML = `
      <div class="join-inner">
        <div class="join-callout" data-reveal>
          <p class="eyebrow">${e(join.eyebrow)}</p>
          <h2 id="join-title">연구실 <em>지원</em></h2>
          <p class="join-description">${e(join.title)} ${e(join.description)}</p>
          <p class="contact-note">${e(join.availability)}</p>
          <a class="join-email" href="${mailto(join.email)}"><span>${e(join.email)}</span><span aria-hidden="true">↗</span></a>
        </div>
        <div class="join-details" data-reveal>
          <p class="micro-label">Ways to join / collaborate</p>
          <div class="join-tracks">
            ${join.tracks.map((track) => `<article class="join-track"><h3>${e(track.title)}</h3><p>${e(track.text)}</p></article>`).join("")}
          </div>
          <div class="join-checklist">
            <h3 class="micro-label">First message checklist</h3>
            <ul>${join.checklist.map((item) => `<li>${e(item)}</li>`).join("")}</ul>
          </div>
          <div class="contact-card">
            <p class="micro-label">Coordinates / Contact</p>
            <dl>
              <div><dt>Laboratory</dt><dd>${e(content.site.location)}</dd></div>
              <div><dt>Professor</dt><dd>${e(content.site.professorOffice)}</dd></div>
              <div><dt>Email</dt><dd><a href="${mailto(content.site.email)}">${e(content.site.email)}</a></dd></div>
            </dl>
            <p class="contact-note">${e(content.site.professorOfficeNote)}</p>
            <div class="source-links">
              ${external(content.site.mapUrl, "Open map ↗", "")}
              ${content.researchSources.map((source) => external(source.url, `${source.label} ↗`, "")).join("")}
            </div>
          </div>
        </div>
      </div>`;
  }

  function renderFooter() {
    const target = document.querySelector("#site-footer");
    target.innerHTML = `
      <div class="footer-inner">
        <div class="footer-brand footer-brand-logos">
          <img src="../../resource/sclab%20%EB%A1%9C%EA%B3%A0.png" alt="${e(content.site.name)}" />
          <img src="../../resource/%EA%B1%B4%EA%B5%AD%EB%8C%80%ED%95%99%EA%B5%90%20%EB%A1%9C%EA%B3%A0.jpg" alt="${e(content.site.university)}" />
        </div>
        <div class="footer-meta">
          <p>© <span data-current-year></span> ${e(content.site.name)}</p>
          <p>${e(content.site.university)} · ${e(content.site.location)}</p>
        </div>
      </div>`;
  }

  function initAtlas() {
    const nodes = Array.from(document.querySelectorAll(".atlas-node[data-topic]"));
    const slider = document.querySelector("#time-slider");
    const output = document.querySelector("#time-output");
    const readout = document.querySelector("#atlas-readout");
    const cursor = document.querySelector("#time-cursor");
    const cursorLabel = document.querySelector("#time-cursor-label");
    let selectedId = content.research[0].id;
    let stage = 0;

    function updateReadout() {
      const item = researchById(selectedId);
      const itemIndex = content.research.findIndex((research) => research.id === item.id);
      readout.innerHTML = `
        <span class="readout-index">${String(itemIndex + 1).padStart(2, "0")}</span>
        <div class="readout-copy">
          <h2>${e(item.titleKo)}</h2>
          <p class="readout-relation">${e(stageLabels[stage])} / ${e(item.titleEn)}</p>
        </div>`;
    }

    function updateMap() {
      document.querySelectorAll(".atlas-edge, .edge-label").forEach((edge) => {
        const isStage = Number(edge.dataset.stage) === stage;
        edge.classList.toggle("is-active", isStage);
        edge.classList.toggle("is-emphasis", isStage && edge.dataset.edgeTopic === selectedId);
      });

      nodes.forEach((node) => {
        const selected = node.dataset.topic === selectedId;
        node.classList.toggle("is-selected", selected);
        node.setAttribute("aria-pressed", String(selected));
      });

      const xPositions = [0, 225, 450];
      const translate = xPositions[stage];
      cursor.style.transform = `translateX(${translate}px)`;
      cursorLabel.style.transform = `translateX(${translate}px)`;
      cursorLabel.textContent = `T${["₀", "₁", "₂"][stage]}`;
      output.textContent = stageLabels[stage];
      slider.setAttribute("aria-valuetext", `${stageLabels[stage]}. ${stageNotes[stage]}`);
      updateReadout();
    }

    function selectNode(node, focusNode) {
      selectedId = node.dataset.topic;
      if (focusNode) node.focus();
      updateMap();
    }

    nodes.forEach((node, index) => {
      node.addEventListener("click", () => selectNode(node, false));
      node.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectNode(node, false);
        }
        if (["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"].includes(event.key)) {
          event.preventDefault();
          const direction = event.key === "ArrowRight" || event.key === "ArrowDown" ? 1 : -1;
          const next = nodes[(index + direction + nodes.length) % nodes.length];
          selectNode(next, true);
        }
      });
    });

    slider.addEventListener("input", () => {
      stage = Number(slider.value);
      updateMap();
    });

    const atlasSection = document.querySelector("#atlas");
    let scrollFrame = 0;
    function syncAtlasToScroll() {
      scrollFrame = 0;
      const rect = atlasSection.getBoundingClientRect();
      const distance = Math.max(1, atlasSection.offsetHeight - window.innerHeight * 0.35);
      const progress = Math.max(0, Math.min(1, -rect.top / distance));
      const nextStage = Math.round(progress * 2);
      if (nextStage === stage) return;
      stage = nextStage;
      slider.value = String(stage);
      updateMap();
    }
    window.addEventListener("scroll", () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(syncAtlasToScroll);
    }, { passive: true });
    window.addEventListener("resize", syncAtlasToScroll);

    updateMap();
    syncAtlasToScroll();
  }

  function initFieldNotes() {
    document.querySelectorAll(".field-toggle").forEach((button) => {
      button.addEventListener("click", () => {
        const card = button.closest(".field-card");
        const open = button.getAttribute("aria-expanded") !== "true";
        button.setAttribute("aria-expanded", String(open));
        button.querySelector("span:first-child").textContent = open ? "Close field notes" : "Open field notes";
        card.classList.toggle("is-open", open);
      });
    });
  }

  function initPeopleFilters() {
    const buttons = Array.from(document.querySelectorAll(".people-filter"));
    const rows = Array.from(document.querySelectorAll(".member-row"));
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        buttons.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
        rows.forEach((row) => {
          row.hidden = filter !== "all" && row.dataset.group !== filter;
        });
      });
    });
  }

  function initMenu() {
    utils.initMenu(".menu-toggle", "#site-nav");
    const button = document.querySelector(".menu-toggle");
    const menu = document.querySelector("#site-nav");
    if (!button || !menu) return;

    button.addEventListener("click", () => {
      const expanded = button.getAttribute("aria-expanded") === "true";
      const label = button.querySelector(".sr-only");
      if (label) label.textContent = expanded ? "메뉴 닫기" : "메뉴 열기";
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && button.getAttribute("aria-expanded") === "true") {
        button.click();
        button.focus();
      }
    });
  }

  function initPage() {
    document.title = `${content.site.shortName} — Ontology Atlas`;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute("content", content.site.description);

    renderHeader();
    renderAtlas();
    renderResearch();
    renderDispatches();
    renderProfessor();
    renderPeople();
    renderJoin();
    renderFooter();

    initAtlas();
    initFieldNotes();
    initPeopleFilters();
    initMenu();
    utils.initReveal("[data-reveal]");
    utils.setCurrentYear();
  }

  initPage();
})();
