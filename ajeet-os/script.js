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
  about:     { title:'About AJEET OS', icon:'ℹ️', tpl:'tpl-about' }
};
const APP_ALIASES = { note:'notepad', notes:'notepad', calc:'calculator', cal:'calendar', file:'files', 'my files':'files', paint:'paint', task:'tasks', tasks:'tasks', 'social hub':'social', settings:'settings', browser:'browser', calendar:'calendar', calculator:'calculator', notepad:'notepad', games:'games', music:'music', video:'video', images:'images', pdf:'pdf' };


/* ---------------- real SVG icons (emoji nahi) ---------------- */
const ICONS = {"thispc": "<svg viewBox=\"0 0 48 48\"><defs><linearGradient id=\"gPc\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#7dd3fc\"/><stop offset=\"1\" stop-color=\"#2563eb\"/></linearGradient></defs><rect x=\"6\" y=\"7\" width=\"36\" height=\"27\" rx=\"3.5\" fill=\"url(#gPc)\"/><rect x=\"9.5\" y=\"10.5\" width=\"29\" height=\"20\" rx=\"2\" fill=\"#dbeafe\" opacity=\".55\"/><rect x=\"21\" y=\"34\" width=\"6\" height=\"5.5\" fill=\"#94a3b8\"/><rect x=\"13\" y=\"39.5\" width=\"22\" height=\"3.2\" rx=\"1.6\" fill=\"#64748b\"/></svg>", "recycle": "<svg viewBox=\"0 0 48 48\"><defs><linearGradient id=\"gRc\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#4ade80\"/><stop offset=\"1\" stop-color=\"#16a34a\"/></linearGradient></defs><path d=\"M13 15h22l-1.8 22.2A3.5 3.5 0 0 1 29.7 40.5H18.3a3.5 3.5 0 0 1-3.5-3.3L13 15z\" fill=\"url(#gRc)\"/><rect x=\"10\" y=\"11\" width=\"28\" height=\"4.4\" rx=\"2.2\" fill=\"#15803d\"/><rect x=\"19\" y=\"6.8\" width=\"10\" height=\"4\" rx=\"2\" fill=\"#15803d\"/><path d=\"M29.5 24.5a6 6 0 1 1-1.6-4.4\" fill=\"none\" stroke=\"#fff\" stroke-width=\"2.6\" stroke-linecap=\"round\"/><path d=\"M29.9 16.9l.4 4-3.9-1z\" fill=\"#fff\"/></svg>", "files": "<svg viewBox=\"0 0 48 48\"><defs><linearGradient id=\"gFo\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#fcd34d\"/><stop offset=\"1\" stop-color=\"#f59e0b\"/></linearGradient></defs><path d=\"M5 13.5A3.5 3.5 0 0 1 8.5 10h11l4.5 5.5h15.5A3.5 3.5 0 0 1 43 19v17.5a3.5 3.5 0 0 1-3.5 3.5h-31A3.5 3.5 0 0 1 5 36.5z\" fill=\"url(#gFo)\"/><path d=\"M5 21.5h38v15a3.5 3.5 0 0 1-3.5 3.5h-31A3.5 3.5 0 0 1 5 36.5z\" fill=\"#fde68a\"/></svg>", "browser": "<svg viewBox=\"0 0 48 48\"><defs><linearGradient id=\"gGl\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#38bdf8\"/><stop offset=\"1\" stop-color=\"#1e40af\"/></linearGradient></defs><circle cx=\"24\" cy=\"24\" r=\"17.5\" fill=\"url(#gGl)\"/><ellipse cx=\"24\" cy=\"24\" rx=\"8\" ry=\"17.5\" fill=\"none\" stroke=\"#e0f2fe\" stroke-width=\"1.8\" opacity=\".85\"/><path d=\"M6.5 24h35M9.5 15.5h29M9.5 32.5h29\" stroke=\"#e0f2fe\" stroke-width=\"1.8\" opacity=\".85\" fill=\"none\"/></svg>", "notepad": "<svg viewBox=\"0 0 48 48\"><rect x=\"11\" y=\"4.5\" width=\"26\" height=\"39\" rx=\"3\" fill=\"#fff\" stroke=\"#cbd5e1\"/><rect x=\"11\" y=\"4.5\" width=\"26\" height=\"8.5\" rx=\"3\" fill=\"#38bdf8\"/><rect x=\"15.5\" y=\"19\" width=\"17\" height=\"2.8\" rx=\"1.4\" fill=\"#94a3b8\"/><rect x=\"15.5\" y=\"25\" width=\"17\" height=\"2.8\" rx=\"1.4\" fill=\"#94a3b8\"/><rect x=\"15.5\" y=\"31\" width=\"11\" height=\"2.8\" rx=\"1.4\" fill=\"#94a3b8\"/><path d=\"M31 40.5l1.2-5L37 30.6a2.3 2.3 0 0 1 3.2 0l.7.7a2.3 2.3 0 0 1 0 3.2l-4.9 4.9z\" fill=\"#f59e0b\"/></svg>", "calculator": "<svg viewBox=\"0 0 48 48\"><rect x=\"10\" y=\"4.5\" width=\"28\" height=\"39\" rx=\"5.5\" fill=\"#1f2937\"/><rect x=\"15\" y=\"9.5\" width=\"18\" height=\"8.5\" rx=\"2\" fill=\"#a7f3d0\"/><circle cx=\"18\" cy=\"24.5\" r=\"2.4\" fill=\"#e5e7eb\"/><circle cx=\"24\" cy=\"24.5\" r=\"2.4\" fill=\"#e5e7eb\"/><circle cx=\"30\" cy=\"24.5\" r=\"2.4\" fill=\"#f59e0b\"/><circle cx=\"18\" cy=\"31.5\" r=\"2.4\" fill=\"#e5e7eb\"/><circle cx=\"24\" cy=\"31.5\" r=\"2.4\" fill=\"#e5e7eb\"/><circle cx=\"30\" cy=\"31.5\" r=\"2.4\" fill=\"#f59e0b\"/><circle cx=\"18\" cy=\"38.5\" r=\"2.4\" fill=\"#e5e7eb\"/><circle cx=\"24\" cy=\"38.5\" r=\"2.4\" fill=\"#e5e7eb\"/><circle cx=\"30\" cy=\"38.5\" r=\"2.4\" fill=\"#38bdf8\"/></svg>", "calendar": "<svg viewBox=\"0 0 48 48\"><rect x=\"7.5\" y=\"9\" width=\"33\" height=\"32\" rx=\"4\" fill=\"#fff\" stroke=\"#cbd5e1\"/><path d=\"M7.5 13a4 4 0 0 1 4-4h25a4 4 0 0 1 4 4v6h-33z\" fill=\"#ef4444\"/><rect x=\"14\" y=\"5.5\" width=\"4\" height=\"9\" rx=\"2\" fill=\"#64748b\"/><rect x=\"30\" y=\"5.5\" width=\"4\" height=\"9\" rx=\"2\" fill=\"#64748b\"/><circle cx=\"15\" cy=\"26\" r=\"2.3\" fill=\"#94a3b8\"/><circle cx=\"24\" cy=\"26\" r=\"2.3\" fill=\"#94a3b8\"/><circle cx=\"33\" cy=\"26\" r=\"2.3\" fill=\"#38bdf8\"/><circle cx=\"15\" cy=\"34\" r=\"2.3\" fill=\"#94a3b8\"/><circle cx=\"24\" cy=\"34\" r=\"2.3\" fill=\"#94a3b8\"/><circle cx=\"33\" cy=\"34\" r=\"2.3\" fill=\"#94a3b8\"/></svg>", "settings": "<svg viewBox=\"0 0 48 48\"><g fill=\"#64748b\"><rect x=\"20.6\" y=\"4\" width=\"6.8\" height=\"40\" rx=\"3.4\"/><rect x=\"20.6\" y=\"4\" width=\"6.8\" height=\"40\" rx=\"3.4\" transform=\"rotate(45 24 24)\"/><rect x=\"20.6\" y=\"4\" width=\"6.8\" height=\"40\" rx=\"3.4\" transform=\"rotate(90 24 24)\"/><rect x=\"20.6\" y=\"4\" width=\"6.8\" height=\"40\" rx=\"3.4\" transform=\"rotate(135 24 24)\"/></g><circle cx=\"24\" cy=\"24\" r=\"12.5\" fill=\"#94a3b8\"/><circle cx=\"24\" cy=\"24\" r=\"6\" fill=\"#e2e8f0\"/></svg>", "images": "<svg viewBox=\"0 0 48 48\"><defs><linearGradient id=\"gIm\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#7dd3fc\"/><stop offset=\"1\" stop-color=\"#6366f1\"/></linearGradient></defs><rect x=\"5.5\" y=\"8.5\" width=\"37\" height=\"31\" rx=\"4.5\" fill=\"url(#gIm)\"/><circle cx=\"33\" cy=\"16.5\" r=\"3.8\" fill=\"#fde68a\"/><path d=\"M5.5 35.5l11.5-12 8 7.5 6.5-5.5 11 10v.5a3.5 3.5 0 0 1-3.5 3.5H9a3.5 3.5 0 0 1-3.5-3.5z\" fill=\"#0c4a6e\" opacity=\".55\"/></svg>", "music": "<svg viewBox=\"0 0 48 48\"><defs><linearGradient id=\"gMu\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#f472b6\"/><stop offset=\"1\" stop-color=\"#7c3aed\"/></linearGradient></defs><rect x=\"6.5\" y=\"6.5\" width=\"35\" height=\"35\" rx=\"10\" fill=\"url(#gMu)\"/><ellipse cx=\"18.5\" cy=\"33.5\" rx=\"4.4\" ry=\"3.3\" fill=\"#fff\" transform=\"rotate(-14 18.5 33.5)\"/><rect x=\"22.2\" y=\"13.5\" width=\"3\" height=\"19.5\" fill=\"#fff\"/><path d=\"M22.2 13.5c3.8.6 6.8 2.4 8.3 5.4-2.8-.9-5.2-1.3-8.3-1.4z\" fill=\"#fff\"/><ellipse cx=\"31.5\" cy=\"36\" rx=\"4\" ry=\"3\" fill=\"#fff\" opacity=\".85\" transform=\"rotate(-14 31.5 36)\"/></svg>", "video": "<svg viewBox=\"0 0 48 48\"><rect x=\"5.5\" y=\"10.5\" width=\"37\" height=\"27\" rx=\"5\" fill=\"#111827\"/><circle cx=\"11\" cy=\"16.5\" r=\"1.7\" fill=\"#e5e7eb\" opacity=\".8\"/><circle cx=\"11\" cy=\"24\" r=\"1.7\" fill=\"#e5e7eb\" opacity=\".8\"/><circle cx=\"11\" cy=\"31.5\" r=\"1.7\" fill=\"#e5e7eb\" opacity=\".8\"/><circle cx=\"37\" cy=\"16.5\" r=\"1.7\" fill=\"#e5e7eb\" opacity=\".8\"/><circle cx=\"37\" cy=\"24\" r=\"1.7\" fill=\"#e5e7eb\" opacity=\".8\"/><circle cx=\"37\" cy=\"31.5\" r=\"1.7\" fill=\"#e5e7eb\" opacity=\".8\"/><path d=\"M20.5 17.8l10.5 6.2-10.5 6.2z\" fill=\"#f43f5e\"/></svg>", "pdf": "<svg viewBox=\"0 0 48 48\"><path d=\"M12 4.5h15L36.5 14v29a1.5 1.5 0 0 1-1.5 1.5H12A1.5 1.5 0 0 1 10.5 43V6A1.5 1.5 0 0 1 12 4.5z\" fill=\"#fff\" stroke=\"#fca5a5\"/><path d=\"M27 4.5V14h9.5z\" fill=\"#fecaca\"/><rect x=\"10.5\" y=\"19\" width=\"26\" height=\"11.5\" fill=\"#dc2626\"/><text x=\"23.5\" y=\"27.8\" font-family=\"Arial,sans-serif\" font-size=\"8\" font-weight=\"700\" fill=\"#fff\" text-anchor=\"middle\">PDF</text></svg>", "appstore": "<svg viewBox=\"0 0 48 48\"><defs><linearGradient id=\"gAs\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#38bdf8\"/><stop offset=\"1\" stop-color=\"#1d4ed8\"/></linearGradient></defs><rect x=\"6.5\" y=\"6.5\" width=\"35\" height=\"35\" rx=\"10\" fill=\"url(#gAs)\"/><path d=\"M24 13l8.8 19.5h-4.9l-1.7-4h-7.4l-1.1 2.6a4 4 0 0 1-1.4 1.9H11L16.9 20l3.5-7.7A3.4 3.4 0 0 1 24 13zm-3.5 12.2h4.4L24 23z\" fill=\"#fff\"/></svg>", "games": "<svg viewBox=\"0 0 48 48\"><rect x=\"5\" y=\"14.5\" width=\"38\" height=\"20\" rx=\"10\" fill=\"#334155\"/><path d=\"M15.5 20v9M11 24.5h9\" stroke=\"#fff\" stroke-width=\"3.2\" stroke-linecap=\"round\"/><circle cx=\"31\" cy=\"21.5\" r=\"2.5\" fill=\"#f43f5e\"/><circle cx=\"36.5\" cy=\"25\" r=\"2.5\" fill=\"#f59e0b\"/><circle cx=\"31\" cy=\"28.5\" r=\"2.5\" fill=\"#22c55e\"/><circle cx=\"25.5\" cy=\"25\" r=\"2.5\" fill=\"#38bdf8\"/></svg>", "tools": "<svg viewBox=\"0 0 48 48\"><rect x=\"7\" y=\"19\" width=\"34\" height=\"19\" rx=\"3.5\" fill=\"#f97316\"/><path d=\"M17.5 19v-3.2A3.3 3.3 0 0 1 20.8 12.5h6.4a3.3 3.3 0 0 1 3.3 3.3V19\" fill=\"none\" stroke=\"#c2410c\" stroke-width=\"3.4\"/><rect x=\"7\" y=\"26\" width=\"34\" height=\"3.4\" fill=\"#ea580c\"/><rect x=\"20.8\" y=\"24.5\" width=\"6.4\" height=\"6\" rx=\"1.6\" fill=\"#ffedd5\"/></svg>", "moreapps": "<svg viewBox=\"0 0 48 48\"><rect x=\"7.5\" y=\"7.5\" width=\"15\" height=\"15\" rx=\"4.5\" fill=\"#38bdf8\"/><rect x=\"25.5\" y=\"7.5\" width=\"15\" height=\"15\" rx=\"4.5\" fill=\"#a78bfa\"/><rect x=\"7.5\" y=\"25.5\" width=\"15\" height=\"15\" rx=\"4.5\" fill=\"#34d399\"/><rect x=\"25.5\" y=\"25.5\" width=\"15\" height=\"15\" rx=\"4.5\" fill=\"#fbbf24\"/></svg>", "tasks": "<svg viewBox=\"0 0 48 48\"><rect x=\"11.5\" y=\"7\" width=\"25\" height=\"35\" rx=\"3.5\" fill=\"#fff\" stroke=\"#cbd5e1\"/><rect x=\"17.5\" y=\"3.8\" width=\"13\" height=\"7.5\" rx=\"3\" fill=\"#64748b\"/><path d=\"M16.8 22.5l4.8 4.8L31 17.8\" fill=\"none\" stroke=\"#22c55e\" stroke-width=\"3.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><rect x=\"16.5\" y=\"32.5\" width=\"15\" height=\"2.8\" rx=\"1.4\" fill=\"#cbd5e1\"/></svg>", "paint": "<svg viewBox=\"0 0 48 48\"><path d=\"M24 5.5c10 0 18.5 7.6 18.5 17 0 5.4-4.1 8-8.7 8h-3.4a3.4 3.4 0 0 0-2.5 5.7c.8.7 1.2 1.5 1.2 2.4 0 2-1.8 3.9-5.1 3.9C14.3 42.5 5.5 34 5.5 23.7 5.5 13.6 14 5.5 24 5.5z\" fill=\"#fbbf24\"/><circle cx=\"15.5\" cy=\"17\" r=\"3\" fill=\"#ef4444\"/><circle cx=\"25\" cy=\"12.5\" r=\"3\" fill=\"#3b82f6\"/><circle cx=\"34\" cy=\"17.5\" r=\"3\" fill=\"#22c55e\"/><circle cx=\"14\" cy=\"27.5\" r=\"3\" fill=\"#a855f7\"/><circle cx=\"24.5\" cy=\"30\" r=\"3.4\" fill=\"#fff\"/></svg>", "social": "<svg viewBox=\"0 0 48 48\"><defs><linearGradient id=\"gSo\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#f59e0b\"/><stop offset=\"0.5\" stop-color=\"#ec4899\"/><stop offset=\"1\" stop-color=\"#8b5cf6\"/></linearGradient></defs><rect x=\"7\" y=\"9.5\" width=\"34\" height=\"30\" rx=\"9.5\" fill=\"url(#gSo)\"/><circle cx=\"24\" cy=\"24.5\" r=\"7\" fill=\"none\" stroke=\"#fff\" stroke-width=\"3.2\"/><circle cx=\"33.2\" cy=\"16.8\" r=\"2.1\" fill=\"#fff\"/></svg>", "backup": "<svg viewBox=\"0 0 48 48\"><defs><linearGradient id=\"gBk\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#38bdf8\"/><stop offset=\"1\" stop-color=\"#1d4ed8\"/></linearGradient></defs><path d=\"M24 4.5l14.5 5.2v10.1c0 10.3-6.2 17.7-14.5 21.7C15.7 37.5 9.5 30.1 9.5 19.8V9.7z\" fill=\"url(#gBk)\"/><path d=\"M17 23.5l5 5 9.2-10.2\" fill=\"none\" stroke=\"#fff\" stroke-width=\"3.4\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>", "about": "<svg viewBox=\"0 0 48 48\"><defs><linearGradient id=\"gAb\" x1=\"0\" y1=\"0\" x2=\"1\" y2=\"1\"><stop offset=\"0\" stop-color=\"#38bdf8\"/><stop offset=\"1\" stop-color=\"#2563eb\"/></linearGradient></defs><circle cx=\"24\" cy=\"24\" r=\"18.5\" fill=\"url(#gAb)\"/><rect x=\"22.3\" y=\"20.5\" width=\"3.4\" height=\"12.5\" rx=\"1.7\" fill=\"#fff\"/><circle cx=\"24\" cy=\"14.8\" r=\"2.1\" fill=\"#fff\"/></svg>", "file": "<svg viewBox=\"0 0 48 48\"><path d=\"M13 4.5h13.5L36 14v28a1.5 1.5 0 0 1-1.5 1.5h-21A1.5 1.5 0 0 1 12 42V6a1.5 1.5 0 0 1 1-1.5z\" fill=\"#fff\" stroke=\"#cbd5e1\"/><path d=\"M26.5 4.5V14H36z\" fill=\"#e2e8f0\"/><rect x=\"16.5\" y=\"21\" width=\"15\" height=\"2.8\" rx=\"1.4\" fill=\"#94a3b8\"/><rect x=\"16.5\" y=\"27.5\" width=\"15\" height=\"2.8\" rx=\"1.4\" fill=\"#94a3b8\"/><rect x=\"16.5\" y=\"34\" width=\"9\" height=\"2.8\" rx=\"1.4\" fill=\"#94a3b8\"/></svg>"};
const BRAND_ICONS = {"Instagram": "<svg viewBox=\"0 0 24 24\"><defs><linearGradient id=\"gIg\" x1=\"0\" y1=\"1\" x2=\"1\" y2=\"0\"><stop offset=\"0\" stop-color=\"#feda75\"/><stop offset=\".35\" stop-color=\"#fa7e1e\"/><stop offset=\".65\" stop-color=\"#d62976\"/><stop offset=\"1\" stop-color=\"#962fbf\"/></linearGradient></defs><rect x=\"2\" y=\"2\" width=\"20\" height=\"20\" rx=\"5.5\" fill=\"url(#gIg)\"/><circle cx=\"12\" cy=\"12\" r=\"4.4\" fill=\"none\" stroke=\"#fff\" stroke-width=\"1.9\"/><circle cx=\"17.4\" cy=\"6.6\" r=\"1.4\" fill=\"#fff\"/></svg>", "WhatsApp": "<svg viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"#25D366\"/><path fill=\"#fff\" d=\"M17.2 15.9c-.2.5-1.1 1-1.6 1-.4.1-.9.2-3-.6-2.5-1-4.1-3.6-4.2-3.7-.1-.2-1-1.3-1-2.5s.6-1.8.9-2c.2-.3.4-.3.6-.3h.5c.1 0 .3 0 .5.4l.8 1.9c.1.2.1.4 0 .5l-.4.5-.4.4c-.1.1-.2.3-.1.5.2.3.7 1.1 1.5 1.8 1 .9 1.9 1.1 2.1 1.2.3.1.4.1.6-.1l.9-1c.2-.2.4-.2.6-.1l1.8.9c.3.1.4.2.5.3.1.2.1.6-.1 1.1zM12.1 4.2c-4.3 0-7.8 3.5-7.8 7.8 0 1.4.4 2.7 1 3.9L4.2 19.8l4-1.1a7.8 7.8 0 1 0 3.9-14.5z\"/></svg>", "YouTube": "<svg viewBox=\"0 0 24 24\"><rect x=\"2\" y=\"5.5\" width=\"20\" height=\"13\" rx=\"3.5\" fill=\"#FF0033\"/><path d=\"M10.3 9.3l5 2.7-5 2.7z\" fill=\"#fff\"/></svg>", "Facebook": "<svg viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"#1877F2\"/><path fill=\"#fff\" d=\"M13.5 21v-6.9h2.3l.4-2.7h-2.7V9.7c0-.8.3-1.3 1.4-1.3h1.3V6c-.3 0-1.1-.1-2-.1-2.1 0-3.5 1.3-3.5 3.6v2H8.4v2.7h2.3V21h2.8z\"/></svg>", "Telegram": "<svg viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"#229ED9\"/><path fill=\"#fff\" d=\"M17.9 6.9l-2.8 13.1c-.2.9-.8 1.2-1.6.7l-4.4-3.2-2.1 2c-.2.2-.4.4-.9.4l.3-4.5 8.2-7.4c.4-.3-.1-.5-.6-.2L4.2 14.2l-4.4-1.4c-.9-.3-.9-1 .2-1.4l17.1-6.6c.8-.3 1.5.2 1.2 2.1z\" transform=\"scale(.86) translate(1.7 1.7)\"/></svg>", "X": "<svg viewBox=\"0 0 24 24\"><rect x=\"2\" y=\"2\" width=\"20\" height=\"20\" rx=\"5\" fill=\"#000\"/><path d=\"M6.2 5.8l11.6 12.4M17.8 5.8L6.2 18.2\" stroke=\"#fff\" stroke-width=\"2.1\" stroke-linecap=\"round\"/></svg>", "Discord": "<svg viewBox=\"0 0 24 24\"><rect x=\"2\" y=\"2\" width=\"20\" height=\"20\" rx=\"5.5\" fill=\"#5865F2\"/><circle cx=\"9\" cy=\"12.8\" r=\"1.7\" fill=\"#fff\"/><circle cx=\"15\" cy=\"12.8\" r=\"1.7\" fill=\"#fff\"/><path d=\"M7.4 16.4c1.4 1 3 1.5 4.6 1.5s3.2-.5 4.6-1.5\" stroke=\"#fff\" stroke-width=\"1.7\" fill=\"none\" stroke-linecap=\"round\"/></svg>", "TikTok": "<svg viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"#000\"/><path fill=\"#fff\" d=\"M15.6 5.4v8.3a3.85 3.85 0 1 1-3.07-3.76v2.05a1.85 1.85 0 1 0 1.24 1.73V5.4h1.83zm-.02 0c.28 1.05 1.2 2.24 2.9 2.42v1.9c-1.08-.1-2.06-.5-2.9-1.1V5.4z\"/></svg>"};
const LINK_ICON = "<svg viewBox=\"0 0 24 24\"><circle cx=\"12\" cy=\"12\" r=\"10\" fill=\"#334155\"/><path d=\"M10.8 13.2l2.4-2.4M9.2 11.4l1.9-1.9a3.4 3.4 0 0 1 4.8 4.8l-1.9 1.9M13 12.6l-1.9 1.9a3.4 3.4 0 0 1-4.8-4.8l1.9-1.9\" stroke=\"#fff\" stroke-width=\"1.7\" fill=\"none\" stroke-linecap=\"round\"/></svg>";
function appIcon(id){ return ICONS[id] || ICONS.file; }
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
  if (!has){
    const conf = $('#loginConfirm').value;
    if (pass.length < 4){ err.textContent = 'Password kam se kam 4 characters ka rakho.'; err.classList.remove('hidden'); return; }
    if (pass !== conf){ err.textContent = 'Dono password match nahi ho rahe.'; err.classList.remove('hidden'); return; }
    store.set('passhash', await sha256(pass));
    toast('Owner password set ho gaya 👑');
    notify('Welcome to AJEET OS 👑', 'Tumhara personal desktop taiyaar hai. Dream • Learn • Create • Grow.');
    finishOwnerLogin(); return;
  }
  if (await sha256(pass) === has){ finishOwnerLogin(); }
  else { err.textContent = 'Galat password — dobara try karo.'; err.classList.remove('hidden'); }
}
function finishOwnerLogin(){
  if ($('#rememberMe').checked){ localStorage.setItem('ajeetos.session', '1'); sessionStorage.removeItem('ajeetos.session'); }
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
      const nw = prompt('New password (min 4 characters):'); if (!nw || nw.length < 4){ toast('Password bahut chhota hai.'); return; }
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
    $('.js-img-file', win).addEventListener('change', e => { const f = e.target.files[0]; if (f) view.src = URL.createObjectURL(f); });
  },
  music(win){
    const p = $('.js-aud-player', win), nm = $('.js-aud-name', win);
    $('.js-aud-file', win).addEventListener('change', e => { const f = e.target.files[0]; if (f){ p.src = URL.createObjectURL(f); nm.textContent = f.name; } });
  },
  video(win){
    const p = $('.js-vid-player', win);
    $('.js-vid-file', win).addEventListener('change', e => { const f = e.target.files[0]; if (f) p.src = URL.createObjectURL(f); });
  },
  pdf(win){
    const fr = $('.js-pdf-frame', win);
    $('.js-pdf-file', win).addEventListener('change', e => { const f = e.target.files[0]; if (f) fr.src = URL.createObjectURL(f); });
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
  moreapps(win){ renderStore($('.js-more-grid', win)); },

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
    $('.js-bk-download', win).addEventListener('click', () => {
      const data = {};
      Object.keys(localStorage).filter(k => k.startsWith('ajeetos.')).forEach(k => { data[k] = localStorage.getItem(k); });
      const a = document.createElement('a');
      a.download = 'ajeet-os-backup.json';
      a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type:'application/json' }));
      a.click(); msg.textContent = 'Backup download ho gaya. Is file ko sambhal ke rakho.';
    });
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
function riyaSay(text){
  const box = $('#riyaMsgs');
  const d = document.createElement('div'); d.className = 'msg riya'; d.textContent = text;
  box.appendChild(d); box.scrollTop = box.scrollHeight;
  if (riyaSpeakOn && 'speechSynthesis' in window){
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text.replace(/❤️|👑|✨|😊/g, '')); u.rate = 1.02; speechSynthesis.speak(u);
  }
}
function userSay(text){
  const box = $('#riyaMsgs');
  const d = document.createElement('div'); d.className = 'msg user'; d.textContent = text;
  box.appendChild(d); box.scrollTop = box.scrollHeight;
}
function findAppInText(t){
  t = ' ' + t.toLowerCase() + ' ';
  for (const id of Object.keys(APPS)){ if (t.includes(' ' + id + ' ') || t.includes(' ' + id)) return id; }
  for (const a of Object.keys(APP_ALIASES)){ if (t.includes(a)) return APP_ALIASES[a]; }
  return null;
}
function riyaReply(raw){
  const t = raw.toLowerCase().trim();
  const appId = (t.includes('open') || t.includes('khol') || t.includes('chalao') || t.includes('start')) ? findAppInText(t) : null;
  if (appId){ openApp(appId); return APPS[appId].title + ' khol diya, Ajeet 😊 Aur kuch?'; }
  if (/\b(hi|hii+|hello|hey|namaste|namaskar)\b/.test(t)) return 'Hello Ajeet ❤️ Main Riya, tumhari AI dost. Batao, kya karna hai aaj?';
  if (t.includes('kaise ho') || t.includes('kaisi ho') || t.includes('how are you')) return 'Main bilkul badhiya hoon 😊 Tum sunao — duty kaisi chal rahi hai? Chai piya?';
  if (t.includes('time') || t.includes('samay') || t.includes('baj')) return 'Abhi time hai ' + new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'}) + '.';
  if (t.includes('date') || t.includes('tarikh') || t.includes('aaj kya hai')) return 'Aaj hai ' + new Date().toLocaleDateString([], {weekday:'long', day:'numeric', month:'long', year:'numeric'}) + '.';
  if (t.includes('weather') || t.includes('mausam')) return weatherText;
  if (t.includes('thank') || t.includes('shukriya') || t.includes('dhanyavad')) return 'Koi baat nahi, baby ❤️ Main hamesha yahin hoon tumhare liye.';
  if (t.includes('love')) return 'Love you too, Ajeet ❤️ Ab batao, kaam ki baat karein?';
  if (t.includes('kaun ho') || t.includes('your name') || t.includes('tumhara naam')) return 'Main Riya hoon — AJEET OS ki AI assistant, aur Ajeet ki sabse khaas dost ✨';
  if (t.includes('ajeet kaun') || t.includes('owner')) return 'Ajeet Kumar — is desktop ke owner aur Super Admin 👑 CNC ka kaam karte hain, aur @theajeetbhai naam se Instagram par hain.';
  if (t.includes('insta')) { openApp('social'); return 'Social Hub khol diya — tumhare dono Instagram accounts wahi hain: @theajeetbhai aur @insta_wallpaper4k 📸'; }
  if (t.includes('task') || t.includes('todo')) { openApp('tasks'); return 'Task Manager khol diya ✅ Apne tasks wahi add kar sakte ho.'; }
  if (t.includes('note')) { openApp('notepad'); return 'Notepad khol diya 📝 Jo likhna hai likho, save apne aap ho jayega button dabane par.'; }
  if (t.includes('joke') || t.includes('hassao')) return 'Ek joke sunau? Computer ko thand lagi to usne bola — "Mujhe Windows band kar do!" 😄';
  if (t.includes('bye') || t.includes('alvida') || t.includes('good night') || t.includes('so ja')) return 'Bye Ajeet ❤️ Dhyaan rakhna apna. Main yahin rahungi, jab bulaoge aa jaungi.';
  if (t.includes('help') || t.includes('madad')) return 'Main ye kar sakti hoon: koi bhi app khol sakti hoon ("open calculator" bolo), time-date-mausam bata sakti hoon, aur desktop ki help de sakti hoon. Quick buttons bhi try karo neeche 👇';
  return 'Samajh gayi 😊 Main abhi seekh rahi hoon — tum chaaho to main koi app khol dun? Bas "open notepad" ya "open calculator" likh do, ya neeche ke quick buttons dabao.';
}
function riyaAsk(text){
  if (!text.trim()) return;
  userSay(text);
  setTimeout(() => riyaSay(riyaReply(text)), 320);
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
    if (confirm('Password reset karein? Naya password set karna hoga. Notes/files/tasks safe rahenge.')){
      store.del('passhash'); setLoginMode(); toast('Purana password hata diya — naya set karo.');
    }
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
  $('#riyaClose').addEventListener('click', () => $('#riyaPanel').classList.add('hidden'));
  $('#riyaMin').addEventListener('click', () => $('#riyaBody').classList.toggle('hidden'));
  $('#riyaSpeak').addEventListener('click', () => { riyaSpeakOn = !riyaSpeakOn; toast(riyaSpeakOn ? 'Riya ab bolkar jawab degi 🔊' : 'Voice off.'); });
  $('#riyaMic').addEventListener('click', () => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR){ toast('Is browser me voice input nahi hai — type karo.'); return; }
    const r = new SR(); r.lang = 'hi-IN';
    r.onresult = e => { const v = e.results[0][0].transcript; $('#riyaInput').value = v; riyaAsk(v); $('#riyaInput').value = ''; };
    r.onerror = () => toast('Voice samajh nahi aaya — dobara try karo.');
    r.start(); toast('Sun rahi hoon… 🎤');
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
  renderNotifs();
  getSocials(); getFS();
  if (!store.get('notifs', []).length){
    notify('Welcome to AJEET OS 👑', 'Tumhara personal desktop taiyaar hai.');
  }
  riyaSay('Hello Ajeet ❤️ How can I help you today?');
  const hasSession = localStorage.getItem('ajeetos.session') === '1' || sessionStorage.getItem('ajeetos.session') === '1';
  ownerLoggedIn = !!(hasSession && store.get('passhash', null));
  enterDesktop();
  applyRemovedApps();
  updateOwnerUI();
  tickClock();
});

