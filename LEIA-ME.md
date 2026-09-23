# MecaNotas: app de mecânica industrial

App para Android e iPhone com tabelas, calculadoras e anotações de serviço.
Funciona sem internet e é todo editável pelo celular.

## Arquivos

| Arquivo | Para que serve |
|---|---|
| `index.html` | Página principal |
| `app.js` | Funcionamento do app (telas, edição, calculadoras) |
| `data.js` | **Conteúdo inicial**: tabelas e textos que vêm de fábrica |
| `style.css` | Cores e visual |
| `manifest.json`, `sw.js`, `icons/` | Deixam o app instalável e funcionando offline |

## 1. Publicar na internet (grátis, uma vez só)

1. Crie uma conta em https://github.com
2. Clique em **New repository**, nome `mecanotas`, marque **Public** e depois **Create**.
3. Clique em **uploading an existing file** e arraste todos os arquivos desta pasta (incluindo a pasta `icons`). Clique em **Commit changes**.
4. Vá em **Settings → Pages**. Em *Branch*, escolha `main` e `/ (root)`, depois **Save**.
5. Em 1 ou 2 minutos o app estará em: `https://SEU-USUARIO.github.io/mecanotas/`

## 2. Instalar no celular

- **Android (Chrome):** abra o link, toque em ⋮ e depois em **Instalar app** (ou "Adicionar à tela inicial").
- **iPhone (Safari):** abra o link, toque em **Compartilhar** (quadrado com seta) e depois em **Adicionar à Tela de Início**.

Depois de aberto uma vez, funciona **sem internet**.

## 3. Editar o conteúdo pelo celular (dentro do app)

- Toque no **✏️** no topo para entrar no modo edição.
- Toque em uma **linha da tabela** para alterar ou excluir.
- **＋ Adicionar linha**, **＋ Tabela**, **＋ Texto**, **＋ Calculadora** e **Nova seção** (na tela inicial).
- ⬆ ⬇ mudam a ordem dos blocos e 🗑 exclui.
- Nos textos, `**palavra**` fica em **negrito**.

⚠️ **Os dados ficam salvos só no aparelho.** Use ⚙️ → **Exportar backup** com frequência
e guarde o arquivo no Drive ou no WhatsApp. O mesmo arquivo serve para passar tudo para outro celular (**Importar backup**).

## 4. Editar o código pelo celular (opcional)

No app do GitHub ou no navegador, abra o repositório, toque no arquivo (ex.: `style.css`)
e depois no lápis ✏️ para editar e em **Commit changes**. O site se atualiza sozinho em cerca de 1 minuto
e o app pega a nova versão na próxima vez que for aberto.

> Alterar o `data.js` muda o conteúdo **inicial**. Quem já usa o app continua com os próprios dados.
> Para receber as tabelas novas, use ⚙️ → "Restaurar seções padrão excluídas" ou "Voltar tabelas ao padrão".

## 5. Testar no computador

Na pasta do projeto: `python -m http.server 8000` e abra http://localhost:8000

## Próximos passos possíveis

- Fotos nas anotações de serviço
- Exportar anotações em PDF ou planilha
- Publicar na Play Store / App Store (usando Capacitor, com o mesmo código)
- Sincronizar entre aparelhos (nuvem)
