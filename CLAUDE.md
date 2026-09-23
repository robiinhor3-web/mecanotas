# MecaNotas: instruções para o Claude

App PWA (HTML/CSS/JS puro, sem build) para mecânicos industriais: tabelas técnicas, calculadoras,
ordens de serviço com envio para WhatsApp e um mecânico mascote.

- Site público: https://robiinhor3-web.github.io/mecanotas/ (GitHub Pages, branch `main`)
- Repositório: https://github.com/robiinhor3-web/mecanotas (`gh` logado como `robiinhor3-web`)

## Quem é o usuário
Mecânico industrial, não é programador. Fale **português simples**, passo a passo, sem jargão.
Explique o que mudou no app, e não no código.

## Arquitetura
- `data.js`: conteúdo (`DEFAULT_DATA`: settings + seções/blocos). **É gerado pelo editor**
  (`admin-server.js` → `formatData`). Não edite à mão sem manter o mesmo formato.
- `app.js`: telas, calculadoras (`CALCS`), OS (`NOTE_FIELDS`, `whatsReport`), temas (`THEMES`), ações (`ACTIONS`).
- `mascote.js`: mecânico ajudante (dicas em `DICAS`, alertas em `AVISOS_CALC`). Regra: falar pouco e só quando for útil.
- `admin-server.js` + `EDITAR-APP.bat`: editor que só roda no PC (127.0.0.1:8123) e libera ✏️, fotos, aparência e o botão Publicar.
- Celulares: conteúdo **somente leitura**. Cada aparelho guarda só as próprias OS (localStorage `mecanotas-notas-v1`) e preferências (`mecanotas-prefs`).
- `sw.js`: offline em modo network-first. Ao mudar a lista de arquivos, suba a versão do `CACHE`.

## Regras de trabalho
- **Nunca teste na porta 8123**: o usuário pode estar com o editor aberto.
  Copie o projeto para `%TEMP%` e rode `$env:PORT='8130'; node admin-server.js` na cópia.
  Para simular o site público, use `python -m http.server 8124` na cópia.
- Teste com o Edge headless (`--dump-dom` / `--screenshot`, janela com pelo menos 600 px de largura).
- Não apague nem sobrescreva `icons/secoes/*` nem `data.js` sem conferir. Podem ser edições do usuário ainda não publicadas.
- Para publicar código, faça commit **só dos arquivos que você mudou** (não use `git add -A`, que levaria edições
  do usuário ainda em andamento). Depois dê `git push` e confira o site no ar.
- Dados técnicos das tabelas são referência. Seja conservador e deixe claro quando for valor aproximado.
