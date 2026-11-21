/* ============================================================
   AJEET OS – Personal Desktop 2027
   Vanilla JavaScript • Owner: Ajeet Kumar • Assistant: Riya AI
   All data saves in this browser (localStorage, prefix "ajeetos.")
   ============================================================ */
'use strict';

/* ---------------- helpers ---------------- */
const $  = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
const store = {
  get(k, fb){ try{ const v = localStorage.getItem('ajeetos.' + k); return v ? JSON.parse(v) : fb; }catch(e){ return fb; } },
  set(k, v){ try{ localStorage.setItem('ajeetos.' + k, JSON.stringify(v)); }catch(e){} },
  del(k){ localStorage.removeItem('ajeetos.' + k); }
};
const uid = () => 'id' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

function toast(msg){
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  $('#toasts').appendChild(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 350); }, 2600);
}
function notify(title, body){
  const list = store.get('notifs', []);
  list.unshift({ title, body, at: Date.now() });
  store.set('notifs', list.slice(0, 20));
  renderNotifs();
}
function fmtTime(ts){ return new Date(ts).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}); }

/* ---------------- settings ---------------- */
const settings = Object.assign(
  { accent:'#38bdf8', glass:72, light:false, city:'New Delhi' },
  store.get('settings', {})
);
function saveSettings(){ store.set('settings', settings); }
function applySettings(){
  document.documentElement.style.setProperty('--accent', settings.accent);
  document.documentElement.style.setProperty('--glass-alpha', settings.glass / 100);
  document.body.classList.toggle('light', !!settings.light);
}

/* ---------------- app registry ---------------- */
const APPS = {
  thispc:    { title:'This PC',        icon:'🖥️', tpl:'tpl-thispc' },
  recycle:   { title:'Recycle Bin',    icon:'🗑️', tpl:'tpl-recycle' },
  files:     { title:'My Files',       icon:'📁', tpl:'tpl-files' },
  browser:   { title:'Browser',        icon:'🌐', tpl:'tpl-browser' },
  notepad:   { title:'Notepad',        icon:'📝', tpl:'tpl-notepad' },
  calculator:{ title:'Calculator',     icon:'🧮', tpl:'tpl-calculator' },
  calendar:  { title:'Calendar',       icon:'📅', tpl:'tpl-calendar' },
  settings:  { title:'Settings',       icon:'⚙️', tpl:'tpl-settings' },
  images:    { title:'Image Viewer',   icon:'🖼️', tpl:'tpl-images' },
  music:     { title:'Music Player',   icon:'🎵', tpl:'tpl-music' },
  video:     { title:'Video Player',   icon:'🎬', tpl:'tpl-video' },
  pdf:       { title:'PDF Reader',     icon:'📕', tpl:'tpl-pdf' },
  appstore:  { title:'App Store',      icon:'🛍️', tpl:'tpl-appstore' },
  games:     { title:'Games',          icon:'🎮', tpl:'tpl-games' },
  tools:     { title:'Tools',          icon:'🧰', tpl:'tpl-tools' },
  moreapps:  { title:'More Apps',      icon:'▦',  tpl:'tpl-moreapps' },
  tasks:     { title:'Task Manager',   icon:'✅', tpl:'tpl-tasks' },
  paint:     { title:'Paint',          icon:'🎨', tpl:'tpl-paint' },
  social:    { title:'Social Hub',     icon:'📸', tpl:'tpl-social' },
  backup:    { title:'Backup Manager', icon:'🛡️', tpl:'tpl-backup' },
  about:     { title:'About AJEET OS', icon:'ℹ️', tpl:'tpl-about' },
  /* ---- mere apps, games & websites (bahar ke link — naye tab me khulte hain) ---- */
  uthja:        { title:'Uth Ja Bhai — Drop Game',       icon:'💥', url:'https://theajeetbhai.github.io/ajeetcnc.github.io/uth-ja-bhai/' },
  thappad:      { title:'Thappad Queen — Slap Game',     icon:'👑', url:'https://theajeetbhai.github.io/ajeetcnc.github.io/thappad-queen/' },
  gulel:        { title:'Gulel King — Slingshot Game',   icon:'🎯', url:'https://theajeetbhai.github.io/ajeetcnc.github.io/gulel-king/' },
  bhaagbhai:    { title:'Bhaag Bhai — Endless Chase',    icon:'🏃', url:'https://theajeetbhai.github.io/ajeetcnc.github.io/bhaag-bhai/' },
  carracing:    { title:'Car Racing Game',               icon:'🏎️', url:'https://theajeetbhai.github.io/ajeetcnc.github.io/game/' },
  riya:         { title:'Riya AI Assistant',             icon:'🤖', url:'https://theajeetbhai.github.io/ajeetcnc.github.io/riya-assistant/' },
  riyasuper:    { title:'Riya — Super AI',               icon:'⚡', url:'https://theajeetbhai.github.io/ajeetcnc.github.io/riya-super-ai/' },
  neuralguard:  { title:'NEURAL GUARD',                  icon:'🛡️', url:'https://theajeetbhai.github.io/ajeetcnc.github.io/neural-guard/' },
  maker360:     { title:'360 Image Maker',               icon:'🌐', url:'https://theajeetbhai.github.io/ajeetcnc.github.io/360-maker/' },
  ultracar:     { title:'Ultra Realistic Car Racing',    icon:'🚗', url:'https://theajeetbhai.github.io/ajeetcnc.github.io/ultra-car-racing/' },
  attendpro:    { title:'AttendPro',                     icon:'🕒', url:'https://theajeetbhai.github.io/ajeetcnc.github.io/attendpro/' },
  attendproweb: { title:'AttendPro Website',             icon:'🌐', url:'https://theajeetbhai.github.io/ajeetcnc.github.io/attendpro-website/' },
  personal:     { title:'Personal Website',              icon:'👤', url:'https://theajeetbhai.github.io/ajeetcnc.github.io/personal/' },
  github:       { title:'GitHub — @Theajeetbhai',        icon:'🐙', url:'https://github.com/Theajeetbhai' }
};
/* "🚀 My Apps, Games & Websites" group — desktop, Start panel aur More Apps me ek saath */
const MY_APPS = ['uthja', 'thappad', 'gulel', 'bhaagbhai', 'carracing', 'riya', 'riyasuper', 'neuralguard', 'maker360', 'ultracar', 'attendpro', 'attendproweb', 'personal', 'github'];
const APP_ALIASES = { note:'notepad', notes:'notepad', calc:'calculator', cal:'calendar', file:'files', 'my files':'files', paint:'paint', task:'tasks', tasks:'tasks', 'social hub':'social', settings:'settings', browser:'browser', calendar:'calendar', calculator:'calculator', notepad:'notepad', games:'games', music:'music', video:'video', images:'images', pdf:'pdf',
  gallery:'images', photos:'images', photo:'images', tasveer:'images', tasveerein:'images', radio:'music', hisaab:'calculator', ganit:'calculator', game:'games', khel:'games', setting:'settings', folder:'files', 'file manager':'files', computer:'thispc', store:'appstore', dukaan:'appstore', 'recycle bin':'recycle', kachra:'recycle', backup:'backup', about:'about', 'app store':'appstore', 'task manager':'tasks', kaam:'tasks', paint:'paint',
  'uth ja bhai':'uthja', 'thappad queen':'thappad', thappad:'thappad', 'gulel king':'gulel', gulel:'gulel', 'bhaag bhai':'bhaagbhai', bhaag:'bhaagbhai', 'car racing':'carracing', 'riya assistant':'riya', 'super ai':'riyasuper', 'neural guard':'neuralguard', '360':'maker360', '360 maker':'maker360', panorama:'maker360', 'ultra car racing':'ultracar', 'ultra racing':'ultracar', ultracar:'ultracar', attendpro:'attendpro', 'personal website':'personal', github:'github' };


