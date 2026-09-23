'use strict';

const STORAGE_KEY = 'mecanotas-notas-v1';
const OLD_STORAGE_KEY = 'mecanotas-v1';
const $ = (s, el = document) => el.querySelector(s);
const clone = o => JSON.parse(JSON.stringify(o));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const norm = s => String(s ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, ' ');
const num = v => parseFloat(String(v).replace(',', '.'));
const fmt = (n, d = 2) => (isFinite(n) ? n.toLocaleString('pt-BR', { maximumFractionDigits: d }) : '—');
const richText = t => esc(t).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>');
const today = () => new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
const fmtDate = s => (s ? s.split('-').reverse().join('/') : '—');
const slug = s => norm(s).replace(/[^a-z0-9]+/g, '-');

// Conteúdo (seções/tabelas) vem sempre do data.js publicado: é somente leitura no celular.
// Cada aparelho guarda apenas as próprias anotações de serviço.
// O modo edição só existe no PC do administrador (EDITAR-APP.bat → admin-server.js).
let ADMIN = false;
const DEFAULT_SETTINGS = { appName: 'MecaNotas', theme: 'industrial', accent: '', mascot: true };
let DB = withIds({
  settings: { ...DEFAULT_SETTINGS, ...DEFAULT_DATA.settings },
  sections: clone(DEFAULT_DATA.sections),
  notes: loadNotes(),
});
// preferências de cada aparelho (WhatsApp padrão, nome do executante, último backup)
const PREFS_KEY = 'mecanotas-prefs';
let PREFS = {};
try { PREFS = JSON.parse(localStorage.getItem(PREFS_KEY)) || {}; } catch { /* sem prefs */ }
const savePrefs = () => localStorage.setItem(PREFS_KEY, JSON.stringify(PREFS));
let editMode = false;
let pageEditable = false;
let lastRoute = null;

// ---------- Armazenamento ----------

function withIds(data) {
  data.sections ||= [];
  data.notes ||= [];
  data.sections.forEach(s => { s.id ||= uid(); s.blocks ||= []; s.blocks.forEach(b => { b.id ||= uid(); }); });
  return data;
}

function loadNotes() {
  try {
    const s = localStorage.getItem(STORAGE_KEY);
    if (s) return JSON.parse(s);
    // a primeira versão guardava tudo (tabelas + anotações) numa chave só
    const old = localStorage.getItem(OLD_STORAGE_KEY);
    if (old) return JSON.parse(old).notes || [];
  } catch (e) { console.error(e); }
  return [];
}

function save() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(DB.notes)); }
  catch (e) { alert('Não foi possível salvar (armazenamento cheio?). Faça um backup em ⚙️.'); }
  if (ADMIN) saveContent();
}

// ---------- Aparência ----------

const THEMES = {
  industrial: { name: 'Industrial (amarelo)', accent: '#f5b301', bg: '#121417', panel: '#1d2127', panel2: '#262b33', line: '#333a44', text: '#e8eaed', muted: '#9aa3ad', topbg: '#1b1f24', strong: '#ffffff' },
  aco: { name: 'Azul aço', accent: '#3b9eff', bg: '#0e1520', panel: '#152032', panel2: '#1d2b42', line: '#2a3b57', text: '#e6edf6', muted: '#93a4bb', topbg: '#101a2a', strong: '#ffffff' },
  seguranca: { name: 'Verde segurança', accent: '#2ecc71', bg: '#0f1612', panel: '#17221b', panel2: '#1f2e24', line: '#2c4033', text: '#e5efe8', muted: '#94a89a', topbg: '#111a14', strong: '#ffffff' },
  laranja: { name: 'Laranja oficina', accent: '#ff7a1a', bg: '#151210', panel: '#211b17', panel2: '#2b231d', line: '#3d3129', text: '#f0e9e4', muted: '#ab9d92', topbg: '#1a1512', strong: '#ffffff' },
  vermelho: { name: 'Vermelho máquina', accent: '#ff4d4d', bg: '#141111', panel: '#1f1818', panel2: '#2a2020', line: '#3b2c2c', text: '#f1e6e6', muted: '#ab9797', topbg: '#191313', strong: '#ffffff' },
  claro: { name: 'Claro (dia)', accent: '#d48c00', bg: '#f1f3f5', panel: '#ffffff', panel2: '#eceff2', line: '#d5dae0', text: '#1f2328', muted: '#5d6874', topbg: '#ffffff', strong: '#000000' },
};

function themeColors(settings = DB.settings) {
  const t = { ...(THEMES[settings.theme] || THEMES.industrial) };
  if (settings.accent) t.accent = settings.accent;
  return t;
}

function applyTheme() {
  const t = themeColors();
  const root = document.documentElement.style;
  ['accent', 'bg', 'panel', 'panel2', 'line', 'text', 'muted', 'topbg', 'strong'].forEach(k => root.setProperty('--' + k, t[k]));
  document.querySelector('meta[name=theme-color]')?.setAttribute('content', t.topbg);
  document.title = DB.settings.appName;
}

// ---------- Administrador (somente no PC) ----------

let saving = Promise.resolve();

function saveContent() {
  const t = themeColors();
  const body = JSON.stringify({
    version: DEFAULT_DATA.version || 1,
    settings: DB.settings,
    sections: DB.sections,
    manifest: { name: DB.settings.appName, theme_color: t.topbg, background_color: t.bg },
  });
  saving = saving
    .then(() => fetch('/api/salvar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body }))
    .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return refreshAdminBar(); })
    .catch(e => alert(`Erro ao salvar no PC (${e.message}). A janela preta do editor está aberta?`));
}

async function detectAdmin() {
  if (!['localhost', '127.0.0.1'].includes(location.hostname)) return;
  try {
    const r = await fetch('/api/status');
    if (!r.ok) return;
    ADMIN = true;
    $('.topbar').insertAdjacentHTML('afterend', '<div id="admin-bar"></div>');
    await refreshAdminBar();
  } catch { /* servidor comum, sem editor */ }
}

async function refreshAdminBar() {
  const st = await fetch('/api/status').then(r => r.json()).catch(() => null);
  const bar = $('#admin-bar');
  if (!bar) return;
  if (!st) { bar.innerHTML = '🔒 Editor · ⚠️ sem conexão com o editor (janela preta fechada?)'; return; }
  bar.innerHTML = `<span>🔒 Editor do administrador</span>
    ${st.pendentes ? `<span class="pend">● alterações não publicadas</span>
      <button class="primary" data-action="publish">🚀 Publicar</button>` : '<span class="okpub">✔ tudo publicado</span>'}`;
}

