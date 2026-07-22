// ===== Nav: scroll state + mobile menu =====
const nav = document.getElementById("nav");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");

if (nav) {
  window.addEventListener("scroll", () => {
    nav.classList.toggle("nav--scrolled", window.scrollY > 30);
  });
}

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    navToggle.classList.toggle("open", open);
    navToggle.setAttribute("aria-expanded", String(open));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      navToggle.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ===== Scroll reveal =====
const revealEls = document.querySelectorAll(".reveal");
if (revealEls.length) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add("in"), (i % 4) * 80);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  revealEls.forEach((el) => revealObserver.observe(el));
}

// ===== Animated stat counters =====
const stats = document.querySelectorAll(".stat__num");
if (stats.length) {
  const statObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseFloat(el.dataset.target);
        const isFloat = !Number.isInteger(target);
        const duration = 1400;
        const start = performance.now();

        const tick = (now) => {
          const p = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const val = target * eased;
          el.textContent = isFloat ? val.toFixed(1) : Math.round(val);
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = isFloat ? target.toFixed(1) : target;
        };
        requestAnimationFrame(tick);
        statObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );
  stats.forEach((s) => statObserver.observe(s));
}

// ===== Contact form (real delivery) =====
// Where messages go:
const CONTACT_EMAIL = "vickrammadhavan2002@gmail.com";
// Messages send in the background (no page redirect):
//  - If left blank, delivery uses FormSubmit (no signup; requires a one-time
//    email confirmation the first time a message is sent).
//  - Optionally paste a Web3Forms access key (https://web3forms.com) to use
//    that instead. Either way, if delivery fails the form falls back to
//    opening the visitor's email app.
const WEB3FORMS_ACCESS_KEY = "";

const form = document.getElementById("contactForm");
const status = document.getElementById("formStatus");

if (form && status) {
  const setStatus = (msg, kind) => {
    status.textContent = msg;
    status.className = "form-status " + kind;
  };

  // Fallback: open the visitor's email client with the message pre-filled.
  const sendViaMailto = (name, email, message) => {
    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setStatus(
      `Thanks, ${name}! Your email app should now open with the message ready — just hit send.`,
      "ok"
    );
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

    // Deliver in the background so the visitor never leaves the page.
    setStatus("Sending…", "ok");
    try {
      let res, data;
      if (WEB3FORMS_ACCESS_KEY) {
        // Preferred: Web3Forms (if a key is configured).
        res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({
            access_key: WEB3FORMS_ACCESS_KEY,
            subject: `Portfolio enquiry from ${name}`,
            from_name: name,
            name,
            email,
            message,
          }),
        });
        data = await res.json();
        if (!(res.ok && data.success)) throw new Error("web3forms failed");
      } else {
        // No key needed: FormSubmit delivers straight to the inbox.
        res = await fetch(
          `https://formsubmit.co/ajax/${encodeURIComponent(CONTACT_EMAIL)}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
              name,
              email,
              message,
              _replyto: email,
              _subject: `Portfolio enquiry from ${name}`,
              _template: "table",
            }),
          }
        );
        data = await res.json();
        const ok = data && (data.success === true || data.success === "true");
        if (!(res.ok && ok)) throw new Error("formsubmit failed");
      }
      setStatus(`✓ Thanks, ${name}! Your message has been sent — I'll be in touch soon.`, "ok sent");
      form.reset();
    } catch (err) {
      // Any delivery failure → fall back to the visitor's email app.
      sendViaMailto(name, email, message);
    }
  });
}

// ===== Resume modal viewer =====
// The resume is shown as page images (assets/resume-page-*.png) so it displays
// reliably on every browser and device — unlike embedded PDFs, which many
// browsers refuse to render inline. The Download / Open-in-new-tab buttons
// still serve the real PDF.
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
  // Expose so the chatbot can open the resume viewer.
  window.__openResume = openResume;
}

// ===== Case-study banner animation =====
(() => {
  const banner = document.querySelector(".page-banner");
  if (!banner) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  requestAnimationFrame(() => banner.classList.add("is-animated"));
})();

