'use strict';
/* ===== Helpers ===== */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const fmt = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const esc = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const sum = a => a.reduce((x, y) => x + y, 0);

/* ===== Inline SVG icons (Lucide-style paths) ===== */
const ICONS = {
  home: 'M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z',
  list: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01',
  chart: 'M3 3v18h18M7 15l4-4 3 3 5-6',
  wallet: 'M3 7h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM3 7l2-3h12M16 14h2',
  target: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
  gear: 'M4 6h10M18 6h2M4 12h2M10 12h10M4 18h12M14 4v4M8 10v4M16 16v4',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  bell: 'M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21h4',
  moon: 'M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z',
  sun: 'M12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  menu: 'M3 6h18M3 12h18M3 18h18',
  plus: 'M12 5v14M5 12h14',
  x: 'M18 6L6 18M6 6l12 12',
  down: 'M12 5v14M19 12l-7 7-7-7',
  up: 'M12 19V5M5 12l7-7 7 7',
  piggy: 'M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6',
  out: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  bulb: 'M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2z',
  alert: 'M12 9v4M12 17h.01M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z'
};
const icon = n => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${ICONS[n]}"/></svg>`;
const paintIcons = (root = document) => $$('[data-i]', root).forEach(e => (e.innerHTML = icon(e.dataset.i)));

/* ===== Demo data ===== */
const CATS = ['Food', 'Shopping', 'Transport', 'Bills', 'Entertainment', 'Other'];
let COLORS = [];
const MONTHS = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
const day = n => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().slice(0, 10); };
const seed = () => ({
  balance: 248560, income: 65000, expenses: 28450, savings: 120000,
  cat: [7200, 6800, 3150, 6900, 2400, 2000],
  limits: [8000, 7000, 4000, 7000, 3000, 2500],
  inc: [58000, 61000, 59500, 63000, 62000, 65000],
  exp: [31000, 29500, 34200, 27800, 30100, 28450],
  tx: [
    { name: 'Salary — Northwind Ltd', cat: 'Income', amt: 65000, type: 'income', date: day(12), status: 'Completed' },
    { name: 'Swiggy Instamart', cat: 'Food', amt: 1860, type: 'expense', date: day(1), status: 'Completed' },
    { name: 'Amazon Shopping', cat: 'Shopping', amt: 4299, type: 'expense', date: day(3), status: 'Pending' },
    { name: 'Uber Rides', cat: 'Transport', amt: 640, type: 'expense', date: day(4), status: 'Completed' },
    { name: 'Electricity Bill', cat: 'Bills', amt: 2150, type: 'expense', date: day(6), status: 'Completed' },
    { name: 'Netflix & Spotify', cat: 'Entertainment', amt: 799, type: 'expense', date: day(9), status: 'Completed' },
    { name: 'Freelance Project', cat: 'Income', amt: 12000, type: 'income', date: day(20), status: 'Pending' },
    { name: 'Zomato Dinner', cat: 'Food', amt: 1240, type: 'expense', date: day(34), status: 'Completed' },
    { name: 'Broadband Plan', cat: 'Bills', amt: 1179, type: 'expense', date: day(52), status: 'Failed' }
  ],
  goals: [
    { name: 'Emergency Fund', target: 200000, saved: 70000 },
    { name: 'Goa Trip', target: 60000, saved: 20000 },
    { name: 'New Laptop', target: 150000, saved: 30000 }
  ],
  log: [{ t: 'Salary of ₹65,000 credited', w: '6 days ago' }, { t: 'Electricity bill paid', w: '6 days ago' }, { t: 'Budget alert: Bills almost at limit', w: '8 days ago' }]
});
const S = seed();
const notifs = [
  { t: 'Bills budget at 99%', s: 'Consider pausing extra payments', u: true },
  { t: 'Salary credited', s: '₹65,000 from Northwind Ltd', u: true },
  { t: 'Goa Trip is 33% funded', s: 'Nice progress this month', u: false }
];
const CARDS = [
  { k: 'balance', l: 'Total Balance', i: 'wallet', d: '+8.2%', good: 1, s: [40, 44, 42, 50, 54, 52, 60, 66] },
  { k: 'income', l: 'Monthly Income', i: 'down', d: '+4.8%', good: 1, s: [52, 50, 56, 55, 60, 58, 63, 65] },
  { k: 'expenses', l: 'Monthly Expenses', i: 'up', d: '−4.1%', good: 1, neg: 1, s: [34, 30, 36, 31, 33, 29, 31, 28] },
  { k: 'savings', l: 'Total Savings', i: 'piggy', d: '+12.5%', good: 1, s: [80, 86, 92, 95, 101, 108, 114, 120] }
];