// ---------- Calculadoras ----------

const inp = (k, label, ph = '') => `<label>${label}<input data-k="${k}" inputmode="decimal" autocomplete="off" placeholder="${ph}"></label>`;
const res = rows => `<dl class="res">${rows.filter(Boolean).map(([k, v, main]) => `<div class="${main ? 'main' : ''}"><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;
const hint = t => `<p class="hint">${t}</p>`;
const MOTORES_KW = [0.37, 0.55, 0.75, 1.1, 1.5, 2.2, 3, 3.7, 4, 5.5, 7.5, 11, 15, 18.5, 22, 30, 37, 45, 55, 75, 90, 110, 132, 160, 200, 250, 315];

const CALCS = {
  correia: {
    title: '🧮 Comprimento da correia',
    html: inp('D', 'Ø polia maior (mm)') + inp('d', 'Ø polia menor (mm)') + inp('C', 'Distância entre centros (mm)'),
    run({ D, d, C }) {
      if (!(D > 0 && d > 0 && C > 0)) return hint('Preencha os três campos. Use o diâmetro primitivo (efetivo) das polias.');
      const [M, m] = D >= d ? [D, d] : [d, D];
      const L = 2 * C + Math.PI * (M + m) / 2 + (M - m) ** 2 / (4 * C);
      const wrap = 180 - 57.3 * (M - m) / C;
      const vao = Math.sqrt(C ** 2 - ((M - m) / 2) ** 2);
      return res([
        ['Comprimento primitivo', `${fmt(L, 0)} mm (${fmt(L / 25.4, 1)}")`, true],
        ['Perfil A (aprox.)', 'A-' + Math.round((L - 33) / 25.4)],
        ['Perfil B (aprox.)', 'B-' + Math.round((L - 46) / 25.4)],
        ['Perfil C (aprox.)', 'C-' + Math.round((L - 74) / 25.4)],
        ['SPZ / SPA / SPB / SPC', `Ld ≈ ${fmt(L, 0)} mm`],
        ['Abraçamento na polia menor', `${fmt(wrap, 0)}°${wrap < 120 ? ' ⚠️ baixo, risco de patinar' : ''}`],
        ['Flecha p/ tensionar (16 mm/m)', `${fmt(vao * 16 / 1000, 1)} mm`],
      ]) + hint('Escolha a correia de catálogo mais próxima e ajuste pelo esticador.');
    },
  },
  distancia: {
    title: '🧮 Distância entre centros (tenho a correia)',
    html: inp('D', 'Ø polia maior (mm)') + inp('d', 'Ø polia menor (mm)') + inp('L', 'Comprimento primitivo da correia (mm)'),
    run({ D, d, L }) {
      if (!(D > 0 && d > 0 && L > 0)) return hint('Informe as polias e o comprimento primitivo da correia.');
      const b = 2 * L - Math.PI * (D + d);
      const disc = b * b - 8 * (D - d) ** 2;
      if (b <= 0 || disc < 0) return hint('⚠️ Correia curta demais para essas polias.');
      const C = (b + Math.sqrt(disc)) / 8;
      return res([['Distância entre centros', `${fmt(C, 0)} mm`, true]]);
    },
  },
  rpm: {
    title: '🧮 Rotação e relação de polias',
    html: inp('n1', 'Rotação do motor (rpm)', '1750') + inp('d1', 'Ø polia do motor (mm)') + inp('d2', 'Ø polia movida (mm)') + inp('n2x', 'Rotação desejada (rpm), opcional'),
    run({ n1, d1, d2, n2x }) {
      if (!(n1 > 0 && d1 > 0)) return hint('Informe a rotação do motor e o Ø da polia do motor.');
      const v = Math.PI * d1 * n1 / 60000;
      return res([
        d2 > 0 && ['Rotação da polia movida', `${fmt(n1 * d1 / d2, 0)} rpm`, true],
        d2 > 0 && ['Relação de transmissão', `${fmt(d2 / d1, 2)} : 1`],
        n2x > 0 && ['Ø polia movida necessária', `${fmt(n1 * d1 / n2x, 0)} mm`, true],
        ['Velocidade da correia', `${fmt(v, 1)} m/s${v > 30 ? ' ⚠️ acima de 30 m/s' : ''}`],
      ]) + hint('Fórmula: n1 × d1 = n2 × d2');
    },
  },
  afinidade: {
    title: '🧮 Leis de afinidade (mudar rotação)',
    html: inp('n1', 'Rotação atual (rpm)') + inp('n2', 'Nova rotação (rpm)') + inp('Q', 'Vazão atual (m³/h)') + inp('H', 'Altura atual (m)') + inp('P', 'Potência atual (kW)'),
    run({ n1, n2, Q, H, P }) {
      if (!(n1 > 0 && n2 > 0)) return hint('Informe as rotações e ao menos um dos dados atuais. Vale também para troca do Ø do rotor (pequenas usinagens).');
      const r = n2 / n1;
      return res([
        Q > 0 && ['Nova vazão (Q × r)', `${fmt(Q * r)} m³/h`, true],
        H > 0 && ['Nova altura (H × r²)', `${fmt(H * r * r)} m`, true],
        P > 0 && ['Nova potência (P × r³)', `${fmt(P * r ** 3)} kW`, true],
        ['Relação r = n2/n1', fmt(r, 3)],
      ]);
    },
  },
  potencia: {
    title: '🧮 Potência da bomba',
    html: inp('Q', 'Vazão (m³/h)') + inp('H', 'Altura manométrica (m)') + inp('rho', 'Densidade (kg/m³)', '1000') + inp('eta', 'Rendimento da bomba (%)', '70'),
    run({ Q, H, rho, eta }) {
      if (!(Q > 0 && H > 0)) return hint('Informe vazão e altura manométrica.');
      rho = rho > 0 ? rho : 1000;
      eta = eta > 0 ? eta : 70;
      const Ph = rho * 9.81 * (Q / 3600) * H / 1000;
      const Pe = Ph / (eta / 100);
      const motor = MOTORES_KW.find(k => k >= Pe * 1.15);
      return res([
        ['Potência no eixo', `${fmt(Pe)} kW (${fmt(Pe / 0.7355, 1)} CV)`, true],
        ['Potência hidráulica', `${fmt(Ph)} kW`],
        motor && ['Motor sugerido (+15%)', `${fmt(motor)} kW (${fmt(motor / 0.7355, 1)} CV)`],
      ]);
    },
  },
  torque: {
    title: '🧮 Torque e rotação do redutor',
    html: inp('P', 'Potência do motor (kW)') + inp('n', 'Rotação do motor (rpm)') + inp('i', 'Redução (i), ex: 30') + inp('eta', 'Rendimento (%)', '95'),
    run({ P, n, i, eta }) {
      if (!(P > 0 && n > 0)) return hint('Informe potência e rotação. Dica: 1 CV = 0,7355 kW.');
      eta = eta > 0 ? eta : 95;
      const T = 9550 * P / n;
      return res([
        ['Torque no motor', `${fmt(T, 1)} N·m`],
        i > 0 && ['Rotação de saída', `${fmt(n / i, 1)} rpm`, true],
        i > 0 && ['Torque de saída', `${fmt(T * i * eta / 100, 0)} N·m (${fmt(T * i * eta / 100 / 9.807, 0)} kgf·m)`, true],
      ]) + hint('T (N·m) = 9550 × P (kW) ÷ n (rpm)');
    },
  },
  graxa: {
    title: '🧮 Quantidade de graxa para relubrificar',
    html: inp('D', 'Ø externo do rolamento D (mm)') + inp('B', 'Largura B (mm)'),
    run({ D, B }) {
      if (!(D > 0 && B > 0)) return hint('Veja D e B nas tabelas abaixo. Fórmula: G = 0,005 × D × B');
      return res([['Graxa por relubrificação', `${fmt(0.005 * D * B, 1)} g`, true]]) + hint('Uma "bombada" de engraxadeira manual dá cerca de 1 a 2 g. Aferir a sua.');
    },
  },
  conversor: {
    title: '🧮 Conversor rápido',
    html: inp('v', 'Valor'),
    run({ v }) {
      if (!isFinite(v)) return hint('Digite um valor para ver todas as conversões.');
      return res([
        [`${fmt(v)} mm`, `${fmt(v / 25.4, 4)} pol`], [`${fmt(v)} pol`, `${fmt(v * 25.4, 3)} mm`],
        [`${fmt(v)} bar`, `${fmt(v * 14.504, 2)} psi · ${fmt(v * 1.0197, 2)} kgf/cm²`], [`${fmt(v)} psi`, `${fmt(v / 14.504, 3)} bar`],
        [`${fmt(v)} kgf/cm²`, `${fmt(v * 0.98067, 3)} bar · ${fmt(v * 14.223, 2)} psi`],
        [`${fmt(v)} kW`, `${fmt(v / 0.7355, 2)} CV · ${fmt(v / 0.7457, 2)} HP`], [`${fmt(v)} CV`, `${fmt(v * 0.7355, 3)} kW`],
        [`${fmt(v)} HP`, `${fmt(v * 0.7457, 3)} kW`],
        [`${fmt(v)} °C`, `${fmt(v * 9 / 5 + 32, 1)} °F`], [`${fmt(v)} °F`, `${fmt((v - 32) * 5 / 9, 1)} °C`],
        [`${fmt(v)} N·m`, `${fmt(v / 9.807, 3)} kgf·m · ${fmt(v * 0.7376, 2)} lbf·ft`], [`${fmt(v)} kgf·m`, `${fmt(v * 9.807, 2)} N·m`],
        [`${fmt(v)} m³/h`, `${fmt(v / 3.6, 3)} L/s · ${fmt(v * 4.403, 2)} gpm`], [`${fmt(v)} gpm (US)`, `${fmt(v / 4.403, 3)} m³/h`],
      ]);
    },
  },
};