// ===== Skill -> Projects filter =====
const projectsGrid = document.getElementById("projectsGrid");
const skillTags = document.querySelectorAll(".tags .tag[data-skill]");

if (projectsGrid && skillTags.length) {
  const filterBar = document.getElementById("projectsFilter");
  const filterText = document.getElementById("projectsFilterText");
  const filterClear = document.getElementById("projectsFilterClear");
  const emptyMsg = document.getElementById("projectsEmpty");
  const projectCards = projectsGrid.querySelectorAll(".project");
  let activeSkill = null;

  const clearFilter = () => {
    activeSkill = null;
    projectCards.forEach((c) => c.classList.remove("is-hidden", "is-match"));
    skillTags.forEach((t) => t.classList.remove("is-active"));
    if (filterBar) filterBar.hidden = true;
    if (emptyMsg) emptyMsg.hidden = true;
  };

  const applyFilter = (skill, label) => {
    if (activeSkill === skill) { clearFilter(); return; }
    activeSkill = skill;
    let matches = 0;
    projectCards.forEach((card) => {
      const skills = (card.dataset.skills || "").split(/\s+/);
      const hit = skills.includes(skill);
      card.classList.toggle("is-hidden", !hit);
      card.classList.toggle("is-match", hit);
      if (hit) matches++;
    });
    skillTags.forEach((t) => t.classList.toggle("is-active", t.dataset.skill === skill));

    if (filterBar && filterText) {
      if (matches > 0) {
        filterText.innerHTML =
          `Showing <b>${matches}</b> project${matches > 1 ? "s" : ""} where I used <b>${label}</b>`;
        if (emptyMsg) emptyMsg.hidden = true;
      } else {
        filterText.innerHTML = `No featured projects tagged <b>${label}</b> — but ask the chatbot about it!`;
        if (emptyMsg) {
          emptyMsg.innerHTML = `Nothing here for <b>${label}</b> just yet. It's a skill I use in coursework and smaller work — happy to chat about it.`;
          emptyMsg.hidden = false;
        }
      }
      filterBar.hidden = false;
    }

    const projectsSection = document.getElementById("projects");
    if (projectsSection) projectsSection.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  skillTags.forEach((tag) => {
    tag.setAttribute("role", "button");
    tag.setAttribute("tabindex", "0");
    tag.setAttribute("title", "See projects using this skill");
    const trigger = () => applyFilter(tag.dataset.skill, tag.textContent.trim());
    tag.addEventListener("click", trigger);
    tag.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); trigger(); }
    });
  });

  if (filterClear) filterClear.addEventListener("click", clearFilter);
}