/* ---------------- real SVG icons (emoji nahi) ---------------- */
const ICONS = {"thispc": "<svg viewBox=\"0 0 48 48\"><defs><linearGradient id=\"gPc\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#7dd3fc\"/><stop offset=\"1\" stop-color=\"#2563eb\"/></linearGradient></defs><rect x=\"6\" y=\"7\" width=\"36\" height=\"27\" rx=\"3.5\" fill=\"url(#gPc)\"/><rect x=\"9.5\" y=\"10.5\" width=\"29\" height=\"20\" rx=\"2\" fill=\"#dbeafe\" opacity=\".55\"/><rect x=\"21\" y=\"34\" width=\"6\" height=\"5.5\" fill=\"#94a3b8\"/><rect x=\"13\" y=\"39.5\" width=\"22\" height=\"3.2\" rx=\"1.6\" fill=\"#64748b\"/></svg>", "recycle": "<svg viewBox=\"0 0 48 48\"><defs><linearGradient id=\"gRc\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#4ade80\"/><stop offset=\"1\" stop-color=\"#16a34a\"/></linearGradient></defs><path d=\"M13 15h22l-1.8 22.2A3.5 3.5 0 0 1 29.7 40.5H18.3a3.5 3.5 0 0 1-3.5-3.3L13 15z\" fill=\"url(#gRc)\"/><rect x=\"10\" y=\"11\" width=\"28\" height=\"4.4\" rx=\"2.2\" fill=\"#15803d\"/><rect x=\"19\" y=\"6.8\" width=\"10\" height=\"4\" rx=\"2\" fill=\"#15803d\"/><path d=\"M29.5 24.5a6 6 0 1 1-1.6-4.4\" fill=\"none\" stroke=\"#fff\" stroke-width=\"2.6\" stroke-linecap=\"round\"/><path d=\"M29.9 16.9l.4 4-3.9-1z\" fill=\"#fff\"/></svg>", "files": "<svg viewBox=\"0 0 48 48\"><defs><linearGradient id=\"gFo\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#fcd34d\"/><stop offset=\"1\" stop-color=\"#f59e0b\"/></linearGradient></defs><path d=\"M5 13.5A3.5 3.5 0 0 1 8.5 10h11l4.5 5.5h15.5A3.5 3.5 0 0 1 43 19v17.5a3.5 3.5 0 0 1-3.5 3.5h-31A3.5 3.5 0 0 1 5 36.5z\" fill=\"url(#gFo)\"/><path d=\"M5 21.5h38v15a3.5 3.5 0 0 1-3.5 3.5h-31A3.5 3.5 0 0 1 5 36.5z\" fill=\"#fde68a\"/></svg>", "browser": "<svg viewBox=\"0 0 48 48\"><defs><linearGradient id=\"gGl\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#38bdf8\"/><stop offset=\"1\" stop-color=\"#1e40af\"/></linearGradient></defs><circle cx=\"24\" cy=\"24\" r=\"17.5\" fill=\"url(#gGl)\"/><ellipse cx=\"24\" cy=\"24\" rx=\"8\" ry=\"17.5\" fill=\"none\" stroke=\"#e0f2fe\" stroke-width=\"1.8\" opacity=\".85\"/><path d=\"M6.5 24h35M9.5 15.5h29M9.5 32.5h29\" stroke=\"#e0f2fe\" stroke-width=\"1.8\" opacity=\".85\" fill=\"none\"/></svg>", "notepad": "<svg viewBox=\"0 0 48 48\"><rect x=\"11\" y=\"4.5\" width=\"26\" height=\"39\" rx=\"3\" fill=\"#fff\" stroke=\"#cbd5e1\"/><rect x=\"11\" y=\"4.5\" width=\"26\" height=\"8.5\" rx=\"3\" fill=\"#38bdf8\"/><rect x=\"15.5\" y=\"19\" width=\"17\" height=\"2.8\" rx=\"1.4\" fill=\"#94a3b8\"/><rect x=\"15.5\" y=\"25\" width=\"17\" height=\"2.8\" rx=\"1.4\" fill=\"#94a3b8\"/><rect x=\"15.5\" y=\"31\" width=\"11\" height=\"2.8\" rx=\"1.4\" fill=\"#94a3b8\"/><path d=\"M31 40.5l1.2-5L37 30.6a2.3 2.3 0 0 1 3.2 0l.7.7a2.3 2.3 0 0 1 0 3.2l-4.9 4.9z\" fill=\"#f59e0b\"/></svg>", "calculator": "<svg viewBox=\"0 0 48 48\"><rect x=\"10\" y=\"4.5\" width=\"28\" height=\"39\" rx=\"5.5\" fill=\"#1f2937\"/><rect x=\"15\" y=\"9.5\" width=\"18\" height=\"8.5\" rx=\"2\" fill=\"#a7f3d0\"/><circle cx=\"18\" cy=\"24.5\" r=\"2.4\" fill=\"#e5e7eb\"/><circle cx=\"24\" cy=\"24.5\" r=\"2.4\" fill=\"#e5e7eb\"/><circle cx=\"30\" cy=\"24.5\" r=\"2.4\" fill=\"#f59e0b\"/><circle cx=\"18\" cy=\"31.5\" r=\"2.4\" fill=\"#e5e7eb\"/><circle cx=\"24\" cy=\"31.5\" r=\"2.4\" fill=\"#e5e7eb\"/><circle cx=\"30\" cy=\"31.5\" r=\"2.4\" fill=\"#f59e0b\"/><circle cx=\"18\" cy=\"38.5\" r=\"2.4\" fill=\"#e5e7eb\"/><circle cx=\"24\" cy=\"38.5\" r=\"2.4\" fill=\"#e5e7eb\"/><circle cx=\"30\" cy=\"38.5\" r=\"2.4\" fill=\"#38bdf8\"/></svg>", "calendar": "<svg viewBox=\"0 0 48 48\"><rect x=\"7.5\" y=\"9\" width=\"33\" height=\"32\" rx=\"4\" fill=\"#fff\" stroke=\"#cbd5e1\"/><path d=\"M7.5 13a4 4 0 0 1 4-4h25a4 4 0 0 1 4 4v6h-33z\" fill=\"#ef4444\"/><rect x=\"14\" y=\"5.5\" width=\"4\" height=\"9\" rx=\"2\" fill=\"#64748b\"/><rect x=\"30\" y=\"5.5\" width=\"4\" height=\"9\" rx=\"2\" fill=\"#64748b\"/><circle cx=\"15\" cy=\"26\" r=\"2.3\" fill=\"#94a3b8\"/><circle cx=\"24\" cy=\"26\" r=\"2.3\" fill=\"#94a3b8\"/><circle cx=\"33\" cy=\"26\" r=\"2.3\" fill=\"#38bdf8\"/><circle cx=\"15\" cy=\"34\" r=\"2.3\" fill=\"#94a3b8\"/><circle cx=\"24\" cy=\"34\" r=\"2.3\" fill=\"#94a3b8\"/><circle cx=\"33\" cy=\"34\" r=\"2.3\" fill=\"#94a3b8\"/></svg>", "settings": "<svg viewBox=\"0 0 48 48\"><g fill=\"#64748b\"><rect x=\"20.6\" y=\"4\" width=\"6.8\" height=\"40\" rx=\"3.4\"/><rect x=\"20.6\" y=\"4\" width=\"6.8\" height=\"40\" rx=\"3.4\" transform=\"rotate(45 24 24)\"/><rect x=\"20.6\" y=\"4\" width=\"6.8\" height=\"40\" rx=\"3.4\" transform=\"rotate(90 24 24)\"/><rect x=\"20.6\" y=\"4\" width=\"6.8\" height=\"40\" rx=\"3.4\" transform=\"rotate(135 24 24)\"/></g><circle cx=\"24\" cy=\"24\" r=\"12.5\" fill=\"#94a3b8\"/><circle cx=\"24\" cy=\"24\" r=\"6\" fill=\"#e2e8f0\"/></svg>", "images": "<svg viewBox=\"0 0 48 48\"><defs><linearGradient id=\"gIm\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#7dd3fc\"/><stop offset=\"1\" stop-color=\"#6366f1\"/></linearGradient></defs><rect x=\"5.5\" y=\"8.5\" width=\"37\" height=\"31\" rx=\"4.5\" fill=\"url(#gIm)\"/><circle cx=\"33\" cy=\"16.5\" r=\"3.8\" fill=\"#fde68a\"/><path d=\"M5.5 35.5l11.5-12 8 7.5 6.5-5.5 11 10v.5a3.5 3.5 0 0 1-3.5 3.5H9a3.5 3.5 0 0 1-3.5-3.5z\" fill=\"#0c4a6e\" opacity=\".55\"/></svg>", "music": "<svg viewBox=\"0 0 48 48\"><defs><linearGradient id=\"gMu\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#f472b6\"/><stop offset=\"1\" stop-color=\"#7c3aed\"/></linearGradient></defs><rect x=\"6.5\" y=\"6.5\" width=\"35\" height=\"35\" rx=\"10\" fill=\"url(#gMu)\"/><ellipse cx=\"18.5\" cy=\"33.5\" rx=\"4.4\" ry=\"3.3\" fill=\"#fff\" transform=\"rotate(-14 18.5 33.5)\"/><rect x=\"22.2\" y=\"13.5\" width=\"3\" height=\"19.5\" fill=\"#fff\"/><path d=\"M22.2 13.5c3.8.6 6.8 2.4 8.3 5.4-2.8-.9-5.2-1.3-8.3-1.4z\" fill=\"#fff\"/><ellipse cx=\"31.5\" cy=\"36\" rx=\"4\" ry=\"3\" fill=\"#fff\" opacity=\".85\" transform=\"rotate(-14 31.5 36)\"/></svg>", "video": "<svg viewBox=\"0 0 48 48\"><rect x=\"5.5\" y=\"10.5\" width=\"37\" height=\"27\" rx=\"5\" fill=\"#111827\"/><circle cx=\"11\" cy=\"16.5\" r=\"1.7\" fill=\"#e5e7eb\" opacity=\".8\"/><circle cx=\"11\" cy=\"24\" r=\"1.7\" fill=\"#e5e7eb\" opacity=\".8\"/><circle cx=\"11\" cy=\"31.5\" r=\"1.7\" fill=\"#e5e7eb\" opacity=\".8\"/><circle cx=\"37\" cy=\"16.5\" r=\"1.7\" fill=\"#e5e7eb\" opacity=\".8\"/><circle cx=\"37\" cy=\"24\" r=\"1.7\" fill=\"#e5e7eb\" opacity=\".8\"/><circle cx=\"37\" cy=\"31.5\" r=\"1.7\" fill=\"#e5e7eb\" opacity=\".8\"/><path d=\"M20.5 17.8l10.5 6.2-10.5 6.2z\" fill=\"#f43f5e\"/></svg>", "pdf": "<svg viewBox=\"0 0 48 48\"><path d=\"M12 4.5h15L36.5 14v29a1.5 1.5 0 0 1-1.5 1.5H12A1.5 1.5 0 0 1 10.5 43V6A1.5 1.5 0 0 1 12 4.5z\" fill=\"#fff\" stroke=\"#fca5a5\"/><path d=\"M27 4.5V14h9.5z\" fill=\"#fecaca\"/><rect x=\"10.5\" y=\"19\" width=\"26\" height=\"11.5\" fill=\"#dc2626\"/><text x=\"23.5\" y=\"27.8\" font-family=\"Arial,sans-serif\" font-size=\"8\" font-weight=\"700\" fill=\"#fff\" text-anchor=\"middle\">PDF</text></svg>", "appstore": "<svg viewBox=\"0 0 48 48\"><defs><linearGradient id=\"gAs\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#38bdf8\"/><stop offset=\"1\" stop-color=\"#1d4ed8\"/></linearGradient></defs><rect x=\"6.5\" y=\"6.5\" width=\"35\" height=\"35\" rx=\"10\" fill=\"url(#gAs)\"/><path d=\"M24 13l8.8 19.5h-4.9l-1.7-4h-7.4l-1.1 2.6a4 4 0 0 1-1.4 1.9H11L16.9 20l3.5-7.7A3.4 3.4 0 0 1 24 13zm-3.5 12.2h4.4L24 23z\" fill=\"#fff\"/></svg>", "games": "<svg viewBox=\"0 0 48 48\"><rect x=\"5\" y=\"14.5\" width=\"38\" height=\"20\" rx=\"10\" fill=\"#334155\"/><path d=\"M15.5 20v9M11 24.5h9\" stroke=\"#fff\" stroke-width=\"3.2\" stroke-linecap=\"round\"/><circle cx=\"31\" cy=\"21.5\" r=\"2.5\" fill=\"#f43f5e\"/><circle cx=\"36.5\" cy=\"25\" r=\"2.5\" fill=\"#f59e0b\"/><circle cx=\"31\" cy=\"28.5\" r=\"2.5\" fill=\"#22c55e\"/><circle cx=\"25.5\" cy=\"25\" r=\"2.5\" fill=\"#38bdf8\"/></svg>", "tools": "<svg viewBox=\"0 0 48 48\"><rect x=\"7\" y=\"19\" width=\"34\" height=\"19\" rx=\"3.5\" fill=\"#f97316\"/><path d=\"M17.5 19v-3.2A3.3 3.3 0 0 1 20.8 12.5h6.4a3.3 3.3 0 0 1 3.3 3.3V19\" fill=\"none\" stroke=\"#c2410c\" stroke-width=\"3.4\"/><rect x=\"7\" y=\"26\" width=\"34\" height=\"3.4\" fill=\"#ea580c\"/><rect x=\"20.8\" y=\"24.5\" width=\"6.4\" height=\"6\" rx=\"1.6\" fill=\"#ffedd5\"/></svg>", "moreapps": "<svg viewBox=\"0 0 48 48\"><rect x=\"7.5\" y=\"7.5\" width=\"15\" height=\"15\" rx=\"4.5\" fill=\"#38bdf8\"/><rect x=\"25.5\" y=\"7.5\" width=\"15\" height=\"15\" rx=\"4.5\" fill=\"#a78bfa\"/><rect x=\"7.5\" y=\"25.5\" width=\"15\" height=\"15\" rx=\"4.5\" fill=\"#34d399\"/><rect x=\"25.5\" y=\"25.5\" width=\"15\" height=\"15\" rx=\"4.5\" fill=\"#fbbf24\"/></svg>", "tasks": "<svg viewBox=\"0 0 48 48\"><rect x=\"11.5\" y=\"7\" width=\"25\" height=\"35\" rx=\"3.5\" fill=\"#fff\" stroke=\"#cbd5e1\"/><rect x=\"17.5\" y=\"3.8\" width=\"13\" height=\"7.5\" rx=\"3\" fill=\"#64748b\"/><path d=\"M16.8 22.5l4.8 4.8L31 17.8\" fill=\"none\" stroke=\"#22c55e\" stroke-width=\"3.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><rect x=\"16.5\" y=\"32.5\" width=\"15\" height=\"2.8\" rx=\"1.4\" fill=\"#cbd5e1\"/></svg>", "paint": "<svg viewBox=\"0 0 48 48\"><path d=\"M24 5.5c10 0 18.5 7.6 18.5 17 0 5.4-4.1 8-8.7 8h-3.4a3.4 3.4 0 0 0-2.5 5.7c.8.7 1.2 1.5 1.2 2.4 0 2-1.8 3.9-5.1 3.9C14.3 42.5 5.5 34 5.5 23.7 5.5 13.6 14 5.5 24 5.5z\" fill=\"#fbbf24\"/><circle cx=\"15.5\" cy=\"17\" r=\"3\" fill=\"#ef4444\"/><circle cx=\"25\" cy=\"12.5\" r=\"3\" fill=\"#3b82f6\"/><circle cx=\"34\" cy=\"17.5\" r=\"3\" fill=\"#22c55e\"/><circle cx=\"14\" cy=\"27.5\" r=\"3\" fill=\"#a855f7\"/><circle cx=\"24.5\" cy=\"30\" r=\"3.4\" fill=\"#fff\"/></svg>", "social": "<svg viewBox=\"0 0 48 48\"><defs><linearGradient id=\"gSo\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#f59e0b\"/><stop offset=\"0.5\" stop-color=\"#ec4899\"/><stop offset=\"1\" stop-color=\"#8b5cf6\"/></linearGradient></defs><rect x=\"7\" y=\"9.5\" width=\"34\" height=\"30\" rx=\"9.5\" fill=\"url(#gSo)\"/><circle cx=\"24\" cy=\"24.5\" r=\"7\" fill=\"none\" stroke=\"#fff\" stroke-width=\"3.2\"/><circle cx=\"33.2\" cy=\"16.8\" r=\"2.1\" fill=\"#fff\"/></svg>", "backup": "<svg viewBox=\"0 0 48 48\"><defs><linearGradient id=\"gBk\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#38bdf8\"/><stop offset=\"1\" stop-color=\"#1d4ed8\"/></linearGradient></defs><path d=\"M24 4.5l14.5 5.2v10.1c0 10.3-6.2 17.7-14.5 21.7C15.7 37.5 9.5 30.1 9.5 19.8V9.7z\" fill=\"url(#gBk)\"/><path d=\"M17 23.5l5 5 9.2-10.2\" fill=\"none\" stroke=\"#fff\" stroke-width=\"3.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>", "about": "<svg viewBox=\"0 0 48 48\"><defs><linearGradient id=\"gAb\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#38bdf8\"/><stop offset=\"1\" stop-color=\"#2563eb\"/></linearGradient></defs><circle cx=\"24\" cy=\"24\" r=\"18.5\" fill=\"url(#gAb)\"/><rect x=\"22.3\" y=\"20.5\" width=\"3.4\" height=\"12.5\" rx=\"1.7\" fill=\"#fff\"/><circle cx=\"24\" cy=\"14.8\" r=\"2.1\" fill=\"#fff\"/></svg>", "file": "<svg viewBox=\"0 0 48 48\"><path d=\"M13 4.5h13.5L36 14v28a1.5 1.5 0 0 1-1.5 1.5h-21A1.5 1.5 0 0 1 12 42V6a1.5 1.5 0 0 1 1-1.5z\" fill=\"#fff\" stroke=\"#cbd5e1\"/><path d=\"M26.5 4.5V14H36z\" fill=\"#e2e8f0\"/><rect x=\"16.5\" y=\"21\" width=\"15\" height=\"2.8\" rx=\"1.4\" fill=\"#94a3b8\"/><rect x=\"16.5\" y=\"27.5\" width=\"15\" height=\"2.8\" rx=\"1.4\" fill=\"#94a3b8\"/><rect x=\"16.5\" y=\"34\" width=\"9\" height=\"2.8\" rx=\"1.4\" fill=\"#94a3b8\"/></svg>"};
const BRAND_ICONS = {"Instagram": "<svg viewBox=\"0 0 24 24\"><defs><linearGradient id=\"gIg\" x1=\"0\" y1=\"1\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#feda75\"/><stop offset=\".35\" stop-color=\"#fa7e1e\"/><stop offset=\".65\" stop-color=\"#d62976\"/><stop offset=\"1\" stop-color=\"#962fbf\"/></linearGradient></defs><rect x=\"2\" y=\"2\" width=\"20\" height=\"20\" rx=\"5.5\" fill=\"url(#gIg)\"/><circle cx=\"12\" cy=\"12\" r=\"4.4\" fill=\"none\" stroke=\"#fff\" stroke-width=\"1.9\"/><circle cx=\"17.4\" cy=\"6.6\" r=\"1.4\" fill=\"#fff\"/></svg>", "WhatsApp": "<svg viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"#25D366\"/><path fill=\"#fff\" d=\"M17.2 15.9c-.2.5-1.1 1-1.6 1-.4.1-.9.2-3-.6-2.5-1-4.1-3.6-4.2-3.7-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.3.4-.3.6-.3h.5c.1 0 .3 0 .5.4l.8 1.9c.1.2.1.4 0 .5l-.4.5-.4.4c-.1.1-.2.3-.1.5.2.3.7 1.1 1.5 1.8 1 .9 1.9 1.1 2.1 1.2.3.1.4.1.6-.1l.9-1c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.2.5.3.1.2.1.6-.1 1.1zM12.1 4.2c-4.3 0-7.8 3.5-7.8 7.8 0 1.4.4 2.7 1 3.9L4.2 19.8l4-1.1a7.8 7.8 0 1 0 3.9-14.5z\"/></svg>", "YouTube": "<svg viewBox=\"0 0 24 24\"><rect x=\"2\" y=\"5.5\" width=\"20\" height=\"13\" rx=\"3.5\" fill=\"#FF0033\"/><path d=\"M10.3 9.3l5 2.7-5 2.7z\" fill=\"#fff\"/></svg>", "Facebook": "<svg viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"#1877F2\"/><path fill=\"#fff\" d=\"M13.5 21v-6.9h2.3l.4-2.7h-2.7V9.7c0-.8.3-1.3 1.4-1.3h1.3V6c-.3 0-1.1-.1-2-.1-2.1 0-3.5 1.3-3.5 3.6v2H8.4v2.7h2.3V21h2.8z\"/></svg>", "Telegram": "<svg viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"#229ED9\"/><path fill=\"#fff\" d=\"M17.9 6.9l-2.8 13.1c-.2.9-.8 1.2-1.6.7l-4.4-3.2-2.1 2c-.2.2-.4.4-.9.4l.3-4.5 8.2-7.4c.4-.3-.1-.5-.6-.2L4.2 14.2l-4.4-1.4c-.9-.3-.9-1 .2-1.4l17.1-6.6c.8-.3 1.5.2 1.2 2.1z\" transform=\"scale(.86) translate(1.7 1.7)\"/></svg>", "X": "<svg viewBox=\"0 0 24 24\"><rect x=\"2\" y=\"2\" width=\"20\" height=\"20\" rx=\"5\" fill=\"#000\"/><path d=\"M6.2 5.8l11.6 12.4M17.8 5.8L6.2 18.2\" stroke=\"#fff\" stroke-width=\"2.1\" stroke-linecap=\"round\"/></svg>", "Discord": "<svg viewBox=\"0 0 24 24\"><rect x=\"2\" y=\"2\" width=\"20\" height=\"20\" rx=\"5.5\" fill=\"#5865F2\"/><circle cx=\"9\" cy=\"12.8\" r=\"1.7\" fill=\"#fff\"/><circle cx=\"15\" cy=\"12.8\" r=\"1.7\" fill=\"#fff\"/><path d=\"M7.4 16.4c1.4 1 3 1.5 4.6 1.5s3.2-.5 4.6-1.5\" stroke=\"#fff\" stroke-width=\"1.7\" fill=\"none\" stroke-linecap=\"round\"/></svg>", "TikTok": "<svg viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"#000\"/><path fill=\"#fff\" d=\"M15.6 5.4v8.3a3.85 3.85 0 1 1-3.07-3.76v2.05a1.85 1.85 0 1 0 1.24 1.73V5.4h1.83zm-.02 0c.28 1.05 1.2 2.24 2.9 2.42v1.9c-1.08-.1-2.06-.5-2.9-1.1V5.4z\"/></svg>"};
const LINK_ICON = "<svg viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"#334155\"/><path d=\"M10.8 13.2l2.4-2.4M9.2 11.4l1.9-1.9a3.4 3.4 0 0 1 4.8 4.8l-1.9 1.9M13 12.6l-1.9 1.9a3.4 3.4 0 0 1-4.8-4.8l1.9-1.9\" stroke=\"#fff\" stroke-width=\"1.7\" fill=\"none\" stroke-linecap=\"round\"/></svg>";
function appIcon(id){
  if (ICONS[id]) return ICONS[id];
  const a = APPS[id];
  if (a && a.icon) return '<span class="app-emoji">' + a.icon + '</span>';
  return ICONS.file;
}
function socialIcon(s){ return BRAND_ICONS[s.platform] || LINK_ICON; }

/* ---------------- window manager ---------------- */
let zTop = 100, cascade = 0;
const openWins = new Map(); // appId -> win element

function openApp(id){
  const app = APPS[id]; if (!app) return;
  if (getRemovedApps().includes(id)){
    toast('Ye app removed hai — App Store se wapas install karo.');
    if (id !== 'appstore') openApp('appstore');
    return;
  }
  if (app.url){ window.open(app.url, '_blank', 'noopener'); return; } /* mere apps/games/websites — naye tab me */
  if (openWins.has(id)){
    const w = openWins.get(id);
    w.classList.remove('hidden'); focusWin(id); return;
  }
  const tpl = document.getElementById(app.tpl);
  const win = document.createElement('section');
  win.className = 'win glass'; win.dataset.app = id;
  const off = (cascade++ % 6) * 26;
  win.style.left = Math.max(8, Math.min(230 + off, window.innerWidth - 320)) + 'px';
  win.style.top  = Math.min(92 + off, Math.max(76, window.innerHeight - 240)) + 'px';
  win.style.zIndex = ++zTop;
  win.innerHTML =
    '<div class="win-head"><span class="win-ico">' + appIcon(id) + '</span><span class="win-title">' + app.title + '</span>' +
    '<div class="win-btns"><button class="wb-min" title="Minimise">—</button>' +
    '<button class="wb-max" title="Maximise">▢</button>' +
    '<button class="wb-close" title="Close">✕</button></div></div>' +
    '<div class="win-body"></div>';
  const body = $('.win-body', win);
  if (tpl) body.appendChild(tpl.content.cloneNode(true));
  $('#windows').appendChild(win);
  openWins.set(id, win);

  $('.wb-close', win).addEventListener('click', () => closeWin(id));
  $('.wb-min', win).addEventListener('click', () => { win.classList.add('hidden'); renderChips(); });
  $('.wb-max', win).addEventListener('click', () => { win.classList.toggle('max'); focusWin(id); });
  win.addEventListener('pointerdown', () => focusWin(id));
  makeDraggable(win, $('.win-head', win));
  renderChips();
  if (APP_INIT[id]) APP_INIT[id](win);
}
function focusWin(id){
  const w = openWins.get(id); if (!w) return;
  w.style.zIndex = ++zTop;
  $$('#openChips .chip').forEach(c => c.classList.toggle('active', c.dataset.app === id));
}
function closeWin(id){
  const w = openWins.get(id); if (!w) return;
  w.remove(); openWins.delete(id); renderChips();
}
/* screen ghumne ya size badalne par saari khuli windows ko screen ke andar wapas fit karo */
function clampWindows(){
  const vw = window.innerWidth, vh = window.innerHeight;
  openWins.forEach(w => {
    const r = w.getBoundingClientRect();
    let x = parseFloat(w.style.left), y = parseFloat(w.style.top);
    if (isNaN(x)) x = r.left; if (isNaN(y)) y = r.top;
    x = Math.max(-r.width + 90, Math.min(x, vw - 70));
    y = Math.max(70, Math.min(y, vh - 90));
    w.style.left = x + 'px'; w.style.top = y + 'px';
  });
}
let rszTimer = null;
window.addEventListener('resize', () => { clearTimeout(rszTimer); rszTimer = setTimeout(clampWindows, 120); });
window.addEventListener('orientationchange', () => setTimeout(clampWindows, 250));

function renderChips(){
  const box = $('#openChips'); box.innerHTML = '';
  openWins.forEach((w, id) => {
    const c = document.createElement('button');
    c.className = 'chip'; c.dataset.app = id;
    c.innerHTML = appIcon(id) + '<span>' + APPS[id].title + '</span>';
    c.addEventListener('click', () => {
      if (w.classList.contains('hidden')) { w.classList.remove('hidden'); }
      focusWin(id); renderChips();
    });
    box.appendChild(c);
  });
}
function makeDraggable(win, handle){
  handle.addEventListener('pointerdown', e => {
    if (e.target.closest('.win-btns') || win.classList.contains('max')) return;
    if (e.button !== undefined && e.button !== 0) return; /* primary button / touch only */
    const r = win.getBoundingClientRect();
    const baseLeft = r.left, baseTop = r.top;
    const startX = e.clientX, startY = e.clientY;
    const minX = -r.width + 90, maxX = window.innerWidth - 70;
    const minY = 70, maxY = window.innerHeight - 90;
    let tx = 0, ty = 0, rafId = 0, lastEv = null;
    win.classList.add('dragging');
    if (handle.setPointerCapture && e.pointerId !== undefined){ try{ handle.setPointerCapture(e.pointerId); }catch(err){} }
    function apply(){
      rafId = 0;
      if (!lastEv) return;
      let x = baseLeft + (lastEv.clientX - startX), y = baseTop + (lastEv.clientY - startY);
      x = Math.max(minX, Math.min(x, maxX));
      y = Math.max(minY, Math.min(y, maxY));
      tx = x - baseLeft; ty = y - baseTop;
      win.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,0)';
    }
    function move(ev){ lastEv = ev; if (!rafId) rafId = requestAnimationFrame(apply); }
    function up(){
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerup', up);
      document.removeEventListener('pointercancel', up);
      if (rafId){ cancelAnimationFrame(rafId); rafId = 0; apply(); }
      win.style.left = (baseLeft + tx) + 'px';
      win.style.top  = (baseTop + ty) + 'px';
      win.style.transform = '';
      win.classList.remove('dragging');
    }
    document.addEventListener('pointermove', move);
    document.addEventListener('pointerup', up);
    document.addEventListener('pointercancel', up);
  });
}

/* ---------------- clock ---------------- */
function tickClock(){
  if (document.hidden) return;
  const now = new Date();
  const t = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit'});
  const tShort = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
  const d = now.toLocaleDateString([], {weekday:'short', day:'numeric', month:'short', year:'numeric'});
  const wc = $('#wClock'); if (wc) wc.textContent = t;
  const wd = $('#wDate'); if (wd) wd.textContent = d;
  const tt = $('#tbTime'); if (tt) tt.textContent = tShort;
  const td = $('#tbDate'); if (td) td.textContent = d;
}
let clockTimer = setInterval(tickClock, 1000);