function runCalc(el) {
  const c = CALCS[el.dataset.calc];
  const v = {};
  el.querySelectorAll('[data-k]').forEach(i => { v[i.dataset.k] = num(i.value); });
  const out = c.run(v) || '';
  $('.out', el).innerHTML = out;
  if (out.includes('⚠️')) Mascote.evento('calc-aviso', { calc: el.dataset.calc, texto: $('.out', el).textContent });
}

// ---------- Telas ----------

function setHeader(title, { back = null, editable = false } = {}) {
  $('#title').textContent = title;
  $('#btn-back').hidden = !back;
  $('#btn-back').onclick = () => { location.hash = back; };
  pageEditable = editable && ADMIN;
  $('#btn-edit').hidden = !pageEditable;
  $('#btn-edit').classList.toggle('on', editMode);
}

function view(html) {
  const banner = editMode && pageEditable
    ? '<div class="edit-banner">✏️ Modo edição: toque no que quiser alterar (ícones e fotos, linhas, textos). Toque no ✏️ de cima para sair.</div>' : '';
  $('#app').innerHTML = banner + html;
}

function render() {
  const route = location.hash.slice(1) || '/';
  const [page, a, b] = route.split('/').filter(Boolean);
  if (!page) renderHome();
  else if (page === 's') renderSection(a, b);
  else if (page === 'notas') a ? renderNote(a) : renderNotes();
  else if (page === 'busca') renderSearch(decodeURIComponent(a || ''));
  else if (page === 'config') renderSettings();
  else if (page === 'aparencia' && ADMIN) renderAppearance();
  else renderHome();
  Mascote.evento('rota', { page, id: a });
  if (route !== lastRoute && !b) window.scrollTo(0, 0);
  lastRoute = route;
}

const sectionIcon = (s, cls = 'ico') => s.image
  ? `<img class="${cls} ico-img" src="${esc(s.image)}" alt="">`
  : `<span class="${cls}">${esc(s.icon)}</span>`;

function renderHome() {
  setHeader(DB.settings.appName, { editable: true });
  const abertas = DB.notes.filter(n => n.status !== 'Concluída').length;
  view(`
    <form class="search" id="search-form">
      <input type="search" id="q" placeholder="🔍 Buscar em tudo (ex: 6205, 35x52, cavitação)" enterkeyhint="search">
    </form>
    <a class="card card-notes" href="#/notas"><span class="ico">📋</span>
      <div><b>Ordens de serviço</b><small>${DB.notes.length} registro(s)${abertas ? ` · <span class="pend">${abertas} em aberto</span>` : ''}</small></div></a>
    <div class="grid">
      ${DB.sections.map(s => editMode
        ? `<button class="card editing" data-action="edit-section" data-s="${s.id}">${sectionIcon(s)}<b>${esc(s.title)}</b><span class="cam">📷 trocar foto</span></button>`
        : `<a class="card" href="#/s/${s.id}">${sectionIcon(s)}<b>${esc(s.title)}</b></a>`).join('')}
      ${editMode ? '<button class="card add" data-action="add-section"><span class="ico">＋</span><b>Nova seção</b></button>' : ''}
    </div>`);
  $('#search-form').onsubmit = e => {
    e.preventDefault();
    const q = $('#q').value.trim();
    if (q) location.hash = '#/busca/' + encodeURIComponent(q);
  };
}