// ===== British-dialect keyword chatbot =====
(function initChatbot() {
  const onSubpage = /\/projects\//.test(location.pathname);
  const base = onSubpage ? "../" : "";
  const L = (hash, text) => `<a href="${base}index.html${hash}">${text}</a>`;

  const RESUME = onSubpage ? "../assets/resume.pdf" : "assets/resume.pdf";
  // A clickable link that opens the in-page resume viewer (falls back to the PDF).
  const resumeLink = (label) =>
    `<a href="${RESUME}" target="_blank" rel="noopener" data-action="resume">${label}</a>`;

  // Knowledge base — matched by keywords, answered as Alfred, a witty British butler.
  const rules = [
    { k: ["hello", "hi ", "hiya", "hey", "alright", "good morning", "good afternoon", "evening", "yo ", "greetings"],
      a: () => `Good day to you. 🎩 Alfred, at your service — Master Vickram's data butler. I should be delighted to tell you of his projects, skills, experience or credentials. Where shall we begin?` },
    { k: ["python", "pandas", "numpy"],
      a: () => `Python is very much his mother tongue — <b>Pandas, NumPy and scikit-learn</b> the tools of choice. It underpins every one of his projects, from the neural-network classifier to the big-data work. Do click "Python" in the ${L("#skills", "Skills")} panel to see them filtered, if you'd be so kind.` },
    { k: ["machine learning", "ml", "predict", "classifier", "classification", "regression", "svm", "knn"],
      a: () => `Machine learning is rather his forte. He's comfortable across <b>regression, classification, Random Forest, SVM and Artificial Neural Networks</b> — building them, evaluating them, and crucially <i>interpreting</i> them. The ${L("#projects", "case studies")} tell the tale nicely.` },
    { k: ["ann", "neural", "deep learning", "obesity", "tensorflow", "keras"],
      a: () => `Ah, the neural networks — a personal favourite of mine. For the Obesity Classification he engineered three ANN architectures in <b>TensorFlow/Keras</b> and achieved up to <b>95% test accuracy</b> with the regularised Deep ANN. Charts, confusion matrix and the full write-up await in the ${L("#projects", "Projects")} section.` },
    { k: ["random forest", "sla", "breach", "public health", "svr"],
      a: () => `His featured work centres on a <b>supply-chain DSS</b> and an <b>obesity ANN classifier</b>. Further models — including SLA-style predictors — live on his <a href="https://github.com/analysisbot-bi" target="_blank" rel="noopener">GitHub</a>.` },
    { k: ["power bi", "tableau", "dashboard", "supply chain", "visual", "bi ", "seaborn", "matplotlib", "shap", "xgboost"],
      a: () => `He's thoroughly at home with <b>Power BI and Tableau</b> (and Matplotlib/Seaborn for the finer details). His supply-chain DSS pairs <b>XGBoost + SHAP</b> (<b>86.9% accuracy</b>, ROC-AUC <b>0.96</b>) with a KPI dashboard — do peruse the ${L("#projects", "Projects")}.` },
    { k: ["big data", "data analysis", "analytics", "data scientist", "data analyst"],
      a: () => `Precisely the roles he's after — <b>Data Analyst</b>. His MSc specialises in data analysis and big data: cleaning, feature engineering and drawing genuine insight from sizeable datasets.` },
    { k: ["excel", "power query", "pivot"],
      a: () => `Indeed — <b>Excel</b> with Pivot Tables and Power Query is well within his repertoire, alongside the heavier analytics tooling.` },
    { k: ["forecast", "forecasting", "time series"],
      a: () => `Forecasting, yes — he turns data into predictions a business can actually act upon. That, he'd say, is rather the whole point.` },
    { k: ["sql", "database", "mysql", "postgres", "mongo"],
      a: () => `Databases are well in hand: <b>SQL, MySQL, PostgreSQL and MongoDB</b>. Querying and modelling data is daily bread. Try the "SQL" chip in ${L("#skills", "Skills")} to see it in context.` },
    { k: ["cloud", "aws", "oracle"],
      a: () => `He holds an <b>AWS Academy Cloud Operations</b> certification and <b>Oracle Database Foundations</b> — a tidy cloud-and-data grounding, if I may say.` },
    { k: ["blockchain"],
      a: () => `Quite the polymath — he completed a <b>Blockchain Specialisation on Coursera</b>. Curiosity is something of a habit with him.` },
    { k: ["certif", "course", "qualif", "aws", "google"],
      a: () => `His certifications include <b>AWS Academy Cloud Operations</b>, <b>Oracle Database Foundations</b>, a <b>Blockchain Specialisation (Coursera)</b> and <b>Google Digital Marketing</b>. All catalogued on his ${resumeLink("resume")}.` },
    { k: ["skill", "tech", "stack", "tool", "know", "language"],
      a: () => `A focused toolbox: <b>Python, SQL, Machine Learning, Power BI, Data Visualisation and Business Operations</b>. Do visit ${L("#skills", "Skills")} — click any skill to reveal the projects behind it.` },
    { k: ["project", "work you", "portfolio", "built", "case study", "case studies"],
      a: () => `Two featured case studies: a <b>supply-chain DSS</b> (XGBoost + SHAP, 86.9% accuracy) and an <b>ANN obesity classifier</b> (~95% accuracy). For further work, check his <a href="https://github.com/analysisbot-bi" target="_blank" rel="noopener">GitHub</a>.` },
    { k: ["experience", "job", "career", "worked", "operations", "mycaptain", "financial"],
      a: () => `At <b>MyCaptain</b> (Business Operations Executive) he used <b>data visualisation</b> to turn ops metrics into clear reports. As <b>Financial Center Lead</b> at CTECH he ran <b>data analysis</b> on budgets and expenses to support decisions. See ${L("#experience", "Experience")}.` },
    { k: ["achievement", "award", "leadership", "e-summit", "iit", " e-cell", "ecell", "nss"],
      a: () => `A decorated sort: <b>Semi-finalist at E-Summit 2023, IIT Bombay</b>, Senior Marketing Member at E-Cell SRM, Financial Lead at CTech Association, and an NSS community volunteer. Leadership runs through it.` },
    { k: ["education", "study", "studies", "degree", "university", "coventry", "srm", "msc", "btech", "cgpa", "grade"],
      a: () => `<b>MSc Computer Science, Coventry University</b> (2025–present), following a <b>B.Tech in Computer Science &amp; Engineering at SRM</b> (2020–2024, CGPA <b>8.07/10</b>). His MSc covered Machine Learning &amp; Big Data, Artificial Neural Networks, Web Applications &amp; AI and more. Timeline's in ${L("#experience", "Education")}.` },
    { k: ["contact", "email", "reach", "get in touch", "phone", "number", "call"],
      a: () => `By all means. Email <a href="mailto:vickrammadhavan2002@gmail.com">vickrammadhavan2002@gmail.com</a>, telephone <b>+44 7883 278066</b>, the ${L("#contact", "Contact")} form, or <a href="https://www.linkedin.com/in/vickram-madhavan-746344226/" target="_blank" rel="noopener">LinkedIn</a>. He'll respond promptly.` },
    { k: ["hire", "recruit", "hiring", "available", "availability", "role", "notice", "why should", "why hire", "why you", "strength", "candidate", "fit"],
      a: () => `An excellent question. Master Vickram pairs solid <b>data-analysis skills</b> (Python, ML, BI) with real <b>business impact</b> — he doesn't merely build models, he moves the metric. He's seeking a <b>Data Analyst</b> post and is based in the UK. Shall I point you to his ${resumeLink("resume")} or the ${L("#contact", "Contact")} form?` },
    { k: ["resume", "cv", "download", "curriculum"],
      a: () => `Certainly — his resume is right here: ${resumeLink("open the CV")} (or use the <b>Resume</b> button at the top). You may view it in-page and download it as you please.` },
    { k: ["linkedin", "social", "github"],
      a: () => `Of course — <a href="https://www.linkedin.com/in/vickram-madhavan-746344226/" target="_blank" rel="noopener">LinkedIn</a> and <a href="https://github.com/analysisbot-bi" target="_blank" rel="noopener">GitHub</a>. Do connect.` },
    { k: ["where", "location", "based", "live", "uk", "england", "relocate", "visa"],
      a: () => `He's based in <b>Coventry, England</b> — well placed for data roles across the UK.` },
    { k: ["who", "about", "yourself", "vickram", "tell me"],
      a: () => `Vickram Madhavan: MSc Computer Science graduate, a <b>Data Analyst</b> who turns messy data into decisions — with a business head, no less. And I? Merely the butler, keeping the estate in order. 🎩` },
    { k: ["thank", "cheers", "ta ", "nice one", "brilliant", "great", "lovely"],
      a: () => `A pleasure entirely. Is there anything further I might assist with?` },
    { k: ["bye", "goodbye", "see ya", "cya", "later", "farewell"],
      a: () => `Very good — until next time. Do give Master Vickram a shout; you'll not regret it. 🎩` },
    { k: ["help", "what can you", "options", "menu", "topics"],
      a: () => `I'd be delighted. Ask about his <b>projects</b>, <b>skills</b> (Python, SQL, ML, Power BI…), <b>experience</b>, <b>education</b>, <b>certifications</b>, <b>achievements</b>, or how to <b>hire / contact</b> him. You may also request his ${resumeLink("resume")}.` },
  ];

  const fallback = () =>
    `I'm afraid that one rather escapes me. Might I suggest asking about his <b>projects</b>, <b>Python</b>, <b>skills</b>, <b>experience</b>, <b>certifications</b>, or how to <b>get in touch</b>? Or take a look at his ${resumeLink("resume")}.`;

  const answer = (raw) => {
    const q = " " + raw.toLowerCase() + " ";
    for (const r of rules) {
      if (r.k.some((kw) => q.includes(kw))) return r.a();
    }
    return fallback();
  };

  // Build widget
  const fab = document.createElement("button");
  fab.className = "chat-fab";
  fab.type = "button";
  fab.innerHTML = `<span class="chat-fab__dot"></span> Ask Alfred`;

  const panel = document.createElement("div");
  panel.className = "chat-panel";
  panel.innerHTML = `
    <div class="chat-head">
      <div class="chat-head__avatar">🎩</div>
      <div class="chat-head__meta">
        <div class="chat-head__name">Alfred</div>
        <div class="chat-head__status">Vic's data butler · online</div>
      </div>
      <button class="chat-close" type="button" aria-label="Close chat">&times;</button>
    </div>
    <div class="chat-body" id="chatBody"></div>
    <div class="chat-chips" id="chatChips">
      <span class="chat-chip" data-q="Has he done any Python projects?">Python projects?</span>
      <span class="chat-chip" data-q="Why should I hire him?">Why hire him?</span>
      <span class="chat-chip" data-q="What are his skills?">Skills</span>
      <span class="chat-chip" data-q="Show me his certifications">Certifications</span>
      <span class="chat-chip" data-q="Can I see his resume?">Resume</span>
      <span class="chat-chip" data-q="How do I contact him?">Contact</span>
    </div>
    <form class="chat-input" id="chatForm">
      <input type="text" id="chatText" placeholder="Ask us anything, guv…" autocomplete="off" />
      <button class="chat-send" type="submit" aria-label="Send">➤</button>
    </form>`;

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  const body = panel.querySelector("#chatBody");
  const form = panel.querySelector("#chatForm");
  const input = panel.querySelector("#chatText");
  let greeted = false;

  const scrollDown = () => { body.scrollTop = body.scrollHeight; };

  const addMsg = (html, who) => {
    const el = document.createElement("div");
    el.className = "chat-msg chat-msg--" + who;
    el.innerHTML = html;
    body.appendChild(el);
    scrollDown();
  };

  const botReply = (text) => {
    const typing = document.createElement("div");
    typing.className = "chat-typing";
    typing.innerHTML = "<span></span><span></span><span></span>";
    body.appendChild(typing);
    scrollDown();
    setTimeout(() => {
      typing.remove();
      addMsg(answer(text), "bot");
    }, 550 + Math.random() * 500);
  };

  const openChat = () => {
    panel.classList.add("open");
    fab.classList.add("is-hidden");
    if (!greeted) {
      greeted = true;
      setTimeout(() => addMsg(`Good day to you. 🎩 I am Alfred, Master Vickram's data butler. I should be most happy to tell you of his work — his projects, skills, certifications, or how one might engage him. Pray, how may I assist?`, "bot"), 250);
    }
    setTimeout(() => input.focus(), 300);
  };
  const closeChat = () => {
    panel.classList.remove("open");
    fab.classList.remove("is-hidden");
  };

  fab.addEventListener("click", openChat);
  panel.querySelector(".chat-close").addEventListener("click", closeChat);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addMsg(text.replace(/</g, "&lt;"), "user");
    input.value = "";
    botReply(text);
  });

  panel.querySelectorAll(".chat-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      const q = chip.dataset.q;
      addMsg(q, "user");
      botReply(q);
    });
  });

  // Resume links inside chat: open the in-page viewer if it exists on this page.
  body.addEventListener("click", (e) => {
    const link = e.target.closest('[data-action="resume"]');
    if (link && typeof window.__openResume === "function") {
      e.preventDefault();
      window.__openResume();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.classList.contains("open")) closeChat();
  });
})();

