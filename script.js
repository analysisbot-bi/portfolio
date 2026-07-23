/* =========================================================
   Site behaviour: skills filter, projects, resume modal,
   copy email. Content lives in content.js.
   ========================================================= */

(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ----- Copy email ----- */
  const copyBtn = document.getElementById("copyEmail");
  const emailText = document.getElementById("emailText");
  const copyToast = document.getElementById("copyToast");
  if (copyBtn && emailText) {
    copyBtn.addEventListener("click", async () => {
      const value = emailText.textContent.trim();
      try {
        await navigator.clipboard.writeText(value);
        if (copyToast) {
          copyToast.textContent = "Copied";
          setTimeout(() => { copyToast.textContent = ""; }, 1500);
        }
      } catch (err) {
        if (copyToast) copyToast.textContent = "Copy failed";
      }
    });
  }

  /* ----- Render skills + projects ----- */
  const site = window.SITE || { skills: [], projects: [] };
  const skillsRoot = document.getElementById("skillsList");
  const projectsGrid = document.getElementById("projectsGrid");
  const filterBar = document.getElementById("projectsFilter");
  const filterText = document.getElementById("projectsFilterText");
  const filterClear = document.getElementById("projectsFilterClear");
  const projectsEmpty = document.getElementById("projectsEmpty");

  let activeSkill = null;

  function renderSkills() {
    if (!skillsRoot) return;
    skillsRoot.innerHTML = "";
    site.skills.forEach((s) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "skill-chip";
      btn.dataset.skill = s.id;
      btn.textContent = s.label;
      btn.addEventListener("click", () => setSkillFilter(s.id, s.label));
      skillsRoot.appendChild(btn);
    });
  }

  function renderProjects() {
    if (!projectsGrid) return;
    projectsGrid.innerHTML = "";
    site.projects.forEach((p) => {
      const article = document.createElement("article");
      article.className = "project";
      article.dataset.skills = p.skills.join(" ");
      article.innerHTML =
        "<h3 class=\"project__title\"></h3>" +
        "<p class=\"project__desc\"></p>" +
        "<p class=\"project__tech\"></p>" +
        "<div class=\"project__links\"></div>";
      article.querySelector(".project__title").textContent = p.title;
      article.querySelector(".project__desc").innerHTML = p.desc;
      article.querySelector(".project__tech").textContent = p.tech;
      const links = article.querySelector(".project__links");
      if (p.caseUrl) {
        const a = document.createElement("a");
        a.href = p.caseUrl;
        a.textContent = "Case study";
        links.appendChild(a);
      }
      if (p.githubUrl) {
        const a = document.createElement("a");
        a.href = p.githubUrl;
        a.target = "_blank";
        a.rel = "noopener";
        a.innerHTML =
          "<svg width=\"14\" height=\"14\" viewBox=\"0 0 24 24\" fill=\"currentColor\" aria-hidden=\"true\"><path d=\"M12 .5C5.37.5 0 5.87 0 12.5c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.28-.01-1.03-.02-2.02-3.34.73-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.75.08-.73.08-.73 1.21.09 1.85 1.24 1.85 1.24 1.07 1.84 2.81 1.31 3.5 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23.96-.27 1.98-.4 3-.4s2.04.13 3 .4c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.62-2.81 5.65-5.49 5.95.43.37.81 1.1.81 2.22 0 1.61-.01 2.9-.01 3.3 0 .32.22.7.83.58C20.56 22.3 24 17.8 24 12.5 24 5.87 18.63.5 12 .5z\"/></svg> GitHub";
        links.appendChild(a);
      }
      projectsGrid.appendChild(article);
    });
    applyFilter();
  }

  function setSkillFilter(id, label) {
    activeSkill = activeSkill === id ? null : id;
    document.querySelectorAll(".skill-chip").forEach((btn) => {
      btn.classList.toggle("is-active", btn.dataset.skill === activeSkill);
    });
    if (filterBar && filterText) {
      if (activeSkill) {
        filterBar.hidden = false;
        filterText.textContent = "Filtered by: " + label;
      } else {
        filterBar.hidden = true;
        filterText.textContent = "";
      }
    }
    applyFilter();
  }

  function applyFilter() {
    if (!projectsGrid) return;
    const cards = projectsGrid.querySelectorAll(".project");
    let shown = 0;
    cards.forEach((card) => {
      const skills = (card.dataset.skills || "").split(/\s+/);
      const ok = !activeSkill || skills.includes(activeSkill);
      card.hidden = !ok;
      if (ok) shown += 1;
    });
    if (projectsEmpty) {
      projectsEmpty.hidden = shown > 0;
      if (shown === 0) {
        projectsEmpty.textContent = "No projects for that skill. Check GitHub for more.";
      }
    }
  }

  if (filterClear) {
    filterClear.addEventListener("click", () => {
      activeSkill = null;
      document.querySelectorAll(".skill-chip").forEach((btn) => btn.classList.remove("is-active"));
      if (filterBar) filterBar.hidden = true;
      applyFilter();
    });
  }

  renderSkills();
  renderProjects();

  /* ----- Resume modal ----- */
  const resumeTriggers = document.querySelectorAll(".js-resume-open");
  const resumeModal = document.getElementById("resumeModal");
  const resumeBody = document.getElementById("resumeBody");

  if (resumeModal) {
    const openResume = (e) => {
      if (e) e.preventDefault();
      resumeModal.classList.add("open");
      resumeModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      if (resumeBody) resumeBody.scrollTop = 0;
    };
    const closeResume = () => {
      resumeModal.classList.remove("open");
      resumeModal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    };

    resumeTriggers.forEach((btn) => btn.addEventListener("click", openResume));
    resumeModal.querySelectorAll("[data-close]").forEach((el) =>
      el.addEventListener("click", closeResume)
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && resumeModal.classList.contains("open")) closeResume();
    });
  }
})();