function renderSection(id, scrollTo) {
  const s = DB.sections.find(x => x.id === id);
  if (!s) { location.hash = '#/'; return; }
  setHeader(s.title, { back: '#/', editable: true });
  view(`
    ${editMode ? `<div class="toolbar">
      <button data-action="edit-section" data-s="${s.id}">✏️ Nome, ícone e foto</button>
      <button class="danger" data-action="del-section" data-s="${s.id}">🗑 Excluir seção</button></div>` : ''}
    ${s.blocks.map(b => renderBlock(s, b)).join('')}
    ${s.blocks.length ? '' : '<p class="empty">Seção vazia. Toque no ✏️ lá em cima para adicionar tabelas, textos e calculadoras.</p>'}
    ${editMode ? `<div class="toolbar">
      <button class="primary" data-action="add-table" data-s="${s.id}">＋ Tabela</button>
      <button class="primary" data-action="add-text" data-s="${s.id}">＋ Texto</button>
      <button class="primary" data-action="add-calc" data-s="${s.id}">＋ Calculadora</button></div>` : ''}`);
  document.querySelectorAll('.calc').forEach(runCalc);
  if (scrollTo) document.querySelector(`[data-b="${CSS.escape(scrollTo)}"]`)?.scrollIntoView({ block: 'start' });
}

function renderBlock(s, b) {
  const ctl = editMode ? `<div class="ctl">
      ${b.type !== 'calc' ? '<button data-action="edit-block" aria-label="Editar">✏️</button>' : ''}
      <button data-action="move-block" data-dir="-1" aria-label="Subir">⬆</button>
      <button data-action="move-block" data-dir="1" aria-label="Descer">⬇</button>
      <button data-action="del-block" aria-label="Excluir">🗑</button></div>` : '';
  const title = b.type === 'calc' ? CALCS[b.calc]?.title : b.title;
  let body;
  if (b.type === 'table') body = renderTable(b);
  else if (b.type === 'text') body = `<div class="text">${richText(b.text)}</div>`;
  else if (CALCS[b.calc]) body = `<div class="calc" data-calc="${b.calc}"><div class="inputs">${CALCS[b.calc].html}</div><div class="out"></div></div>`;
  else body = '<p>Calculadora desconhecida.</p>';
  return `<section class="block" data-s="${s.id}" data-b="${b.id}">
    <div class="block-head"><h3>${esc(title)}</h3>${ctl}</div>${body}</section>`;
}

function renderTable(b) {
  const action = editMode ? 'edit-row' : 'view-row';
  return `
    ${b.rows.length > 8 ? '<input type="search" class="filter" placeholder="Filtrar esta tabela...">' : ''}
    <div class="table-wrap"><table>
      <thead><tr>${b.columns.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead>
      <tbody>${b.rows.map((r, ri) => `<tr data-r="${ri}" data-action="${action}">${b.columns.map((_, ci) => `<td>${richText(r[ci])}</td>`).join('')}</tr>`).join('')}</tbody>
    </table></div>
    ${!b.rows.length ? '<p class="empty">Tabela vazia.</p>' : ''}
    ${editMode ? '<button class="add-row" data-action="add-row">＋ Adicionar linha</button>' : ''}`;
}

function renderSearch(q) {
  setHeader('Busca', { back: '#/' });
  const nq = norm(q.trim());
  const hits = [];
  DB.sections.forEach(s => s.blocks.forEach(b => {
    const link = `#/s/${s.id}/${b.id}`;
    const where = `${s.image ? '' : esc(s.icon)} ${esc(s.title)} › ${esc(b.title)}`;
    if (b.type === 'table') {
      b.rows.forEach(r => {
        if (norm(r.join(' ')).includes(nq)) hits.push(`<a class="hit" href="${link}"><small>${where}</small>
          ${b.columns.map((c, i) => r[i] ? `<span><em>${esc(c)}:</em> ${esc(r[i])}</span>` : '').join('')}</a>`);
      });
    } else if (b.type === 'text' && norm(b.title + ' ' + b.text).includes(nq)) {
      hits.push(`<a class="hit" href="${link}"><small>${where}</small><span>${esc(b.text.replace(/\*\*/g, '').slice(0, 140))}…</span></a>`);
    }
  }));
  DB.notes.forEach(n => {
    if (norm(noteText(n)).includes(nq)) hits.push(`<a class="hit" href="#/notas/${n.id}"><small>📋 ${n.os ? 'OS ' + esc(n.os) + ' · ' : ''}${fmtDate(n.date)}</small><span><b>${esc(n.equipment)}</b> ${esc(n.tag)}</span></a>`);
  });
  view(`<form class="search" id="search-form"><input type="search" id="q" value="${esc(q)}" enterkeyhint="search"></form>
    <p class="muted">${hits.length} resultado(s) para "${esc(q)}"</p>${hits.join('')}`);
  if (!hits.length) Mascote.evento('busca-vazia', q);
  $('#search-form').onsubmit = e => {
    e.preventDefault();
    const nq2 = $('#q').value.trim();
    if (nq2) location.hash = '#/busca/' + encodeURIComponent(nq2);
  };
}

// ---------- Ordens de serviço ----------

const NOTE_FIELDS = [
  { key: 'os', label: 'Nº da nota / OS' },
  { key: 'date', label: 'Data', type: 'date' },
  { key: 'executor', label: 'Executante(s)' },
  { key: 'equipment', label: 'Equipamento' },
  { key: 'tag', label: 'TAG / Local' },
  { key: 'kind', label: 'Tipo de serviço', type: 'select', options: ['Corretiva', 'Preventiva', 'Preditiva', 'Inspeção', 'Melhoria', 'Outro'] },
  { key: 'status', label: 'Status', type: 'select', options: ['Aberta', 'Em andamento', 'Concluída'] },
  { key: 'problem', label: 'Problema / solicitação', type: 'textarea' },
  { key: 'done', label: 'O que foi feito no serviço', type: 'textarea', rows: 5 },
  { key: 'parts', label: 'Peças / materiais usados', type: 'textarea', rows: 3 },
  { key: 'hours', label: 'Horas trabalhadas', inputmode: 'decimal' },
  { key: 'obs', label: 'Observações / medições', type: 'textarea', rows: 3 },
];

