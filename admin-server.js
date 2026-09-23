// Editor do MecaNotas: roda SOMENTE no PC do administrador (abrir pelo EDITAR-APP.bat).
// Serve o app em http://localhost:8123 com o modo edição liberado,
// grava as alterações no data.js e publica no GitHub com o botão "Publicar".
// Só aceita conexões do próprio computador (127.0.0.1).

const http = require('http');
const fs = require('fs');
const path = require('path');
const { execFile } = require('child_process');

const PORT = Number(process.env.PORT) || 8123;
const ROOT = __dirname;
const DATA_FILE = path.join(ROOT, 'data.js');
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.md': 'text/plain; charset=utf-8',
  '.webp': 'image/webp', '.jpg': 'image/jpeg',
};

const HEADER = `// Conteúdo do app (seções, tabelas, textos e calculadoras).
// Este arquivo é gerado pelo editor do administrador (EDITAR-APP.bat).
// Valores são de referência: confira sempre o catálogo do fabricante.

`;

// JSON legível: listas simples (colunas e linhas das tabelas) ficam numa linha só
function formatData(data) {
  const json = JSON.stringify(data, null, 2)
    .replace(/\[\s+("(?:[^"\\]|\\.)*"(?:,\s+"(?:[^"\\]|\\.)*")*)\s+\]/g, (_, items) => '[' + items.replace(/",\s+"/g, '", "') + ']');
  return `${HEADER}const DEFAULT_DATA = ${json};\n`;
}

// Usa o Git do PATH ou, se não achar, o local padrão da instalação no Windows
const GIT = ['C:\\Program Files\\Git\\cmd\\git.exe', 'C:\\Program Files (x86)\\Git\\cmd\\git.exe'].find(p => fs.existsSync(p)) || 'git';

const IMG_DIR = path.join(ROOT, 'icons', 'secoes');

// Nome e cores do app instalado (tela inicial do celular) vêm do manifest.json e do index.html
function updateAppIdentity({ name, theme_color, background_color }) {
  const mPath = path.join(ROOT, 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(mPath, 'utf8'));
  Object.assign(manifest, { name, short_name: name, theme_color, background_color });
  fs.writeFileSync(mPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');

  const iPath = path.join(ROOT, 'index.html');
  const attr = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const html = fs.readFileSync(iPath, 'utf8')
    .replace(/<title>[^<]*<\/title>/, `<title>${attr(name)}</title>`)
    .replace(/(name="apple-mobile-web-app-title" content=")[^"]*/, `$1${attr(name)}`)
    .replace(/(name="theme-color" content=")[^"]*/, `$1${attr(theme_color)}`)
    .replace(/(<h1 id="title">)[^<]*/, `$1${attr(name)}`);
  fs.writeFileSync(iPath, html, 'utf8');
}

function git(args) {
  return new Promise(resolve => {
    execFile(GIT, args,{ cwd: ROOT, windowsHide: true }, (err, stdout, stderr) =>
      resolve({ ok: !err, out: (stdout + stderr).trim() }));
  });
}

function send(res, status, body, type = 'application/json; charset=utf-8') {
  res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
  res.end(typeof body === 'string' || Buffer.isBuffer(body) ? body : JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', c => { data += c; if (data.length > 20e6) reject(new Error('muito grande')); });
    req.on('end', () => resolve(data));
  });
}