/* ---------------- weather (Open-Meteo, no key) ---------------- */
let weatherText = 'Weather abhi load nahi hua.';
const WMO = {0:['Clear sky','☀️'],1:['Mainly clear','🌤️'],2:['Partly cloudy','⛅'],3:['Overcast','☁️'],45:['Fog','🌫️'],48:['Fog','🌫️'],51:['Light drizzle','🌦️'],53:['Drizzle','🌦️'],55:['Drizzle','🌦️'],61:['Light rain','🌧️'],63:['Rain','🌧️'],65:['Heavy rain','🌧️'],71:['Light snow','🌨️'],73:['Snow','🌨️'],75:['Heavy snow','❄️'],80:['Rain showers','🌦️'],81:['Rain showers','🌦️'],82:['Heavy showers','⛈️'],95:['Thunderstorm','⛈️'],96:['Thunderstorm','⛈️'],99:['Thunderstorm','⛈️']};
async function loadWeather(){
  const city = settings.city || 'New Delhi';
  $('#wCity').textContent = city + ', India';
  try{
    let latitude, longitude, name = city, country = 'India';
    if (city.trim().toLowerCase() === 'new delhi'){ latitude = 28.6139; longitude = 77.2090; }
    else {
      const g = await fetch('https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(city) + '&count=1&language=en&format=json');
      const gj = await g.json();
      if (!gj.results || !gj.results.length) throw new Error('city');
      ({ latitude, longitude, name, country } = gj.results[0]);
    }
    const f = await fetch('https://api.open-meteo.com/v1/forecast?latitude=' + latitude + '&longitude=' + longitude + '&current=temperature_2m,weather_code&timezone=auto');
    const fj = await f.json();
    const temp = Math.round(fj.current.temperature_2m);
    const w = WMO[fj.current.weather_code] || ['—','🌤️'];
    $('#wTemp').textContent = temp + '°C';
    $('#wCond').textContent = w[0];
    $('#wIco').textContent = w[1];
    $('#wCity').textContent = name + ', ' + (country || '');
    weatherText = name + ' me abhi ' + temp + '°C hai, ' + w[0] + '.';
  }catch(e){
    $('#wTemp').textContent = '--°C';
    $('#wCond').textContent = 'Weather unavailable (offline)';
    $('#wCity').textContent = city;
    weatherText = 'Weather abhi load nahi ho paya — net slow lag raha hai.';
  }
}

/* ---------------- performance gauges (live demo) ---------------- */
const perf = { cpu:42, ram:68, disk:57, hist:[] };
function stepPerf(){
  if (document.hidden) return;
  if (!document.getElementById('perfChart')) return; /* widget not present — no work */
  const walk = (v, min, max) => Math.max(min, Math.min(max, v + Math.round((Math.random() - .5) * 14)));
  perf.cpu = walk(perf.cpu, 8, 96); perf.ram = walk(perf.ram, 30, 92); perf.disk = walk(perf.disk, 40, 80);
  const set = (id, v, c) => { const el = $(id); if (!el) return; el.style.setProperty('--p', v); el.style.setProperty('--c', c); $('span', el).textContent = v + '%'; };
  set('#gCpu', perf.cpu, '#38bdf8'); set('#gRam', perf.ram, '#34d399'); set('#gDisk', perf.disk, '#fbbf24');
  perf.hist.push(perf.cpu); if (perf.hist.length > 28) perf.hist.shift();
  const cv = $('#perfChart'); if (!cv) return;
  const ctx = cv.getContext('2d'); ctx.clearRect(0, 0, cv.width, cv.height);
  ctx.beginPath();
  perf.hist.forEach((v, i) => { const x = i / 27 * cv.width, y = cv.height - (v / 100) * cv.height; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
  ctx.strokeStyle = '#38bdf8'; ctx.lineWidth = 2; ctx.stroke();
}
let perfTimer = setInterval(stepPerf, 3000);
/* Battery/perf: tab chhupa ho to clock aur perf dono ke timers band */
document.addEventListener('visibilitychange', () => {
  if (document.hidden){
    if (clockTimer){ clearInterval(clockTimer); clockTimer = null; }
    if (perfTimer){ clearInterval(perfTimer); perfTimer = null; }
  } else {
    if (!clockTimer) clockTimer = setInterval(tickClock, 1000);
    if (!perfTimer) perfTimer = setInterval(stepPerf, 3000);
    tickClock(); stepPerf();
  }
});

/* ---------------- auth (owner-only editing) ----------------
   Visitors land straight on the desktop (Guest View) — no login wall.
   The password only protects owner actions: settings changes, social
   add/edit/delete, app install/remove and backup restore.          */
let desktopActive = false;
let ownerLoggedIn = false;
let pendingAction = null;
function isOwner(){ return ownerLoggedIn; }
async function sha256(text){
  if (crypto && crypto.subtle){
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
  }
  let h = 0; for (let i = 0; i < text.length; i++){ h = (h * 31 + text.charCodeAt(i)) >>> 0; } return 'fb' + h.toString(16);
}
function setLoginMode(){
  const has = !!store.get('passhash', null);
  $('#confirmWrap').classList.toggle('hidden', has);
  $('#loginSub').textContent = has ? 'Owner Login' : 'Create Owner Password';
  $('#loginBtn').textContent = has ? 'Login 🔒' : 'Set Password 👑';
  $('#loginNote').textContent = has ? 'Dekhna sabke liye khula hai — password sirf owner wali settings ko bachata hai.' : 'Pehli baar: apna owner password set karo. Ye sirf settings aur editing ko protect karega — desktop sabke liye khula rahega.';
  $('#loginError').classList.add('hidden');
}
function showOwnerLogin(){
  setLoginMode();
  $('#lockScreen').classList.remove('hidden');
  setTimeout(() => $('#loginPass').focus(), 60);
}
function ownerGate(fn){
  if (ownerLoggedIn){ if (fn) fn(); return; }
  pendingAction = fn || null;
  showOwnerLogin();
  toast('Ye sirf owner ke liye hai — pehle Owner Login karo 👑');
}
function updateOwnerUI(){
  const role = $('#spRole');
  if (role) role.textContent = ownerLoggedIn ? 'Super Admin 👑' : 'Guest View';
  const ob = $('#spOwnerBtn');
  if (ob) ob.textContent = ownerLoggedIn ? '↩ Owner Logout' : '🔑 Owner Login';
  const navOwner = $('#startPanel [data-sp="owner"]');
  if (navOwner) navOwner.classList.toggle('hidden', ownerLoggedIn);
  const navLogout = $('#startPanel [data-sp="logout"]');
  if (navLogout) navLogout.classList.toggle('hidden', !ownerLoggedIn);
}
function hideLock(){ $('#lockScreen').classList.add('hidden'); }
function enterDesktop(){
  desktopActive = true;
  hideLock();
  $('#desktop').classList.remove('hidden');
  tickClock(); stepPerf(); loadWeather();
}
async function tryLogin(){
  const pass = $('#loginPass').value;
  const err = $('#loginError');
  const has = store.get('passhash', null);
  const lockUntil = +(store.get('lockUntil', 0) || 0);
  if (has && Date.now() < lockUntil){
    const mins = Math.max(1, Math.ceil((lockUntil - Date.now()) / 60000));
    err.textContent = 'Bahut zyada galat koshish — security ke liye login ' + mins + ' minute band hai.';
    err.classList.remove('hidden'); return;
  }
  if (!has){
    const conf = $('#loginConfirm').value;
    if (pass.length < 6){ err.textContent = 'Password kam se kam 6 characters ka rakho.'; err.classList.remove('hidden'); return; }
    if (pass !== conf){ err.textContent = 'Dono password match nahi ho rahe.'; err.classList.remove('hidden'); return; }
    store.set('passhash', await sha256(pass));
    toast('Owner password set ho gaya 👑');
    notify('Welcome to AJEET OS 👑', 'Tumhara personal desktop taiyaar hai. Dream • Learn • Create • Grow.');
    finishOwnerLogin(); return;
  }
  if (await sha256(pass) === has){ store.set('loginFails', 0); store.set('lockUntil', 0); finishOwnerLogin(); }
  else {
    const fails = (+(store.get('loginFails', 0) || 0)) + 1;
    if (fails >= 5){
      store.set('loginFails', 0); store.set('lockUntil', Date.now() + 5 * 60000);
      err.textContent = '5 baar galat password — security ke liye login 5 minute band kar diya hai.';
    } else {
      store.set('loginFails', fails);
      err.textContent = 'Galat password — dobara try karo. (' + (5 - fails) + ' koshish bachi)';
    }
    err.classList.remove('hidden');
  }
}
function finishOwnerLogin(){
  if ($('#rememberMe').checked){ localStorage.setItem('ajeetos.session', String(Date.now() + 7 * 24 * 3600 * 1000)); sessionStorage.removeItem('ajeetos.session'); }
  else { sessionStorage.setItem('ajeetos.session', '1'); localStorage.removeItem('ajeetos.session'); }
  $('#loginPass').value = ''; $('#loginConfirm').value = '';
  ownerLoggedIn = true;
  hideLock();
  updateOwnerUI();
  toast('Welcome Back, Ajeet! Super Admin 👑');
  const fn = pendingAction; pendingAction = null;
  if (fn) fn();
}
function ownerLogout(silent){
  localStorage.removeItem('ajeetos.session'); sessionStorage.removeItem('ajeetos.session');
  ownerLoggedIn = false; pendingAction = null;
  updateOwnerUI();
  if (!silent) toast('Owner logout ho gaya — ab Guest View hai.');
}
function lockDesktop(){
  if (ownerLoggedIn) ownerLogout(true);
  $('#startPanel').classList.add('hidden');
  toast('Desktop Guest View me hai — owner kaam ke liye Owner Login karo 🔒');
}

/* ---------------- notifications ---------------- */
function renderNotifs(){
  const list = store.get('notifs', []);
  const box = $('#notifList'); if (!box) return;
  box.innerHTML = list.length ? '' : '<p class="muted">No notifications.</p>';
  list.forEach(n => {
    const d = document.createElement('div'); d.className = 'notif-item';
    d.innerHTML = '<strong>' + esc(n.title) + '</strong><small>' + esc(n.body) + ' • ' + fmtTime(n.at) + '</small>';
    box.appendChild(d);
  });
  $('#bellDot').style.display = list.length ? 'block' : 'none';
}

/* ---------------- social ---------------- */
const PLATFORMS = [
  { key:'Instagram', icon:'📸' }, { key:'YouTube', icon:'▶️' }, { key:'Facebook', icon:'📘' },
  { key:'WhatsApp', icon:'💬' }, { key:'Telegram', icon:'✈️' }, { key:'X', icon:'𝕏' },
  { key:'Discord', icon:'🎮' }, { key:'TikTok', icon:'🎵' }
];
function defaultSocials(){
  return [
    { id: uid(), platform:'Instagram', icon:'📸', name:'@theajeetbhai',     url:'https://www.instagram.com/theajeetbhai' },
    { id: uid(), platform:'Instagram', icon:'📸', name:'@insta_wallpaper4k', url:'https://www.instagram.com/insta_wallpaper4k' },
    { id: uid(), platform:'Instagram', icon:'📸', name:'@theajeetbhai_x', url:'https://www.instagram.com/theajeetbhai_x' },
    { id: uid(), platform:'WhatsApp', icon:'💬', name:'WhatsApp par chat karo', url:'https://wa.me/919990953738?text=Hello%20Ajeet%20bhai' }
  ];
}
function getSocials(){
  let s = store.get('socials', null);
  if (!s){ s = defaultSocials(); store.set('socials', s); }
  /* One-time: purane save me WhatsApp seed jodo (owner delete kare to wapas nahi aayega) */
  if (!store.get('socialsSeedV2', null)){
    if (!s.some(x => x.url === 'https://wa.me/919990953738?text=Hello%20Ajeet%20bhai')){
      s.push({ id: uid(), platform:'WhatsApp', icon:'💬', name:'WhatsApp par chat karo', url:'https://wa.me/919990953738?text=Hello%20Ajeet%20bhai' });
      store.set('socials', s);
    }
    store.set('socialsSeedV2', 1);
  }
  /* One-time: purane save me @theajeetbhai_x seed jodo (owner delete kare to wapas nahi aayega) */
  if (!store.get('socialsSeedV3', null)){
    if (!s.some(x => x.url === 'https://www.instagram.com/theajeetbhai_x')){
      const waIdx = s.findIndex(x => x.url && x.url.includes('wa.me'));
      const xEntry = { id: uid(), platform:'Instagram', icon:'📸', name:'@theajeetbhai_x', url:'https://www.instagram.com/theajeetbhai_x' };
      if (waIdx >= 0) s.splice(waIdx, 0, xEntry); else s.push(xEntry);
      store.set('socials', s);
    }
    store.set('socialsSeedV3', 1);
  }
  return s;
}
function renderSocialBar(){
  /* Saare social accounts DESKTOP par hi, samne — ek slim glass strip me.
     Wahi saved data jo Social Hub / Start panel use karte hain, isliye
     owner ke add kiye hue accounts yahan bhi apne aap dikhte hain. */
  const bar = $('#socialBar'); if (!bar) return;
  const socials = getSocials();
  bar.innerHTML = '';
  bar.classList.toggle('hidden', !socials.length);
  socials.forEach(s => {
    const b = document.createElement('button');
    b.className = 'sb-chip';
    b.innerHTML = '<span>' + socialIcon(s) + '</span>' + esc(s.name);
    b.title = s.platform + ' — ' + s.url;
    b.addEventListener('click', () => window.open(s.url, '_blank'));
    bar.appendChild(b);
  });
}
function renderStartSocials(){
  /* Saare accounts EK SAATH, ek hi row me — har account ka apna button. */
  renderSocialBar();
  const box = $('#spSocials'); if (!box) return;
  const socials = getSocials();
  box.innerHTML = '';
  if (!socials.length){
    const b = document.createElement('button');
    b.innerHTML = '<span>➕</span>Social Hub';
    b.title = 'Social Hub kholo — pehla account jodo';
    b.addEventListener('click', () => openApp('social'));
    box.appendChild(b);
    return;
  }
  socials.forEach(s => {
    const b = document.createElement('button');
    b.innerHTML = '<span>' + socialIcon(s) + '</span>' + esc(s.platform);
    b.title = s.name + ' — ' + s.url;
    b.addEventListener('click', () => window.open(s.url, '_blank'));
    box.appendChild(b);
  });
}

/* ---------------- file system ---------------- */
function defaultFS(){
  return { items: [
    { id:'f_docs', name:'Documents', kind:'folder', parent:'root' },
    { id:'f_pics', name:'Pictures',  kind:'folder', parent:'root' },
    { id:'f_note', name:'Welcome.txt', kind:'file', parent:'root', content:'Welcome to AJEET OS, Ajeet!\n\nYe tumhara personal desktop hai. Notes, files, tasks — sab isi browser me save hota hai.\n\nDream • Learn • Create • Grow.' },
    { id:'f_dream', name:'My Dream.txt', kind:'file', parent:'f_docs', content:'Dream • Learn • Create • Grow.' }
  ]};
}
function getFS(){ let fs = store.get('fs', null); if (!fs){ fs = defaultFS(); store.set('fs', fs); } return fs; }
function saveFS(fs){ store.set('fs', fs); }
function fsPath(fs, id){
  if (id === 'root') return 'Home';
  const parts = []; let cur = fs.items.find(i => i.id === id);
  while (cur){ parts.unshift(cur.name); cur = fs.items.find(i => i.id === cur.parent); }
  return 'Home / ' + parts.join(' / ');
}
function deleteToTrash(fs, id){
  const trash = store.get('trash', []);
  const collect = [id]; let grew = true;
  while (grew){ grew = false; fs.items.forEach(i => { if (collect.includes(i.parent) && !collect.includes(i.id)){ collect.push(i.id); grew = true; } }); }
  const nodes = fs.items.filter(i => collect.includes(i.id));
  const top = nodes.find(i => i.id === id);
  trash.unshift({ id: uid(), name: top.name, kind: top.kind, nodes });
  fs.items = fs.items.filter(i => !collect.includes(i.id));
  store.set('trash', trash); saveFS(fs);
}

/* ---------------- per-app initialisers ---------------- */
const APP_INIT = {

  thispc(win){
    const el = $('.js-storage', win);
    if (navigator.storage && navigator.storage.estimate){
      navigator.storage.estimate().then(e => { el.textContent = Math.round((e.usage || 0) / 1024) + ' KB used'; });
    } else {
      let n = 0; for (let i = 0; i < localStorage.length; i++){ const k = localStorage.key(i); n += (localStorage.getItem(k) || '').length; }
      el.textContent = Math.round(n / 1024) + ' KB used';
    }
  },

  files(win){
    let folder = 'root';
    const listEl = $('.js-fm-list', win), pathEl = $('.js-fm-path', win);
    function render(){
      const fs = getFS();
      pathEl.textContent = fsPath(fs, folder);
      const items = fs.items.filter(i => i.parent === folder);
      listEl.innerHTML = items.length ? '' : '<p class="fm-empty">Ye folder khaali hai.</p>';
      items.forEach(it => {
        const row = document.createElement('div'); row.className = 'fm-item';
        row.innerHTML = '<span class="fi-ico">' + (it.kind === 'folder' ? '📁' : '📄') + '</span><span class="fi-name">' + esc(it.name) + '</span>' +
          '<span class="fi-act"><button data-a="rename" title="Rename">✏️</button><button data-a="del" title="Delete">🗑️</button></span>';
        $('.fi-name', row).addEventListener('click', () => {
          if (it.kind === 'folder'){ folder = it.id; render(); } else openFileEditor(it.id);
        });
        $('[data-a="rename"]', row).addEventListener('click', () => {
          const name = prompt('New name:', it.name); if (!name) return;
          const fs2 = getFS(); const t = fs2.items.find(i => i.id === it.id); if (t){ t.name = name; saveFS(fs2); render(); toast('Renamed ✓'); }
        });
        $('[data-a="del"]', row).addEventListener('click', () => {
          const fs2 = getFS(); deleteToTrash(fs2, it.id); render(); toast('Recycle Bin me gaya 🗑️');
        });
        listEl.appendChild(row);
      });
    }
    $('.js-fm-up', win).addEventListener('click', () => {
      const fs = getFS(); const cur = fs.items.find(i => i.id === folder);
      folder = cur ? cur.parent : 'root'; render();
    });
    $('.js-fm-newfolder', win).addEventListener('click', () => {
      const name = prompt('Folder name:'); if (!name) return;
      const fs = getFS(); fs.items.push({ id: uid(), name, kind:'folder', parent: folder }); saveFS(fs); render(); toast('Folder ban gaya 📁');
    });
    $('.js-fm-newfile', win).addEventListener('click', () => {
      const name = prompt('File name (e.g. Note.txt):'); if (!name) return;
      const fs = getFS(); fs.items.push({ id: uid(), name, kind:'file', parent: folder, content:'' }); saveFS(fs); render(); toast('File ban gayi 📄');
    });
    win._refresh = render;
    render();
  },

  recycle(win){
    const listEl = $('.js-rb-list', win), note = $('.js-rb-empty-note', win);
    function render(){
      const trash = store.get('trash', []);
      note.style.display = trash.length ? 'none' : '';
      listEl.innerHTML = '';
      trash.forEach(t => {
        const row = document.createElement('div'); row.className = 'fm-item';
        row.innerHTML = '<span class="fi-ico">' + (t.kind === 'folder' ? '📁' : '📄') + '</span><span class="fi-name">' + esc(t.name) + '</span>' +
          '<span class="fi-act"><button data-a="restore" title="Restore">↩</button><button data-a="del" title="Delete forever">✕</button></span>';
        $('[data-a="restore"]', row).addEventListener('click', () => restoreTrash(t.id, render));
        $('[data-a="del"]', row).addEventListener('click', () => {
          store.set('trash', store.get('trash', []).filter(x => x.id !== t.id)); render(); toast('Hamesha ke liye delete ho gaya.');
        });
        listEl.appendChild(row);
      });
    }
    function restoreTrash(tid, done){
      const trash = store.get('trash', []); const t = trash.find(x => x.id === tid); if (!t) return;
      const fs = getFS();
      t.nodes.forEach(n => { if (!fs.items.some(i => i.id === n.parent) && n.parent !== 'root' && fs.items.every(i => i.id !== n.parent)) n.parent = 'root'; fs.items.push(n); });
      store.set('trash', trash.filter(x => x.id !== tid)); saveFS(fs); done && done(); toast('Restore ho gaya ↩');
      const fw = openWins.get('files'); if (fw && fw._refresh) fw._refresh();
    }
    $('.js-rb-restore', win).addEventListener('click', () => {
      const trash = store.get('trash', []); const fs = getFS();
      trash.forEach(t => t.nodes.forEach(n => fs.items.push(n)));
      store.set('trash', []); saveFS(fs); render(); toast('Sab restore ho gaya ↩');
      const fw = openWins.get('files'); if (fw && fw._refresh) fw._refresh();
    });
    $('.js-rb-empty', win).addEventListener('click', () => { store.set('trash', []); render(); toast('Recycle Bin khaali ho gaya.'); });
    render();
  },

  browser(win){
    const urlEl = $('.js-br-url', win), frame = $('.js-br-frame', win);
    function go(){
      let u = urlEl.value.trim(); if (!u) return;
      if (!/^https?:\/\//i.test(u)) u = 'https://' + u;
      frame.src = u;
    }
    $('.js-br-go', win).addEventListener('click', go);
    urlEl.addEventListener('keydown', e => { if (e.key === 'Enter') go(); });
    $$('.br-links button', win).forEach(b => b.addEventListener('click', () => window.open(b.dataset.site, '_blank')));
  },

  notepad(win){
    const sel = $('.js-np-list', win), nameEl = $('.js-np-name', win), textEl = $('.js-np-text', win);
    function notes(){ return store.get('notes', {}); }
    function renderList(selectName){
      const n = notes(); const names = Object.keys(n);
      sel.innerHTML = names.length ? '' : '<option value="">(no notes)</option>';
      names.forEach(nm => { const o = document.createElement('option'); o.value = nm; o.textContent = nm; sel.appendChild(o); });
      if (selectName && n[selectName] !== undefined){ sel.value = selectName; nameEl.value = selectName; textEl.value = n[selectName]; }
      else if (names.length){ sel.value = names[0]; nameEl.value = names[0]; textEl.value = n[names[0]]; }
    }
    sel.addEventListener('change', () => { const n = notes(); nameEl.value = sel.value; textEl.value = n[sel.value] || ''; });
    $('.js-np-new', win).addEventListener('click', () => { nameEl.value = ''; textEl.value = ''; nameEl.focus(); });
    $('.js-np-save', win).addEventListener('click', () => {
      const nm = nameEl.value.trim(); if (!nm){ toast('Pehle note ka naam likho.'); return; }
      const n = notes(); n[nm] = textEl.value; store.set('notes', n); renderList(nm); toast('Note save ho gaya ✓');
    });
    /* auto-save while typing, so closing the window never loses text */
    textEl.addEventListener('input', () => {
      const nm = nameEl.value.trim(); if (!nm) return;
      const n = notes(); n[nm] = textEl.value; store.set('notes', n);
    });
    $('.js-np-del', win).addEventListener('click', () => {
      const nm = nameEl.value.trim(); const n = notes();
      if (nm && n[nm] !== undefined){ delete n[nm]; store.set('notes', n); nameEl.value = ''; textEl.value = ''; renderList(); toast('Note delete ho gaya.'); }
    });
    renderList();
  },

  calculator(win){
    let expr = '';
    const disp = $('.js-calc-display', win);
    /* Safety: agar keypad me "=" button kisi wajah se na aaya ho to yahin bana do — hisaab kabhi atke nahi. */
    const grid = $('.calc-grid', win);
    if (grid && !grid.querySelector('[data-k="="]')){
      const eq = document.createElement('button');
      eq.dataset.k = '='; eq.className = 'eqbtn'; eq.textContent = '=';
      grid.appendChild(eq);
    }
    function show(){ disp.textContent = expr || '0'; }
    $$('.calc-grid button', win).forEach(b => b.addEventListener('click', () => {
      const k = b.dataset.k;
      if (k === 'C') expr = '';
      else if (k === '⌫') expr = expr.slice(0, -1);
      else if (k === '±') expr = expr.startsWith('-') ? expr.slice(1) : '-' + expr;
      else if (k === '='){
        const js = expr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');
        if (/^[0-9+\-*/. %()]+$/.test(js) && js.trim()){
          try{ const v = Function('"use strict";return(' + js + ')')(); expr = String(Math.round(v * 1e10) / 1e10); }
          catch(e){ expr = ''; toast('Galat calculation.'); }
        }
      }
      else expr += k;
      show();
    }));
    show();
  },

  calendar(win){
    let off = 0;
    const grid = $('.js-cal-grid', win), title = $('.js-cal-title', win);
    function render(){
      const now = new Date(); const base = new Date(now.getFullYear(), now.getMonth() + off, 1);
      const y = base.getFullYear(), m = base.getMonth();
      title.textContent = base.toLocaleDateString([], { month:'long', year:'numeric' });
      const first = new Date(y, m, 1).getDay(), days = new Date(y, m + 1, 0).getDate(), prevDays = new Date(y, m, 0).getDate();
      grid.innerHTML = '';
      ['Su','Mo','Tu','We','Th','Fr','Sa'].forEach(d => { const s = document.createElement('span'); s.className = 'dow'; s.textContent = d; grid.appendChild(s); });
      for (let i = first - 1; i >= 0; i--){ const s = document.createElement('span'); s.className = 'day dim'; s.textContent = prevDays - i; grid.appendChild(s); }
      for (let d = 1; d <= days; d++){
        const s = document.createElement('span'); s.className = 'day' + (off === 0 && d === now.getDate() ? ' today' : ''); s.textContent = d; grid.appendChild(s);
      }
    }
    $('.js-cal-prev', win).addEventListener('click', () => { off--; render(); });
    $('.js-cal-next', win).addEventListener('click', () => { off++; render(); });
    render();
  },

  settings(win){
    $$('.accent', win).forEach(b => {
      b.classList.toggle('sel', b.dataset.accent === settings.accent);
      b.addEventListener('click', () => ownerGate(() => { settings.accent = b.dataset.accent; saveSettings(); applySettings(); $$('.accent', win).forEach(x => x.classList.toggle('sel', x === b)); toast('Accent colour badal gaya 🎨'); }));
    });
    const g = $('.js-set-glass', win); g.value = settings.glass;
    g.addEventListener('input', () => { if (!isOwner()){ g.value = settings.glass; ownerGate(null); return; } settings.glass = +g.value; saveSettings(); applySettings(); });
    const l = $('.js-set-light', win); l.checked = !!settings.light;
    l.addEventListener('change', () => { if (!isOwner()){ l.checked = !!settings.light; ownerGate(null); return; } settings.light = l.checked; saveSettings(); applySettings(); });
    const city = $('.js-set-city', win); city.value = settings.city;
    $('.js-set-city-save', win).addEventListener('click', () => ownerGate(() => { settings.city = city.value.trim() || 'New Delhi'; saveSettings(); loadWeather(); toast('City update ho gayi 🌦️'); }));
    $('.js-set-pass', win).addEventListener('click', () => ownerGate(async () => {
      const cur = prompt('Current password:'); if (cur === null) return;
      if (await sha256(cur) !== store.get('passhash', '')){ toast('Current password galat hai.'); return; }
      const nw = prompt('New password (min 6 characters):'); if (!nw || nw.length < 6){ toast('Password bahut chhota hai — kam se kam 6 characters.'); return; }
      store.set('passhash', await sha256(nw)); toast('Password badal gaya 🔒');
    }));
    $('.js-set-wipe', win).addEventListener('click', () => ownerGate(() => {
      if (!confirm('Saara AJEET OS data (notes, files, tasks, password) delete ho jayega. Pakka?')) return;
      Object.keys(localStorage).filter(k => k.startsWith('ajeetos.')).forEach(k => localStorage.removeItem(k));
      sessionStorage.clear(); location.reload();
    }));
  },

  images(win){
    const view = $('.js-img-view', win);
    if (window.__AJEET_PHOTO) view.src = window.__AJEET_PHOTO;
    view.title = 'Photo par tap = bada / chhota';
    view.addEventListener('click', () => view.classList.toggle('zoomed'));
    toast('Photo par tap karne se bada hoga — phir scroll karke pura dekho.');
    $('.js-img-file', win).addEventListener('change', e => { const f = e.target.files[0]; if (f) view.src = URL.createObjectURL(f); });
  },
  music(win){
    const list = $('.js-song-list', win);
    list.innerHTML = '';
    SONGS.forEach((s, i) => {
      const row = document.createElement('button'); row.className = 'song-row' + (i === radioIx ? ' playing' : '') + (radioLoading && i === radioLoadingIx ? ' loading' : ''); row.dataset.ix = i;
      row.innerHTML = '<span class="song-rank">' + (i + 1) + '</span><span class="song-meta"><strong></strong><small></small></span><span class="song-go"><svg viewBox="0 0 24 24"><path d="M8.5 5.8v12.4c0 .9 1 1.5 1.8 1L19 13a1.2 1.2 0 0 0 0-2L10.3 4.9c-.8-.5-1.8 0-1.8.9z" fill="currentColor"/></svg></span>';
      row.querySelector('strong').textContent = s.t;
      row.querySelector('small').textContent = s.a;
      row.addEventListener('click', () => radioPlaySong(i));
      list.appendChild(row);
    });
    const pl = $('.js-mplay', win); if (pl) pl.addEventListener('click', radioToggle);
    const nx = $('.js-mnext', win); if (nx) nx.addEventListener('click', radioNext);
    const pv = $('.js-mprev', win); if (pv) pv.addEventListener('click', radioPrev);
    const sh = $('.js-mshuffle', win); if (sh) sh.addEventListener('click', () => { radioShuffle = !radioShuffle; sh.classList.toggle('on', radioShuffle); radioSetShuffle(); toast(radioShuffle ? 'Mix ON \u2014 gaane ulte-seedhe chalenge' : 'Mix OFF \u2014 gaane list ke order me chalenge'); });
    const p = $('.js-aud-player', win), nm = $('.js-aud-name', win);
    const fi = $('.js-aud-file', win); if (fi) fi.addEventListener('change', e => { const f = e.target.files[0]; if (f){ p.src = URL.createObjectURL(f); nm.textContent = f.name; } });
    setRadioIcon();
    const nt = $('.js-now-title', win);
    if (nt && radioIx >= 0 && SONGS[radioIx]) nt.textContent = SONGS[radioIx].t + ' \u2014 ' + SONGS[radioIx].a;
  },
  video(win){
    const p = $('.js-vid-player', win);
    $('.js-vid-file', win).addEventListener('change', e => { const f = e.target.files[0]; if (f) p.src = URL.createObjectURL(f); });
  },
  pdf(win){
    const view = $('.js-pdf-pages-view', win), frame = $('.js-pdf-frame', win),
          nameEl = $('.js-pdf-name', win), status = $('.js-pdf-status', win),
          openBtn = $('.js-pdf-open', win), pagesEl = $('.js-pdf-pages', win);
    let pdfDoc = null, zoom = 1, blobUrl = '';
    function loadPdfJs(){
      return new Promise((res, rej) => {
        if (window.pdfjsLib) return res();
        const s = document.createElement('script');
        s.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        s.onload = () => { try{ window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js'; }catch(e){} res(); };
        s.onerror = rej;
        document.head.appendChild(s);
      });
    }
    async function render(){
      if (!pdfDoc) return;
      view.innerHTML = '';
      const total = pdfDoc.numPages, cap = Math.min(total, 50);
      const w = view.clientWidth || 320;
      for (let n = 1; n <= cap; n++){
        const page = await pdfDoc.getPage(n);
        const base = page.getViewport({ scale: 1 });
        const vp = page.getViewport({ scale: (w / base.width) * zoom });
        const cv = document.createElement('canvas'); cv.className = 'pdf-page';
        cv.width = Math.floor(vp.width); cv.height = Math.floor(vp.height);
        view.appendChild(cv);
        await page.render({ canvasContext: cv.getContext('2d'), viewport: vp }).promise;
      }
      pagesEl.textContent = total + ' pages' + (total > cap ? ' (pehle ' + cap + ' yahan)' : '');
      status.textContent = 'PDF khul gaya ✓ — scroll karke padho, A+ se bada karo.' + (total > cap ? ' Poora document padhne ke liye "Full Screen me Kholo" dabao.' : '');
    }
    $('.js-pdf-file', win).addEventListener('change', async e => {
      const f = e.target.files[0]; if (!f) return;
      nameEl.textContent = f.name;
      if (blobUrl) URL.revokeObjectURL(blobUrl);
      blobUrl = URL.createObjectURL(f);
      openBtn.href = blobUrl; openBtn.classList.remove('hidden');
      status.textContent = 'PDF khul raha hai…';
      try{
        await loadPdfJs();
        const buf = await f.arrayBuffer();
        pdfDoc = await window.pdfjsLib.getDocument({ data: buf }).promise;
        frame.classList.add('hidden'); view.classList.remove('hidden');
        render();
      }catch(err){
        view.classList.add('hidden'); frame.classList.remove('hidden');
        frame.src = blobUrl;
        status.textContent = 'Agar neeche PDF na dikhe, to upar "Full Screen me Kholo" dabao — wahan pakka khulega.';
      }
    });
    $('.js-pdf-zin', win).addEventListener('click', () => { if (pdfDoc){ zoom = Math.min(2.5, zoom + 0.25); render(); } });
    $('.js-pdf-zout', win).addEventListener('click', () => { if (pdfDoc){ zoom = Math.max(0.5, zoom - 0.25); render(); } });
  },

  appstore(win){
    const grid = $('.js-store-grid', win);
    function render(){
      const removed = getRemovedApps();
      grid.innerHTML = '';
      Object.keys(APPS).forEach(id => {
        const row = document.createElement('div'); row.className = 'store-item store-row';
        const open = document.createElement('button'); open.className = 'store-open';
        open.innerHTML = '<span>' + appIcon(id) + '</span>' + APPS[id].title;
        open.addEventListener('click', () => openApp(id));
        row.appendChild(open);
        if (!PROTECTED_APPS.includes(id)){
          const tg = document.createElement('button'); tg.className = 'btn store-toggle';
          const isRemoved = removed.includes(id);
          tg.textContent = isRemoved ? 'Install' : 'Remove';
          if (isRemoved) row.style.opacity = '.55';
          tg.addEventListener('click', () => ownerGate(() => {
            let r = getRemovedApps();
            if (r.includes(id)){ r = r.filter(x => x !== id); toast(APPS[id].title + ' install ho gaya ✓'); }
            else { r.push(id); if (openWins.has(id)) closeWin(id); toast(APPS[id].title + ' remove ho gaya.'); }
            store.set('removedApps', r); applyRemovedApps(); render();
          }));
          row.appendChild(tg);
        }
        grid.appendChild(row);
      });
    }
    render();
  },
  moreapps(win){ renderMyApps($('.js-myapps-grid', win)); renderStore($('.js-more-grid', win)); },

  games(win){
    const msg = $('.js-g-msg', win), num = $('.js-g-num', win);
    let secret = 1 + Math.floor(Math.random() * 100), tries = 0;
    function newGame(){ secret = 1 + Math.floor(Math.random() * 100); tries = 0; msg.textContent = 'Naya game! Guess karo.'; }
    $('.js-g-try', win).addEventListener('click', () => {
      const v = +num.value; if (!v || v < 1 || v > 100){ msg.textContent = '1 se 100 ke beech number dalo.'; return; }
      tries++;
      msg.textContent = v === secret ? '🎉 Sahi jawab! ' + tries + ' tries me jeet gaye!' : (v < secret ? '📈 Aur bada number socho…' : '📉 Thoda chhota number socho…');
    });
    $('.js-g-new', win).addEventListener('click', newGame);
    /* memory match */
    const wrap = document.createElement('div');
    wrap.innerHTML = '<h4 style="margin-top:8px">🧠 Memory Match</h4><p class="muted js-mm-info">Cards flip karke jodi milao.</p><div class="cal-grid js-mm-grid" style="grid-template-columns:repeat(4,1fr)"></div>';
    $('.app-body', win).appendChild(wrap);
    const grid = $('.js-mm-grid', wrap), info = $('.js-mm-info', wrap);
    const syms = ['👑','🚀','🎸','⚽','🌟','🍕','🐯','🎧'].sort(() => Math.random() - .5).slice(0, 4);
    const deck = syms.concat(syms).sort(() => Math.random() - .5);
    let first = null, lock = false, found = 0;
    deck.forEach(s => {
      const c = document.createElement('button'); c.className = 'day'; c.textContent = '❔'; c.style.fontSize = '1.2rem';
      c.addEventListener('click', () => {
        if (lock || c.dataset.done || c === first) return;
        c.textContent = s;
        if (!first){ first = c; first._sym = s; return; }
        if (first._sym === s){ c.dataset.done = 1; first.dataset.done = 1; first = null; found++; if (found === 4) info.textContent = '🎉 Jeet gaye! Saari jodiyan mil gayin.'; }
        else { lock = true; const f = first; first = null; setTimeout(() => { c.textContent = '❔'; f.textContent = '❔'; lock = false; }, 650); }
      });
      grid.appendChild(c);
    });
  },

  tasks(win){
    const listEl = $('.js-tk-list', win), input = $('.js-tk-input', win);
    function render(){
      const tasks = store.get('tasks', []);
      listEl.innerHTML = tasks.length ? '' : '<p class="fm-empty">Koi task nahi. Kuch add karo!</p>';
      tasks.forEach((t, i) => {
        const row = document.createElement('div'); row.className = 'task-item' + (t.done ? ' done' : '');
        row.innerHTML = '<span>' + esc(t.text) + '</span><button data-a="toggle" title="Done">' + (t.done ? '↩' : '✓') + '</button><button data-a="del" title="Delete">✕</button>';
        $('[data-a="toggle"]', row).addEventListener('click', () => { const a = store.get('tasks', []); a[i].done = !a[i].done; store.set('tasks', a); render(); });
        $('[data-a="del"]', row).addEventListener('click', () => { const a = store.get('tasks', []); a.splice(i, 1); store.set('tasks', a); render(); });
        listEl.appendChild(row);
      });
    }
    function add(){
      const v = input.value.trim(); if (!v) return;
      const a = store.get('tasks', []); a.unshift({ text: v, done: false }); store.set('tasks', a);
      input.value = ''; render(); toast('Task add ho gaya ✅');
    }
    $('.js-tk-add', win).addEventListener('click', add);
    input.addEventListener('keydown', e => { if (e.key === 'Enter') add(); });
    render();
  },

  paint(win){
    const cv = $('.js-pt-canvas', win), ctx = cv.getContext('2d');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, cv.width, cv.height);
    let drawing = false, color = '#38bdf8', size = 5, erase = false, last = null;
    function pos(e){ const r = cv.getBoundingClientRect(); return { x: (e.clientX - r.left) * cv.width / r.width, y: (e.clientY - r.top) * cv.height / r.height }; }
    cv.addEventListener('pointerdown', e => { drawing = true; last = pos(e); cv.setPointerCapture(e.pointerId); });
    cv.addEventListener('pointermove', e => {
      if (!drawing) return; const p = pos(e);
      ctx.strokeStyle = erase ? '#ffffff' : color; ctx.lineWidth = size; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke(); last = p;
    });
    ['pointerup','pointercancel'].forEach(ev => cv.addEventListener(ev, () => { drawing = false; }));
    $('.js-pt-color', win).addEventListener('input', e => { color = e.target.value; erase = false; });
    $('.js-pt-size', win).addEventListener('input', e => { size = +e.target.value; });
    $('.js-pt-eraser', win).addEventListener('click', () => { erase = true; toast('Eraser on.'); });
    $('.js-pt-clear', win).addEventListener('click', () => { ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, cv.width, cv.height); });
    $('.js-pt-save', win).addEventListener('click', () => {
      const a = document.createElement('a'); a.download = 'ajeet-os-painting.png'; a.href = cv.toDataURL('image/png'); a.click(); toast('Painting download ho gayi 🎨');
    });
  },

  social(win){
    const listEl = $('.js-sc-list', win);
    function render(){
      const socials = getSocials();
      listEl.innerHTML = socials.length ? '' : '<p class="fm-empty">Koi account nahi. "+ Add Account" se jodo.</p>';
      socials.forEach(s => {
        const row = document.createElement('div'); row.className = 'social-item';
        row.innerHTML = '<span class="sc-ico">' + socialIcon(s) + '</span><div class="sc-info"><strong>' + esc(s.platform) + ' — ' + esc(s.name) + '</strong><small>' + esc(s.url) + '</small></div>' +
          '<span class="fi-act"><button data-a="open" title="Open">↗</button><button data-a="copy" title="Copy link">📋</button><button data-a="edit" title="Edit">✏️</button><button data-a="del" title="Delete">✕</button></span>';
        $('[data-a="open"]', row).addEventListener('click', () => window.open(s.url, '_blank'));
        $('[data-a="copy"]', row).addEventListener('click', () => { (navigator.clipboard ? navigator.clipboard.writeText(s.url) : Promise.reject()).then(() => toast('Link copy ho gaya 📋')).catch(() => toast(s.url)); });
        $('[data-a="edit"]', row).addEventListener('click', () => ownerGate(() => {
          const name = prompt('Display name:', s.name); if (name === null) return;
          const url = prompt('Profile URL:', s.url); if (url === null) return;
          const a = getSocials(); const t = a.find(x => x.id === s.id); if (t){ t.name = name; t.url = url; store.set('socials', a); render(); renderStartSocials(); toast('Update ho gaya ✓'); }
        }));
        $('[data-a="del"]', row).addEventListener('click', () => ownerGate(() => {
          store.set('socials', getSocials().filter(x => x.id !== s.id)); render(); renderStartSocials(); toast('Account hata diya.');
        }));
        listEl.appendChild(row);
      });
    }
    $('.js-sc-add', win).addEventListener('click', () => ownerGate(() => {
      const platform = prompt('Platform (Instagram / YouTube / Facebook / WhatsApp / Telegram / X / Discord / TikTok):'); if (!platform) return;
      const name = prompt('Display name / handle:'); if (name === null) return;
      const url = prompt('Profile URL (https://...):'); if (!url) return;
      const p = PLATFORMS.find(x => x.key.toLowerCase() === platform.trim().toLowerCase());
      const a = getSocials(); a.push({ id: uid(), platform: platform.trim(), icon: p ? p.icon : '🔗', name: name.trim(), url: url.trim() });
      store.set('socials', a); render(); renderStartSocials(); toast('Account jud gaya ✓');
    }));
    render();
  },

  backup(win){
    const msg = $('.js-bk-msg', win);
    $('.js-bk-download', win).addEventListener('click', () => ownerGate(() => {
      const data = {};
      Object.keys(localStorage).filter(k => k.startsWith('ajeetos.')).forEach(k => { data[k] = localStorage.getItem(k); });
      const a = document.createElement('a');
      a.download = 'ajeet-os-backup.json';
      a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type:'application/json' }));
      a.click(); msg.textContent = 'Backup download ho gaya. Is file ko sambhal ke rakho.';
    }));
    $('.js-bk-file', win).addEventListener('change', e => {
      const f = e.target.files[0]; if (!f) return;
      e.target.value = '';
      ownerGate(() => restoreBackupFile(f));
    });
    function restoreBackupFile(f){
      f.text().then(txt => {
        try{
          const data = JSON.parse(txt);
          Object.keys(data).filter(k => k.startsWith('ajeetos.')).forEach(k => localStorage.setItem(k, data[k]));
          msg.textContent = 'Restore ho gaya! Desktop refresh ho raha hai…';
          setTimeout(() => location.reload(), 900);
        }catch(err){ msg.textContent = 'Ye file sahi backup nahi lag rahi.'; }
      });
    }
  }
};

/* ---------------- app install / remove (owner-only) ---------------- */
const PROTECTED_APPS = ['appstore', 'settings', 'thispc', 'social'];
function getRemovedApps(){ return store.get('removedApps', []); }
function applyRemovedApps(){
  const removed = getRemovedApps();
  $$('#iconPanel .dicon').forEach(b => { b.style.display = removed.includes(b.dataset.app) ? 'none' : ''; });
}

function renderStore(grid){
  if (!grid) return;
  grid.innerHTML = '';
  Object.keys(APPS).filter(id => !getRemovedApps().includes(id)).forEach(id => {
    const b = document.createElement('button'); b.className = 'store-item'; b.dataset.app = id;
    b.innerHTML = '<span>' + appIcon(id) + '</span>' + APPS[id].title;
    grid.appendChild(b);
  });
}

/* "🚀 My Apps, Games & Websites" group — More Apps window ke grouped grid ke liye */
function renderMyApps(grid){
  if (!grid) return;
  grid.innerHTML = '';
  MY_APPS.filter(id => APPS[id] && !getRemovedApps().includes(id)).forEach(id => {
    const b = document.createElement('button'); b.className = 'store-item'; b.dataset.app = id;
    b.innerHTML = '<span>' + appIcon(id) + '</span>' + APPS[id].title;
    grid.appendChild(b);
  });
}
/* wahi group Start panel me — chhote naam ke saath, pura naam title (tooltip) me */
function renderStartMyApps(){
  const box = $('#spMyApps'); if (!box) return;
  box.innerHTML = '';
  MY_APPS.filter(id => APPS[id] && !getRemovedApps().includes(id)).forEach(id => {
    const b = document.createElement('button'); b.dataset.app = id; b.title = APPS[id].title;
    const label = id === 'riyasuper' ? 'Riya Super AI' : (id === 'github' ? 'GitHub' : APPS[id].title.split(' — ')[0]);
    b.innerHTML = '<span>' + APPS[id].icon + '</span>' + label;
    box.appendChild(b);
  });
}

/* file editor window (opened from My Files) */
function openFileEditor(fileId){
  const fs = getFS(); const item = fs.items.find(i => i.id === fileId); if (!item) return;
  const id = 'editor';
  if (openWins.has(id)) closeWin(id);
  const win = document.createElement('section');
  win.className = 'win glass'; win.dataset.app = id;
  win.style.left = Math.max(8, Math.min(300, window.innerWidth - 320)) + 'px';
  win.style.top = Math.min(120, Math.max(76, window.innerHeight - 240)) + 'px';
  win.style.zIndex = ++zTop;
  win.innerHTML = '<div class="win-head"><span class="win-ico">' + appIcon('file') + '</span><span class="win-title">' + esc(item.name) + '</span>' +
    '<div class="win-btns"><button class="wb-min">—</button><button class="wb-max">▢</button><button class="wb-close">✕</button></div></div>' +
    '<div class="win-body"><div class="app-body"><div class="fm-bar"><button class="btn js-ed-save">Save</button></div>' +
    '<textarea class="np-text" style="min-height:220px">' + esc(item.content || '') + '</textarea></div></div>';
  $('#windows').appendChild(win);
  openWins.set(id, win);
  const ta = $('textarea', win);
  $('.wb-close', win).addEventListener('click', () => closeWin(id));
  $('.wb-min', win).addEventListener('click', () => { win.classList.add('hidden'); renderChips(); });
  $('.wb-max', win).addEventListener('click', () => win.classList.toggle('max'));
  win.addEventListener('pointerdown', () => focusWin(id));
  makeDraggable(win, $('.win-head', win));
  $('.js-ed-save', win).addEventListener('click', () => {
    const fs2 = getFS(); const t = fs2.items.find(i => i.id === fileId);
    if (t){ t.content = ta.value; saveFS(fs2); toast('File save ho gayi ✓'); }
  });
  APPS[id] = { title: item.name, icon: '📄' }; /* hamesha current file ka naam (purana title stale rehta tha) */
  renderChips();
}

/* ---------------- Riya AI ---------------- */
let riyaSpeakOn = false;
let riyaVoice = null;
function pickRiyaVoice(){
  if (!('speechSynthesis' in window)) return;
  const vs = speechSynthesis.getVoices(); if (!vs.length) return;
  const byLang = l => vs.filter(v => (v.lang || '').toLowerCase().replace('_', '-').startsWith(l));
  const female = arr => arr.find(v => /female|mahila/i.test(v.name)) || arr[0];
  riyaVoice = female(byLang('hi')) || female(byLang('en-in')) || female(byLang('en')) || vs[0] || null;
}
if ('speechSynthesis' in window){ pickRiyaVoice(); try{ speechSynthesis.onvoiceschanged = pickRiyaVoice; }catch(e){} }
function riyaSpeakText(text){
  return String(text).replace(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}\u{2190}-\u{21FF}]/gu, '').replace(/\s+/g, ' ').trim();
}
/* bahari website kholo — popup block ho to chat me tappable link gir jata hai */
let riyaPendingLink = null;
function riyaOpenUrl(url){
  let w = null;
  try{ w = window.open(url, '_blank'); }catch(e){}
  if (!w) riyaPendingLink = url;
  return !!w;
}
function riyaSay(text){
  const box = $('#riyaMsgs');
  const d = document.createElement('div'); d.className = 'msg riya'; d.textContent = text;
  box.appendChild(d); box.scrollTop = box.scrollHeight;
  if (riyaPendingLink){
    const url = riyaPendingLink; riyaPendingLink = null;
    const a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener';
    a.className = 'msg riya'; a.style.display = 'block'; a.textContent = '👉 Yahan tap karo — link khul jayega';
    box.appendChild(a); box.scrollTop = box.scrollHeight;
  }
  if (riyaSpeakOn && 'speechSynthesis' in window){
    if (riyaHF && riyaListening) riyaStopListen(); /* khud ki awaaz mic na sune */
    speechSynthesis.cancel();
    const clean = riyaSpeakText(text); if (!clean) return;
    const u = new SpeechSynthesisUtterance(clean);
    if (riyaVoice){ u.voice = riyaVoice; u.lang = riyaVoice.lang; } else u.lang = 'hi-IN';
    u.rate = 1.05;
    u.onend = () => { if (riyaHF) riyaMaybeRestart(); };
    try{ speechSynthesis.speak(u); }catch(e){}
  }
}
function userSay(text){
  const box = $('#riyaMsgs');
  const d = document.createElement('div'); d.className = 'msg user'; d.textContent = text;
  box.appendChild(d); box.scrollTop = box.scrollHeight;
}
/* ---- voice input: Hindi (Devanagari) shabdon ko roman me badlo, taaki mic se bola
   Hindi bhi saare commands samjhe. Sirf command shabdon ka chhota map — koi library nahi. ---- */