const noteText = n => NOTE_FIELDS.map(f => `${f.label}: ${f.key === 'date' ? fmtDate(n.date) : (n[f.key] || '-')}`).join('\n');

// Relatório no formato do WhatsApp (*negrito*), sem os campos vazios
function whatsReport(n) {
  const line = (label, v) => (v ? `*${label}:* ${v}` : null);
  const block = (label, v) => (v ? `\n*${label}:*\n${v}` : null);
  return [
    '🔧 *RELATÓRIO DE SERVIÇO*',
    line('OS / Nota', n.os),
    line('Data', fmtDate(n.date)),
    line('Executante', n.executor),
    line('Equipamento', [n.equipment, n.tag && `(${n.tag})`].filter(Boolean).join(' ')),
    line('Tipo', [n.kind, n.status].filter(Boolean).join(' · ')),
    block('Problema', n.problem),
    block('Serviço executado', n.done),
    block('Peças / materiais', n.parts),
    n.hours ? `\n*Horas trabalhadas:* ${n.hours} h` : null,
    block('Observações', n.obs),
  ].filter(Boolean).join('\n');
}

function sendWhats(text) {
  const num = (PREFS.whats || '').replace(/\D/g, '');
  const full = num && num.length <= 11 ? '55' + num : num;
  window.open(`https://wa.me/${full}?text=${encodeURIComponent(text)}`, '_blank');
  Mascote.evento('whatsapp');
}

function renderNotes() {
  setHeader('Ordens de serviço', { back: '#/' });
  const notes = [...DB.notes].sort((a, b) => (b.date || '').localeCompare(a.date || '') || (b.os || '').localeCompare(a.os || ''));
  const hoje = DB.notes.filter(n => n.date === today()).length;
  view(`
    <div class="toolbar">
      <button class="primary" data-action="new-note">＋ Nova OS</button>
      ${hoje ? `<button class="whats" data-action="whats-day">📲 Relatório de hoje (${hoje})</button>` : ''}
    </div>
    ${notes.length > 3 ? '<input type="search" class="filter-notes" placeholder="Filtrar por OS, equipamento, TAG, peça...">' : ''}
    ${notes.map(n => `<a class="note-card" href="#/notas/${n.id}" data-search="${esc(norm(noteText(n)))}">
      <div class="note-top"><span>${n.os ? `<b>OS ${esc(n.os)}</b> · ` : ''}${fmtDate(n.date)} · ${esc(n.kind)}</span><span class="badge st-${slug(n.status)}">${esc(n.status)}</span></div>
      <b>${esc(n.equipment || 'Sem equipamento')}</b>${n.tag ? ` <small>${esc(n.tag)}</small>` : ''}
      <p>${esc((n.done || n.problem || '').slice(0, 120))}</p></a>`).join('')}
    ${notes.length ? '' : '<p class="empty">Nenhuma ordem de serviço ainda. Toque em ＋ Nova OS.</p>'}`);
}

function renderNote(id) {
  const n = DB.notes.find(x => x.id === id);
  if (!n) { location.hash = '#/notas'; return; }
  setHeader(n.os ? 'OS ' + n.os : (n.equipment || 'Ordem de serviço'), { back: '#/notas' });
  view(`<button class="whats big" data-action="whats-note" data-id="${n.id}">📲 Enviar relatório no WhatsApp</button>
    <section class="block note-view">
      ${NOTE_FIELDS.map(f => `<div class="nf"><span>${esc(f.label)}</span><div>${f.key === 'date' ? fmtDate(n.date) : richText(n[f.key] || '—')}</div></div>`).join('')}
    </section>
    <div class="toolbar">
      <button class="primary" data-action="edit-note" data-id="${n.id}">✏️ Editar</button>
      <button data-action="share-note" data-id="${n.id}">📤 Outros apps</button>
      <button data-action="dup-note" data-id="${n.id}">📄 Duplicar</button>
      <button class="danger" data-action="del-note" data-id="${n.id}">🗑 Excluir</button>
    </div>`);
}

function noteModal(n) {
  const isNew = !n;
  n ||= { date: today(), kind: 'Corretiva', status: 'Aberta', executor: PREFS.executor || '' };
  openModal({
    title: isNew ? 'Nova ordem de serviço' : 'Editar ordem de serviço',
    fields: NOTE_FIELDS.map(f => ({ ...f, value: n[f.key] })),
    onSave: v => {
      Object.assign(n, v);
      if (isNew) { n.id = uid(); DB.notes.push(n); }
      if (v.executor) { PREFS.executor = v.executor; savePrefs(); }
      save();
      Mascote.evento('nota-salva', n);
      if (isNew) location.hash = '#/notas/' + n.id; else render();
    },
  });
}

// ---------- Backup ----------

function renderSettings() {
  setHeader('Configurações', { back: '#/' });
  view(`
    ${ADMIN ? `<a class="card card-notes admin-card" href="#/aparencia"><span class="ico">🎨</span>
      <div><b>Aparência do app</b><small>Nome do app, cores e mecânico ajudante (só no seu PC)</small></div></a>` : ''}
    <section class="block"><h3>📲 WhatsApp dos relatórios</h3>
      <form id="prefs-form">
        <label class="lbl">Número que recebe os relatórios (opcional)
          <input name="whats" type="tel" inputmode="tel" placeholder="(11) 98765-4321" value="${esc(PREFS.whats || '')}"></label>
        <p class="hint">Com o número preenchido, o relatório já abre na conversa dessa pessoa (supervisor, PCM...).
        Em branco, o WhatsApp pergunta para quem enviar.</p>
        <label class="lbl">Seu nome (executante)
          <input name="executor" placeholder="Ex.: João Silva" value="${esc(PREFS.executor || '')}"></label>
        <div class="toolbar"><button class="primary">Salvar</button></div>
      </form>
    </section>
    <section class="block"><h3>🔧 Mecânico ajudante</h3>
      <p class="hint">O bonequinho no canto da tela dá dicas de vez em quando.</p>
      <div class="toolbar"><button data-action="mascot-toggle">${PREFS.mascotOff ? '👷 Mostrar o mecânico' : '💤 Esconder o mecânico'}</button></div>
    </section>
    <section class="block"><h3>💾 Backup das ordens de serviço</h3>
      <p>Suas ${DB.notes.length} ordens de serviço ficam salvas <b>somente neste aparelho</b>. Exporte um backup de vez em quando
      e guarde no Google Drive, e-mail ou WhatsApp. O mesmo arquivo serve para passar tudo para outro celular.</p>
      <div class="toolbar">
        <button class="primary" data-action="export">⬇ Exportar backup</button>
        <label class="btn">⬆ Importar backup<input type="file" accept=".json,application/json" id="import-file" hidden></label>
      </div>
    </section>
    <section class="block"><h3>ℹ️ Sobre</h3>
      <p>${esc(DB.settings.appName)}: tabelas, calculadoras e ordens de serviço de mecânica industrial. Funciona sem internet.<br>
      Os valores das tabelas são de <b>referência</b>. Confira sempre o catálogo e o manual do fabricante.</p>
    </section>`);
  $('#import-file').onchange = importFile;
  $('#prefs-form').onsubmit = e => {
    e.preventDefault();
    const f = e.target.elements;
    PREFS.whats = f.whats.value.trim();
    PREFS.executor = f.executor.value.trim();
    savePrefs();
    alert('Salvo!');
  };
}