async function api(req, res, url) {
  if (url === '/api/status' && req.method === 'GET') {
    const st = await git(['status', '--porcelain']);
    if (!st.ok) console.error('Erro no git:', st.out);
    return send(res, 200, { ok: true, pendentes: st.ok ? st.out.split('\n').filter(Boolean).length : 0 });
  }
  if (url === '/api/salvar' && req.method === 'POST') {
    const data = JSON.parse(await readBody(req));
    if (!Array.isArray(data.sections)) return send(res, 400, { ok: false, msg: 'formato inválido' });
    fs.writeFileSync(DATA_FILE, formatData({ version: data.version || 1, settings: data.settings, sections: data.sections }), 'utf8');
    if (data.manifest) updateAppIdentity(data.manifest);
    console.log(new Date().toLocaleTimeString('pt-BR'), 'alteração salva');
    return send(res, 200, { ok: true });
  }
  if (url === '/api/icone' && req.method === 'POST') {
    const body = JSON.parse(await readBody(req));
    const files = { i512: 'icon-512.png', i192: 'icon-192.png', i180: 'apple-touch-icon.png' };
    const decoded = {};
    for (const k of Object.keys(files)) {
      const m = /^data:image\/png;base64,(.+)$/.exec(body[k] || '');
      if (!m) return send(res, 400, { ok: false, msg: 'imagem inválida' });
      decoded[k] = Buffer.from(m[1], 'base64');
    }
    for (const k of Object.keys(files)) fs.writeFileSync(path.join(ROOT, 'icons', files[k]), decoded[k]);
    console.log(new Date().toLocaleTimeString('pt-BR'), 'ícone do app trocado');
    return send(res, 200, { ok: true });
  }
  if (url === '/api/imagem' && req.method === 'POST') {
    const { nome, data } = JSON.parse(await readBody(req));
    const m = /^data:image\/(webp|png|jpeg);base64,(.+)$/.exec(data || '');
    if (!m || !/^[\w-]{1,60}$/.test(nome || '')) return send(res, 400, { ok: false, msg: 'imagem inválida' });
    fs.mkdirSync(IMG_DIR, { recursive: true });
    const file = `${nome}.${m[1] === 'jpeg' ? 'jpg' : m[1]}`;
    fs.writeFileSync(path.join(IMG_DIR, file), Buffer.from(m[2], 'base64'));
    console.log(new Date().toLocaleTimeString('pt-BR'), 'foto salva:', file);
    return send(res, 200, { ok: true, path: `icons/secoes/${file}?v=${Date.now().toString(36)}` });
  }
  if (url === '/api/publicar' && req.method === 'POST') {
    await git(['add', '-A']);
    const stamp = new Date().toLocaleString('pt-BR');
    const commit = await git(['-c', 'user.name=MecaNotas', '-c', 'user.email=mecanotas@users.noreply.github.com',
      'commit', '-m', `Atualiza conteúdo (${stamp})`]);
    if (!commit.ok && !/nothing to commit|nada a submeter/i.test(commit.out)) return send(res, 200, { ok: false, msg: commit.out });
    const push = await git(['push']);
    console.log(stamp, push.ok ? 'PUBLICADO' : 'ERRO AO PUBLICAR\n' + push.out);
    return send(res, 200, { ok: push.ok, msg: push.out });
  }
  send(res, 404, { ok: false, msg: 'rota desconhecida' });
}

const server = http.createServer(async (req, res) => {
  // Bloqueia pedidos vindos de outros sites abertos no navegador
  const origin = req.headers.origin;
  if (origin && origin !== `http://localhost:${PORT}` && origin !== `http://127.0.0.1:${PORT}`) return send(res, 403, { ok: false });
  const url = decodeURIComponent(req.url.split('?')[0]);
  try {
    if (url.startsWith('/api/')) return await api(req, res, url);
    const file = path.normalize(path.join(ROOT, url === '/' ? 'index.html' : url));
    if (!file.startsWith(ROOT) || path.basename(file).startsWith('.')) return send(res, 403, 'proibido', 'text/plain');
    fs.readFile(file, (err, buf) => err
      ? send(res, 404, 'não encontrado', 'text/plain')
      : send(res, 200, buf, TYPES[path.extname(file)] || 'application/octet-stream'));
  } catch (e) {
    console.error(e);
    send(res, 500, { ok: false, msg: e.message });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log('==============================================');
  console.log('  EDITOR DO MECANOTAS ABERTO');
  console.log(`  http://localhost:${PORT}`);
  console.log('  Deixe esta janela aberta enquanto edita.');
  console.log('  Para fechar o editor, feche esta janela.');
  console.log('==============================================');
});
server.on('error', e => {
  if (e.code === 'EADDRINUSE') console.log('O editor já está aberto em outra janela. Use o navegador: http://localhost:' + PORT);
  else console.error(e);
});
