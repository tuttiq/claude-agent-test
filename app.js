/* ============================================
   Claude Projects Dashboard - App Logic
   ============================================ */

const projects = [
  // Product & Ops
  {
    id: 1,
    name: "Eng Team Process Optimizer",
    emoji: "\u{1F3AF}",
    description: "Analyze engineering workflows, sprint retros, and team velocity data. Generate process improvement recommendations and OKR tracking templates.",
    category: "product-ops",
    status: "active",
    tags: ["operations", "analytics", "OKRs"],
    conversations: 142,
    artifacts: 67,
    lastActive: "2 hours ago"
  },
  {
    id: 2,
    name: "Technical Spec Writer",
    emoji: "\u{1F4DD}",
    description: "Draft and review PRDs, technical design documents, and architecture decision records. Tailored to Intrinsic's robotics platform context.",
    category: "product-ops",
    status: "active",
    tags: ["documentation", "PRDs", "architecture"],
    conversations: 98,
    artifacts: 203,
    lastActive: "5 hours ago"
  },
  {
    id: 3,
    name: "Incident & Postmortem Assistant",
    emoji: "\u{1F6A8}",
    description: "Structure incident reports, guide blameless postmortems, and track action items. Helps identify systemic patterns across incidents.",
    category: "product-ops",
    status: "paused",
    tags: ["incidents", "reliability", "SRE"],
    conversations: 34,
    artifacts: 41,
    lastActive: "3 days ago"
  },

  // Community & DEI
  {
    id: 4,
    name: "Speaker Database Curator",
    emoji: "\u{1F399}\u{FE0F}",
    description: "Manage and enhance the speak-her-db project. Generate speaker bios, match speakers to events, and track diversity metrics in tech conferences.",
    category: "community",
    status: "active",
    tags: ["diversity", "speakers", "Vue.js"],
    conversations: 87,
    artifacts: 156,
    lastActive: "1 day ago"
  },
  {
    id: 5,
    name: "DEI Program Planner",
    emoji: "\u{1F31F}",
    description: "Plan community events, mentorship programs, and outreach initiatives for Women in Software Engineering. Draft proposals and comms.",
    category: "community",
    status: "active",
    tags: ["community", "mentorship", "events"],
    conversations: 63,
    artifacts: 94,
    lastActive: "12 hours ago"
  },
  {
    id: 6,
    name: "Open Source Contributor Guide",
    emoji: "\u{1F91D}",
    description: "Help onboard new contributors to open source projects. Generate good-first-issue descriptions, review PR guidelines, and Hacktoberfest prep.",
    category: "community",
    status: "new",
    tags: ["open-source", "hacktoberfest", "onboarding"],
    conversations: 18,
    artifacts: 29,
    lastActive: "4 days ago"
  },

  // Web Development
  {
    id: 7,
    name: "Vue/Nuxt Dev Companion",
    emoji: "\u{1F4BB}",
    description: "Full-stack development assistant for Vue.js and Nuxt projects. Code reviews, component architecture, Composition API patterns, and Netlify CMS integration.",
    category: "webdev",
    status: "active",
    tags: ["Vue.js", "Nuxt", "Netlify"],
    conversations: 214,
    artifacts: 891,
    lastActive: "30 min ago"
  },
  {
    id: 8,
    name: "API & Backend Architect",
    emoji: "\u{1F527}",
    description: "Design REST/GraphQL APIs, database schemas, and microservice architectures. Covers Node/Express, Ruby on Rails, and Go services.",
    category: "webdev",
    status: "active",
    tags: ["API design", "Node.js", "Go"],
    conversations: 76,
    artifacts: 312,
    lastActive: "6 hours ago"
  },
  {
    id: 9,
    name: "Personal Site Redesign",
    emoji: "\u{1F3A8}",
    description: "Redesign tuttiq.me with modern aesthetics. Explore layouts, color schemes, and content strategy for a product/eng leader portfolio.",
    category: "webdev",
    status: "paused",
    tags: ["design", "portfolio", "Nuxt"],
    conversations: 42,
    artifacts: 87,
    lastActive: "1 week ago"
  },

  // Learning & Talks
  {
    id: 10,
    name: "Conference Talk Builder",
    emoji: "\u{1F3AC}",
    description: "Develop talk outlines, slide content, and speaker notes. Currently working on 'Scaling Software Development' with code samples and case studies.",
    category: "learning",
    status: "active",
    tags: ["talks", "scaling", "leadership"],
    conversations: 31,
    artifacts: 68,
    lastActive: "2 days ago"
  },
  {
    id: 11,
    name: "Robotics & AI Study Notes",
    emoji: "\u{1F916}",
    description: "Deep-dive learning companion for robotics concepts, computer vision, and AI/ML fundamentals relevant to work at Intrinsic (Alphabet).",
    category: "learning",
    status: "new",
    tags: ["robotics", "AI/ML", "study"],
    conversations: 24,
    artifacts: 53,
    lastActive: "3 days ago"
  },
  {
    id: 12,
    name: "Language & Framework Lab",
    emoji: "\u{1F9EA}",
    description: "Experiment with new languages and frameworks. Current explorations: Dart/Flutter, advanced Go patterns, and Rust basics.",
    category: "learning",
    status: "active",
    tags: ["Dart", "Go", "Rust"],
    conversations: 18,
    artifacts: 44,
    lastActive: "5 days ago"
  }
];