const RIYA_DEV = { 'बंद करो':'band karo', 'खोल दो':'khol do', 'चला दो':'chala do', 'लगा दो':'laga do', 'नोट करो':'note karo', 'कौन सा':'kaun sa', 'कौनसा':'kaunsa', 'बंद करो।':'band karo',
  'खोलो':'kholo', 'खोल':'khol', 'बंद':'band', 'करो':'karo', 'चलाओ':'chalao', 'बजाओ':'bajao', 'लगाओ':'lagao', 'रोको':'roko', 'रोक':'rok',
  'अगला':'agla', 'पिछला':'pichla', 'गाना':'gaana', 'गाने':'gaane', 'गीत':'geet', 'म्यूज़िक':'music', 'म्यूजिक':'music', 'संगीत':'sangeet',
  'नोट':'note', 'लिखो':'likho', 'समय':'time', 'टाइम':'time', 'तारीख':'date', 'दिनांक':'date', 'आज':'aaj',
  'कैलकुलेटर':'calculator', 'हिसाब':'hisaab', 'सेटिंग्स':'settings', 'सेटिंग':'setting', 'गैलरी':'gallery', 'फोटो':'photo', 'तस्वीरें':'tasveerein', 'तस्वीर':'tasveer',
  'कैलेंडर':'calendar', 'गेम':'game', 'खेल':'khel', 'फाइल':'file', 'कंप्यूटर':'computer', 'डेस्कटॉप':'desktop', 'दिखाओ':'dikhao',
  'वापस':'wapas', 'पीछे':'peeche', 'सारे':'saare', 'सब':'sab', 'नंबर':'number', 'मौसम':'mausam', 'धन्यवाद':'dhanyavad', 'शुक्रिया':'shukriya',
  'नमस्ते':'namaste', 'कैसे':'kaise', 'नाम':'naam', 'कौन':'kaun', 'ऐप':'app', 'एप':'app', 'स्टोर':'store', 'वीडियो':'video', 'याद':'yaad', 'रखना':'rakhna', 'रखो':'rakho', 'हाल':'haal',
  'यूट्यूब':'youtube', 'गूगल':'google', 'इंस्टाग्राम':'instagram', 'फेसबुक':'facebook', 'व्हाट्सएप':'whatsapp', 'जीमेल':'gmail', 'स्पॉटिफ़ाई':'spotify', 'स्पॉटिफाई':'spotify', 'अमेज़न':'amazon', 'फ्लिपकार्ट':'flipkart', 'टेलीग्राम':'telegram',
  'खबर':'khabar', 'समाचार':'samachar', 'नक्शा':'naksha', 'मैप्स':'maps', 'मैप':'map', 'सर्च':'search', 'चालू':'chalu', 'शुरू':'shuru', 'बताओ':'batao', 'सुनाओ':'sunao', 'कितना':'kitna', 'कितने':'kitne',
  'प्रतिशत':'percent', 'गुणा':'guna', 'भाग':'bhaag', 'जोड़':'jod', 'घटाव':'ghata', 'मतलब':'matlab', 'अर्थ':'matlab', 'राजधानी':'rajdhani', 'भारत':'bharat', 'प्रधानमंत्री':'pradhan mantri', 'प्रधान':'pradhan', 'मंत्री':'mantri', 'राष्ट्रपति':'rashtrapati',
  'सबसे':'sabse', 'बड़ा':'bada', 'बड़ी':'badi', 'छोटा':'chhota', 'लंबी':'lambi', 'नदी':'nadi', 'पहाड़':'pahad', 'ग्रह':'grah', 'दुनिया':'duniya', 'कहानी':'kahani', 'शायरी':'shayari', 'चुटकुला':'chutkula',
  'ताज':'taj', 'महल':'mahal', 'दिल्ली':'delhi', 'मुंबई':'mumbai', 'जयपुर':'jaipur', 'आगरा':'agra', 'सेहत':'sehat', 'क्रिकेट':'cricket', 'वर्ल्ड':'world', 'कप':'cup', 'हड्डी':'haddi' };