// ===== Floating background (icons + code snippets) =====
(function initFloatingBg() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  const ICONS = {
    github: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.5 11.5 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>',
    gmail: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>',
  };
  const CODE = [
    "import pandas as pd", "model.fit(X, y)", "SELECT * FROM data", "df.groupby('cat')",
    "git commit -m 'wip'", "accuracy = 0.87", "RandomForestClassifier()", "import numpy as np",
    "SELECT AVG(sales)", "plt.plot(loss)", "def predict(x):", "git push origin main",
    "&lt;Vickram /&gt;", "npm run build",
  ];

  const layer = document.createElement("div");
  layer.className = "bg-float";
  layer.setAttribute("aria-hidden", "true");

  const rand = (min, max) => min + Math.random() * (max - min);
  const make = (html, cls, size) => {
    const el = document.createElement("div");
    el.className = "float-item " + cls;
    el.innerHTML = html;
    el.style.left = rand(2, 90) + "%";
    el.style.top = rand(6, 88) + "%";
    if (size) { el.style.width = size + "px"; el.style.height = size + "px"; }
    const dur = rand(6, 12);
    el.style.animationDuration = dur + "s";
    el.style.animationDelay = -rand(0, dur) + "s";
    layer.appendChild(el);
  };

  const iconKeys = Object.keys(ICONS);
  for (let i = 0; i < 10; i++) {
    const key = iconKeys[i % iconKeys.length];
    make(ICONS[key], "float-item--icon", Math.round(rand(26, 50)));
  }
  for (let i = 0; i < 12; i++) {
    make(CODE[i % CODE.length], "float-item--code");
  }
  document.body.appendChild(layer);
})();

