(function () {
  "use strict";
  const u = window.SCLabUtils;
  const c = u.content;
  const e = u.escapeHTML;
  const $ = (selector) => document.querySelector(selector);
  if (!c) return;

  const groups = { phd: "Ph.D. Students", masters: "M.S. Students", undergraduate: "Undergraduate Researchers" };
  $("[data-hero-tagline]").textContent = c.site.taglineKo;
  $("[data-hero-description]").textContent = c.site.description;

  const latest = c.news[0];
  const latestEl = $("[data-latest-news]");
  latestEl.href = latest.url;
  latestEl.target = "_blank";
  latestEl.rel = "noreferrer";
  latestEl.querySelector("strong").textContent = latest.title;
  latestEl.querySelector("time").textContent = latest.displayDate;

  $("[data-about]").innerHTML = `<div class="section-heading"><p>00 / ABOUT SCLAB</p><h2>Smart Computing<br />Laboratory.</h2><span>EST. AT KONKUK UNIVERSITY</span></div><div class="about-body"><p class="about-lead">${e(c.site.taglineKo)}</p><div><p>${e(c.site.description)}</p><p>${e(c.professor.narrative)}</p><ul>${c.research.map((r) => `<li><span>${e(r.code.slice(0, 2))}</span>${e(r.titleEn)}</li>`).join("")}</ul></div></div>`;

  $("[data-vision]").innerHTML = `<div class="vision-index"><span>01</span><p>RESEARCH VISION</p></div><div class="vision-statement"><p>WHY WE RESEARCH</p><h2>${e(c.site.taglineEn)}</h2></div><div class="vision-notes"><strong>${e(c.site.taglineKo)}</strong><p>${e(c.site.description)}</p><ul>${c.professor.keywords.map((x) => `<li>${e(x)}</li>`).join("")}</ul></div>`;

  $("[data-research-grid]").innerHTML = c.research.map((r) => `<a class="research-entry" href="./research.html#${e(r.id)}" id="${e(r.id)}"><span class="topic-number">${e(r.code.slice(0, 2))}</span><div class="topic-title"><small>${e(r.id.toUpperCase())}</small><h3>${e(r.titleEn)}</h3><em>${e(r.titleKo)}</em></div><div class="topic-copy"><strong>${e(r.short)}</strong><p>${e(r.description)}</p></div><i>↗</i></a>`).join("");

  $("[data-publication-count]").textContent = `${c.publications.length} PAPERS / ${new Set(c.publications.map((p) => p.year)).size} YEARS`;
  const featured = c.publications[0];
  const publicationRow = (p, index) => `<article class="publication-row"><span>${String(index + 1).padStart(2, "0")}</span><div><small>${e(p.year)} · ${e(p.type)}</small><h3>${e(p.title)}</h3><p>${e(p.authors)}</p><em>${e(p.venue)}${p.doi ? ` · DOI ${e(p.doi)}` : ""}</em></div><a href="${e(p.url)}" target="_blank" rel="noreferrer">PAPER ↗</a></article>`;
  $("[data-publication-list]").innerHTML = `<article class="featured-paper"><div><p>FEATURED PAPER / ${e(featured.year)}</p><span>${e(featured.type)}</span></div><h3>${e(featured.title)}</h3><p>${e(featured.authors)}</p><em>${e(featured.venue)}${featured.doi ? ` · DOI ${e(featured.doi)}` : ""}</em><a href="${e(featured.url)}" target="_blank" rel="noreferrer">READ PAPER ↗</a></article><div class="publication-archive"><div class="subhead"><h3>ARCHIVE</h3><span>ALL PUBLICATIONS</span></div>${c.publications.slice(1).map((p, i) => publicationRow(p, i + 1)).join("")}</div>`;

  $("[data-news-list]").innerHTML = c.news.map((n, i) => `<a class="news-entry${i === 0 ? " featured-news" : ""}" href="${e(n.url)}" target="_blank" rel="noreferrer"><time>${e(n.displayDate)}<small>${e(n.status)}</small></time><div><span>${String(i + 1).padStart(2, "0")}</span><h3>${e(n.title)}</h3><p>${e(n.summary)}</p>${n.publicationTitle ? `<em>${e(n.publicationTitle)}${n.venue ? ` · ${e(n.venue)}` : ""}${n.doi ? ` · DOI ${e(n.doi)}` : ""}</em>` : ""}</div><i>↗</i></a>`).join("");

  const p = c.professor;
  $("[data-professor]").innerHTML = `<div class="professor-mark"><img src="./resource/%EA%B1%B4%EA%B5%AD%EB%8C%80%ED%95%99%EA%B5%90%20%EB%A1%9C%EA%B3%A0.jpg" alt="건국대학교 로고" /><span>YG</span><small>LABORATORY DIRECTOR</small></div><div class="professor-copy"><p>PROFESSOR / ${e(p.researchArea)}</p><h3>${e(p.nameEn)}<small>${e(p.nameKo)} 교수</small></h3><strong>${e(p.role)} · ${e(p.introduction)}</strong><p>${e(p.narrative)}</p><ul>${p.keywords.map((x) => `<li>${e(x)}</li>`).join("")}</ul><dl>${p.career.map((x) => `<div><dt>${e(x.label)}</dt><dd>${e(x.value)}</dd></div>`).join("")}</dl><div class="profile-links"><a href="${e(p.officialProfile)}" target="_blank" rel="noreferrer">OFFICIAL PROFILE ↗</a><a href="mailto:${e(p.email)}">${e(p.email)}</a></div></div>`;

  $("[data-people]").innerHTML = Object.entries(groups).map(([id, label]) => { const members = c.members.filter((m) => m.group === id); return `<section class="member-group"><header><h3>${label}</h3><span>${String(members.length).padStart(2, "0")}</span></header><div>${members.map((m, i) => `<article><span>${String(i + 1).padStart(2, "0")}</span><strong>${e(m.name)}</strong><p>${e(m.degree)}</p><em>${e(m.affiliation)}</em></article>`).join("")}</div></section>`; }).join("");

  const j = c.join;
  $("[data-join]").innerHTML = `<div class="join-lead"><p>06 / JOIN SCLAB</p><h2>${e(j.title)}</h2><strong>${e(j.eyebrow)}</strong><p>${e(j.description)}</p><a href="mailto:${e(j.email)}">CONTACT US <span>↗</span></a></div><div class="join-details"><div class="join-tracks">${j.tracks.map((x, i) => `<article><span>${String(i + 1).padStart(2, "0")}</span><h3>${e(x.title)}</h3><p>${e(x.text)}</p></article>`).join("")}</div><aside><h3>FIRST CONTACT CHECKLIST</h3><ul>${j.checklist.map((x) => `<li>${e(x)}</li>`).join("")}</ul><p>${e(j.availability)}</p></aside></div>`;

  $("[data-contact]").innerHTML = `<div class="section-heading"><p>07 / CONTACT</p><h2>Find us at<br />Konkuk.</h2><span>SEOUL, REPUBLIC OF KOREA</span></div><div class="contact-grid"><div><small>LABORATORY</small><h3>${e(c.site.name)}</h3><p>${e(c.site.university)}<br />${e(c.site.department)}</p><a href="mailto:${e(c.site.email)}">${e(c.site.email)} ↗</a></div><address><small>LOCATION</small><strong>${e(c.site.location)}</strong><p>교수 연구실 ${e(c.site.professorOffice)}</p><em>${e(c.site.professorOfficeNote)}</em><a href="${e(c.site.mapUrl)}" target="_blank" rel="noreferrer">GOOGLE MAPS ↗</a></address><div><small>RESEARCH SOURCES</small>${c.researchSources.map((s) => `<a href="${e(s.url)}" target="_blank" rel="noreferrer">${e(s.label)} ↗</a>`).join("")}</div></div>`;

  $("[data-footer]").innerHTML = `<div class="footer-brand"><img src="./resource/sclab%20%EB%A1%9C%EA%B3%A0.png" alt="Smart Computing Laboratory" /><p>${e(c.site.name)}<br />${e(c.site.university)} · ${e(c.site.department)}</p></div><nav><a href="#people">People</a><a href="#research">Research</a><a href="#publications">Publications</a><a href="#board">Board</a><a href="#contact">Contact</a></nav><div><p>${e(c.site.location)}<br /><a href="mailto:${e(c.site.email)}">${e(c.site.email)}</a></p><p>© ${new Date().getFullYear()} SCLab</p></div>`;

  const positions = [[88,120],[245,75],[470,115],[575,250],[435,385],[190,370],[315,235],[78,270]];
  const edges = [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[1,6],[6,4],[5,6],[6,2],[0,7],[7,5]];
  $("[data-demo-nodes]").innerHTML = positions.map((n, i) => `<g class="demo-node" transform="translate(${n[0]} ${n[1]})"><circle r="9"/><circle r="24"/><text y="4">E${String(i + 1).padStart(2, "0")}</text></g>`).join("");
  $("[data-demo-edges]").innerHTML = edges.map((x, i) => `<line class="demo-edge" data-edge="${i}" x1="${positions[x[0]][0]}" y1="${positions[x[0]][1]}" x2="${positions[x[1]][0]}" y2="${positions[x[1]][1]}"/>`).join("");
  function updateGraph(i) { const r = c.research[i]; $("[data-demo-title]").textContent = r.titleKo; document.querySelectorAll(".demo-edge").forEach((x, k) => x.classList.toggle("active", k <= 2 + i * 2)); }
  let frame = 0;
  function syncGraph() { frame = 0; const rect = $(".hero").getBoundingClientRect(); const distance = Math.max(1, $(".hero").offsetHeight - innerHeight * .35); const progress = Math.max(0, Math.min(1, -rect.top / distance)); updateGraph(Math.round(progress * 3)); }
  addEventListener("scroll", () => { if (!frame) frame = requestAnimationFrame(syncGraph); }, { passive: true });
  addEventListener("resize", syncGraph);
  updateGraph(0); syncGraph(); u.initMenu(".menu-button", "#main-nav");
})();