const recentConversations = [
  { icon: "\u{1F4BB}", title: "Refactor composables for Vue 3.4 reactivity changes", project: "Vue/Nuxt Dev Companion", time: "30 min ago", color: "#2563EB" },
  { icon: "\u{1F3AF}", title: "Q2 OKR draft: reduce deploy-to-prod cycle time by 40%", project: "Eng Team Process Optimizer", time: "2 hours ago", color: "#D97706" },
  { icon: "\u{1F31F}", title: "Mentorship program proposal for WiSE JP 2026", project: "DEI Program Planner", time: "12 hours ago", color: "#DB2777" },
  { icon: "\u{1F527}", title: "Design pagination strategy for speaker search API", project: "API & Backend Architect", time: "6 hours ago", color: "#2563EB" },
  { icon: "\u{1F3AC}", title: "Outline: Engineering culture at scale - lessons learned", project: "Conference Talk Builder", time: "2 days ago", color: "#7C3AED" },
  { icon: "\u{1F916}", title: "Notes on sim-to-real transfer for manipulation tasks", project: "Robotics & AI Study Notes", time: "3 days ago", color: "#7C3AED" },
];

// ---- Render Projects ----
function renderProjects(filter = "all", searchQuery = "") {
  const grid = document.getElementById("projectsGrid");
  const filtered = projects.filter(p => {
    const matchesFilter = filter === "all" || p.category === filter;
    const matchesSearch = searchQuery === "" ||
      p.name.toLowerCase().includes(searchQuery) ||
      p.description.toLowerCase().includes(searchQuery) ||
      p.tags.some(t => t.toLowerCase().includes(searchQuery));
    return matchesFilter && matchesSearch;
  });

  grid.innerHTML = filtered.map(p => `
    <div class="project-card" data-category="${p.category}">
      <div class="project-top">
        <span class="project-emoji">${p.emoji}</span>
        <span class="project-status status-${p.status}">${p.status}</span>
      </div>
      <div class="project-body">
        <h3 class="project-name">${p.name}</h3>
        <p class="project-desc">${p.description}</p>
        <div class="project-tags">
          ${p.tags.map(t => `<span class="tag">${t}</span>`).join("")}
        </div>
        <div class="project-meta">
          <span class="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            ${p.conversations}
          </span>
          <span class="meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            ${p.artifacts}
          </span>
          <span class="meta-item" style="margin-left:auto;">${p.lastActive}</span>
        </div>
      </div>
    </div>
  `).join("");
}