/* ===== Toasts ===== */
function toast(msg, err) {
  const t = document.createElement('div');
  t.className = 'toast' + (err ? ' err' : '');
  t.textContent = msg;
  $('#toasts').append(t);
  setTimeout(() => { t.classList.add('out'); setTimeout(() => t.remove(), 320); }, 2800);
}

/* ===== KPI cards ===== */
const spark = (s, c) => {
  const mx = Math.max(...s), mn = Math.min(...s);
  const pts = s.map((v, i) => `${(i * 100 / (s.length - 1)).toFixed(1)},${(28 - (v - mn) / (mx - mn || 1) * 24).toFixed(1)}`).join(' ');
  return `<svg class="spark" viewBox="0 0 100 32" preserveAspectRatio="none" aria-hidden="true"><polyline pathLength="1" points="${pts}" fill="none" style="stroke:${c}" stroke-width="2" vector-effect="non-scaling-stroke" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
};
function countTo(el, to) {
  const from = +el.dataset.v || 0;
  el.dataset.v = to;
  if (reduce) { el.textContent = fmt.format(to); return; }
  const t0 = performance.now(), dur = 1100;
  const step = t => {
    const p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
    el.textContent = fmt.format(Math.round(from + (to - from) * e));
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
function buildCards() {
  $('#cards').innerHTML = CARDS.map(c => `
    <article class="card kpi ${c.neg ? 'neg' : ''}">
      <div class="top"><span>${c.l}</span><span class="ico">${icon(c.i)}</span></div>
      <div class="val" id="v-${c.k}" aria-live="polite">${fmt.format(0)}</div>
      <div class="meta"><span class="chip ${c.good ? 'up' : 'down'}">${c.d}</span>vs last month</div>
      ${spark(c.s, c.neg ? 'var(--exp)' : 'var(--inc)')}
    </article>`).join('');
}
const updateCards = () => CARDS.forEach(c => countTo($('#v-' + c.k), S[c.k]));

/* ===== Charts ===== */
let lineC, donC;
const css = v => getComputedStyle(document.documentElement).getPropertyValue(v).trim();
function buildCharts() {
  COLORS = ['--c1', '--c2', '--c3', '--c4', '--c5', '--c6'].map(css);
  if (!window.Chart) {
    $$('.chart-box').forEach(b => (b.innerHTML = '<p class="muted">Charts could not load. Check your internet connection.</p>'));
    return;
  }
  lineC && lineC.destroy(); donC && donC.destroy();
  Chart.defaults.color = css('--tx2');
  Chart.defaults.font.family = "'Hanken Grotesk', sans-serif";
  const tip = {
    backgroundColor: css('--elev'), titleColor: css('--tx'), bodyColor: css('--tx2'),
    borderColor: css('--bd'), borderWidth: 1, padding: 12, cornerRadius: 12, usePointStyle: true
  };
  const grad = c => ctx => {
    const a = ctx.chart.chartArea; if (!a) return 'transparent';
    const g = ctx.chart.ctx.createLinearGradient(0, a.top, 0, a.bottom);
    g.addColorStop(0, c + '30'); g.addColorStop(1, c + '00'); return g;
  };
  const ds = (label, data, c) => ({ label, data, backgroundColor: c, borderRadius: 5, borderSkipped: false, categoryPercentage: .7, barPercentage: .85 });
  lineC = new Chart($('#lineChart'), {
    type: 'bar',
    data: { labels: MONTHS, datasets: [ds('Income', S.inc, css('--inc')), ds('Expenses', S.exp, css('--exp'))] },
    options: {
      responsive: true, maintainAspectRatio: false, interaction: { mode: 'index', intersect: false },
      animation: { duration: reduce ? 0 : 1200, easing: 'easeOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: { ...tip, callbacks: {
          label: c => ` ${c.dataset.label}: ${fmt.format(c.parsed.y)}`,
          footer: i => i.length > 1 ? 'Saved: ' + fmt.format(i[0].parsed.y - i[1].parsed.y) : ''
        } }
      },
      scales: {
        x: { grid: { display: false }, border: { display: false } },
        y: { border: { display: false }, grid: { color: css('--bd') }, ticks: { callback: v => '₹' + v / 1000 + 'k' } }
      }
    }
  });
  donC = new Chart($('#donut'), {
    type: 'doughnut',
    data: { labels: CATS, datasets: [{ data: S.cat, backgroundColor: COLORS, borderWidth: 0, spacing: 3, borderRadius: 3, hoverOffset: 4 }] },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '70%',
      animation: { duration: reduce ? 0 : 1200 },
      plugins: { legend: { display: false }, tooltip: { ...tip, callbacks: {
        label: c => ` ${fmt.format(c.parsed)} · ${(c.parsed / sum(S.cat) * 100).toFixed(1)}%`
      } } }
    }
  });
}
function updateCharts() {
  if (lineC) { lineC.data.datasets[0].data = S.inc; lineC.data.datasets[1].data = S.exp; lineC.update(); }
  if (donC) { donC.data.datasets[0].data = S.cat; donC.update(); }
  const tot = sum(S.cat);
  $('#donutTotal').textContent = fmt.format(tot);
  $('#legend').innerHTML = CATS.map((c, i) =>
    `<li><span class="sw" style="background:${COLORS[i]}"></span>${c}<b>${fmt.format(S.cat[i])}</b><em>${(S.cat[i] / tot * 100).toFixed(0)}%</em></li>`).join('');
}

/* ===== Progress bars (animate once their section is visible) ===== */
function fillBars(root) {
  if (!root || !root.classList.contains('in')) return;
  $$('.bar span', root).forEach(s => {
    s.style.width = '0';
    requestAnimationFrame(() => requestAnimationFrame(() => (s.style.width = s.dataset.w + '%')));
  });
}

/* ===== Transactions ===== */
let sort = { k: 'date', dir: -1 };
const inRange = d => { const n = +$('#range').value; return !n || (Date.now() - new Date(d)) / 864e5 <= n; };
function renderTx() {
  const q = $('#search').value.trim().toLowerCase(), ty = $('#type').value;
  const rows = S.tx
    .filter(t => inRange(t.date) && (ty === 'all' || t.type === ty) && (t.name + ' ' + t.cat).toLowerCase().includes(q))
    .sort((a, b) => { const x = a[sort.k], y = b[sort.k]; return (typeof x === 'string' ? x.localeCompare(y) : x - y) * sort.dir; });
  $('#txBody').innerHTML = rows.map(t => `<tr>
    <td><b>${esc(t.name)}</b></td><td>${t.cat}</td>
    <td>${new Date(t.date + 'T00:00').toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</td>
    <td class="amt ${t.type === 'income' ? 'pos' : 'neg-t'}">${t.type === 'income' ? '+' : '−'}${fmt.format(t.amt)}</td>
    <td><span class="badge b-${t.status}">${t.status}</span></td></tr>`).join('');
  $('#empty').hidden = rows.length > 0;
  $('#count').textContent = `${rows.length} transaction${rows.length === 1 ? '' : 's'}`;
  $$('th[aria-sort]').forEach(th => {
    const b = $('button', th);
    th.setAttribute('aria-sort', b && b.dataset.sort === sort.k ? (sort.dir > 0 ? 'ascending' : 'descending') : 'none');
  });
}

/* ===== Budgets, goals, insights, activity, notifications ===== */
function renderBudgets() {
  $('#budgetList').innerHTML = CATS.map((c, i) => {
    const p = Math.round(S.cat[i] / S.limits[i] * 100), cls = p > 100 ? 'over' : p >= 80 ? 'warn' : '';
    return `<article class="card bud"><div class="row"><h3>${c}</h3><span class="chip ${p > 100 ? 'down' : 'up'}">${p}%</span></div>
      <div class="bar"><span class="${cls}" data-w="${Math.min(p, 100)}"></span></div>
      <div class="row"><b>${fmt.format(S.cat[i])}</b><small>of ${fmt.format(S.limits[i])}</small></div></article>`;
  }).join('');
  fillBars($('#budgetList'));
}
function renderGoals() {
  $('#goalList').innerHTML = S.goals.map((g, i) => {
    const p = Math.min(100, Math.round(g.saved / g.target * 100));
    return `<article class="card goal"><div class="row"><h3>${esc(g.name)}</h3><span class="chip up">${p}%</span></div>
      <p class="muted" style="margin-top:6px">${fmt.format(g.saved)} of ${fmt.format(g.target)}</p>
      <div class="bar"><span data-w="${p}"></span></div>
      <button class="btn ghost sm" data-add="${i}">${icon('plus')}Add ${fmt.format(5000)}</button></article>`;
  }).join('');
  fillBars($('#goalList'));
}
function renderInsights() {
  const rate = Math.round((S.income - S.expenses) / S.income * 100);
  const top = S.cat.indexOf(Math.max(...S.cat));
  const near = S.cat.filter((v, i) => v / S.limits[i] >= .8).length;
  const items = [
    ['bulb', `Savings rate: ${rate}%`, rate >= 20 ? 'Above the 20% rule of thumb. Great discipline.' : 'Below the 20% rule of thumb. Try trimming one category.'],
    ['chart', `Top spend: ${CATS[top]}`, `${fmt.format(S.cat[top])} this month, ${Math.round(S.cat[top] / sum(S.cat) * 100)}% of all expenses.`],
    ['alert', `${near} budget${near === 1 ? '' : 's'} near limit`, near ? 'These categories are at 80% or more of their monthly cap.' : 'Every budget is comfortably within its limit.']
  ];
  $('#insights').innerHTML = items.map(([i, t, p]) => `<article class="card insight"><span class="ico">${icon(i)}</span><div><h3>${t}</h3><p>${p}</p></div></article>`).join('');
}
const renderActivity = () => ($('#activity').innerHTML = S.log.slice(0, 5).map(l => `<li><div>${esc(l.t)}<small>${l.w}</small></div></li>`).join(''));
function renderNotifs() {
  $('#notifList').innerHTML = notifs.map(n => `<li class="${n.u ? 'unread' : ''}"><b>${n.t}</b><small>${n.s}</small></li>`).join('');
  $('#dot').hidden = !notifs.some(n => n.u);
}
function renderBento() {
  const rate = Math.max(0, Math.min(100, Math.round((S.income - S.expenses) / S.income * 100))), C = 2 * Math.PI * 44;
  $('#ring').innerHTML = `<svg viewBox="0 0 120 120" class="ringsvg" role="img" aria-label="Kept ${rate}% of income"><circle cx="60" cy="60" r="44" class="rt"/><circle cx="60" cy="60" r="44" class="rf" stroke-dasharray="${(C * rate / 100).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 60 60)"/><text x="60" y="67" text-anchor="middle" class="rn">${rate}%</text></svg><p class="muted">of your income stayed with you</p>`;
  const top = CATS.map((c, i) => ({ c, v: S.cat[i] })).sort((a, b) => b.v - a.v).slice(0, 4), R = [80, 61, 43, 26], op = [.14, .3, .55, .95];
  $('#circles').innerHTML = `<svg viewBox="0 0 170 164" class="circsvg" role="img" aria-label="Top four spending categories">` + top.map((t, i) => {
    const cy = 162 - R[i];
    return `<circle cx="85" cy="${cy}" r="${R[i]}" style="fill:var(--acc);fill-opacity:${op[i]}"><title>${t.c}</title></circle><text x="85" y="${cy - R[i] + 14}" text-anchor="middle" class="cl${i === 3 ? ' w' : ''}">₹${(t.v / 1000).toFixed(1)}k</text>`;
  }).join('') + `</svg><p class="muted">${top.map(t => t.c).join(', ')}: biggest to smallest</p>`;
  const need = S.tx.filter(t => t.status !== 'Completed');
  $('#todo').innerHTML = need.length ? need.map(t => `<li class="${t.status}"><b>${esc(t.name)}</b><small>${t.status} · ${fmt.format(t.amt)}</small></li>`).join('') : '<li><b>All clear</b><small>Nothing is waiting on you.</small></li>';
}
function renderAll() {
  updateCards(); updateCharts(); renderBudgets(); renderGoals(); renderInsights(); renderActivity(); renderTx(); renderBento();
}
const logIt = t => S.log.unshift({ t, w: 'Just now' });

/* ===== Modals ===== */
function openModal(id) {
  const m = $('#' + id); m.classList.add('open'); m.setAttribute('aria-hidden', 'false');
  setTimeout(() => $('input', m).focus(), 150);
}
function closeModals() { $$('.modal.open').forEach(m => { m.classList.remove('open'); m.setAttribute('aria-hidden', 'true'); }); }

$('#txForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target), amt = Math.round(+f.get('amt')), type = f.get('type'), cat = f.get('cat');
  if (!(amt > 0)) return toast('Enter a valid amount', true);
  S.tx.push({ name: f.get('name').trim(), cat: type === 'income' ? 'Income' : cat, amt, type, date: f.get('date'), status: 'Completed' });
  if (type === 'income') { S.income += amt; S.balance += amt; S.inc[5] += amt; }
  else { S.expenses += amt; S.balance -= amt; S.exp[5] += amt; S.cat[CATS.indexOf(cat)] += amt; }
  logIt(`${type === 'income' ? 'Income' : 'Expense'} of ${fmt.format(amt)}: ${f.get('name').trim()}`);
  renderAll(); closeModals(); e.target.reset(); setToday();
  toast('Transaction added');
});
$('#goalForm').addEventListener('submit', e => {
  e.preventDefault();
  const f = new FormData(e.target), target = Math.round(+f.get('target')), saved = Math.min(target, Math.round(+f.get('saved')));
  if (!(target > 0)) return toast('Enter a valid target', true);
  S.goals.push({ name: f.get('name').trim(), target, saved });
  S.savings += saved;
  logIt(`New goal created: ${f.get('name').trim()}`);
  renderAll(); closeModals(); e.target.reset();
  toast('Savings goal created');
});

/* ===== Dropdowns ===== */
function closeDD(except) { $$('.dd.open').forEach(d => { if (d !== except) { d.classList.remove('open'); $('[data-dd]', d).setAttribute('aria-expanded', 'false'); } }); }
$$('[data-dd]').forEach(b => b.addEventListener('click', e => {
  e.stopPropagation();
  const d = b.closest('.dd'), open = !d.classList.contains('open');
  closeDD(d); d.classList.toggle('open', open); b.setAttribute('aria-expanded', open);
}));
document.addEventListener('click', e => { if (!e.target.closest('.dd')) closeDD(); });
$('#readAll').addEventListener('click', () => { notifs.forEach(n => (n.u = false)); renderNotifs(); toast('All notifications marked as read'); });

/* ===== Theme ===== */
function setTheme(t) {
  document.documentElement.dataset.theme = t;
  try { localStorage.setItem('finora-theme', t); } catch (e) { /* storage unavailable */ }
  $('#themeBtn').innerHTML = icon(t === 'dark' ? 'sun' : 'moon');
  if (window.Chart) { buildCharts(); updateCharts(); }
}
const toggleTheme = () => { setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'); toast('Switched to ' + document.documentElement.dataset.theme + ' theme'); };

/* ===== Mobile sidebar ===== */
const sidebar = $('#sidebar'), scrim = $('#scrim');
const menu = open => { sidebar.classList.toggle('open', open); scrim.classList.toggle('show', open); };
$('#menuBtn').addEventListener('click', () => menu(true));
scrim.addEventListener('click', () => menu(false));
$('#nav').addEventListener('click', e => { if (e.target.closest('a')) menu(false); });

/* ===== Global click actions ===== */
document.addEventListener('click', e => {
  const a = e.target.closest('[data-act]');
  if (a) {
    closeDD();
    const act = a.dataset.act;
    if (act === 'theme') toggleTheme();
    else if (act === 'signout') toast('Demo only: there is no real account to sign out of');
    else if (act === 'addtx') openModal('txModal');
    else if (act === 'addgoal') openModal('goalModal');
    else if (act === 'reset') { Object.assign(S, seed()); renderAll(); toast('Demo data restored'); }
  }
  if (e.target.closest('[data-close]') || e.target.classList.contains('modal')) closeModals();
  const add = e.target.closest('[data-add]');
  if (add) {
    const g = S.goals[+add.dataset.add], inc = Math.min(5000, g.target - g.saved);
    if (inc <= 0) return toast(`${g.name} is already fully funded`);
    g.saved += inc; S.savings += inc; logIt(`Added ${fmt.format(inc)} to ${g.name}`);
    renderAll(); toast(`${fmt.format(inc)} added to ${g.name}`);
  }
  const s = e.target.closest('[data-sort]');
  if (s) { const k = s.dataset.sort; sort = { k, dir: sort.k === k ? -sort.dir : (k === 'name' ? 1 : -1) }; renderTx(); }
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeModals(); closeDD(); menu(false); } });

/* ===== Filters ===== */
['search', 'type', 'range'].forEach(id => $('#' + id).addEventListener('input', renderTx));
$('#range').addEventListener('change', () => toast('Showing ' + $('#range').selectedOptions[0].text.toLowerCase()));
$('#clearF').addEventListener('click', () => { $('#search').value = ''; $('#type').value = 'all'; $('#range').value = '0'; renderTx(); });

/* ===== Scroll reveal + active nav ===== */
function initObservers() {
  const io = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) { en.target.classList.add('in'); fillBars(en.target); io.unobserve(en.target); }
  }), { threshold: .12 });
  $$('.reveal, .stagger').forEach(el => io.observe(el));
  const links = $$('#nav a');
  const nav = new IntersectionObserver(es => es.forEach(en => {
    if (en.isIntersecting) links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + en.target.id));
  }), { rootMargin: '-35% 0px -60% 0px' });
  $$('main section').forEach(s => nav.observe(s));
}

/* ===== Init ===== */
function setToday() { $('#txForm [name=date]').value = day(0); }
function init() {
  let t = 'light';
  try { t = localStorage.getItem('finora-theme') || 'light'; } catch (e) { /* ignore */ }
  paintIcons();
  $('#txForm [name=cat]').innerHTML = CATS.map(c => `<option>${c}</option>`).join('');
  const now = new Date(), hr = now.getHours();
  $('#dNum').textContent = now.getDate(); $('#dTxt').textContent = now.toLocaleDateString('en-IN', { weekday: 'short', month: 'long' });
  $('#hi').textContent = `Good ${hr < 12 ? 'morning' : hr < 17 ? 'afternoon' : 'evening'}, Sarjina`;
  setToday(); buildCards(); renderNotifs();
  document.documentElement.dataset.theme = t;
  $('#themeBtn').innerHTML = icon(t === 'dark' ? 'sun' : 'moon');
  $('#themeBtn').addEventListener('click', toggleTheme);
  buildCharts(); renderAll(); initObservers();
}
init();
