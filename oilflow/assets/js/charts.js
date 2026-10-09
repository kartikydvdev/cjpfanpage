/* OILFLOW — canvas/SVG chart helpers. All data shown is simulated. */
(function (global) {
  'use strict';
  const money = n => '\u20B9' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 2 });

  // SVG balance-over-time chart (used on package + portfolio pages)
  function balanceChart(svg, config, day, opts) {
    opts = opts || {};
    const values = OF.series(config);
    const W = 960, H = 270, L = 72, R = 20, T = 22, B = 34;
    let min = Math.min.apply(null, values), max = Math.max.apply(null, values);
    const pad = Math.max((max - min) * .12, 1);
    min -= pad; max += pad;
    const X = i => L + i / config.duration * (W - L - R);
    const Y = v => T + (max - v) / (max - min) * (H - T - B);
    const pts = values.map((v, i) => X(i) + ',' + Y(v)).join(' ');
    const grids = Array.from({ length: 5 }, (_, i) => {
      const v = min + (max - min) * i / 4;
      return '<line x1="' + L + '" x2="' + (W - R) + '" y1="' + Y(v) + '" y2="' + Y(v) + '" stroke="#25313d" stroke-dasharray="3 5"/>' +
        '<text x="' + (L - 10) + '" y="' + (Y(v) + 4) + '" text-anchor="end">' + money(Math.round(v)) + '</text>';
    }).join('');
    const ticks = [0, Math.round(config.duration / 4), Math.round(config.duration / 2), Math.round(config.duration * .75), config.duration];
    svg.innerHTML = '<title>Hypothetical demo balance by day</title>' +
      '<defs><linearGradient id="area" x1="0" y1="0" x2="0" y2="1">' +
      '<stop offset="0" stop-color="#efc478" stop-opacity=".17"/><stop offset="1" stop-color="#efc478" stop-opacity="0"/>' +
      '</linearGradient></defs>' + grids +
      '<polygon points="' + L + ',' + (H - B) + ' ' + pts + ' ' + (W - R) + ',' + (H - B) + '" fill="url(#area)"/>' +
      '<polyline points="' + pts + '" fill="none" stroke="#efc478" stroke-width="2.5" stroke-linejoin="round"/>' +
      ticks.map(i => '<text x="' + X(i) + '" y="' + (H - 9) + '" text-anchor="middle">Day ' + i + '</text>').join('') +
      '<line x1="' + X(day) + '" x2="' + X(day) + '" y1="' + T + '" y2="' + (H - B) + '" stroke="#75d6b1" stroke-dasharray="3 5"/>' +
      '<circle cx="' + X(day) + '" cy="' + Y(values[day]) + '" r="5" fill="#75d6b1" stroke="#111923" stroke-width="2"/>' +
      values.map((v, i) => '<circle tabindex="0" role="img" aria-label="Day ' + i + ', ' + money(v) + ' simulated" data-day="' + i +
        '" data-value="' + v + '" cx="' + X(i) + '" cy="' + Y(v) + '" r="9" fill="transparent"></circle>').join('');

    const tip = OF.el(opts.tipId || 'chartTip');
    if (!tip) return;
    svg.onpointermove = e => {
      const rect = svg.getBoundingClientRect();
      const i = Math.max(0, Math.min(config.duration,
        Math.round(((e.clientX - rect.left) / rect.width * W - L) / (W - L - R) * config.duration)));
      tip.textContent = 'Day ' + i + ' \u00B7 ' + money(values[i]) + ' DEMO';
      tip.style.display = 'block';
    };
    svg.onpointerleave = () => { tip.style.display = 'none'; };
    svg.onfocusin = e => {
      if (e.target.dataset && e.target.dataset.day) {
        tip.textContent = 'Day ' + e.target.dataset.day + ' \u00B7 ' + money(+e.target.dataset.value) + ' DEMO';
        tip.style.display = 'block';
      }
    };
    svg.onfocusout = () => { tip.style.display = 'none'; };
  }

  // Line chart on a <canvas> (oil price preview)
  function oilChart(canvas, values, opts) {
    opts = opts || {};
    const h = opts.height || 220;
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.parentElement.clientWidth || 600;
    canvas.width = w * dpr; canvas.height = h * dpr; canvas.style.height = h + 'px';
    const ctx = canvas.getContext('2d'); ctx.scale(dpr, dpr);
    const pad = { l: 54, r: 12, t: 14, b: 26 };
    const mn = Math.min.apply(null, values), mx = Math.max.apply(null, values), span = (mx - mn) || 1;
    const X = i => pad.l + (i / (values.length - 1)) * (w - pad.l - pad.r);
    const Y = v => pad.t + (1 - (v - mn) / span) * (h - pad.t - pad.b);
    ctx.clearRect(0, 0, w, h);
    ctx.strokeStyle = '#1f2a37'; ctx.lineWidth = 1; ctx.fillStyle = '#5e6b7c'; ctx.font = '11px ui-monospace, monospace';
    ctx.textAlign = 'right';
    for (let i = 0; i <= 4; i++) {
      const v = mn + span * i / 4, y = Y(v);
      ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(w - pad.r, y); ctx.stroke();
      ctx.fillText('$' + v.toFixed(2), pad.l - 8, y + 4);
    }
    const g = ctx.createLinearGradient(0, pad.t, 0, h);
    g.addColorStop(0, '#f2b13455'); g.addColorStop(1, '#f2b13400');
    ctx.beginPath(); ctx.moveTo(X(0), Y(values[0]));
    values.forEach((v, i) => ctx.lineTo(X(i), Y(v)));
    ctx.lineTo(X(values.length - 1), h - pad.b); ctx.lineTo(X(0), h - pad.b);
    ctx.closePath(); ctx.fillStyle = g; ctx.fill();
    ctx.beginPath(); ctx.strokeStyle = '#f2b134'; ctx.lineWidth = 2.2; ctx.lineJoin = 'round';
    values.forEach((v, i) => i ? ctx.lineTo(X(i), Y(v)) : ctx.moveTo(X(i), Y(v)));
    ctx.stroke();
  }

  // Deterministic simulated oil series so every page load looks identical
  function simOil(seed, n, start) {
    let s = seed >>> 0;
    const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
    const out = []; let p = start;
    for (let i = 0; i < n; i++) { p = p * (1 + (rnd() - 0.48) * 0.022); out.push(p); }
    const k = 72.40 / out[out.length - 1];
    return out.map(v => v * k);
  }

  global.OFCharts = { balanceChart: balanceChart, oilChart: oilChart, simOil: simOil };
})(window);