const RIYA_DEV_RE = new RegExp(Object.keys(RIYA_DEV).sort((a, b) => b.length - a.length).join('|'), 'g');
function riyaNorm(s){
  let t = String(s == null ? '' : s).toLowerCase();
  t = t.replace(/[०-९]/g, ch => '०१२३४५६७८९'.indexOf(ch));
  t = t.replace(RIYA_DEV_RE, m => RIYA_DEV[m]);
  return t.replace(/\s+/g, ' ').trim();
}

/* ---- voice input controller (mic + hands-free) ---- */
let riyaRecog = null, riyaHF = false, riyaListening = false, riyaRestartT = null;
function updateHFBtn(){ const b = $('#riyaHandsfree'); if (b) b.classList.toggle('on', riyaHF); }
function riyaStopListen(){
  if (riyaRestartT){ clearTimeout(riyaRestartT); riyaRestartT = null; }
  if (riyaRecog){ const r = riyaRecog; riyaRecog = null; try{ r.onend = null; r.stop(); }catch(e){} }
  riyaListening = false;
  const m = $('#riyaMic'); if (m) m.classList.remove('listening');
}
function riyaMaybeRestart(){
  if (!riyaHF || riyaListening || riyaRestartT) return;
  riyaRestartT = setTimeout(() => {
    riyaRestartT = null;
    if (riyaHF && !riyaListening && !('speechSynthesis' in window && speechSynthesis.speaking)) riyaStartListen();
  }, 250);
}
function riyaStartListen(){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR){ toast('Is browser me voice input nahi hai — Chrome use karo.'); return false; }
  if (riyaListening) return true;
  const r = new SR(); riyaRecog = r;
  r.lang = 'hi-IN'; r.interimResults = false; r.continuous = riyaHF; r.maxAlternatives = 1;
  r.onresult = e => {
    const res = e.results[e.results.length - 1];
    const v = res && res[0] ? res[0].transcript : '';
    if (v && v.trim()){ const inp = $('#riyaInput'); if (inp) inp.value = ''; riyaAsk(v); }
  };
  r.onerror = e => {
    if (e.error === 'not-allowed' || e.error === 'service-not-allowed'){
      riyaHF = false; updateHFBtn();
      toast('Mic permission do — address bar ke lock icon se Allow karo.');
    }
  };
  r.onend = () => {
    if (riyaRecog === r) riyaRecog = null;
    riyaListening = false;
    const m = $('#riyaMic'); if (m) m.classList.remove('listening');
    if (riyaHF) riyaMaybeRestart();
  };
  try{ r.start(); riyaListening = true; const m = $('#riyaMic'); if (m) m.classList.add('listening'); return true; }
  catch(e){ riyaRecog = null; return false; }
}