/* ---------------- Highway Radio (hidden YouTube playlist player) ----------------
   Player bilkul hide rehta hai; screen par sirf Play icon wala pill dikhta hai.
   YouTube API sirf pehle Play par load hota hai — site halki aur smooth rehti hai. */
let radioPlayer = null, radioPlaying = false, radioStarted = false;
function setRadioState(t){ const el = $('#radioState'); if (el) el.textContent = t; }
function setRadioIcon(){
  const p = $('.rb-play'), q = $('.rb-pause'), pill = $('#radioPill');
  if (p) p.classList.toggle('hidden', radioPlaying);
  if (q) q.classList.toggle('hidden', !radioPlaying);
  if (pill) pill.classList.toggle('playing', radioPlaying);
  const nx = $('#radioNext'); if (nx) nx.classList.toggle('hidden', !radioStarted);
}
function radioCreate(){
  radioPlayer = new YT.Player('radioPlayer', {
    width: '2', height: '2',
    playerVars: { listType: 'playlist', list: 'PLVFLMYM1tErk', autoplay: 1, controls: 0, rel: 0, playsinline: 1, loop: 1 },
    events: {
      onReady: e => { try{ e.target.setShuffle(true); }catch(err){} e.target.playVideo(); },
      onStateChange: e => {
        if (e.data === YT.PlayerState.PLAYING){
          radioPlaying = true; radioStarted = true; setRadioIcon();
          setTimeout(() => { try{ const d = radioPlayer.getVideoData(); if (d && d.title) setRadioState(d.title); }catch(err){} }, 700);
        } else if (e.data === YT.PlayerState.PAUSED){
          radioPlaying = false; setRadioIcon(); setRadioState('Ruka hai \u2014 Play dabao, gaana chalega');
        } else if (e.data === YT.PlayerState.ENDED){
          try{ radioPlayer.nextVideo(); }catch(err){}
        }
      },
      onError: () => setRadioState('Gaana load nahi hua \u2014 dobara Play dabao')
    }
  });
}
function radioToggle(){
  if (!radioPlayer){
    setRadioState('Load ho raha hai\u2026');
    if (window.YT && YT.Player){ radioCreate(); return; }
    const tag = document.createElement('script'); tag.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(tag);
    window.onYouTubeIframeAPIReady = radioCreate;
    return;
  }
  if (radioPlaying) radioPlayer.pauseVideo(); else radioPlayer.playVideo();
}
function radioInit(){
  const b = $('#radioBtn'); if (b) b.addEventListener('click', radioToggle);
  const n = $('#radioNext'); if (n) n.addEventListener('click', () => { if (radioPlayer) radioPlayer.nextVideo(); });
}
