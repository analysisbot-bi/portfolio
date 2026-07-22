/* =========================================================
   Site behaviour: nav, skills filter, projects render,
   contact form, resume modal. Content lives in content.js.
   ========================================================= */

(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ----- Nav (mobile) ----- */
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");
  if (navToggle && navLinks) {
    navToggle.addEventListener("click", () => {
      const open = navLinks.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
    });
    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ----- Render skills + projects from content.js ----- */
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
        a.textContent = "GitHub";
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
        filterText.textContent = "Showing projects with: " + label;
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
        projectsEmpty.textContent = "No featured projects for that skill. See GitHub for more.";
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

  /* ----- Contact form ----- */
  const CONTACT_EMAIL = "vickrammadhavan2002@gmail.com";
  const WEB3FORMS_ACCESS_KEY = "";
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  if (form && status) {
    const setStatus = (msg, kind) => {
      status.textContent = msg;
      status.className = "form-status " + kind;
    };

    const sendViaMailto = (name, email, message) => {
      const subject = encodeURIComponent("Portfolio enquiry from " + name);
      const body = encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\n" + message);
      window.location.href = "mailto:" + CONTACT_EMAIL + "?subject=" + subject + "&body=" + body;
      setStatus("Thanks, " + name + ". Your email app should open with the message ready.", "ok");
      form.reset();
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!name || !email || !message) {
        setStatus("Please fill in all fields.", "err");
        return;
      }
      if (!emailOk) {
        setStatus("Please enter a valid email address.", "err");
        return;
      }

      setStatus("Sending…", "ok");
      try {
        let res, data;
        if (WEB3FORMS_ACCESS_KEY) {
          res = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
              access_key: WEB3FORMS_ACCESS_KEY,
              subject: "Portfolio enquiry from " + name,
              from_name: name,
              name,
              email,
              message,
            }),
          });
          data = await res.json();
          if (!(res.ok && data.success)) throw new Error("web3forms failed");
        } else {
          res = await fetch(
            "https://formsubmit.co/ajax/" + encodeURIComponent(CONTACT_EMAIL),
            {
              method: "POST",
              headers: { "Content-Type": "application/json", Accept: "application/json" },
              body: JSON.stringify({
                name,
                email,
                message,
                _replyto: email,
                _subject: "Portfolio enquiry from " + name,
                _template: "table",
              }),
            }
          );
          data = await res.json();
          const ok = data && (data.success === true || data.success === "true");
          if (!(res.ok && ok)) throw new Error("formsubmit failed");
        }
        setStatus("Thanks, " + name + ". Your message was sent.", "ok");
        form.reset();
      } catch (err) {
        sendViaMailto(name, email, message);
      }
    });
  }

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