// ---- Render Conversations ----
function renderConversations() {
  const list = document.getElementById("conversationsList");
  list.innerHTML = recentConversations.map(c => `
    <div class="conversation-item">
      <div class="conv-icon" style="background:${c.color}22;">${c.icon}</div>
      <div class="conv-info">
        <div class="conv-title">${c.title}</div>
        <div class="conv-project">${c.project}</div>
      </div>
      <span class="conv-time">${c.time}</span>
    </div>
  `).join("");
}

// ---- Activity Chart (pure canvas) ----
function drawChart() {
  const canvas = document.getElementById("activityChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.parentElement.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  canvas.style.width = rect.width + "px";
  canvas.style.height = rect.height + "px";
  ctx.scale(dpr, dpr);

  const w = rect.width;
  const h = rect.height;
  const padding = { top: 20, right: 20, bottom: 36, left: 40 };
  const chartW = w - padding.left - padding.right;
  const chartH = h - padding.top - padding.bottom;

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const conversations = [18, 24, 15, 32, 28, 8, 12];
  const artifacts = [12, 18, 9, 22, 20, 5, 8];
  const maxVal = 35;

  // Grid lines
  ctx.strokeStyle = "#2A2E3F";
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding.top + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(w - padding.right, y);
    ctx.stroke();

    ctx.fillStyle = "#5C6078";
    ctx.font = "11px Inter, sans-serif";
    ctx.textAlign = "right";
    ctx.fillText(Math.round(maxVal - (maxVal / 4) * i), padding.left - 8, y + 4);
  }

  // Day labels
  ctx.fillStyle = "#5C6078";
  ctx.font = "11px Inter, sans-serif";
  ctx.textAlign = "center";
  const barGroupWidth = chartW / days.length;

  days.forEach((day, i) => {
    const x = padding.left + barGroupWidth * i + barGroupWidth / 2;
    ctx.fillText(day, x, h - 10);
  });

  // Bars
  const barWidth = 14;
  const gap = 4;

  days.forEach((_, i) => {
    const groupX = padding.left + barGroupWidth * i + barGroupWidth / 2;

    // Conversations bar
    const ch = (conversations[i] / maxVal) * chartH;
    const cx = groupX - barWidth - gap / 2;
    const cy = padding.top + chartH - ch;
    roundedRect(ctx, cx, cy, barWidth, ch, 4);
    ctx.fillStyle = "#D97706";
    ctx.fill();

    // Artifacts bar
    const ah = (artifacts[i] / maxVal) * chartH;
    const ax = groupX + gap / 2;
    const ay = padding.top + chartH - ah;
    roundedRect(ctx, ax, ay, barWidth, ah, 4);
    ctx.fillStyle = "#2563EB";
    ctx.fill();
  });
}

function roundedRect(ctx, x, y, w, h, r) {
  if (h < r * 2) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h);
  ctx.lineTo(x, y + h);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// ---- Event Listeners ----
document.querySelectorAll(".nav-item").forEach(item => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    document.querySelectorAll(".nav-item").forEach(n => n.classList.remove("active"));
    item.classList.add("active");
    renderProjects(item.dataset.filter, document.getElementById("searchInput").value.toLowerCase());
  });
});

document.getElementById("searchInput").addEventListener("input", (e) => {
  const activeFilter = document.querySelector(".nav-item.active").dataset.filter;
  renderProjects(activeFilter, e.target.value.toLowerCase());
});

document.querySelectorAll(".toggle-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".toggle-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    const grid = document.getElementById("projectsGrid");
    grid.classList.toggle("list-view", btn.dataset.view === "list");
  });
});

// ---- Init ----
renderProjects();
renderConversations();
drawChart();
window.addEventListener("resize", drawChart);