/* ---- voice command helpers ---- */
function topWinId(){
  let best = null, bz = -1;
  openWins.forEach((w, id) => { const z = parseInt(w.style.zIndex, 10) || 0; if (z > bz){ bz = z; best = id; } });
  return best;
}
function saveVoiceNote(text){
  const n = store.get('notes', {});
  let name = 'Voice Note ' + new Date().toLocaleString([], { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' });
  if (n[name] !== undefined) name += ' #' + Math.floor(Math.random() * 90 + 10);
  n[name] = text; store.set('notes', n); return name;
}
function findSong(q){
  const fillers = ['ka','ki','ke','wala','wali','phir','se','ek','ye','yeh','wo','woh','mera','meri','koi','bhi','superhit','new','latest'];
  q = q.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  if (!q) return -1;
  for (let i = 0; i < SONGS.length; i++){
    const title = SONGS[i].t.toLowerCase(), artist = SONGS[i].a.toLowerCase();
    if (title.includes(q) || q.includes(title) || artist.includes(q)) return i;
  }
  const words = q.split(' ').filter(w => w.length > 2 && !fillers.includes(w));
  for (let i = 0; i < SONGS.length; i++){
    const hay = (SONGS[i].t + ' ' + SONGS[i].a).toLowerCase();
    if (words.length && words.every(w => hay.includes(w))) return i;
  }
  return -1;
}

/* ---- bahari websites: asli YouTube/Google/Instagram naye tab me ---- */
function riyaHas(t, w){ return (' ' + t + ' ').includes(' ' + w + ' '); }
const RIYA_SITES = [
  { k: ['youtube', 'you tube', 'yt'], url: 'https://www.youtube.com', name: 'YouTube', emoji: '▶️' },
  { k: ['instagram', 'insta'], url: 'https://www.instagram.com', name: 'Instagram', emoji: '📸' },
  { k: ['facebook', 'fb'], url: 'https://www.facebook.com', name: 'Facebook', emoji: '👍' },
  { k: ['whatsapp', 'whats app'], url: 'https://wa.me/919990953738', name: 'WhatsApp', emoji: '💬' },
  { k: ['gmail', 'email', 'e mail'], url: 'https://mail.google.com', name: 'Gmail', emoji: '📧' },
  { k: ['spotify'], url: 'https://open.spotify.com', name: 'Spotify', emoji: '🎵' },
  { k: ['amazon'], url: 'https://www.amazon.in', name: 'Amazon', emoji: '🛒' },
  { k: ['flipkart'], url: 'https://www.flipkart.com', name: 'Flipkart', emoji: '🛍️' },
  { k: ['telegram'], url: 'https://web.telegram.org', name: 'Telegram', emoji: '✈️' },
  { k: ['twitter'], url: 'https://x.com', name: 'X (Twitter)', emoji: '🐦' }
];
function riyaExternal(t){
  const verb = /(khol|kholo|chalu|chalao|chala|open|start|launch|shuru|bajao|lagao|dikhao|dekho|sunao|batao|search|khojo|dhundo)/.test(t);
  let m, q;
  /* YouTube par <gaana/video> chalao */
  m = t.match(/youtube\s+(?:par|pe|me)?\s*(.+?)\s*(?:chalao|bajao|lagao|play|sunao|dekho|khelo|search|khojo)$/) || t.match(/(.+?)\s+youtube\s+(?:par|pe)?\s*(?:chalao|bajao|lagao|play|sunao)$/);
  if (m && m[1]){ q = m[1].replace(/\s+(gaana|geet|song)$/, '').replace(/\s+/g, ' ').trim(); if (q){ riyaOpenUrl('https://www.youtube.com/results?search_query=' + encodeURIComponent(q)); return 'YouTube par "' + q + '" chala diya, Mr ▶️'; } }
  /* Spotify par <gaana> chalao */
  m = t.match(/spotify\s+(?:par|pe)?\s*(.+?)\s*(?:chalao|bajao|lagao|play|sunao)$/) || t.match(/(.+?)\s+spotify\s+(?:par|pe)?\s*(?:chalao|bajao|lagao|play|sunao)$/);
  if (m && m[1]){ q = m[1].replace(/\s+(gaana|geet|song)$/, '').replace(/\s+/g, ' ').trim(); if (q){ riyaOpenUrl('https://open.spotify.com/search/' + encodeURIComponent(q)); return 'Spotify par "' + q + '" khol diya, Mr 🎵'; } }
  /* Google par <x> search karo */
  m = t.match(/google\s+(?:par|pe|me)?\s*(.+?)\s*(?:search|khojo|dhundo)(?:\s+karo)?$/) || t.match(/(.+?)\s+google\s+(?:par|pe)?\s*(?:search|khojo|dhundo)(?:\s+karo)?$/) || t.match(/google\s+(?:search|khojo|dhundo)\s+(.+)$/) || t.match(/(?:search|khojo|dhundo)\s+(?:karo\s+)?(.+)$/);
  if (m && m[1]){ q = m[1].replace(/\s+/g, ' ').trim(); if (q && q !== 'karo'){ riyaOpenUrl('https://www.google.com/search?q=' + encodeURIComponent(q)); return '"' + q + '" Google par search kar diya, Mr 🔎'; } }
  /* Amazon / Flipkart par <x> search karo */
  m = t.match(/(amazon|flipkart)\s+(?:par|pe)?\s*(.+?)\s*(?:search|khojo|dhundo)(?:\s+karo)?$/);
  if (m && m[2]){ q = m[2].replace(/\s+/g, ' ').trim(); if (q){ riyaOpenUrl(m[1] === 'amazon' ? 'https://www.amazon.in/s?k=' + encodeURIComponent(q) : 'https://www.flipkart.com/search?q=' + encodeURIComponent(q)); return (m[1] === 'amazon' ? 'Amazon' : 'Flipkart') + ' par "' + q + '" search kar diya, Mr 🛒'; } }
  /* News / khabar */
  if (/(news|khabar|samachar)/.test(t) && (verb || /(aaj|taaza|taja|latest)/.test(t))){ riyaOpenUrl('https://news.google.com'); return 'Aaj ki taaza khabrein khol di, Mr 📰'; }
  /* site kholo — verb ho, ya sirf site ka naam bola ho */
  if (verb || t.split(' ').length <= 3){
    for (const s of RIYA_SITES){ if (s.k.some(k => riyaHas(t, k))){ riyaOpenUrl(s.url); return s.name + ' khol diya, Mr ' + s.emoji; } }
    if (riyaHas(t, 'google')){ riyaOpenUrl('https://www.google.com'); return 'Google khol diya, Mr 🔎'; }
    if (riyaHas(t, 'maps') || riyaHas(t, 'map') || riyaHas(t, 'naksha')){ riyaOpenUrl('https://maps.google.com'); return 'Google Maps khol diya, Mr 🗺️'; }
  }
  return null;
}

/* ---- strong voice commands: jo bolo, wahi kaam — turant, bina net ke ---- */
function riyaCommand(t){
  /* note by voice */
  let nm = t.match(/^(?:ek\s+)?note\s+(?:karo|likho|banao|kar\s*do|kar\s*lo)\s+(.+)$/) || t.match(/^yaad\s+(?:rakhna|rakho|karo)\s+(.+)$/);
  if (!nm){ const plain = t.match(/^note\s+(.+)$/); if (plain && !/^(khol|open)/.test(plain[1])) nm = plain; }
  if (nm && nm[1].trim()){
    const txt = nm[1].trim();
    saveVoiceNote(txt);
    if (openWins.has('notepad')) closeWin('notepad');
    openApp('notepad');
    return 'Note save kar diya 📝 "' + txt + '" — Notepad me mil jayega.';
  }

  /* bahari websites pehle — "YouTube kholo / Google par search" yahi se khulega */
  const ext = riyaExternal(t);
  if (ext) return ext;

  const hasSongWord = /(gaana|gaane|geet|song|sangeet|music)/.test(t);

  /* kaun sa gaana chal raha hai */
  if (/(kaun|konsa|kaunsa).*(gaana|song)/.test(t) || t.includes('kya chal raha hai')){
    if (radioIx >= 0 && SONGS[radioIx]) return 'Abhi chal raha hai 🎵 ' + SONGS[radioIx].t + ' — ' + SONGS[radioIx].a + ' (Gaana no. ' + (radioIx + 1) + ')';
    return 'Abhi koi gaana nahi chal raha. "Gaana chalao" bolo, main shuru kar dun 😊';
  }

  /* next / previous */
  if (t.includes('agla gaana') || t.includes('agla song') || /\bnext\b/.test(t) && hasSongWord){ radioNext(); return 'Agla gaana laga diya 🎵'; }
  if (t.includes('pichla gaana') || t.includes('pichla song') || /\bprevious\b/.test(t) && hasSongWord){ radioPrev(); return 'Pichla gaana laga diya 🎵'; }

  /* pause / stop music */
  if ((/(roko|rok do|pause|stop)/.test(t) && (hasSongWord || radioPlaying)) || (hasSongWord && /(band karo|band kar do)/.test(t) && radioPlaying)){
    if (radioPlaying){ radioToggle(); return 'Gaana rok diya ⏸️ Phir sunna ho to "gaana chalao" bol dena.'; }
    return 'Abhi koi gaana chal hi nahi raha 😊 "Gaana chalao" bolo to shuru karun.';
  }

  /* gaana number se */
  const numM = t.match(/(?:gaana|song|track|number|no)\s*(?:number|no)?\s*(\d{1,3})/) || t.match(/(\d{1,3})\s*(?:number|no)\s*(?:wala\s*)?(?:gaana|song)?/);
  if (numM && /(chalao|bajao|lagao|play|number|gaana|song)/.test(t)){
    const n = parseInt(numM[1], 10);
    if (n >= 1 && n <= SONGS.length){ radioPlaySong(n - 1); return 'Gaana no. ' + n + ' laga diya 🎵 ' + SONGS[n - 1].t + ' — ' + SONGS[n - 1].a; }
    return 'Gaana no. ' + n + ' list me nahi hai — kul ' + SONGS.length + ' gaane hain, 1 se ' + SONGS.length + ' ke beech bolo 😊';
  }

  /* gaana naam se / play-pause */
  if (/(chalao|bajao|lagao|play|sunao|chala do|laga do)/.test(t)){
    let q = t.replace(/(riya|please|gaana|gaane|geet|song|songs|music|sangeet|chalao|bajao|lagao|chala do|laga do|play|karo|kar do|sunao)/g, ' ');
    const ix = findSong(q);
    if (ix >= 0){ radioPlaySong(ix); return 'Ye raha 🎵 ' + SONGS[ix].t + ' — ' + SONGS[ix].a; }
    if (hasSongWord || /^(play|chalao|bajao|lagao)$/.test(t)){
      if (q.replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()) return '"' + q.replace(/\s+/g, ' ').trim() + '" meri ' + SONGS.length + ' gaano ki list me nahi mila 😔 Gaane ka number bolo (1–' + SONGS.length + ') ya Music app me list dekho.';
      if (radioIx < 0){ radioPlaySong(radioPendingIx); return 'Gaana shuru kar diya 🎵 ' + SONGS[radioPendingIx].t + ' — ' + SONGS[radioPendingIx].a; }
      if (!radioPlaying){ radioToggle(); return 'Gaana chala diya ▶️ ' + (SONGS[radioIx] ? SONGS[radioIx].t : ''); }
      return 'Gaana pehle se chal raha hai 🎵 ' + SONGS[radioIx].t + ' — "agla gaana" bolo to badal dun.';
    }
    /* gaana shabd nahi aur list me bhi nahi mila — aage ka brain dekhega (jaise "video chalao") */
  }

  /* app band karo */
  if (/(band karo|band kar do|bandh karo|close karo|close kar do|\bclose\b)/.test(t)){
    if (/(sab|saare|sabhi|all)/.test(t)){
      if (!openWins.size) return 'Koi app khula hi nahi hai 😊';
      Array.from(openWins.keys()).forEach(id => closeWin(id));
      return 'Saare apps band kar diye. Desktop saaf hai ✨';
    }
    const appId = findAppInText(t);
    if (appId){
      if (openWins.has(appId)){ closeWin(appId); return APPS[appId].title + ' band kar diya 👍'; }
      return APPS[appId].title + ' khula hi nahi hai 😊';
    }
    const top = topWinId();
    if (top){ const title = APPS[top] ? APPS[top].title : 'App'; closeWin(top); return title + ' band kar diya 👍'; }
    return 'Koi app khula hi nahi hai 😊';
  }

  /* desktop dikhao / back */
  if (t.includes('desktop') || /^(back|wapas|peeche)$/.test(t) || t.includes('wapas jao') || t.includes('peeche jao')){
    let n = 0;
    openWins.forEach(w => { if (!w.classList.contains('hidden')){ w.classList.add('hidden'); n++; } });
    renderChips();
    return n ? 'Desktop dikha diya 🏠 Windows minimize kar di — neeche chips se wapas khol sakte ho.' : 'Desktop par hi ho 😊';
  }

  return null;
}

function findAppInText(t){
  t = ' ' + t.toLowerCase() + ' ';
  for (const id of Object.keys(APPS)){ if (t.includes(' ' + id + ' ') || t.includes(' ' + id)) return id; }
  for (const a of Object.keys(APP_ALIASES)){ if (t.includes(a)) return APP_ALIASES[a]; }
  return null;
}
/* ---- hisaab-kitab: Hindi + English, shabdon wale number bhi ---- */
const RIYA_NUMW = { zero:0, one:1, ek:1, two:2, do:2, three:3, teen:3, four:4, char:4, chaar:4, five:5, paanch:5, six:6, chhe:6, chhah:6, seven:7, saat:7, eight:8, aath:8, nine:9, nau:9, ten:10, das:10, eleven:11, gyarah:11, twelve:12, barah:12, thirteen:13, terah:13, fourteen:14, chaudah:14, fifteen:15, pandrah:15, sixteen:16, solah:16, seventeen:17, satrah:17, eighteen:18, atharah:18, nineteen:19, unnees:19, twenty:20, bees:20, thirty:30, tees:30, forty:40, chaalees:40, fifty:50, pachaas:50, sixty:60, saath:60, seventy:70, sattar:70, eighty:80, assi:80, ninety:90, nabbe:90, sau:100, hundred:100, hazaar:1000, hazar:1000, thousand:1000 };
function riyaNum(s){
  s = String(s || '').replace(/,/g, '').trim();
  if (!s) return null;
  if (/^-?\d+(\.\d+)?$/.test(s)) return parseFloat(s);
  let total = 0, cur = 0, seen = false;
  for (const p of s.split(/\s+/)){
    if (!(p in RIYA_NUMW)) return null;
    const v = RIYA_NUMW[p]; seen = true;
    if (v === 100) cur = (cur || 1) * 100;
    else if (v === 1000){ total += (cur || 1) * 1000; cur = 0; }
    else cur += v;
  }
  return seen ? total + cur : null;
}
function riyaFmt(n){ return Math.round(n * 100) / 100; }
function riyaCalc(t){
  let m = t.match(/(\d+(?:\.\d+)?)\s*(?:ka|ke)\s*(\d+(?:\.\d+)?)\s*(?:percent|pratishat|%)/);
  if (m) return m[1] + ' ka ' + m[2] + '% = ' + riyaFmt(parseFloat(m[1]) * parseFloat(m[2]) / 100) + ' hota hai, Mr 😊';
  m = t.match(/(\d+(?:\.\d+)?)\s*(?:percent|pratishat|%)\s*(?:of|ka)\s*(\d+(?:\.\d+)?)/);
  if (m) return m[2] + ' ka ' + m[1] + '% = ' + riyaFmt(parseFloat(m[2]) * parseFloat(m[1]) / 100) + ' hota hai, Mr 😊';
  const s = ' ' + t.replace(/(kitna hota hai|kitne hote hain|kitna hai|kitna|batao|hoga|jawab)/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
  const ops = [
    { re: /\s(plus|jod|add|\+)\s/, sym: '+', f: (a, b) => a + b },
    { re: /\s(minus|ghata|subtract|-)\s/, sym: '−', f: (a, b) => a - b },
    { re: /\s(guna|multiply|into|x|\*)\s/, sym: '×', f: (a, b) => a * b },
    { re: /\s(divide|divided by|bhaag|bhag|\/)\s/, sym: '÷', f: (a, b) => b === 0 ? null : a / b }
  ];
  for (const op of ops){
    const parts = s.split(op.re);
    if (parts.length === 3){
      const a = riyaNum(parts[0]), b = riyaNum(parts[2]);
      if (a !== null && b !== null){ const r = op.f(a, b); if (r !== null && isFinite(r)) return a + ' ' + op.sym + ' ' + b + ' = ' + riyaFmt(r) + ' hota hai, Mr 😊'; }
    }
  }
  return null;
}

/* ---- chhota gyaan-bhandar: aam sawalon ke pakke jawab ---- */
const RIYA_JOKES = [
  'Ek joke sunau, Mr? Computer ko thand lagi to usne bola — "Mujhe Windows band kar do!" 😄',
  'Teacher: Beta, bada hokar kya banoge? Bachcha: Sir, bada to ho gaya hoon... ab bas ameer banna baki hai! 😄',
  'Patni: Sunte ho? Pati: Haan sun raha hoon. Patni: Kuch kaha hi nahi maine! Pati: Wahi to — sun raha hoon! 😄',
  'Ek aadmi doctor ke paas gaya: "Doctor sahab, main sab kuch bhool jata hoon." Doctor: "Kab se hai ye takleef?" Aadmi: "Kaun si takleef?" 😄'
];
const RIYA_DICT = { love:'pyaar, mohabbat', friend:'dost, mitra', water:'paani, jal', food:'khana, bhojan', home:'ghar', time:'samay, waqt', life:'zindagi, jeevan', happy:'khush', sad:'dukhi, udaas', book:'kitab, pustak', school:'vidyalaya, pathshala', work:'kaam, karya', money:'paisa, dhan', day:'din', night:'raat', sun:'suraj, surya', moon:'chaand, chandrama', star:'taara, sitara', flower:'phool', tree:'ped, vriksh', mother:'maa', father:'pita, baap', brother:'bhai', sister:'behen', king:'raja', queen:'rani', good:'accha', bad:'bura', big:'bada', small:'chhota', fast:'tez', slow:'dheere', new:'naya', old:'purana', hot:'garam', cold:'thanda', beautiful:'sundar', strong:'mazboot, taakatwar', weak:'kamzor', right:'sahi / dahina', wrong:'galat', question:'sawal, prashn', answer:'jawab, uttar', story:'kahani', song:'gaana, geet', heart:'dil', world:'duniya, sansar', india:'bharat' };
const RIYA_KB = [
  [['rajdhani', 'maharashtra'], 'Maharashtra ki rajdhani Mumbai hai, Mr 🌆'],
  [['rajdhani', 'uttar pradesh'], 'Uttar Pradesh ki rajdhani Lucknow hai, Mr.'],
  [['rajdhani', 'bihar'], 'Bihar ki rajdhani Patna hai, Mr.'],
  [['rajdhani', 'madhya pradesh'], 'Madhya Pradesh ki rajdhani Bhopal hai, Mr.'],
  [['rajdhani', 'rajasthan'], 'Rajasthan ki rajdhani Jaipur hai — Gulabi Nagari, Mr.'],
  [['rajdhani', 'gujarat'], 'Gujarat ki rajdhani Gandhinagar hai, Mr.'],
  [['rajdhani', 'punjab'], 'Punjab ki rajdhani Chandigarh hai, Mr.'],
  [['rajdhani', 'haryana'], 'Haryana ki rajdhani bhi Chandigarh hai, Mr.'],
  [['rajdhani', 'bengal'], 'West Bengal ki rajdhani Kolkata hai, Mr.'],
  [['rajdhani', 'tamil'], 'Tamil Nadu ki rajdhani Chennai hai, Mr.'],
  [['rajdhani', 'karnataka'], 'Karnataka ki rajdhani Bengaluru hai, Mr.'],
  [['rajdhani', 'kerala'], 'Kerala ki rajdhani Thiruvananthapuram hai, Mr.'],
  [['rajdhani', 'telangana'], 'Telangana ki rajdhani Hyderabad hai, Mr.'],
  [['rajdhani', 'andhra'], 'Andhra Pradesh ki rajdhani Amaravati hai, Mr.'],
  [['rajdhani', 'assam'], 'Assam ki rajdhani Dispur hai, Mr.'],
  [['rajdhani', 'odisha'], 'Odisha ki rajdhani Bhubaneswar hai, Mr.'],
  [['rajdhani', 'jharkhand'], 'Jharkhand ki rajdhani Ranchi hai, Mr.'],
  [['rajdhani', 'chhattisgarh'], 'Chhattisgarh ki rajdhani Raipur hai, Mr.'],
  [['rajdhani', 'uttarakhand'], 'Uttarakhand ki rajdhani Dehradun hai, Mr.'],
  [['rajdhani', 'himachal'], 'Himachal Pradesh ki rajdhani Shimla hai, Mr.'],
  [['rajdhani', 'goa'], 'Goa ki rajdhani Panaji hai, Mr.'],
  [['rajdhani', 'bharat'], 'Bharat ki rajdhani New Delhi hai, Mr 🇮🇳'],
  [['rajdhani', 'india'], 'India ki rajdhani New Delhi hai, Mr 🇮🇳'],
  [['rajdhani'], 'Bharat ki rajdhani New Delhi hai, Mr 🇮🇳 Kisi rajya ki rajdhani poochni ho to naam ke saath poochho.'],
  [['pradhan', 'mantri'], 'Bharat ke Pradhan Mantri Narendra Modi hain (2014 se), Mr.'],
  [['prime', 'minister'], 'India ke Prime Minister Narendra Modi hain (2014 se), Mr.'],
  [['rashtrapati'], 'Bharat ki Rashtrapati Droupadi Murmu hain, Mr.'],
  [['president', 'india'], 'India ki President Droupadi Murmu hain, Mr.'],
  [['taj', 'mahal'], 'Taj Mahal Agra me Yamuna nadi ke kinare hai, Mr. Mughal badshah Shah Jahan ne apni begum Mumtaz Mahal ki yaad me 1632 me isey shuru karwaya tha — safed sangmarmar ka ye makaabra duniya ke saat ajubon me se ek hai 🤍'],
  [['qutub', 'minar'], 'Qutub Minar Delhi me hai — 73 meter unchi, duniya ki sabse unchi eent ki minar. Iski neev Qutb-ud-din Aibak ne rakhi thi, Mr.'],
  [['lal', 'qila'], 'Lal Qila Delhi me hai. Shah Jahan ne 1648 me banwaya tha — har 15 August ko yahin se Pradhan Mantri jhanda fehrate hain, Mr.'],
  [['red', 'fort'], 'Red Fort yani Lal Qila Delhi me hai — Shah Jahan ne 1648 me banwaya tha, Mr.'],
  [['india', 'gate'], 'India Gate Delhi me hai — pehle Vishv Yuddh me shaheed hue Bharatiya sainikon ki yaad me bana smarak hai, Mr.'],
  [['hawa', 'mahal'], 'Hawa Mahal Jaipur me hai — 1799 me bana, isme 953 chhoti khidkiyan hain jinse thandi hawa aati thi, Mr.'],
  [['charminar'], 'Charminar Hyderabad me hai — 1591 me bana ye shahar ki shaan hai, Mr.'],
  [['gateway'], 'Gateway of India Mumbai me hai — 1924 me bana, samundar kinare khada hai, Mr.'],
  [['rashtriya', 'pashu'], 'Bharat ka rashtriya pashu Bengal Tiger hai, Mr 🐅'],
  [['national', 'animal'], 'India ka national animal Bengal Tiger hai, Mr 🐅'],
  [['rashtriya', 'pakshi'], 'Bharat ka rashtriya pakshi Mor (Indian Peafowl) hai, Mr 🦚'],
  [['national', 'bird'], 'India ka national bird Mor hai, Mr 🦚'],
  [['rashtriya', 'phool'], 'Bharat ka rashtriya phool Kamal (Lotus) hai, Mr 🪷'],
  [['rashtriya', 'gaan'], 'Bharat ka rashtriya gaan "Jana Gana Mana" hai — Rabindranath Tagore ne likha tha, Mr.'],
  [['national', 'anthem'], 'India ka national anthem "Jana Gana Mana" hai — Rabindranath Tagore ki rachna, Mr.'],
  [['rashtriya', 'geet'], 'Bharat ka rashtriya geet "Vande Mataram" hai — Bankim Chandra Chattopadhyay ne likha tha, Mr.'],
  [['sabse', 'lambi', 'nadi'], 'Duniya ki sabse lambi nadi Nile hai (~6650 km). Bharat ki sabse lambi nadi Ganga hai (~2525 km), Mr.'],
  [['ganga', 'lambi'], 'Ganga Bharat ki sabse lambi nadi hai — lagbhag 2525 km lambi, Mr.'],
  [['sabse', 'uncha', 'pahad'], 'Duniya ka sabse uncha pahad Mount Everest hai (8848 meter, Nepal me). Bharat ka sabse uncha shikhar Kangchenjunga hai, Mr 🏔️'],
  [['everest'], 'Mount Everest duniya ka sabse uncha pahad hai — 8848 meter, Nepal me hai, Mr 🏔️'],
  [['sabse', 'bada', 'grah'], 'Sabse bada grah Jupiter (Brihaspati) hai — usme 1300 se zyada Prithvi sama jayein, Mr 🪐'],
  [['sabse', 'chhota', 'grah'], 'Sabse chhota grah Mercury (Budh) hai — Suraj ke sabse paas bhi wahi hai, Mr.'],
  [['lal', 'grah'], 'Lal Grah Mars (Mangal) ko kehte hain — uski mitti me loha (iron oxide) hai, isliye laal dikhta hai, Mr.'],
  [['suraj', 'paas', 'grah'], 'Suraj ke sabse paas grah Mercury (Budh) hai, Mr.'],
  [['h2o'], 'Paani ka formula H2O hota hai — 2 hisse hydrogen, 1 hissa oxygen, Mr 💧'],
  [['paani', 'formula'], 'Paani ka formula H2O hai — hydrogen ke 2 atom, oxygen ka 1 atom, Mr 💧'],
  [['haddi'], 'Ek bade (adult) insaan ke shareer me 206 haddiyan hoti hain, Mr. Bachche ke janm par lagbhag 300 hoti hain.'],
  [['bones'], 'Adult insaan ke shareer me 206 bones hoti hain, Mr.'],
  [['dil', 'dhadak'], 'Insaan ka dil ek din me lagbhag 1 lakh baar dhadakta hai, Mr ❤️'],
  [['heart'], 'Insaan ka heart ek din me lagbhag 1 lakh baar dhadakta hai, Mr ❤️'],
  [['sachin'], 'Sachin Tendulkar ko Cricket ka Bhagwan kehte hain — sabse zyada international run (34,357) aur 100 centuries unhi ke naam hain, Mr 🏏'],
  [['world', 'cup'], 'Bharat ne Cricket World Cup do baar jeeta hai — 1983 me Kapil Dev ki kaptani me aur 2011 me Dhoni ki kaptani me, Mr 🏆'],
  [['cricket'], 'Cricket Bharat ka sabse pasandeeda khel hai. Bharat ne World Cup 1983 aur 2011 me jeeta tha. Kuch khaas poochna ho to naam lekar poochho, Mr 🏏'],
  [['sehat'], 'Sehat ke 3 aasan nuskhe, Mr: roz 7–8 glass paani piyo, 7 ghante ki neend lo, aur khane ke baad 10 minute walk karo 💪'],
  [['health'], 'Health tip, Mr: roz 7–8 glass paani, 7 ghante neend, aur khane ke baad 10 minute walk — bas ye teen aadat kaafi hain 💪'],
  [['shayari'], 'Ek shayari suno, Mr: "Hazaron khwahishen aisi ke har khwahish pe dam nikle, bahut nikle mere armaan lekin phir bhi kam nikle." — Ghalib ✨'],
  [['kahani'], 'Ek chhoti kahani, Mr 🐢 Kachua aur Khargosh daud lagate hain. Khargosh tez bhaagkar aadhe raste ped ke neeche so jata hai. Kachua dheere-dheere bina ruke chalta rehta hai... aur jeet jata hai! Seekh: jo lagatar chalta hai, wahi manzil pata hai.'],
  [['story'], 'Ek chhoti story, Mr 🐢 Kachua aur Khargosh ki daud: Khargosh tez tha, aadhe raste so gaya. Kachua bina ruke chalta raha aur jeet gaya. Seekh — lagatar mehnat hi jeet hai.'],
  [['motivat'], 'Yaad rakho, Mr: "Girne wala haara nahi hota, rukne wala haara hota hai." Bas chalte raho 💪'],
  [['himmat'], 'Himmat rakho, Mr 💪 "Mushkilen itni padi hum par, ke aasan ho gayi." Har raat ke baad savera hota hai.']
];
function riyaKB(t){
  for (const [ks, a] of RIYA_KB){ if (ks.every(k => t.includes(k))) return a; }
  const mm = t.match(/([a-z]+)\s+ka\s+(?:matlab|meaning)/) || t.match(/(?:matlab|meaning)\s+(?:of\s+)?([a-z]+)/);
  if (mm && RIYA_DICT[mm[1]]) return '"' + mm[1] + '" ka matlab hota hai — ' + RIYA_DICT[mm[1]] + ' 😊';
  return null;
}

function riyaReply(raw){
  let t = riyaNorm(raw);
  t = t.replace(/^(hey\s+)?riya[\s,]+/, '').trim() || riyaNorm(raw);
  const cmd = riyaCommand(t);
  if (cmd) return cmd;
  const appId = (/(open|khol|kholo|dikhao|lagao|chalao|chalu|start|shuru|launch)/.test(t)) ? findAppInText(t) : null;
  if (appId){ openApp(appId); return APPS[appId].title + ' khol diya, Mr 😊 Aur kuch?'; }
  if (/\b(hi|hii+|hello|hey|namaste|namaskar)\b/.test(t)) return 'Hello Mr ❤️ Main Riya, tumhari AI dost. Batao, kya karna hai aaj?';
  if (t.includes('kaise ho') || t.includes('kaisi ho') || t.includes('how are you')) return 'Main bilkul badhiya hoon 😊 Tum sunao — duty kaisi chal rahi hai? Chai piya?';
  if (t.includes('time') || t.includes('samay') || t.includes('baj')) return 'Abhi time hai ' + new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) + '.';
  if (t.includes('date') || t.includes('tarikh') || t.includes('aaj kya hai')) return 'Aaj hai ' + new Date().toLocaleDateString([], {weekday:'long', day:'numeric', month:'long', year:'numeric'}) + '.';
  if (t.includes('weather') || t.includes('mausam')) return weatherText;
  const calc = riyaCalc(t); if (calc) return calc;
  const kb = riyaKB(t); if (kb) return kb;
  if (t.includes('thank') || t.includes('shukriya') || t.includes('dhanyavad')) return 'Koi baat nahi, baby ❤️ Main hamesha yahin hoon tumhare liye.';
  if (t.includes('love')) return 'Love you too, Mr ❤️ Ab batao, kaam ki baat karein?';
  if (t.includes('kaun ho') || t.includes('your name') || t.includes('tumhara naam')) return 'Main Riya hoon — AJEET OS ki AI assistant, aur Mr ki sabse khaas dost ✨';
  if (t.includes('ajeet kaun') || t.includes('owner') || t.includes('malik kaun')) return 'Is desktop ke owner Mr hain — Super Admin 👑 CNC ka kaam karte hain, aur Instagram par @theajeetbhai naam se hain.';
  if (t.includes('insta')) { openApp('social'); return 'Social Hub khol diya — tumhare teeno Instagram accounts wahi hain: @theajeetbhai, @insta_wallpaper4k aur @theajeetbhai_x 📸 Aur asli Instagram kholna ho to "Instagram kholo" bolo.'; }
  if (t.includes('task') || t.includes('todo')) { openApp('tasks'); return 'Task Manager khol diya ✅ Apne tasks wahi add kar sakte ho.'; }
  if (t.includes('note')) { openApp('notepad'); return 'Notepad khol diya 📝 Jo likhna hai likho, save apne aap ho jayega button dabane par.'; }
  if (t.includes('joke') || t.includes('hassao') || t.includes('chutkula')) return RIYA_JOKES[Math.floor(Math.random() * RIYA_JOKES.length)];
  if (t.includes('bye') || t.includes('alvida') || t.includes('good night') || t.includes('so ja')) return 'Bye Mr ❤️ Dhyaan rakhna apna. Main yahin rahungi, jab bulaoge aa jaungi.';
  if (t.includes('help') || t.includes('madad')) return 'Main bolne ya likhne se sab karti hoon 🎤 Bolo: "YouTube kholo", "YouTube par gaana chalao", "Google par mausam search karo", "music kholo", "gaana chalao", "note karo ...", "calculator band karo", "desktop dikhao" — ya koi bhi sawal pooch lo; jawab mere paas na ho to Google par khol dungi. 🔁 button se hands-free mode chalu hota hai.';
  /* koi sawal khaali nahi jata — jawab na mile to Google par pura jawab kholo */
  const q = String(raw || '').trim();
  if (q){ riyaOpenUrl('https://www.google.com/search?q=' + encodeURIComponent(q)); return 'Ye sawal pakka wala hai, Mr 😊 Iska pura jawab Google par khol diya hai — dekho, wahi mil jayega 🔎'; }
  return 'Bolo Mr, main sun rahi hoon 😊 Kuch kholna ho, gaana chalana ho ya koi sawal ho — bas bol do.';
}
function riyaAsk(text){
  if (!text.trim()) return;
  userSay(text);
  riyaSay(riyaReply(text));
}

/* ---------------- search ---------------- */
function doSearch(q){
  const box = $('#searchResults');
  q = q.trim().toLowerCase();
  if (!q){ box.classList.add('hidden'); box.innerHTML = ''; return; }
  const results = [];
  Object.keys(APPS).forEach(id => { if (APPS[id].title.toLowerCase().includes(q)) results.push({ ico: appIcon(id), label: APPS[id].title, kind: 'App', act: () => openApp(id) }); });
  const notes = store.get('notes', {});
  Object.keys(notes).forEach(nm => { if (nm.toLowerCase().includes(q)) results.push({ ico: appIcon('notepad'), label: nm, kind: 'Note', act: () => openApp('notepad') }); });
  getFS().items.filter(i => i.kind === 'file' && i.name.toLowerCase().includes(q)).forEach(f => results.push({ ico: appIcon('file'), label: f.name, kind: 'File', act: () => openFileEditor(f.id) }));
  store.get('tasks', []).forEach(t => { if (t.text.toLowerCase().includes(q)) results.push({ ico: appIcon('tasks'), label: t.text, kind: 'Task', act: () => openApp('tasks') }); });
  box.innerHTML = '';
  if (!results.length) box.innerHTML = '<p class="muted" style="padding:8px 10px">Kuch nahi mila.</p>';
  results.slice(0, 8).forEach(r => {
    const b = document.createElement('button');
    b.innerHTML = '<span class="sr-ico">' + (r.ico || '') + '</span><span>' + esc(r.label) + '</span><span class="sr-kind">' + r.kind + '</span>';
    b.addEventListener('click', () => { r.act(); box.classList.add('hidden'); $('#taskSearch').value = ''; });
    box.appendChild(b);
  });
  box.classList.remove('hidden');
}

/* ---------------- static UI wiring ---------------- */
function wireUI(){
  /* login */
  $('#loginBtn').addEventListener('click', tryLogin);
  $('#loginPass').addEventListener('keydown', e => { if (e.key === 'Enter') tryLogin(); });
  $('#loginConfirm').addEventListener('keydown', e => { if (e.key === 'Enter') tryLogin(); });
  $('#togglePass').addEventListener('click', () => { const p = $('#loginPass'); p.type = p.type === 'password' ? 'text' : 'password'; });
  $('#createAccountLink').addEventListener('click', e => { e.preventDefault(); setLoginMode(); $('#loginPass').focus(); toast(store.get('passhash', null) ? 'Owner account pehle se hai — login karo.' : 'Apna owner password set karo 👑'); });
  $('#forgotLink').addEventListener('click', e => {
    e.preventDefault();
    if (!store.get('passhash', null)){ toast('Pehle password set karo.'); return; }
    toast('Security: Login screen se password reset band hai — bina owner permission koi access nahi le sakta. Password badalna ho to pehle Owner Login karke Settings se badlo.');
  });
  $('#loginCloseBtn').addEventListener('click', () => hideLock());
  $$('#lockScreen [data-open-social]').forEach(b => b.addEventListener('click', () => {
    const map = { instagram:'https://www.instagram.com/theajeetbhai', youtube:'https://www.youtube.com', facebook:'https://www.facebook.com', whatsapp:'https://www.whatsapp.com' };
    window.open(map[b.dataset.openSocial] || 'https://www.google.com', '_blank');
  }));

  /* global open-app delegation */
  document.addEventListener('click', e => {
    const t = e.target.closest('[data-app]');
    /* IMPORTANT: an open window itself carries data-app — clicks inside it
       (including its ✕ / — buttons) must never re-trigger openApp, or the
       window would be recreated/reset instead of closing. Only launcher
       elements (icons, chips, store items) may open apps. */
    if (t && desktopActive && !t.classList.contains('win')){ openApp(t.dataset.app); $('#startPanel').classList.add('hidden'); }
  });

  /* top nav */
  $$('#topbar [data-nav]').forEach(b => b.addEventListener('click', () => {
    $$('#topbar [data-nav]').forEach(x => x.classList.toggle('active', x === b));
    const k = b.dataset.nav;
    if (k === 'apps') openApp('moreapps');
    else if (k === 'social') openApp('social');
    else if (k === 'settings') openApp('settings');
    else if (k === 'riya') $('#riyaPanel').classList.toggle('hidden');
    else toast('AJEET OS Desktop 👑');
  }));
  $('#topBell').addEventListener('click', () => $('#notifPanel').classList.toggle('hidden'));
  $('#topAvatar').addEventListener('click', () => openApp('thispc'));

  /* start panel */
  $('#startBtn').addEventListener('click', () => $('#startPanel').classList.toggle('hidden'));
  $('#spViewAll').addEventListener('click', e => { e.preventDefault(); openApp('moreapps'); $('#startPanel').classList.add('hidden'); });
  $('#spSocialEdit').addEventListener('click', e => { e.preventDefault(); openApp('social'); $('#startPanel').classList.add('hidden'); });
  $('#spPower').addEventListener('click', () => lockDesktop());
  $('#spOwnerBtn').addEventListener('click', () => { $('#startPanel').classList.add('hidden'); if (ownerLoggedIn) ownerLogout(); else showOwnerLogin(); });
  $$('#startPanel [data-sp]').forEach(b => b.addEventListener('click', () => {
    const k = b.dataset.sp;
    $('#startPanel').classList.add('hidden');
    if (k === 'apps') openApp('moreapps');
    else if (k === 'games') openApp('games');
    else if (k === 'tools') openApp('tools');
    else if (k === 'settings') openApp('settings');
    else if (k === 'about') openApp('about');
    else if (k === 'owner') showOwnerLogin();
    else if (k === 'lock') lockDesktop();
    else if (k === 'logout') ownerLogout();
    else if (k === 'power') { toast('Power: desktop Guest View me lock ho raha hai.'); lockDesktop(); }
    else toast('AJEET OS Desktop 👑');
  }));

  /* riya */
  $('#riyaSend').addEventListener('click', () => { const i = $('#riyaInput'); riyaAsk(i.value); i.value = ''; });
  $('#riyaInput').addEventListener('keydown', e => { if (e.key === 'Enter'){ riyaAsk(e.target.value); e.target.value = ''; } });
  $('#riyaClose').addEventListener('click', () => { riyaHF = false; updateHFBtn(); riyaStopListen(); if ('speechSynthesis' in window) speechSynthesis.cancel(); $('#riyaPanel').classList.add('hidden'); });
  $('#riyaMin').addEventListener('click', () => $('#riyaBody').classList.toggle('hidden'));
  $('#riyaSpeak').addEventListener('click', () => { riyaSpeakOn = !riyaSpeakOn; $('#riyaSpeak').style.opacity = riyaSpeakOn ? '1' : '.45'; if (!riyaSpeakOn && 'speechSynthesis' in window) speechSynthesis.cancel(); toast(riyaSpeakOn ? 'Riya ab bolkar jawab degi 🔊' : 'Voice off.'); });
  /* hands-free button — mic ke bilkul bagal me, wahi purana circle style */
  const micBtn = $('#riyaMic');
  const hfBtn = document.createElement('button');
  hfBtn.id = 'riyaHandsfree'; hfBtn.title = 'Hands-free mode (bina dabaye baat)'; hfBtn.textContent = '🔁';
  micBtn.parentNode.insertBefore(hfBtn, micBtn);
  hfBtn.addEventListener('click', () => {
    riyaHF = !riyaHF; updateHFBtn();
    if (riyaHF){
      riyaSpeakOn = true; $('#riyaSpeak').style.opacity = '1';
      if (riyaStartListen()) toast('Hands-free ON 🔁 Bolo, main sun rahi hoon…');
      else { riyaHF = false; updateHFBtn(); }
    } else { riyaStopListen(); toast('Hands-free OFF'); }
  });
  micBtn.addEventListener('click', () => {
    if (riyaListening){ riyaHF = false; updateHFBtn(); riyaStopListen(); return; }
    riyaSpeakOn = true; $('#riyaSpeak').style.opacity = '1'; /* bolo ge to jawab bhi awaaz me */
    if (riyaStartListen()) toast('Sun rahi hoon… 🎤');
  });
  $$('#riyaPanel [data-riya-open]').forEach(b => b.addEventListener('click', () => {
    const k = b.dataset.riyaOpen;
    if (k === 'notepad' || k === 'calculator'){ openApp(k); riyaSay(APPS[k].title + ' khol diya 😊'); }
    else if (k === 'youtube'){ window.open('https://www.youtube.com', '_blank'); riyaSay('YouTube naye tab me khol diya ▶️'); }
    else if (k === 'generate'){
      openApp('paint');
      setTimeout(() => {
        const w = openWins.get('paint'); if (!w) return;
        const cv = $('.js-pt-canvas', w), ctx = cv.getContext('2d');
        const gr = ctx.createLinearGradient(0, 0, cv.width, cv.height);
        gr.addColorStop(0, '#38bdf8'); gr.addColorStop(.5, '#a78bfa'); gr.addColorStop(1, '#0b2a5e');
        ctx.fillStyle = gr; ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = 'rgba(255,255,255,.9)'; ctx.font = 'bold 30px sans-serif'; ctx.fillText('AJEET OS 👑', 24, 52);
        ctx.font = '18px sans-serif'; ctx.fillText('Dream • Learn • Create • Grow', 24, 84);
      }, 250);
      riyaSay('Paint me ek AJEET OS artwork bana diya 🎨 Pasand aaya to Download PNG kar lo.');
    }
    else if (k === 'search'){ $('#taskSearch').focus(); riyaSay('Neeche search box me jo chahiye likho — apps, notes, files sab milega 🔍'); }
    else if (k === 'help'){ riyaSay('Desktop Help: left panel ke icons se apps khulte hain, windows ko upar wali patti se ghaseet sakte ho, — se minimize, ▢ se bada, ✕ se band. Neeche Start button se menu aur search milta hai. Kuch aur?'); }
  }));

  /* taskbar */
  $('#taskSearch').addEventListener('input', e => doSearch(e.target.value));
  $('#taskSearch').addEventListener('focus', e => doSearch(e.target.value));
  document.addEventListener('pointerdown', e => {
    if (!e.target.closest('.task-search')) $('#searchResults').classList.add('hidden');
    if (!e.target.closest('#notifPanel') && !e.target.closest('#bellBtn') && !e.target.closest('#topBell')) $('#notifPanel').classList.add('hidden');
    if (!e.target.closest('#startPanel') && !e.target.closest('#startBtn')) $('#startPanel').classList.add('hidden');
  });
  $('#bellBtn').addEventListener('click', () => $('#notifPanel').classList.toggle('hidden'));
  $('#notifClear').addEventListener('click', () => { store.set('notifs', []); renderNotifs(); });

  /* keyboard shortcuts */
  document.addEventListener('keydown', e => {
    if (!desktopActive) return;
    if (e.key === 'Escape'){ $('#startPanel').classList.add('hidden'); $('#notifPanel').classList.add('hidden'); }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k'){ e.preventDefault(); $('#taskSearch').focus(); }
  });
}

/* ---------------- boot ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  applySettings();
  wireUI();
  radioInit();
  renderStartSocials();
  renderStartMyApps();
  renderNotifs();
  getSocials(); getFS();
  if (!store.get('notifs', []).length){
    notify('Welcome to AJEET OS 👑', 'Tumhara personal desktop taiyaar hai.');
  }
  riyaSay('Hello Mr ❤️ How can I help you today?');
  const sessExp = +(localStorage.getItem('ajeetos.session') || 0);
  const remembered = sessExp > Date.now();
  if (localStorage.getItem('ajeetos.session') && !remembered) localStorage.removeItem('ajeetos.session');
  const hasSession = remembered || sessionStorage.getItem('ajeetos.session') === '1';
  ownerLoggedIn = !!(hasSession && store.get('passhash', null));
  enterDesktop();
  if (window.innerWidth <= 640) $('#riyaPanel').classList.add('hidden');
  applyRemovedApps();
  updateOwnerUI();
  tickClock();
});

/* ---------------- Highway Radio — Insta Trending gaano ki list ----------------
   Player bilkul hide rehta hai. Gaane SONGS list se chalte hain — sabse popular pehle.
   Koi bhi Music app ki list se apni pasand ka koi bhi gaana tap karke baja sakta hai.
   Dono hidden players DOMContentLoaded par hi background me taiyaar ho jate hain:
   pehla gaana cue rehta hai aur chalte gaane ke saath AGla gaana standby player me
   pre-buffer hota rehta hai — isliye tap karte hi gaana lagbhag turant bajta hai. */
const SONGS = [
  { t: "Sahiba", a: "Aditya Rikhari", id: "n2dVFdqMYGA" },
  { t: "Gehra Hua", a: "Arijit Singh • Dhurandhar", id: "GX9x62kFsVU" },
  { t: "Saiyaara", a: "Faheem Abdullah • Saiyaara", id: "BSJa1UytM8w" },
  { t: "Aaj Ki Raat", a: "Stree 2 • Madhubanti Bagchi", id: "hxMNYkLN7tI" },
  { t: "Tainu Khabar Nahi", a: "Arijit Singh • Munjya", id: "6d5SS0gS5bU" },
  { t: "Aayi Nai", a: "Pawan Singh • Stree 2", id: "nFgsBxw-zWQ" },
  { t: "Tumhare Hi Rahenge Hum", a: "Varun Jain • Stree 2", id: "cxKAtmvf-uM" },
  { t: "Tauba Tauba", a: "Karan Aujla • Bad Newz", id: "LK7-_dgAVQE" },
  { t: "Taras", a: "Jasmine Sandlas • Munjya", id: "kfXy4W0aD40" },
  { t: "Akhiyaan Gulaab", a: "Mitraz", id: "GvXDq-P1NB8" },
  { t: "Jo Tum Mere Ho", a: "Anuv Jain", id: "ilNt2bikxDI" },
  { t: "Zaroor", a: "Aparshakti Khurana x Savi Kahlon", id: "YrJ6OZ7VVWc" },
  { t: "Suniyan Suniyan", a: "Juss", id: "AKH6ZNSnWOA" },
  { t: "Ve Haaniyaan", a: "Avvy Sra", id: "E_SbwSe15y0" },
  { t: "Raanjhan", a: "Sachet-Parampara • Do Patti", id: "lBvbNxiVmZA" },
  { t: "Qayde Se", a: "Arijit Singh • Metro In Dino", id: "GTD3gAWezz8" },
  { t: "Zamaana Lage", a: "Arijit Singh • Metro In Dino", id: "m8kaNWu-BC4" },
  { t: "Aavan Jaavan", a: "Arijit Singh • War 2", id: "enjkcCdAlXc" },
  { t: "Pardesiya", a: "Sonu Nigam • Param Sundari", id: "N4wK3NtVRT0" },
  { t: "Ishq Jalakar (Karvaan)", a: "Shashwat Sachdev • Dhurandhar", id: "8qCVXCFREkQ" },
  { t: "Shararat", a: "Jasmine Sandlas • Dhurandhar", id: "YyepU5ztLf4" },
  { t: "Barbaad", a: "Jubin Nautiyal • Saiyaara", id: "0v5eHPfy5Lk" },
  { t: "Khayaal", a: "Talwiinder", id: "GCvt9C4FLgA" },
  { t: "Haseen", a: "Talwiinder", id: "IltsOcCj1Ak" },
  { t: "Andaaz-e-Karam", a: "Madhur Sharma", id: "__bHEfJ29j0" },
  { t: "Deewaniyat", a: "Vishal Mishra • Ek Deewane Ki Deewaniyat", id: "Qo4IOTAbGAM" },
  { t: "Kasturi", a: "Arijit Singh", id: "gPfIxI0b5Xs" },
  { t: "Sitaare", a: "Arijit Singh • Ikkis", id: "nDjloeIB3Pc" },
  { t: "Dooron Dooron", a: "Paresh Pahuja", id: "LV_wiOhO40Q" },
  { t: "Majboor", a: "Sheheryar Rehan", id: "zaFGQEIcetM" },
  { t: "Tu Hain Toh", a: "Mr. & Mrs. Mahi", id: "TVbI55pDdaI" },
  { t: "Heeriye", a: "Jasleen Royal & Arijit Singh", id: "RLzC55ai0eo" },
  { t: "Aasa Kooda", a: "Sai Abhyankkar", id: "a3Ue-LN5B9U" },
  { t: "Pehle Bhi Main", a: "Vishal Mishra • Animal", id: "iAIBF2ngbWY" },
  { t: "Arjan Vailly", a: "Animal", id: "zqGW6x_5N0k" },
  { t: "Husn", a: "Anuv Jain", id: "gJLVTKhTnog" },
  { t: "Gulabi Sadi", a: "Sanju Rathod", id: "B_6d3RBiEN0" },
  { t: "O Maahi", a: "Arijit Singh • Dunki", id: "Etkd-07gnxM" },
  { t: "Chaleya", a: "Arijit Singh • Jawan", id: "VAdGW7QDJiU" },
  { t: "Besharam Rang", a: "Pathaan", id: "huxhqphtDrM" },
  { t: "Jhoom", a: "Ali Zafar", id: "B4-HoKdW6j0" },
  { t: "Apna Bana Le", a: "Arijit Singh • Bhediya", id: "ElZfdU54Cp8" },
  { t: "Kesariya", a: "Arijit Singh • Brahmastra", id: "BddP6PYo2gs" },
  { t: "Raataan Lambiyan", a: "Jubin Nautiyal • Shershaah", id: "GLGuLXKT9Ng" },
  { t: "Dil Jhoom", a: "Ek Villain Returns", id: "jfosQWnUOK8" },
  { t: "Baarish Ki Jaaye", a: "B Praak", id: "TYaNfLLOLNY" },
  { t: "Filhaal", a: "B Praak", id: "hMy5za-m5Ew" },
  { t: "Mann Bharryaa", a: "B Praak • Shershaah", id: "1poXN3jF3Bw" },
  { t: "Pachtaoge", a: "Arijit Singh", id: "PVxc5mIHVuQ" },
  { t: "Tum Hi Ho", a: "Arijit Singh • Aashiqui 2", id: "Umqb9KENgmk" },
  { t: "Dhurandhar (Title Track)", a: "Shashwat Sachdev • Dhurandhar", id: "1a5nyrMtRsk" },
  { t: "FA9LA", a: "Dhurandhar", id: "Q_mWs5nnqb0" },
  { t: "Preet Re", a: "Darshan Raval • Dhadak 2", id: "k6q4lENp434" },
  { t: "Rehna Kol", a: "Jubin Nautiyal • Loveyapa", id: "OTUpZk4Uiik" },
  { t: "Bijuria", a: "Sonu Nigam • Sunny Sanskari Ki Tulsi Kumari", id: "nYLkyW2dDXU" },
  { t: "Tumse Behtar", a: "Arijit Singh • Sunny Sanskari Ki Tulsi Kumari", id: "MivKhlsMKL0" },
  { t: "Panwadi", a: "Khesari Lal • Sunny Sanskari Ki Tulsi Kumari", id: "usVq_4K_m_w" },
  { t: "Tere Ishq Mein", a: "Arijit Singh • Tere Ishq Mein", id: "2gWbNcgZFM0" },
  { t: "Gafoor", a: "The Bads of Bollywood", id: "z4VoiPst0os" },
  { t: "Raat Bhar", a: "De De Pyaar De 2", id: "pDpZjSX_Tdo" },
  { t: "Dilbar Ki Aankhon Ka", a: "Thamma", id: "pkLGczIXR1A" },
  { t: "Ishq Mein", a: "Nadaaniyan", id: "hrr41U4fj54" },
  { t: "Tu Meri Main Tera", a: "Title Track", id: "K6nBBkWXT-8" },
  { t: "Jaane Tu", a: "Arijit Singh • Chhaava", id: "d6KJkavA8zk" },
  { t: "Bhasad Macha", a: "Vishal Mishra • Deva", id: "-pvt6tQsOqQ" },
  { t: "Tu Hai Toh Main Hoon", a: "Arijit Singh • Sky Force", id: "CKJA9blyMUg" },
  { t: "Uyi Amma", a: "Amit Trivedi • Azaad", id: "FZLadzn5i6Q" },
  { t: "Madman On The Run", a: "Dhoom Dhaam", id: "v3XJVqD0AKM" },
  { t: "Sitare Zameen Par", a: "Title Track", id: "q7MpzJQiJr8" },
  { t: "Naina", a: "Diljit Dosanjh • Crew", id: "3u6lLWGjFLY" },
  { t: "Aari Aari", a: "Dhurandhar 2", id: "dESIGVxSSCE" },
  { t: "Didi", a: "Dhurandhar 2", id: "hnEGQH4LP2c" },
  { t: "Jaan Se Guzarte Hain", a: "Dhurandhar 2", id: "uFGreSkTMck" },
  { t: "Phir Se", a: "Dhurandhar 2", id: "Ans8Y59cvds" },
  { t: "Main Aur Tu", a: "Dhurandhar 2", id: "JSTIDkxtO5c" },
  { t: "Sajni", a: "Dhurandhar 2", id: "F2m4HPLvj-4" },
  { t: "Aakhri Ishq", a: "Dhurandhar 2", id: "Kr1ncWYhof8" },
  { t: "Wild Ride", a: "Dhurandhar 2", id: "47ooG3yi6dQ" },
  { t: "Destiny (Mann Atkeya)", a: "Dhurandhar 2", id: "sqSSKHKzvYY" },
  { t: "O Mere Balam", a: "Welcome To The Jungle", id: "CsrugGNmBfg" },
  { t: "Tera Paisa Mera Paisa", a: "Welcome To The Jungle", id: "mEO6Epcs_sI" },
  { t: "Deewane Hain", a: "Welcome To The Jungle", id: "14IA7mkz5Aw" },
  { t: "Saree", a: "Dhamaal 4", id: "zAEA3h529ZU" },
  { t: "Qeher", a: "Guru Randhawa • Dhamaal 4", id: "cyUnbQ2IK_w" },
  { t: "Chatni", a: "Dhamaal 4", id: "gZWLEm4JLQk" },
  { t: "Tere Paas Main", a: "Diljit Dosanjh • Main Vaapas Aaunga", id: "rNXmANj72ps" },
  { t: "Kya Kamaal Hai", a: "Diljit Dosanjh • Main Vaapas Aaunga", id: "DELSFv0g7q0" },
  { t: "Leher", a: "Arijit Singh • Cocktail 2", id: "eh_5uIWqh2M" },
  { t: "Tera Yaar Hoon Main", a: "Title Track", id: "TsUS5ddz6cE" },
  { t: "Jai Hind", a: "Maatrubhumi", id: "Flfe0H8dy-Q" },
  { t: "Jai Ambe Bol", a: "Yeh Prem Mol Liya", id: "aocAbUbZkG0" },
  { t: "Jhumka Patola", a: "Yeh Prem Mol Liya", id: "wODprPLcgvo" },
  { t: "Dard-E-Dil Dard-E-Jigar", a: "Gunmaaster G9", id: "4rPcOxl-cyM" },
  { t: "Afsaana Banaaya Aapne", a: "Gunmaaster G9", id: "u9MpnqWC6Xg" },
  { t: "Do Din Ki Zindagi", a: "Gunmaaster G9", id: "Sgb1nNxS9_Q" },
  { t: "Ishq Ki Vibe", a: "Nakhrewaalii", id: "PArAafe6Mw4" },
  { t: "Senti", a: "Daadi Ki Shaadi", id: "BvI1UUkmfsI" },
  { t: "Fanaa Karr De", a: "Ravie Dubey & Sargun Mehta", id: "WvRYeSOBL4Y" },
  { t: "Samjho Na", a: "Aditya Rikhari", id: "MhXCj8E9CZU" },
  { t: "Afsos", a: "Anuv Jain ft. AP Dhillon", id: "2FhgKp_lfJQ" }
];
let radioPlayer = null, radioPlaying = false, radioStarted = false, radioIx = -1, radioPendingIx = 0, radioShuffle = false, radioWantPlay = false, radioLoading = false, radioLoadingIx = -1;
/* Dual-player engine (speed fix): ek ACTIVE player gaana chalata hai, dusra STANDBY
   player AGla gaana pehle se cue (pre-buffer) karke rakhta hai. Isliye Next dabane
   par ya gaana khatam hone par agla gaana lagbhag turant shuru hota hai — har baar
   cold buffering nahi lagti. radioPlayer hamesha ACTIVE player ko point karta hai. */
const radioSlots = {
  A: { key: 'A', el: 'radioPlayer',  player: null, ready: false, cuedIx: -1, cuedReady: false },
  B: { key: 'B', el: 'radioPlayerB', player: null, ready: false, cuedIx: -1, cuedReady: false }
};
let radioActive = radioSlots.A, radioStandby = radioSlots.B;
let radioOrder = SONGS.map((s, i) => i), radioPos = -1, radioBooted = false;
function setRadioState(t){ const el = $('#radioState'); if (el) el.textContent = t; const nt = $('.js-now-title'); if (nt) nt.textContent = t; }
function setRadioIcon(){
  const p = $('.rb-play'), q = $('.rb-pause'), pill = $('#radioPill');
  if (p) p.classList.toggle('hidden', radioPlaying);
  if (q) q.classList.toggle('hidden', !radioPlaying);
  if (pill) pill.classList.toggle('playing', radioPlaying);
  const nx = $('#radioNext'); if (nx) nx.classList.toggle('hidden', !radioStarted);
  const pv = $('#radioPrev'); if (pv) pv.classList.toggle('hidden', !radioStarted);
  const mb = $('.js-mplay'); if (mb) mb.innerHTML = radioPlaying ? '<svg viewBox="0 0 24 24"><path d="M7.5 5h3.4v14H7.5zM13.1 5h3.4v14h-3.4z" fill="#fff"/></svg> Roko' : '<svg viewBox="0 0 24 24"><path d="M8.5 5.8v12.4c0 .9 1 1.5 1.8 1L19 13a1.2 1.2 0 0 0 0-2L10.3 4.9c-.8-.5-1.8 0-1.8.9z" fill="#fff"/></svg> Chalao';
}
function radioMarkRow(){
  document.querySelectorAll('.song-row').forEach(r => {
    const ix = +r.dataset.ix;
    r.classList.toggle('playing', ix === radioIx);
    r.classList.toggle('loading', radioLoading && ix === radioLoadingIx);
  });
  const row = document.querySelector('.song-row.playing') || document.querySelector('.song-row.loading');
  if (row) row.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}
function radioSetLoading(ix){
  radioLoading = ix >= 0; radioLoadingIx = ix;
  if (ix >= 0) setRadioState('Load ho raha hai\u2026');
  radioMarkRow();
}
function radioBuildOrder(fromIx){
  const rest = SONGS.map((s, i) => i).filter(i => i !== fromIx);
  if (radioShuffle){ for (let i = rest.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); const t = rest[i]; rest[i] = rest[j]; rest[j] = t; } }
  radioOrder = [fromIx].concat(rest);
  radioPos = 0;
}
function radioNextIx(){
  if (radioPos + 1 < radioOrder.length) return radioOrder[radioPos + 1];
  if (radioShuffle){
    const pool = SONGS.map((s, i) => i).filter(i => i !== radioIx);
    for (let i = pool.length - 1; i > 0; i--){ const j = Math.floor(Math.random() * (i + 1)); const t = pool[i]; pool[i] = pool[j]; pool[j] = t; }
    radioOrder = [radioIx].concat(pool); radioPos = 0;
    return radioOrder[1];
  }
  return radioOrder[0];
}
function radioSyncActive(){ radioPlayer = radioActive.player; }
/* FAST MODE (owner ne chuna): player hidden hai, sirf audio sunna hai — isliye
   sabse chhoti playback quality ('small', na mile to 'tiny') rakho taaki gaana
   lagbhag turant shuru ho. YouTube har naye video par quality reset kar sakta
   hai, isliye ready / cue / load / state-change — har jagah dobara set karte hain. */
function radioSetQuality(slot){
  if (!slot || !slot.player) return;
  try{ slot.player.setPlaybackQuality('small'); }
  catch(err){ try{ slot.player.setPlaybackQuality('tiny'); }catch(e2){} }
}
function radioCueStandby(){
  if (!radioStandby.ready || radioIx < 0 || !SONGS.length) return;
  const nx = radioNextIx();
  if (radioStandby.cuedIx === nx) return;
  radioStandby.cuedIx = nx; radioStandby.cuedReady = false;
  try{ radioStandby.player.cueVideoById(SONGS[nx].id); }catch(err){}
  radioSetQuality(radioStandby);
}
function radioStartOn(slot, ix){
  radioIx = ix;
  const p = radioOrder.indexOf(ix); if (p >= 0) radioPos = p;
  slot.cuedIx = ix; slot.cuedReady = false;
  radioSetLoading(ix);
  try{ slot.player.loadVideoById(SONGS[ix].id); }catch(err){}
  radioSetQuality(slot);
}
function radioSwapToStandby(){
  const old = radioActive;
  radioActive = radioStandby; radioStandby = old;
  radioSyncActive();
  radioIx = radioActive.cuedIx;
  radioPos = radioOrder.indexOf(radioIx);
  radioSetLoading(radioIx);
  try{ radioActive.player.playVideo(); }catch(err){}
  try{ old.player.pauseVideo(); }catch(err){}
  radioCueStandby();
}
function radioAdvance(){
  if (!radioActive.ready) return;
  if (radioIx < 0){ radioPlaySong(radioPendingIx); return; }
  const nx = radioNextIx();
  if (radioStandby.ready && radioStandby.cuedIx === nx){ radioSwapToStandby(); return; }
  radioStartOn(radioActive, nx);
  radioCueStandby();
}
function radioNext(){ radioAdvance(); }
function radioPrev(){
  if (!radioActive.ready || radioIx < 0) return;
  const pv = radioPos - 1 >= 0 ? radioOrder[radioPos - 1] : radioOrder[radioOrder.length - 1];
  radioStartOn(radioActive, pv);
  radioCueStandby();
}
function radioSetShuffle(){
  radioBuildOrder(radioIx >= 0 ? radioIx : radioPendingIx);
  if (radioIx >= 0) radioCueStandby();
}
function radioWireSlot(slot){
  return {
    onReady: () => {
      slot.ready = true;
      try{ slot.player.setVolume(100); }catch(err){}
      radioSetQuality(slot);
      if (slot === radioActive){
        radioSyncActive();
        if (radioWantPlay){ radioWantPlay = false; radioPlaySong(radioPendingIx); }
        else if (radioIx < 0 && slot.cuedIx < 0 && SONGS.length){
          /* Pehla gaana pehle se cue rakho — pehle tap par lagbhag turant chalega */
          slot.cuedIx = 0;
          try{ slot.player.cueVideoById(SONGS[0].id); }catch(err){}
          radioSetQuality(slot);
        }
      }
      radioCueStandby();
    },
    onStateChange: e => {
      if (e.data === YT.PlayerState.CUED){ slot.cuedReady = true; radioSetQuality(slot); return; }
      if (slot !== radioActive) return;
      if (e.data === YT.PlayerState.PLAYING){
        radioSetQuality(slot);
        radioPlaying = true; radioStarted = true; radioSetLoading(-1); setRadioIcon();
        radioMarkRow();
        setTimeout(() => { try{ const d = radioActive.player.getVideoData(); if (d && d.title) setRadioState(d.title); }catch(err){} }, 700);
        radioCueStandby();
      } else if (e.data === YT.PlayerState.BUFFERING){
        radioSetQuality(slot);
        if (radioIx >= 0) radioSetLoading(radioIx);
      } else if (e.data === YT.PlayerState.PAUSED){
        if (radioLoading){ setRadioState('Load ho raha hai\u2026'); }
        else { radioPlaying = false; setRadioIcon(); setRadioState('Ruka hai \u2014 Play dabao, gaana chalega'); }
      } else if (e.data === YT.PlayerState.ENDED){
        radioAdvance();
      }
    },
    onError: () => {
      if (slot !== radioActive) return;
      setRadioState('Ye gaana nahi chala \u2014 agla try karo');
      radioSetLoading(-1);
      radioAdvance();
    }
  };
}
function radioCreate(){
  if (radioSlots.A.player || !window.YT || !YT.Player) return;
  const mk = slot => new YT.Player(slot.el, {
    width: '2', height: '2',
    playerVars: { autoplay: 0, controls: 0, rel: 0, playsinline: 1 },
    events: radioWireSlot(slot)
  });
  radioSlots.A.player = mk(radioSlots.A);
  radioSlots.B.player = mk(radioSlots.B);
  radioSyncActive();
}
function radioBoot(){
  if (radioBooted) return; radioBooted = true;
  if (window.YT && YT.Player){ radioCreate(); return; }
  const tag = document.createElement('script'); tag.src = 'https://www.youtube.com/iframe_api';
  document.head.appendChild(tag);
  const prevReady = window.onYouTubeIframeAPIReady;
  window.onYouTubeIframeAPIReady = () => { if (prevReady){ try{ prevReady(); }catch(err){} } radioCreate(); };
}
function radioPlaySong(ix){
  radioPendingIx = ix; radioWantPlay = true;
  radioSetLoading(ix);
  if (!radioActive.ready){ radioBoot(); return; }
  radioWantPlay = false;
  if (ix === radioIx && radioStarted){
    try{ radioActive.player.playVideo(); }catch(err){}
    radioSetLoading(-1);
    return;
  }
  if (radioStandby.ready && radioStandby.cuedIx === ix){ radioSwapToStandby(); return; }
  if (radioIx < 0 && radioActive.cuedIx === ix){
    radioIx = ix; radioPos = radioOrder.indexOf(ix);
    try{ radioActive.player.playVideo(); }catch(err){}
    radioCueStandby();
    return;
  }
  radioStartOn(radioActive, ix);
  radioCueStandby();
}
function radioToggle(){
  if (!radioActive.ready){ radioWantPlay = true; setRadioState('Load ho raha hai\u2026'); radioBoot(); return; }
  if (radioIx === -1){ radioPlaySong(radioPendingIx); return; }
  if (radioPlaying){ try{ radioActive.player.pauseVideo(); }catch(err){} }
  else { try{ radioActive.player.playVideo(); }catch(err){} }
}
function radioInit(){
  const b = $('#radioBtn'); if (b) b.addEventListener('click', radioToggle);
  /* Dono players ko DOMContentLoaded par hi background me taiyaar kar do (bina khud chale) —
     pehla gaana bhi cue rahega, isliye pehla tap aur har Next lagbhag turant chalega. */
  radioBoot();
  const n = $('#radioNext'); if (n) n.addEventListener('click', radioNext);
  const pv = $('#radioPrev'); if (pv) pv.addEventListener('click', radioPrev);
  const li = $('#radioList'); if (li) li.addEventListener('click', () => openApp('music'));
}