// ===== Creative cursor + section speech bubbles =====
(function initCursor() {
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!finePointer) return;

  const ring = document.createElement("div");
  ring.className = "cursor-ring";
  const dot = document.createElement("div");
  dot.className = "cursor-dot";
  const bubble = document.createElement("div");
  bubble.className = "cursor-bubble";
  document.body.append(ring, dot, bubble);

  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;
  let ready = false;

  window.addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate(${mx}px, ${my}px)`;
    bubble.style.transform = `translate(${mx}px, ${my}px)`;
    bubble.style.left = "0px"; bubble.style.top = "0px";
    if (!ready) { ready = true; document.body.classList.add("cursor-ready"); }
  });
  window.addEventListener("mouseleave", () => document.body.classList.remove("cursor-ready"));
  window.addEventListener("mouseenter", () => { if (ready) document.body.classList.add("cursor-ready"); });

  // Ring easing
  const animate = () => {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate(${rx}px, ${ry}px)`;
    requestAnimationFrame(animate);
  };
  if (!reduce) requestAnimationFrame(animate);
  else ring.style.transform = `translate(${mx}px, ${my}px)`;

  // Hover state over interactive elements
  const interactive = 'a, button, .tag, .chat-chip, .project, .skill-card, .stat, input, textarea, [role="button"]';
  document.addEventListener("mouseover", (e) => {
    if (e.target.closest(interactive)) ring.classList.add("is-hover");
  });
  document.addEventListener("mouseout", (e) => {
    if (e.target.closest(interactive)) ring.classList.remove("is-hover");
  });

  // Bubble is positioned by transform (top-left at cursor); the CSS offset spaces it out.
  bubble.style.transform = `translate(${mx}px, ${my}px)`;

  let hideTimer = null;
  const showBubble = (text) => {
    if (!ready) return;
    bubble.textContent = text;
    bubble.classList.add("show");
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => bubble.classList.remove("show"), 3800);
  };

  const zones = document.querySelectorAll("[data-cursor-bubble]");
  if (zones.length) {
    const seen = new WeakSet();
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !seen.has(entry.target)) {
            seen.add(entry.target);
            showBubble(entry.target.getAttribute("data-cursor-bubble"));
          }
        });
      },
      { threshold: 0.45 }
    );
    zones.forEach((z) => obs.observe(z));
  }
})();

// ===== Footer year =====
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