function renderAppearance() {
  setHeader('Aparência do app', { back: '#/config' });
  const s = DB.settings;
  view(`
    <section class="block"><h3>📱 Ícone do app (tela inicial do celular)</h3>
      <div class="img-pick">
        <div id="app-icon-prev"><img src="icons/icon-192.png?v=${Date.now()}" alt=""></div>
        <div>
          <label class="btn">📷 Trocar ícone do app<input type="file" accept="image/*" id="app-icon-file" hidden></label>
          <p class="hint">Use uma imagem quadrada. No Android o ícone novo aparece sozinho em alguns dias.
          No iPhone, é preciso remover e adicionar o app de novo à tela de início.</p>
        </div>
      </div>
    </section>
    <section class="block"><h3>🏷️ Nome do app</h3>
      <input id="ap-name" maxlength="30" value="${esc(s.appName)}">
      <p class="hint">Aparece no topo e embaixo do ícone no celular. Nomes com até 12 letras cabem melhor na tela inicial.</p>
    </section>
    <section class="block"><h3>🎨 Paleta de cores</h3>
      <div class="themes">
        ${Object.entries(THEMES).map(([k, t]) => `<button class="theme-opt ${s.theme === k ? 'sel' : ''}" data-action="pick-theme" data-theme="${k}"
          style="background:${t.bg};color:${t.text};border-color:${s.theme === k ? t.accent : t.line}">
          <span class="sw" style="background:${t.accent}"></span><span class="sw" style="background:${t.panel2}"></span>${esc(t.name)}</button>`).join('')}
      </div>
      <label class="lbl">Cor de destaque personalizada
        <span class="row"><input id="ap-accent" type="color" value="${s.accent || themeColors().accent}">
        <button data-action="reset-accent">Usar a da paleta</button></span></label>
    </section>
    <section class="block"><h3>👷 Mecânico ajudante</h3>
      <label class="check"><input id="ap-mascot" type="checkbox" ${s.mascot ? 'checked' : ''}> Mostrar o mecânico ajudante para todos</label>
    </section>
    <div class="toolbar"><button class="primary" data-action="save-appearance">💾 Salvar aparência</button></div>
    <p class="hint">Depois de salvar, clique em 🚀 Publicar na barra roxa para mandar para os celulares.</p>`);
  $('#ap-accent').oninput = e => { DB.settings.accent = e.target.value; applyTheme(); };
  $('#app-icon-file').onchange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const [i512, i192, i180] = await Promise.all([512, 192, 180].map(n => squareImage(file, n, 'image/png')));
      const r = await fetch('/api/icone', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ i512, i192, i180 }) }).then(x => x.json());
      if (!r.ok) throw new Error(r.msg);
      $('#app-icon-prev').innerHTML = `<img src="icons/icon-192.png?v=${Date.now()}" alt="">`;
      refreshAdminBar();
      alert('Ícone do app trocado! Clique em 🚀 Publicar para mandar para os celulares.');
    } catch (err) { alert('Erro no ícone: ' + err.message); }
  };
}

// Recorta a foto em quadrado (centro) e reduz para 256 px
function squareImage(file, size = 256, type = 'image/webp') {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const side = Math.min(img.width, img.height);
      const cv = document.createElement('canvas');
      cv.width = cv.height = size;
      cv.getContext('2d').drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
      URL.revokeObjectURL(img.src);
      resolve(cv.toDataURL(type, 0.85));
    };
    img.onerror = () => reject(new Error('Não consegui abrir essa imagem.'));
    img.src = URL.createObjectURL(file);
  });
}

function importFile(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      const data = JSON.parse(reader.result);
      if (!Array.isArray(data.notes)) throw new Error('formato');
      if (!confirm(`Importar backup com ${data.notes.length} anotações? As anotações atuais deste aparelho serão substituídas.`)) return;
      DB.notes = data.notes;
      save();
      alert('Backup importado!');
      location.hash = '#/';
    } catch (err) { alert('Arquivo inválido. Escolha um backup exportado pelo MecaNotas.'); }
  };
  reader.readAsText(file);
}

async function shareText(title, text) {
  if (navigator.share) {
    try { await navigator.share({ title, text }); return; } catch (e) { if (e.name === 'AbortError') return; }
  }
  try { await navigator.clipboard.writeText(text); alert('Texto copiado! Cole no WhatsApp ou e-mail.'); }
  catch { prompt('Copie o texto:', text); }
}

// ---------- Modal ----------

function fieldHtml(f, i) {
  const name = 'f' + i;
  const v = esc(f.value ?? '');
  let input;
  if (f.type === 'textarea') input = `<textarea name="${name}" rows="${f.rows || 4}">${v}</textarea>`;
  else if (f.type === 'select') input = `<select name="${name}">${f.options.map(o => {
    const [val, lab] = Array.isArray(o) ? o : [o, o];
    return `<option value="${esc(val)}" ${val === f.value ? 'selected' : ''}>${esc(lab)}</option>`;
  }).join('')}</select>`;
  else input = `<input name="${name}" type="${f.type || 'text'}" value="${v}" autocomplete="off"${f.inputmode ? ` inputmode="${f.inputmode}"` : ''}>`;
  return `<label>${esc(f.label)}${f.hint ? ` <small>${esc(f.hint)}</small>` : ''}${input}</label>`;
}

