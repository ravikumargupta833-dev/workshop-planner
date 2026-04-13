import { useState, useEffect } from "react";

// ─── DATA ────────────────────────────────────────────────────────────────────
const workshops = [
  { id: "ml", title: "Machine Learning Fundamentals", instructor: "Dr. Arjun Sharma",
    date: "April 14, 2026", time: "10:00 AM – 12:00 PM", mode: "Online", level: "Beginner",
    status: "Booked", seats: 8,
    about: "Hands-on intro to supervised learning, regression, classification, and model evaluation using scikit-learn." },
  { id: "react", title: "React & Modern Frontend Dev", instructor: "Priya Singh",
    date: "April 18, 2026", time: "2:00 PM – 5:00 PM", mode: "Offline", level: "Intermediate",
    status: "Pending", seats: 5,
    about: "Deep dive into React hooks, component architecture, React Router, and Context API. Build a full mini-project." },
  { id: "nlp", title: "NLP with Python & NLTK", instructor: "Rahul Mehta",
    date: "April 22, 2026", time: "11:00 AM – 1:00 PM", mode: "Online", level: "Intermediate",
    status: "Booked", seats: 12,
    about: "Text preprocessing, tokenization, POS tagging, sentiment analysis, and text classification with NLTK and spaCy." },
  { id: "cloud", title: "Cloud & DevOps Essentials", instructor: "Anjali Verma",
    date: "May 3, 2026", time: "9:00 AM – 12:00 PM", mode: "Online", level: "Beginner",
    status: null, seats: 20,
    about: "AWS fundamentals, CI/CD pipelines, Docker basics, and deployment workflows." },
];

const topics = [
  { id: "ml", icon: "🤖", name: "Machine Learning", desc: "Models & algorithms" },
  { id: "web", icon: "🌐", name: "Web Development", desc: "React, Node, HTML/CSS" },
  { id: "nlp", icon: "💬", name: "NLP & AI", desc: "Text & language models" },
  { id: "cloud", icon: "☁️", name: "Cloud & DevOps", desc: "AWS, CI/CD, Docker" },
  { id: "ds", icon: "📊", name: "Data Science", desc: "Pandas, SQL, EDA" },
  { id: "sys", icon: "🏗️", name: "System Design", desc: "Architecture patterns" },
];

