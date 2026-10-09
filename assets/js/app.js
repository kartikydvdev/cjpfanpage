/* OILFLOW — shared application logic.
   Educational simulation: all amounts are hypothetical DEMO values.
   State is kept in localStorage so separate pages behave like one product. */
(function (global) {
  'use strict';

  const money = n => '\u20B9' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  const signed = n => (n >= 0 ? '+' : '-') + money(Math.abs(n));
  const round = n => Math.round((n + Number.EPSILON) * 100) / 100;
  const qs = key => new URLSearchParams(location.search).get(key);
  const el = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  // Six demo tiers. Preset schedule: daily = 18% of amount, bonus = 20%, 14 days.
  const tiers = [
    ['Starter', 500, '#efc478'],
    ['Basic', 1000, '#90bfdd'],
    ['Plus', 2500, '#aca1e6'],
    ['Pro', 5000, '#75d6b1'],
    ['Advanced', 10000, '#e6af93'],
    ['Premium', 20000, '#d9c488']
  ].map(([name, amount, color], id) => ({
    id: id, slug: String(amount), name: name, amount: amount, color: color,
    daily: amount * 0.18, bonus: amount * 0.2, duration: 14
  }));

  const tierBySlug = slug => tiers.find(t => t.slug === String(slug));
  const tierById = id => tiers[Number(id)];

  function defaultConfig(tier) {
    return Object.assign({}, tier, {
      scenario: 'Bull', mode: 'fixed', movement: 2.18
    });
  }

  function calc(c) {
    const daily = round(c.mode === 'linked' ? c.amount * c.movement / 100 : c.daily);
    const rewards = round(daily * c.duration);
    return {
      daily: daily, rewards: rewards,
      final: round(c.amount + rewards),
      inclusive: round(c.amount + rewards + c.bonus)
    };
  }

  function series(c) {
    const x = calc(c);
    return Array.from({ length: c.duration + 1 }, (_, d) =>
      round(c.amount + x.daily * d + (d === c.duration ? c.bonus : 0)));
  }

  // ---- persistent demo state (shared across pages) ----
  const KEY = 'oilflow.demo.v1';
  const blank = () => ({ config: null, day: 0, withdrawn: 0, added: 0, events: [], deposits: [] });

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return blank();
      const parsed = JSON.parse(raw);
      return Object.assign(blank(), parsed);
    } catch (e) { return blank(); }
  }
  function save(state) {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* storage unavailable */ }
  }
  function clear() { try { localStorage.removeItem(KEY); } catch (e) {} }

  function hasDemo() { const s = load(); return !!(s.config && s.config.amount); }

  function available(state) {
    const s = state || load();
    if (!s.config) return 0;
    const x = calc(s.config);
    const bonus = s.day === s.config.duration ? s.config.bonus : 0;
    return round(s.config.amount + x.daily * s.day + bonus + (s.added || 0) - (s.withdrawn || 0));
  }

  function toast(message) {
    let node = el('toast');
    if (!node) {
      node = document.createElement('div');
      node.id = 'toast';
      node.className = 'toast hide';
      node.setAttribute('role', 'status');
      document.body.appendChild(node);
    }
    node.textContent = message;
    node.classList.remove('hide');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => node.classList.add('hide'), 3200);
  }

  // ---- navigation (shared across every page) ----
  const NAV = [
    ['index.html', 'Overview', 'home'],
    ['packages.html', 'Packages', 'packages'],
    ['market.html', 'Oil market', 'market'],
    ['portfolio.html', 'Portfolio', 'portfolio'],
    ['learn.html', 'Learn', 'learn'],
    ['risk.html', 'Risk', 'risk']
  ];

  function navHTML(active) {
    const links = NAV.map(([href, label, key]) =>
      `<a href="${href}"${key === active ? ' class="active"' : ''}>${label}</a>`).join('');
    const s = load();
    const balance = s.config ? money(available(s)) : money(0);
    return `<div class="banner">FICTIONAL EDUCATIONAL DEMO ONLY &nbsp; / &nbsp; No real funds, deposits, withdrawals or financial returns</div>
<nav class="nav"><div class="shell">
  <a class="logo" href="index.html"><span class="mark">\u25C8</span>OILFLOW</a>
  <div class="navlinks">${links}</div>
  <div class="navright">
    <span class="pill">\u25CF DEMO MODE</span>
    <span class="tiny">DEMO ${balance}</span>
    <span class="avatar" aria-label="Demo user">D</span>
  </div>
</div></nav>`;
  }

  function footerHTML() {
    return `<footer><div class="footerline"><a class="logo" href="index.html" style="font-size:13px"><span class="mark">\u25C8</span>OILFLOW</a><span>EDUCATION FIRST. ALWAYS SIMULATED.</span></div>
This website is a fictional simulation for educational and product-design purposes. All investment amounts, rewards, bonuses, balances and withdrawals shown are hypothetical. No real funds are accepted or transferred.
<p>Fictional scenarios are not financial advice or forecasts. Add Funds is a non-functional interface prototype: it has no payment gateway, UPI integration, bank connection or card processing. Every payment method on it is simulated and no money can move. Session data stays in this browser and resets when you clear it.</p></footer>`;
  }

  function mount(active) {
    const host = el('nav');
    if (host) host.innerHTML = navHTML(active);
    const foot = el('footer');
    if (foot) foot.innerHTML = footerHTML();
  }

  global.OF = {
    money: money, signed: signed, round: round, qs: qs, el: el, esc: esc,
    tiers: tiers, tierBySlug: tierBySlug, tierById: tierById,
    defaultConfig: defaultConfig, calc: calc, series: series,
    load: load, save: save, clear: clear, hasDemo: hasDemo, available: available,
    toast: toast, mount: mount
  };
})(window);