function openModal({ title, fields = [], body = '', onSave, onDelete }) {
  const root = $('#modal');
  root.innerHTML = `<div class="modal-box"><h2>${esc(title)}</h2><form>
    ${body}${fields.map(fieldHtml).join('')}
    <div class="modal-actions">
      ${onDelete ? '<button type="button" class="danger" data-m="del">Excluir</button>' : ''}
      <span class="spacer"></span>
      <button type="button" data-m="cancel">${onSave ? 'Cancelar' : 'Fechar'}</button>
      ${onSave ? '<button type="submit" class="primary">Salvar</button>' : ''}
    </div></form></div>`;
  root.hidden = false;
  document.body.classList.add('no-scroll');
  const form = $('form', root);
  const close = () => { root.hidden = true; root.innerHTML = ''; document.body.classList.remove('no-scroll'); };
  form.onsubmit = e => {
    e.preventDefault();
    const vals = {};
    fields.forEach((f, i) => { vals[f.key] = form.elements['f' + i].value; });
    if (onSave(vals) !== false) close();
  };
  $('[data-m=cancel]', root).onclick = close;
  if (onDelete) $('[data-m=del]', root).onclick = () => { if (confirm('Excluir? Não dá para desfazer.')) { onDelete(); close(); } };
  root.onclick = e => { if (e.target === root) close(); };
}

function editTableModal(sec, block) {
  openModal({
    title: block ? 'Editar tabela' : 'Nova tabela',
    fields: [
      { key: 'title', label: 'Título', value: block?.title },
      { key: 'columns', label: 'Colunas', hint: '(uma por linha, na ordem)', type: 'textarea', rows: 6,
        value: block ? block.columns.join('\n') : 'Código\nMedida\nObservação' },
    ],
    onSave: v => {
      const cols = v.columns.split('\n').map(c => c.trim()).filter(Boolean);
      if (!cols.length) { alert('Informe ao menos uma coluna.'); return false; }
      if (block) Object.assign(block, { title: v.title, columns: cols });
      else sec.blocks.push({ id: uid(), type: 'table', title: v.title, columns: cols, rows: [] });
      save(); render();
    },
  });
}

function editTextModal(sec, block) {
  openModal({
    title: block ? 'Editar texto' : 'Novo texto',
    fields: [
      { key: 'title', label: 'Título', value: block?.title },
      { key: 'text', label: 'Texto', hint: '(use **palavra** para negrito)', type: 'textarea', rows: 12, value: block?.text },
    ],
    onSave: v => {
      if (block) Object.assign(block, v);
      else sec.blocks.push({ id: uid(), type: 'text', ...v });
      save(); render();
    },
  });
}

function editRowModal(block, ri) {
  const row = ri >= 0 ? block.rows[ri] : [];
  openModal({
    title: ri >= 0 ? 'Editar linha' : 'Nova linha',
    fields: block.columns.map((c, i) => ({ key: i, label: c, value: row[i] ?? '', type: String(row[i] ?? '').length > 40 ? 'textarea' : 'text' })),
    onSave: v => {
      const r = block.columns.map((_, i) => v[i].trim());
      if (ri >= 0) block.rows[ri] = r; else block.rows.push(r);
      save(); render();
    },
    onDelete: ri >= 0 ? () => { block.rows.splice(ri, 1); save(); render(); } : null,
  });
}

function sectionModal(sec) {
  let image = sec?.image || '';
  openModal({
    title: sec ? 'Editar seção' : 'Nova seção',
    body: `<div class="img-pick">
        <div id="img-prev">${image ? `<img src="${esc(image)}" alt="">` : `<span>${esc(sec?.icon || '🔧')}</span>`}</div>
        <div>
          <label class="btn">📷 Escolher foto<input type="file" accept="image/*" id="img-file" hidden></label>
          <button type="button" id="img-del" ${image ? '' : 'hidden'}>Remover foto</button>
          <p class="hint">A foto é cortada em quadrado pelo centro. Sem foto, usa o emoji abaixo.</p>
        </div>
      </div>`,
    fields: [
      { key: 'title', label: 'Nome (ex: Acoplamentos, Engrenagens, Lubrificação)', value: sec?.title },
      { key: 'icon', label: 'Ícone (emoji), usado quando não há foto', value: sec?.icon || '🔧' },
    ],
    onSave: v => {
      if (!v.title.trim()) { alert('Informe o nome.'); return false; }
      const s = sec || { id: uid(), blocks: [] };
      Object.assign(s, { title: v.title.trim(), icon: v.icon || '🔧', image });
      if (!image) delete s.image;
      if (!sec) DB.sections.push(s);
      save();
      if (sec) render(); else location.hash = '#/s/' + s.id;
    },
  });
  $('#img-file').onchange = async e => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const data = await squareImage(file);
      const r = await fetch('/api/imagem', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nome: sec?.id || uid(), data }) }).then(x => x.json());
      if (!r.ok) throw new Error(r.msg);
      image = r.path;
      $('#img-prev').innerHTML = `<img src="${esc(image)}" alt="">`;
      $('#img-del').hidden = false;
    } catch (err) { alert('Erro na foto: ' + err.message); }
  };
  $('#img-del').onclick = () => {
    image = '';
    $('#img-prev').innerHTML = `<span>${esc(sec?.icon || '🔧')}</span>`;
    $('#img-del').hidden = true;
  };
}

// ---------- Ações (cliques) ----------