const availableDates = [
  { day: "Mon", num: 14, slots: "8 slots", disabled: false },
  { day: "Tue", num: 15, slots: "3 slots", disabled: false },
  { day: "Wed", num: 16, slots: "Full",    disabled: true  },
  { day: "Thu", num: 17, slots: "10 slots", disabled: false },
  { day: "Fri", num: 18, slots: "5 slots", disabled: false },
  { day: "Sat", num: 19, slots: "12 slots", disabled: false },
];

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

  :root {
    --ink: #0D0F12;
    --paper: #F5F3EE;
    --accent: #E85D2F;
    --accent2: #3B82F6;
    --muted: #6B7280;
    --border: #E2DDD5;
    --white: #FFFFFF;
    --success: #059669;
    --warning: #D97706;
    --card-bg: #FFFFFF;
    --r: 10px;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: #E8E4DC;
    color: var(--ink);
    min-height: 100dvh;
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }

  #root { width: 100%; display: flex; justify-content: center; }

  .shell {
    width: 100%;
    max-width: 430px;
    min-height: 100dvh;
    background: var(--paper);
    position: relative;
    overflow: hidden;
    box-shadow: 0 0 60px rgba(0,0,0,.15);
  }

  /* ── SCREEN ── */
  .screen {
    display: flex;
    flex-direction: column;
    min-height: 100dvh;
    animation: fadeUp .22s ease both;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── HEADER ── */
  .hdr {
    background: var(--ink);
    color: var(--white);
    padding: 14px 16px;
    display: flex;
    align-items: center;
    gap: 12px;
    position: sticky;
    top: 0;
    z-index: 20;
  }

  .hdr-title {
    font-family: 'Syne', sans-serif;
    font-size: 16px;
    font-weight: 700;
    flex: 1;
    letter-spacing: -.2px;
  }

  .back-btn {
    background: rgba(255,255,255,.12);
    border: none;
    color: #fff;
    width: 32px; height: 32px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 15px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  /* ── CONTENT ── */
  .content {
    flex: 1;
    overflow-y: auto;
    padding-bottom: 90px;
  }

  /* ── BOTTOM NAV ── */
  .bnav {
    position: fixed;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    max-width: 430px;
    background: var(--ink);
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    padding: 10px 0 max(14px, env(safe-area-inset-bottom));
    z-index: 100;
  }

  .bnav-btn {
    display: flex; flex-direction: column; align-items: center; gap: 3px;
    background: none; border: none; cursor: pointer;
    color: rgba(255,255,255,.4);
    font-size: 10px; font-family: 'DM Sans', sans-serif;
    font-weight: 500; min-height: 44px; transition: color .15s;
  }
  .bnav-btn.active { color: var(--accent); }
  .bnav-btn span:first-child { font-size: 18px; }

  /* ── DASHBOARD ── */
  .dash-hero {
    background: var(--ink);
    color: white;
    padding: 28px 20px 36px;
  }
  .dash-greeting { font-size: 13px; color: rgba(255,255,255,.5); margin-bottom: 4px; }
  .dash-name {
    font-family: 'Syne', sans-serif;
    font-size: 26px;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 20px;
  }
  .dash-stats {
    display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px;
  }
  .stat-box {
    background: rgba(255,255,255,.08);
    border-radius: 10px;
    padding: 12px 10px;
    text-align: center;
  }
  .stat-num {
    font-family: 'Syne', sans-serif;
    font-size: 22px; font-weight: 800;
    color: var(--accent);
  }
  .stat-lbl { font-size: 10px; color: rgba(255,255,255,.5); margin-top: 2px; }

  .section {
    padding: 20px 16px 0;
  }
  .section-hdr {
    font-family: 'Syne', sans-serif;
    font-size: 14px; font-weight: 700;
    letter-spacing: .3px;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 12px;
    display: flex; justify-content: space-between; align-items: center;
  }
  .see-all {
    background: none; border: none; color: var(--accent); font-size: 12px;
    font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif;
  }

  .quick-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
    padding: 16px;
  }
  .quick-card {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px;
    cursor: pointer;
    transition: transform .12s, box-shadow .12s;
    display: flex; flex-direction: column; gap: 6px;
  }
  .quick-card:hover { transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,.08); }
  .quick-icon { font-size: 24px; }
  .quick-name { font-size: 13px; font-weight: 600; }
  .quick-desc { font-size: 11px; color: var(--muted); }

  /* ── WORKSHOP CARD ── */
  .wcard {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 10px;
    cursor: pointer;
    transition: transform .12s, box-shadow .12s;
  }
  .wcard:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,.08); }
  .wcard-title { font-family: 'Syne', sans-serif; font-size: 15px; font-weight: 700; margin-bottom: 4px; line-height: 1.3; }
  .wcard-meta { font-size: 12px; color: var(--muted); margin-bottom: 10px; }
  .wcard-tags { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px; }
  .wcard-btn {
    width: 100%; background: var(--ink); color: #fff; border: none;
    padding: 10px 16px; border-radius: 8px; font-size: 13px; font-weight: 600;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
  }

  /* ── BADGE ── */
  .badge {
    display: inline-flex; align-items: center;
    padding: 3px 9px; border-radius: 20px; font-size: 11px; font-weight: 600;
  }
  .badge-booked      { background: #DBEAFE; color: #1E40AF; }
  .badge-pending     { background: #FEF3C7; color: #92400E; }
  .badge-completed   { background: #D1FAE5; color: #065F46; }
  .badge-online      { background: #EDE9FE; color: #5B21B6; }
  .badge-offline     { background: #F3F4F6; color: #374151; }
  .badge-beginner    { background: #ECFDF5; color: #047857; }
  .badge-intermediate{ background: #FFF7ED; color: #9A3412; }

  /* ── DETAIL ── */
  .detail-hero {
    background: var(--ink); color: white; padding: 24px 20px;
  }
  .detail-title {
    font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800;
    line-height: 1.2; margin-bottom: 6px;
  }
  .detail-instructor { font-size: 13px; color: rgba(255,255,255,.6); margin-bottom: 14px; }
  .detail-tags { display: flex; gap: 8px; flex-wrap: wrap; }

  .info-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 10px;
    padding: 16px;
  }
  .info-box {
    background: var(--card-bg); border: 1px solid var(--border);
    border-radius: 10px; padding: 14px;
  }
  .info-lbl { font-size: 10px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .5px; color: var(--muted); margin-bottom: 4px; }
  .info-val { font-size: 14px; font-weight: 600; }

  .about-box { margin: 0 16px 16px; background: var(--card-bg);
    border: 1px solid var(--border); border-radius: 10px; padding: 16px; }
  .about-title { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700;
    text-transform: uppercase; letter-spacing: .4px; color: var(--muted); margin-bottom: 8px; }
  .about-text { font-size: 14px; line-height: 1.6; color: #374151; }

  .sticky-footer {
    position: sticky; bottom: 80px; padding: 12px 16px;
    background: var(--paper); border-top: 1px solid var(--border);
  }

  /* ── WIZARD ── */
  .progress-rail {
    display: flex; gap: 5px; padding: 14px 16px 0;
  }
  .rail-seg {
    height: 3px; flex: 1; border-radius: 2px; background: var(--border);
    transition: background .25s;
  }
  .rail-seg.done { background: var(--ink); }
  .rail-seg.active { background: var(--accent); }

  .step-intro { padding: 20px 16px 16px; }
  .step-intro h2 { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 800; margin-bottom: 4px; }
  .step-intro p { font-size: 13px; color: var(--muted); }

  .topic-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; padding: 0 16px; }
  .topic-card {
    border: 1.5px solid var(--border); border-radius: var(--r); padding: 14px 12px;
    cursor: pointer; background: var(--card-bg); text-align: left;
    display: flex; flex-direction: column; gap: 3px;
    transition: border-color .12s, background .12s;
  }
  .topic-card.selected { border-color: var(--accent); background: #FFF5F2; }
  .topic-icon { font-size: 22px; }
  .topic-name { font-size: 13px; font-weight: 700; }
  .topic-desc { font-size: 11px; color: var(--muted); }

  .date-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; padding: 0 16px; }
  .date-card {
    border: 1.5px solid var(--border); border-radius: var(--r); padding: 12px 8px;
    cursor: pointer; background: var(--card-bg); text-align: center;
    display: flex; flex-direction: column; gap: 2px;
    transition: border-color .12s, background .12s;
  }
  .date-card.selected { border-color: var(--accent); background: #FFF5F2; }
  .date-card.disabled { opacity: .4; cursor: not-allowed; }
  .date-day { font-size: 10px; color: var(--muted); font-weight: 600; text-transform: uppercase; }
  .date-num { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; }
  .date-slots { font-size: 10px; font-weight: 600; }
  .date-slots.avail { color: var(--success); }
  .date-slots.full  { color: var(--muted); }

  .form-group { padding: 0 16px; margin-bottom: 14px; }
  .form-group label { font-size: 12px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .4px; color: var(--muted); display: block; margin-bottom: 6px; }
  .form-group input, .form-group textarea {
    width: 100%; padding: 11px 13px; border: 1.5px solid var(--border);
    border-radius: 8px; font-size: 14px; font-family: 'DM Sans', sans-serif; outline: none;
    background: var(--card-bg); transition: border-color .12s;
  }
  .form-group input:focus, .form-group textarea:focus { border-color: var(--accent); }
  .form-group textarea { resize: vertical; min-height: 80px; }
  .field-err { font-size: 11px; color: #EF4444; display: block; margin-top: 4px; }

  .wiz-footer {
    padding: 14px 16px;
    display: flex; gap: 10px;
    border-top: 1px solid var(--border);
    background: var(--paper);
    position: sticky; bottom: 80px;
  }

  .btn-primary {
    flex: 1; background: var(--ink); color: #fff; border: none;
    padding: 13px 20px; border-radius: 9px; font-size: 14px; font-weight: 600;
    cursor: pointer; font-family: 'DM Sans', sans-serif; min-height: 44px;
    transition: background .12s;
  }
  .btn-primary:hover { background: #1a1e25; }
  .btn-primary.accent { background: var(--accent); }
  .btn-primary.accent:hover { background: #D4522A; }
  .btn-secondary {
    background: var(--border); color: var(--ink); border: none;
    padding: 13px 20px; border-radius: 9px; font-size: 14px; font-weight: 600;
    cursor: pointer; font-family: 'DM Sans', sans-serif; min-height: 44px;
    transition: background .12s;
  }

  .review-card { background: var(--card-bg); border: 1px solid var(--border);
    border-radius: 12px; margin: 0 16px; }
  .review-row {
    display: flex; justify-content: space-between; align-items: flex-start;
    padding: 12px 14px; border-bottom: 1px solid #F3F4F6;
  }
  .review-row:last-child { border-bottom: none; }
  .rlabel { font-size: 11px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .4px; color: var(--muted); }
  .rvalue { font-size: 13px; font-weight: 600; text-align: right; max-width: 60%; }

  .notice {
    margin: 12px 16px; background: #FFFBEB; border: 1px solid #FDE68A;
    border-radius: 9px; padding: 10px 12px; font-size: 12px; color: #92400E; line-height: 1.5;
  }

  .success-screen {
    display: flex; flex-direction: column; align-items: center;
    text-align: center; padding: 64px 24px; gap: 16px;
    min-height: 100dvh;
  }
  .success-icon { font-size: 56px; }
  .success-screen h2 {
    font-family: 'Syne', sans-serif; font-size: 24px; font-weight: 800;
  }
  .success-screen p { font-size: 14px; color: var(--muted); line-height: 1.65; max-width: 280px; }

  /* ── PROFILE ── */
  .profile-hero {
    background: var(--ink); padding: 32px 20px 24px;
    display: flex; flex-direction: column; align-items: center; gap: 12px;
  }
  .avatar {
    width: 72px; height: 72px; border-radius: 50%;
    background: var(--accent); display: flex; align-items: center; justify-content: center;
    font-family: 'Syne', sans-serif; font-size: 26px; font-weight: 800; color: white;
  }
  .profile-name { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 800; color: white; }
  .profile-email { font-size: 13px; color: rgba(255,255,255,.5); }

  .menu-list { padding: 16px; display: flex; flex-direction: column; gap: 8px; }
  .menu-item {
    background: var(--card-bg); border: 1px solid var(--border);
    border-radius: 10px; padding: 14px 16px;
    display: flex; align-items: center; gap: 12px; cursor: pointer;
  }
  .menu-icon { font-size: 18px; }
  .menu-lbl { font-size: 14px; font-weight: 600; flex: 1; }
  .menu-arr { color: var(--muted); font-size: 14px; }

  /* ── FILTER BAR ── */
  .filter-bar {
    display: flex; gap: 8px; padding: 14px 16px;
    overflow-x: auto; scrollbar-width: none;
  }
  .filter-bar::-webkit-scrollbar { display: none; }
  .chip {
    flex-shrink: 0; padding: 6px 14px; border-radius: 20px; font-size: 12px; font-weight: 600;
    border: 1.5px solid var(--border); background: var(--card-bg); cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all .12s;
  }
  .chip.active { background: var(--ink); color: white; border-color: var(--ink); }

  .empty-state {
    text-align: center; padding: 48px 24px; color: var(--muted);
  }
  .empty-icon { font-size: 40px; margin-bottom: 12px; }
  .empty-text { font-size: 14px; }
`;

// ─── COMPONENTS ──────────────────────────────────────────────────────────────
function Badge({ status }) {
  const cls = `badge badge-${status?.toLowerCase()}`;
  return <span className={cls}>{status}</span>;
}

function Header({ title, showBack, onBack }) {
  return (
    <div className="hdr">
      {showBack && <button className="back-btn" onClick={onBack}>←</button>}
      <span className="hdr-title">{title}</span>
    </div>
  );
}

function BottomNav({ current, nav }) {
  const items = [
    { id: "dashboard", label: "Home",      icon: "🏠" },
    { id: "book",      label: "Book",      icon: "➕" },
    { id: "workshops", label: "Workshops", icon: "📋" },
    { id: "profile",   label: "Profile",   icon: "👤" },
  ];
  return (
    <nav className="bnav">
      {items.map(it => (
        <button
          key={it.id}
          className={`bnav-btn ${current === it.id ? "active" : ""}`}
          onClick={() => nav(it.id === "book" ? { page: "book" } : { page: it.id })}
        >
          <span>{it.icon}</span>
          <span>{it.label}</span>
        </button>
      ))}
    </nav>
  );
}

// ─── PAGES ───────────────────────────────────────────────────────────────────
function Dashboard({ nav }) {
  const booked = workshops.filter(w => w.status === "Booked").length;
  const upcoming = workshops.filter(w => w.status === "Pending").length;

  return (
    <div className="screen">
      <div className="dash-hero">
        <p className="dash-greeting">Good morning 👋</p>
        <h1 className="dash-name">Ravi Kumar</h1>
        <div className="dash-stats">
          <div className="stat-box">
            <div className="stat-num">{booked}</div>
            <div className="stat-lbl">Booked</div>
          </div>
          <div className="stat-box">
            <div className="stat-num">{upcoming}</div>
            <div className="stat-lbl">Pending</div>
          </div>
          <div className="stat-box">
            <div className="stat-num">4</div>
            <div className="stat-lbl">Total</div>
          </div>
        </div>
      </div>

      <div className="content">
        <div className="section">
          <div className="section-hdr">
            <span>Quick Book</span>
          </div>
        </div>
        <div className="quick-grid">
          {topics.slice(0, 4).map(t => (
            <div key={t.id} className="quick-card" onClick={() => nav({ page: "book", topicId: t.id })}>
              <span className="quick-icon">{t.icon}</span>
              <span className="quick-name">{t.name}</span>
              <span className="quick-desc">{t.desc}</span>
            </div>
          ))}
        </div>

        <div className="section">
          <div className="section-hdr">
            <span>My Workshops</span>
            <button className="see-all" onClick={() => nav({ page: "workshops" })}>See all →</button>
          </div>
          {workshops.filter(w => w.status).map(w => (
            <div key={w.id} className="wcard" onClick={() => nav({ page: "detail", workshopId: w.id })}>
              <div className="wcard-title">{w.title}</div>
              <div className="wcard-meta">📅 {w.date} · {w.time}</div>
              <div className="wcard-tags">
                {w.status && <Badge status={w.status} />}
                <Badge status={w.mode} />
                <Badge status={w.level} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav current="dashboard" nav={nav} />
    </div>
  );
}

// ─── FILTERING ────────────────────────────────────────────────────────────────
// Each filter entry declares which workshop field and value it matches against.
// Adding a new filter = one new object here. No other code needs to change.
const FILTERS = [
  { label: "All" },
  { label: "Booked",       field: "status", value: "Booked"       },
  { label: "Pending",      field: "status", value: "Pending"       },
  { label: "Online",       field: "mode",   value: "Online"        },
  { label: "Offline",      field: "mode",   value: "Offline"       },
  { label: "Beginner",     field: "level",  value: "Beginner"      },
  { label: "Intermediate", field: "level",  value: "Intermediate"  },
];

function applyFilter(list, filterLabel) {
  if (filterLabel === "All") return list;
  const rule = FILTERS.find(f => f.label === filterLabel);
  if (!rule) return list;
  return list.filter(w => w[rule.field] === rule.value);
}

function WorkshopList({ nav }) {
  const [filter, setFilter] = useState("All");

  // ── IMPROVED FILTERING: driven by FILTERS config, not ad-hoc string matching ──
  const filtered = applyFilter(workshops, filter);

  return (
    <div className="screen">
      <Header title="All Workshops" />
      <div className="content">
        <div className="filter-bar">
          {FILTERS.map(f => (
            <button
              key={f.label}
              className={`chip ${filter === f.label ? "active" : ""}`}
              onClick={() => setFilter(f.label)}
            >
              {f.label}
              {/* ── BONUS: show count on active non-All filter ── */}
              {filter === f.label && f.label !== "All" && (
                <span style={{
                  marginLeft: 5,
                  background: "rgba(255,255,255,0.25)",
                  borderRadius: 10,
                  padding: "1px 6px",
                  fontSize: 10,
                }}>
                  {filtered.length}
                </span>
              )}
            </button>
          ))}
        </div>
        {/* ── BONUS: result count row ── */}
        <div style={{
          padding: "0 16px 10px",
          fontSize: 12,
          color: "var(--muted)",
          fontWeight: 500,
        }}>
          {filter === "All"
            ? `${filtered.length} workshops`
            : `${filtered.length} result${filtered.length !== 1 ? "s" : ""} for "${filter}"`}
        </div>

        <div style={{ padding: "0 16px" }}>
          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🔍</div>
              <div className="empty-text">No workshops match this filter.</div>
            </div>
          ) : filtered.map(w => (
            <div key={w.id} className="wcard" onClick={() => nav({ page: "detail", workshopId: w.id })}>
              <div className="wcard-title">{w.title}</div>
              <div className="wcard-meta">📅 {w.date} · {w.time}</div>
              <div style={{ marginBottom: 6, fontSize: 12, color: "var(--muted)" }}>
                👤 {w.instructor} · 💺 {w.seats} seats left
              </div>
              <div className="wcard-tags">
                {w.status && <Badge status={w.status} />}
                <Badge status={w.mode} />
                <Badge status={w.level} />
              </div>
              <button className="wcard-btn">View Details →</button>
            </div>
          ))}
        </div>
      </div>
      <BottomNav current="workshops" nav={nav} />
    </div>
  );
}

function WorkshopDetail({ workshopId, nav }) {
  const w = workshops.find(x => x.id === workshopId) || workshops[0];

  return (
    <div className="screen">
      <Header title="Workshop Details" showBack onBack={() => nav({ page: "workshops" })} />
      <div className="content">
        <div className="detail-hero">
          <div className="detail-title">{w.title}</div>
          <div className="detail-instructor">👤 {w.instructor}</div>
          <div className="detail-tags">
            {w.status && <Badge status={w.status} />}
            <Badge status={w.mode} />
            <Badge status={w.level} />
          </div>
        </div>

        <div className="info-grid">
          <div className="info-box">
            <div className="info-lbl">Date</div>
            <div className="info-val">{w.date}</div>
          </div>
          <div className="info-box">
            <div className="info-lbl">Time</div>
            <div className="info-val">{w.time}</div>
          </div>
          <div className="info-box">
            <div className="info-lbl">Mode</div>
            <div className="info-val">{w.mode}</div>
          </div>
          <div className="info-box">
            <div className="info-lbl">Seats Left</div>
            <div className="info-val">{w.seats}</div>
          </div>
        </div>

        <div className="about-box">
          <div className="about-title">About</div>
          <div className="about-text">{w.about}</div>
        </div>
      </div>

      {!w.status && (
        <div className="sticky-footer">
          <button className="btn-primary accent" onClick={() => nav({ page: "book", topicId: w.id })}>
            Book This Workshop →
          </button>
        </div>
      )}
      <BottomNav current="workshops" nav={nav} />
    </div>
  );
}

// ─── BOOKING WIZARD ───────────────────────────────────────────────────────────
const STEPS = ["Select Topic", "Choose Date", "Your Details", "Review & Confirm"];
const DRAFT_KEY = "bookingDraft";

// ── SAVE DRAFT: safely read from localStorage, fall back to defaults on any error ──
function loadDraft(initialTopic) {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Guard: must be a plain object with at least one expected key
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function saveDraft(form) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
  } catch {
    // localStorage unavailable (private browsing quota, etc.) — fail silently
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch { /* ignore */ }
}

function BookingWizard({ initialTopic, nav }) {
  // ── SAVE DRAFT: restore persisted draft on mount; initialTopic takes precedence
  //    for topic so deep-linking from a workshop card still works correctly ──
  const [form, setForm] = useState(() => {
    const draft = loadDraft();
    if (draft) {
      return {
        topic: initialTopic || draft.topic || null,
        date:  draft.date  || null,
        name:  draft.name  || "",
        email: draft.email || "",
        phone: draft.phone || "",
        notes: draft.notes || "",
      };
    }
    return { topic: initialTopic || null, date: null, name: "", email: "", phone: "", notes: "" };
  });

  // ── SAVE DRAFT: when restoring a draft, advance past step 0 if topic is already set ──
  const [step, setStep] = useState(() => {
    if (initialTopic) return 1;
    const draft = loadDraft();
    return draft?.topic ? 1 : 0;
  });

  const [errors, setErrors] = useState({});
  const [done, setDone] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false); // UX hint state

  // ── SAVE DRAFT: persist form to localStorage on every meaningful change ──
  useEffect(() => {
    // Don't bother saving if nothing has been filled in yet
    const hasData = form.topic || form.date || form.name || form.email;
    if (!hasData) return;
    saveDraft(form);
    setDraftSaved(true);
    const t = setTimeout(() => setDraftSaved(false), 1800);
    return () => clearTimeout(t);
  }, [form]);

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (step === 0 && !form.topic) e.topic = "Please select a topic.";
    if (step === 1 && !form.date)  e.date  = "Please select a date.";
    if (step === 2) {
      if (!form.name.trim())  e.name  = "Name is required.";
      if (!form.email.trim()) e.email = "Email is required.";
      else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (!validate()) return;
    if (step === 3) {
      // ── SAVE DRAFT: clear persisted draft on confirmed booking ──
      clearDraft();
      setDone(true);
      return;
    }
    setStep(s => s + 1);
  };

  const back = () => {
    if (step === 0) { nav({ page: "workshops" }); return; }
    setStep(s => s - 1);
  };

  if (done) {
    const topicName = topics.find(t => t.id === form.topic)?.name;
    return (
      <div className="screen">
        <div className="success-screen">
          <div className="success-icon">✅</div>
          <h2>You're confirmed!</h2>
          <p>
            Your spot for <strong>{topicName}</strong> on <strong>April {form.date}</strong> is reserved.
            A confirmation will be sent to {form.email}.
          </p>
          <button className="btn-primary accent" style={{ maxWidth: 280 }}
            onClick={() => nav({ page: "dashboard" })}>
            Back to Dashboard
          </button>
        </div>
        <BottomNav current="book" nav={nav} />
      </div>
    );
  }

  return (
    <div className="screen">
      <Header title={STEPS[step]} showBack onBack={back} />

      {/* ── SAVE DRAFT: subtle "Draft saved" toast in the header area ── */}
      <div style={{
        height: draftSaved ? 32 : 0,
        overflow: "hidden",
        transition: "height .2s ease",
        background: "#F0FDF4",
        borderBottom: draftSaved ? "1px solid #BBF7D0" : "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        fontSize: 12,
        fontWeight: 600,
        color: "#166534",
      }}>
        ✓ Draft saved
      </div>

      <div className="progress-rail">
        {STEPS.map((_, i) => (
          <div key={i} className={`rail-seg ${i < step ? "done" : i === step ? "active" : ""}`} />
        ))}
      </div>

      <div className="content">
        {step === 0 && (
          <>
            <div className="step-intro">
              <h2>What do you want to learn?</h2>
              <p>Choose a topic that interests you</p>
            </div>
            <div className="topic-grid">
              {topics.map(t => (
                <button key={t.id}
                  className={`topic-card ${form.topic === t.id ? "selected" : ""}`}
                  onClick={() => upd("topic", t.id)}>
                  <span className="topic-icon">{t.icon}</span>
                  <span className="topic-name">{t.name}</span>
                  <span className="topic-desc">{t.desc}</span>
                </button>
              ))}
            </div>
            {errors.topic && <span className="field-err" style={{ padding: "8px 16px", display: "block" }}>{errors.topic}</span>}
          </>
        )}

        {step === 1 && (
          <>
            <div className="step-intro">
              <h2>Pick a date</h2>
              <p>Available slots for April 2026</p>
            </div>
            <div className="date-grid">
              {availableDates.map(d => (
                <button key={d.num}
                  className={`date-card ${form.date === d.num ? "selected" : ""} ${d.disabled ? "disabled" : ""}`}
                  onClick={() => !d.disabled && upd("date", d.num)}
                  disabled={d.disabled}>
                  <span className="date-day">{d.day}</span>
                  <span className="date-num">{d.num}</span>
                  <span className={`date-slots ${d.disabled ? "full" : "avail"}`}>{d.slots}</span>
                </button>
              ))}
            </div>
            {errors.date && <span className="field-err" style={{ padding: "8px 16px", display: "block" }}>{errors.date}</span>}
          </>
        )}

        {step === 2 && (
          <>
            <div className="step-intro">
              <h2>Your details</h2>
              <p>We'll use this to confirm your booking</p>
            </div>
            {[
              { id: "name",  label: "Full Name *",       type: "text",  ph: "e.g. Ravi Kumar Gupta" },
              { id: "email", label: "Email Address *",   type: "email", ph: "you@vit.ac.in" },
              { id: "phone", label: "Phone Number",      type: "tel",   ph: "+91 98765 43210" },
            ].map(f => (
              <div className="form-group" key={f.id}>
                <label>{f.label}</label>
                <input type={f.type} placeholder={f.ph} value={form[f.id]}
                  onChange={e => upd(f.id, e.target.value)} />
                {errors[f.id] && <span className="field-err">{errors[f.id]}</span>}
              </div>
            ))}
            <div className="form-group">
              <label>Questions or notes?</label>
              <textarea placeholder="Optional…" value={form.notes}
                onChange={e => upd("notes", e.target.value)} />
            </div>
          </>
        )}

        {step === 3 && (() => {
          const topicName = topics.find(t => t.id === form.topic)?.name || "—";
          const rows = [
            { label: "Topic", value: topicName },
            { label: "Date",  value: `April ${form.date}, 2026` },
            { label: "Name",  value: form.name },
            { label: "Email", value: form.email },
            form.phone && { label: "Phone", value: form.phone },
            form.notes && { label: "Notes", value: form.notes },
          ].filter(Boolean);
          return (
            <>
              <div className="step-intro">
                <h2>Review your booking</h2>
                <p>Check everything before confirming</p>
              </div>
              <div className="review-card">
                {rows.map(r => (
                  <div className="review-row" key={r.label}>
                    <span className="rlabel">{r.label}</span>
                    <span className="rvalue">{r.value}</span>
                  </div>
                ))}
              </div>
              <div className="notice">
                ⚠️ By confirming, you agree to attend the full session. Cancellations must be made 24 hrs in advance.
              </div>
            </>
          );
        })()}
      </div>

      <div className="wiz-footer">
        {step > 0 && <button className="btn-secondary" onClick={back}>Back</button>}
        <button className={`btn-primary ${step === 3 ? "accent" : ""}`} onClick={next}>
          {step === 3 ? "Confirm Booking ✓" : "Next →"}
        </button>
      </div>
      <BottomNav current="book" nav={nav} />
    </div>
  );
}

function Profile({ nav }) {
  const menuItems = [
    { icon: "📅", label: "My Bookings" },
    { icon: "🔔", label: "Notifications" },
    { icon: "🛡️", label: "Privacy & Security" },
    { icon: "🎓", label: "My Certificates" },
    { icon: "❓", label: "Help & Support" },
    { icon: "🚪", label: "Sign Out" },
  ];

  return (
    <div className="screen">
      <Header title="Profile" />
      <div className="content">
        <div className="profile-hero">
          <div className="avatar">R</div>
          <div className="profile-name">Ravi Kumar Gupta</div>
          <div className="profile-email">ravi.kumar@vit.ac.in</div>
        </div>
        <div className="menu-list">
          {menuItems.map(item => (
            <div className="menu-item" key={item.label}>
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-lbl">{item.label}</span>
              <span className="menu-arr">›</span>
            </div>
          ))}
        </div>
      </div>
      <BottomNav current="profile" nav={nav} />
    </div>
  );
}

// ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [route, setRoute] = useState({ page: "dashboard" });

  const nav = (r) => setRoute(r);

  return (
    <>
      <style>{styles}</style>
      <div className="shell">
        {route.page === "dashboard" && <Dashboard nav={nav} />}
        {route.page === "workshops" && <WorkshopList nav={nav} />}
        {route.page === "detail"    && <WorkshopDetail workshopId={route.workshopId} nav={nav} />}
        {route.page === "book"      && <BookingWizard initialTopic={route.topicId} nav={nav} />}
        {route.page === "profile"   && <Profile nav={nav} />}
      </div>
    </>
  );
}
