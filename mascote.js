'use strict';

// Mecânico ajudante: segue os toques com o olhar e fala pouco, só quando tem algo útil.
// Regras para não ficar chato:
//  - fala espontânea no máximo a cada 90 s, e nunca repete uma dica já vista;
//  - alertas de calculadora e avisos importantes podem falar na hora;
//  - tocar nele dá uma dica; o botão 💤 faz ele dormir (fica lembrado no aparelho).
const Mascote = (() => {
  const KEY = 'mecanotas-mascote';
  let mem = {};
  try { mem = JSON.parse(localStorage.getItem(KEY)) || {}; } catch { /* primeira vez */ }
  mem.vistas ||= [];
  const guardar = () => localStorage.setItem(KEY, JSON.stringify(mem));

  const DICAS = {
    rolamentos: [
      'Rolamento esquentando logo depois da troca? Muitas vezes é graxa demais. Encha só 30 a 50% da caixa.',
      'Nunca gire rolamento com ar comprimido. Sem lubrificação, as esferas marcam as pistas.',
      'Motor elétrico normalmente usa rolamento C3. Confira o sufixo antes de trocar.',
      'Para aquecer rolamento, use aquecedor por indução até 110 °C. Maçarico estraga a têmpera.',
      'Toque numa linha da tabela para ver as medidas em tela cheia.',
    ],
    retentores: [
      'A mola do retentor fica sempre virada para o lado do óleo.',
      'Eixo com sulco do lábio antigo? Desloque o retentor novo 1 a 2 mm ou use luva de reparo.',
      'Busque a medida direto na tela inicial: digite, por exemplo, "35x52".',
      'Viton (FKM) aguenta até uns 200 °C. A borracha NBR comum, só até uns 100 °C.',
    ],
    correias: [
      'Troque sempre o jogo completo de correias. Correia nova com velha divide mal a carga.',
      'Depois de 24 a 48 h de trabalho, confira a tensão de novo, porque a correia nova assenta.',
      'Correia chiando na partida geralmente é tensão baixa ou canal da polia gasto.',
      'Nas calculadoras, use o diâmetro primitivo das polias, não o externo.',
    ],
    selos: [
      'Selo mecânico nunca pode girar a seco, nem para testar o sentido de rotação!',
      'Selo cartucho vazando logo na partida? Veja se as travas de montagem foram retiradas.',
      'Antes de montar o selo, meça o batimento do eixo. Acima de 0,05 mm já é problema.',
      'O-ring de EPDM incha com óleo mineral. Use o lubrificante indicado pelo fabricante.',
    ],
    bombas: [
      'Barulho de pedrinhas dentro da bomba é cavitação. Confira o filtro e a válvula da sucção.',
      'Nunca regule a vazão fechando a válvula da sucção. Regule pela descarga.',
      'Confira o sentido de rotação com a bomba desacoplada, antes da primeira partida.',
      'Vai mudar a rotação com inversor? A calculadora de afinidade mostra a nova vazão e potência.',
    ],
    valvulas: [
      'Válvula gaveta é para abrir ou fechar totalmente. Usar para regular gasta a cunha.',
      'Retenção montada ao contrário acontece mais do que parece. Confira a seta do corpo.',
      'Na gaxeta da válvula, aperte a sobreposta por igual dos dois lados.',
    ],
    redutores: [
      'Óleo sintético PAG não pode misturar com óleo mineral. Confira a plaqueta do redutor.',
      'Respiro entupido faz o redutor vazar pelos retentores. Limpe na preventiva.',
      'A primeira troca de óleo de redutor novo é com 300 a 500 horas.',
    ],
    parafusos: [
      'Aperte flanges em cruz e em 3 etapas: 30%, 70% e 100% do torque.',
      'Broca do macho na rosca grossa: diâmetro menos o passo. M10 × 1,5 → 8,5 mm.',
      'Com pasta antiengripante, o mesmo torque estica mais o parafuso. Reduza o valor.',
    ],
    conversoes: [
      'Conta de cabeça: 1 bar ≈ 14,5 psi ≈ 1 kgf/cm².',
      '1 CV = 0,7355 kW e 1 HP = 0,7457 kW. São parecidos, mas não iguais!',
    ],
    notas: [
      'Coloque o número da OS: depois fica fácil achar na busca.',
      'Preencha seu nome e o WhatsApp do supervisor em ⚙️ e o relatório já sai pronto.',
      'No fim do dia, "📲 Relatório de hoje" manda todas as OS do dia numa mensagem só.',
      'As OS ficam só neste celular. Faça backup em ⚙️ de vez em quando.',
    ],
    geral: [
      'Toque em mim quando quiser uma dica. Se eu atrapalhar, é só me pôr para dormir. 💤',
      'A busca da tela inicial procura em todas as tabelas e nas suas OS.',
      'O app funciona sem internet. Pode usar lá no fundo da fábrica!',
    ],
  };

  const AVISOS_CALC = {
    correia: 'Abraçamento abaixo de 120° costuma patinar. Aumente a distância entre centros ou diminua a diferença entre as polias.',
    rpm: 'Acima de 30 m/s passa do limite das correias clássicas. Reveja o perfil ou o tamanho das polias.',
    distancia: 'Essa correia não fecha nessas polias. Confira se o comprimento é o primitivo (Ld), não o interno.',
  };

  const SVG = `<svg viewBox="0 0 60 76" class="m-svg" aria-hidden="true">
    <path d="M16 51 Q16 44 23 44 H37 Q44 44 44 51 V70 H33 V61 H27 V70 H16 Z" fill="#2f6fb5"/>
    <path d="M21 44 V56 M39 44 V56" stroke="#1f5189" stroke-width="2.4"/>
    <rect x="25" y="50" width="10" height="7" rx="1.5" fill="#1f5189"/>
    <rect x="14" y="68.5" width="14" height="6" rx="3" fill="#3b2a20"/>
    <rect x="32" y="68.5" width="14" height="6" rx="3" fill="#3b2a20"/>
    <path d="M17 50 L10 60" stroke="#2f6fb5" stroke-width="6" stroke-linecap="round"/>
    <circle cx="9.5" cy="61" r="3.2" fill="#f1c27d"/>
    <g class="m-braco">
      <path d="M43 50 L50 42" stroke="#2f6fb5" stroke-width="6" stroke-linecap="round"/>
      <rect x="49.3" y="24" width="3.4" height="17" rx="1.7" fill="#aab3bd"/>
      <circle cx="51" cy="22" r="4.6" fill="#aab3bd"/>
      <rect x="49.8" y="16.4" width="2.4" height="5.2" rx="1" class="m-furo"/>
      <circle cx="51" cy="41.5" r="3.4" fill="#f1c27d"/>
    </g>
    <g class="m-cabeca">
      <ellipse cx="17.5" cy="31" rx="2.2" ry="3.2" fill="#e0ac69"/>
      <ellipse cx="42.5" cy="31" rx="2.2" ry="3.2" fill="#e0ac69"/>
      <circle cx="30" cy="30" r="13" fill="#f1c27d"/>
      <g class="m-olhos">
        <ellipse cx="25" cy="29" rx="3" ry="3.4" fill="#fff"/>
        <ellipse cx="35" cy="29" rx="3" ry="3.4" fill="#fff"/>
        <g class="m-pupilas"><circle cx="25" cy="29.6" r="1.7" fill="#222"/><circle cx="35" cy="29.6" r="1.7" fill="#222"/></g>
      </g>
      <g class="m-fechados" stroke="#5a3a22" stroke-width="1.3" fill="none" stroke-linecap="round">
        <path d="M22 30 q3 2 6 0"/><path d="M32 30 q3 2 6 0"/>
      </g>
      <path d="M23 36 Q30 32 37 36 Q33 38.2 30 36.6 Q27 38.2 23 36 Z" fill="#5a3a22"/>
      <path class="m-boca" d="M26.5 39.2 Q30 42 33.5 39.2" stroke="#8a4b2a" stroke-width="1.4" fill="none" stroke-linecap="round"/>
      <path d="M16 26 Q16 12 30 12 Q44 12 44 26 Z" class="m-capacete"/>
      <rect x="28.4" y="12.6" width="3.2" height="12" fill="rgba(0,0,0,.14)"/>
      <rect x="13" y="24.5" width="34" height="3.6" rx="1.8" class="m-capacete"/>
    </g>
    <g class="m-zzz"><text x="44" y="12" font-size="9">z</text><text x="51" y="5" font-size="7">z</text></g>
  </svg>`;

  const PAUSA = 90e3;
  let root, balao, texto, boneco;
  let ativo = false;
  let contexto = 'geral';
  let ultimaFala = 0;
  let timers = {};
  const avisosDaSessao = new Set();

  const agora = () => Date.now();
  const hojeISO = () => new Date().toISOString().slice(0, 10);
  const modalAberto = () => !document.getElementById('modal')?.hidden;
  const later = (nome, ms, fn) => { clearTimeout(timers[nome]); timers[nome] = setTimeout(fn, ms); };

  function animar(classe, ms = 900) {
    if (!root) return;
    root.classList.remove(classe);
    void root.offsetWidth; // reinicia a animação
    root.classList.add(classe);
    later('anim-' + classe, ms, () => root?.classList.remove(classe));
  }

  function falar(msg, { forcar = false, humor = '' } = {}) {
    if (!ativo || !root) return false;
    if (mem.dormindo && !forcar) return false;
    if (!forcar && (agora() - ultimaFala < PAUSA || modalAberto())) return false;
    texto.textContent = msg;
    balao.className = 'm-balao ' + humor;
    balao.hidden = false;
    ultimaFala = agora();
    animar(humor === 'alerta' ? 'alerta' : 'acena');
    later('calar', Math.max(6000, msg.length * 75), calar);
    return true;
  }

  function calar() {
    if (balao) balao.hidden = true;
  }

  function dica(forcar) {
    const lista = DICAS[contexto] || DICAS.geral;
    let i = lista.findIndex((_, k) => !mem.vistas.includes(contexto + k));
    if (i < 0) {
      if (!forcar) return;
      // todas já vistas: volta a mostrar, mas sem repetir a última
      mem.vistas = mem.vistas.filter(v => !v.startsWith(contexto));
      i = (lista.indexOf(texto.textContent.replace(/^💡 /, '')) + 1) % lista.length;
    }
    if (falar('💡 ' + lista[i], { forcar })) {
      mem.vistas.push(contexto + i);
      guardar();
    }
  }

  function dormir() {
    mem.dormindo = true;
    guardar();
    calar();
    root.classList.add('dormindo');
  }

  function clicarBoneco() {
    if (mem.dormindo) {
      mem.dormindo = false;
      guardar();
      root.classList.remove('dormindo');
      falar('Opa, voltei! 👷 Toque em mim quando quiser uma dica.', { forcar: true });
    } else if (!balao.hidden) {
      calar();
    } else {
      dica(true);
    }
    animar('pula', 600);
  }

  // Os olhos e a cabeça acompanham onde a pessoa tocou
  function olhar(e) {
    if (!root || mem.dormindo || root.contains(e.target)) return;
    const r = boneco.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height * 0.4);
    const d = Math.hypot(dx, dy) || 1;
    root.style.setProperty('--ox', (dx / d * 1.6).toFixed(2) + 'px');
    root.style.setProperty('--oy', (dy / d * 1.4).toFixed(2) + 'px');
    root.style.setProperty('--tilt', Math.max(-9, Math.min(9, dx / 45)).toFixed(1) + 'deg');
    if (e.target.closest?.('tr, .card, .note-card')) animar('concorda', 500);
    later('olhar', 2500, () => {
      ['--ox', '--oy', '--tilt'].forEach(p => root?.style.removeProperty(p));
    });
  }

  function iniciar(ligado) {
    ativo = ligado;
    if (!ligado) { root?.remove(); root = null; return; }
    if (root) return;
    root = document.createElement('div');
    root.id = 'mascote';
    root.innerHTML = `<div class="m-balao" hidden role="status"><p></p>
      <div class="m-acoes"><button data-m="outra">💡 Outra dica</button><button data-m="dormir">💤 Dormir</button>
      <button data-m="fechar" aria-label="Fechar">✕</button></div></div>
      <button class="m-boneco" aria-label="Mecânico ajudante: toque para uma dica">${SVG}</button>`;
    document.body.appendChild(root);
    balao = root.querySelector('.m-balao');
    texto = balao.querySelector('p');
    boneco = root.querySelector('.m-boneco');
    root.classList.toggle('dormindo', !!mem.dormindo);
    boneco.onclick = clicarBoneco;
    balao.onclick = e => {
      const a = e.target.dataset.m;
      if (a === 'outra') dica(true);
      else if (a === 'dormir') dormir();
      else if (a === 'fechar') calar();
    };
    if (!iniciar.ouvindo) {
      document.addEventListener('pointerdown', olhar, { passive: true });
      iniciar.ouvindo = true;
    }
  }

  function saudacao() {
    const h = new Date().getHours();
    return h < 12 ? 'Bom dia! ☕' : h < 18 ? 'Boa tarde! 🔧' : 'Boa noite! 🌙';
  }

  function evento(tipo, info = {}) {
    if (!ativo || !root) return;
    switch (tipo) {
      case 'rota': {
        const novo = info.page === 's' ? info.id : info.page === 'notas' ? 'notas' : 'geral';
        if (novo !== contexto) calar();
        contexto = novo;
        // às vezes, ao entrar numa seção, comenta algo útil sobre ela
        if (info.page === 's' && Math.random() < 0.3) later('dica-secao', 3000, () => { if (contexto === novo) dica(false); });
        break;
      }
      case 'abertura': {
        const msgs = [];
        if (mem.dia !== hojeISO()) {
          mem.dia = hojeISO();
          guardar();
          msgs.push(saudacao());
          if (info.abertas) msgs.push(`Você tem ${info.abertas} OS em aberto.`);
        }
        if (info.notas >= 5 && info.diasSemBackup > 30 && Math.random() < 0.5) {
          msgs.push('Faz tempo que você não faz backup das OS. Toque em ⚙️ para exportar.');
        }
        if (msgs.length) later('abertura', 1500, () => falar(msgs.join(' '), { forcar: true }));
        break;
      }
      case 'calc-aviso':
        // espera a pessoa terminar de digitar e só avisa uma vez cada alerta
        later('calc', 1200, () => {
          const chave = info.calc + info.texto;
          if (avisosDaSessao.has(chave)) return;
          avisosDaSessao.add(chave);
          falar('⚠️ ' + (AVISOS_CALC[info.calc] || 'Olha o alerta no resultado!'), { forcar: true, humor: 'alerta' });
        });
        break;
      case 'nota-salva':
        if (!mem.dicaWhats) {
          mem.dicaWhats = true;
          guardar();
          later('nota', 600, () => falar('OS salva! 👍 Toque em 📲 para mandar o relatório no WhatsApp.', { forcar: true, humor: 'feliz' }));
        } else if (info.status === 'Concluída') {
          animar('pula', 600);
          if (Math.random() < 0.25) later('nota', 600, () => falar('Mais um serviço concluído! 💪', { humor: 'feliz' }));
        }
        break;
      case 'whatsapp':
        animar('pula', 600);
        break;
      case 'busca-vazia':
        if (!avisosDaSessao.has('busca')) {
          avisosDaSessao.add('busca');
          falar(`Não achei "${info}". Tente só uma parte, como "6205" em vez de "6205-2RS".`, { forcar: true });
        }
        break;
    }
  }

  return { iniciar, evento };
})();