const ACTIONS = {
  'toggle-edit'() { editMode = !editMode; render(); },
  'add-section'() { sectionModal(null); },
  'edit-section'({ sec }) { sectionModal(sec); },
  'del-section'({ sec }) {
    if (!confirm(`Excluir a seção "${sec.title}" e todo o conteúdo dela?`)) return;
    DB.sections = DB.sections.filter(s => s !== sec); save();
    location.hash = '#/';
  },
  'add-table'({ sec }) { editTableModal(sec, null); },
  'add-text'({ sec }) { editTextModal(sec, null); },
  'add-calc'({ sec }) {
    openModal({
      title: 'Adicionar calculadora',
      fields: [{ key: 'calc', label: 'Calculadora', type: 'select', options: Object.entries(CALCS).map(([k, c]) => [k, c.title.replace('🧮 ', '')]), value: 'correia' }],
      onSave: v => { sec.blocks.push({ id: uid(), type: 'calc', calc: v.calc }); save(); render(); },
    });
  },
  'edit-block'({ sec, block }) { block.type === 'table' ? editTableModal(sec, block) : editTextModal(sec, block); },
  'move-block'({ el, sec, block }) {
    const i = sec.blocks.indexOf(block), j = i + Number(el.dataset.dir);
    if (j < 0 || j >= sec.blocks.length) return;
    [sec.blocks[i], sec.blocks[j]] = [sec.blocks[j], sec.blocks[i]];
    save(); render();
  },
  'del-block'({ sec, block }) {
    if (!confirm(`Excluir "${block.title || 'calculadora'}"?`)) return;
    sec.blocks = sec.blocks.filter(b => b !== block); save(); render();
  },
  'add-row'({ block }) { editRowModal(block, -1); },
  'edit-row'({ el, block }) { editRowModal(block, Number(el.dataset.r)); },
  'view-row'({ el, block }) {
    if (block.columns.length < 3) return;
    const r = block.rows[Number(el.dataset.r)];
    openModal({ title: block.title, body: `<dl class="row-view">${block.columns.map((c, i) => `<dt>${esc(c)}</dt><dd>${richText(r[i]) || '—'}</dd>`).join('')}</dl>` });
  },
  'new-note'() { noteModal(null); },
  'edit-note'({ el }) { noteModal(DB.notes.find(n => n.id === el.dataset.id)); },
  'dup-note'({ el }) {
    const src = DB.notes.find(n => n.id === el.dataset.id);
    noteModal(null);
    // pré-preenche o formulário novo com os dados da anotação original
    const form = $('#modal form');
    NOTE_FIELDS.forEach((f, i) => { if (f.key !== 'date' && f.key !== 'status') form.elements['f' + i].value = src[f.key] || ''; });
  },
  'del-note'({ el }) {
    if (!confirm('Excluir esta anotação?')) return;
    DB.notes = DB.notes.filter(n => n.id !== el.dataset.id); save();
    location.hash = '#/notas';
  },
  'share-note'({ el }) {
    const n = DB.notes.find(x => x.id === el.dataset.id);
    shareText(`Serviço: ${n.equipment}`, whatsReport(n));
  },
  'whats-note'({ el }) { sendWhats(whatsReport(DB.notes.find(x => x.id === el.dataset.id))); },
  'whats-day'() {
    const list = DB.notes.filter(n => n.date === today());
    const head = `📋 *RELATÓRIO DO DIA ${fmtDate(today())}*${PREFS.executor ? `\n*Executante:* ${PREFS.executor}` : ''}\n*Serviços:* ${list.length}`;
    sendWhats([head, ...list.map((n, i) => `━━━━━━━━━━\n*${i + 1}.* ` + whatsReport(n).split('\n').slice(1).join('\n'))].join('\n\n'));
  },
  'mascot-toggle'() {
    PREFS.mascotOff = !PREFS.mascotOff;
    savePrefs();
    Mascote.iniciar(DB.settings.mascot && !PREFS.mascotOff);
    render();
  },
  'pick-theme'({ el }) {
    DB.settings.theme = el.dataset.theme;
    DB.settings.accent = '';
    applyTheme();
    render();
  },
  'reset-accent'() { DB.settings.accent = ''; applyTheme(); render(); },
  'save-appearance'() {
    const name = $('#ap-name').value.trim();
    if (!name) { alert('Informe o nome do app.'); return; }
    DB.settings.appName = name;
    DB.settings.mascot = $('#ap-mascot').checked;
    applyTheme();
    Mascote.iniciar(DB.settings.mascot && !PREFS.mascotOff);
    save();
    alert('Aparência salva! Clique em 🚀 Publicar para mandar para os celulares.');
    location.hash = '#/';
  },
  'export'() {
    const name = `mecanotas-backup-${today()}.json`;
    const blob = new Blob([JSON.stringify({ app: 'mecanotas', notes: DB.notes }, null, 1)], { type: 'application/json' });
    const file = new File([blob], name, { type: 'application/json' });
    PREFS.lastBackup = Date.now();
    savePrefs();
    if (navigator.canShare?.({ files: [file] })) {
      navigator.share({ files: [file], title: name }).catch(() => {});
      return;
    }
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  },
  async 'publish'({ el }) {
    if (!confirm('Publicar as alterações para todos os celulares?')) return;
    el.disabled = true;
    el.textContent = '⏳ Publicando...';
    await saving;
    const r = await fetch('/api/publicar', { method: 'POST' }).then(x => x.json()).catch(e => ({ ok: false, msg: e.message }));
    alert(r.ok
      ? '✅ Publicado! Em 1 a 2 minutos a atualização estará no site. Os celulares recebem ao abrir o app (às vezes é preciso abrir duas vezes).'
      : '❌ Erro ao publicar:\n' + r.msg);
    refreshAdminBar();
  },
};

document.addEventListener('click', e => {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const blockEl = el.closest('[data-b]');
  const sec = DB.sections.find(s => s.id === (el.dataset.s || blockEl?.dataset.s));
  const block = sec && blockEl ? sec.blocks.find(b => b.id === blockEl.dataset.b) : null;
  ACTIONS[el.dataset.action]?.({ el, sec, block, e });
});

document.addEventListener('input', e => {
  const t = e.target;
  if (t.matches('.filter')) {
    const q = norm(t.value);
    t.closest('.block').querySelectorAll('tbody tr').forEach(tr => { tr.hidden = q && !norm(tr.textContent).includes(q); });
  } else if (t.matches('.filter-notes')) {
    const q = norm(t.value);
    document.querySelectorAll('.note-card').forEach(c => { c.hidden = q && !c.dataset.search.includes(q); });
  } else if (t.closest('.calc')) {
    runCalc(t.closest('.calc'));
  }
});

window.addEventListener('hashchange', render);
applyTheme();
detectAdmin().then(() => {
  Mascote.iniciar(DB.settings.mascot && !PREFS.mascotOff);
  render();
  Mascote.evento('abertura', {
    abertas: DB.notes.filter(n => n.status !== 'Concluída').length,
    notas: DB.notes.length,
    diasSemBackup: PREFS.lastBackup ? (Date.now() - PREFS.lastBackup) / 864e5 : Infinity,
  });
});

// No PC (localhost) não usa cache offline, para o editor sempre mostrar o conteúdo atual
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  // quando chega uma versão nova do app, recarrega uma vez para já mostrar a atualização
  const hadController = !!navigator.serviceWorker.controller;
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (hadController && !reloaded) { reloaded = true; location.reload(); }
  });
  navigator.serviceWorker.register('sw.js', { updateViaCache: 'none' });
}
navigator.storage?.persist?.();
