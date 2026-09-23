# MecaNotas: app de mecânica industrial

App para Android e iPhone com tabelas, calculadoras e anotações de serviço. Funciona sem internet.

- **App:** https://robiinhor3-web.github.io/mecanotas/
- **Política de Privacidade:** https://robiinhor3-web.github.io/mecanotas/privacidade.html

## Como funciona

| Quem | O que pode fazer |
|---|---|
| **Usuários (celular)** | Consultar tabelas e calculadoras, buscar, criar **as próprias anotações de serviço** (ficam só no aparelho de cada um) |
| **Administrador (seu PC)** | Editar tudo: seções, tabelas, textos, calculadoras. Depois clicar em **Publicar** para todos receberem |

## Editar o app (somente no seu PC)

1. Dê dois cliques no atalho **"Editar MecaNotas"** da Área de Trabalho (ou no `EDITAR-APP.bat` desta pasta).
2. Vai abrir uma **janela preta** (deixe aberta) e o navegador com o app. No topo aparece a barra roxa **🔒 Editor do administrador**.
3. Toque no **✏️** para entrar no modo edição:
   - toque numa **linha** da tabela para alterar ou excluir;
   - **＋ Adicionar linha**, **＋ Tabela**, **＋ Texto**, **＋ Calculadora**;
   - na tela inicial, **＋ Nova seção** (uma aba nova, ex.: Acoplamentos);
   - ⬆ ⬇ mudam a ordem e 🗑 exclui;
   - nos textos, `**palavra**` fica em **negrito**.
   - em **✏️ Nome, ícone e foto** (dentro da seção), escolha uma **foto** para o ícone;
   - em ⚙️ → **🎨 Aparência do app**: nome do app, paleta de cores e mecânico ajudante.
4. Cada alteração é salva no PC na hora. Quando terminar, clique em **🚀 Publicar**.
5. Em 1 a 2 minutos o site é atualizado. Os celulares recebem a novidade quando abrirem o app (às vezes é preciso abrir duas vezes).
6. Feche a janela preta para encerrar o editor.

Por que ninguém mais consegue editar: o editor só funciona no seu computador,
e só a sua conta do GitHub (`robiinhor3-web`) tem permissão para publicar.

## Instalar no celular

- **Android (Chrome):** abra o link, toque em ⋮ e depois em **Instalar app**.
- **iPhone (Safari):** abra o link, toque em **Compartilhar** e depois em **Adicionar à Tela de Início**.

## Backup das anotações (usuários)

As anotações de serviço ficam só no aparelho. Em ⚙️ → **Exportar backup** gera um arquivo para guardar
ou para passar as anotações para outro celular (**Importar backup**).

## Arquivos

| Arquivo | Para que serve |
|---|---|
| `data.js` | **Conteúdo** do app (gerado pelo editor) |
| `app.js`, `index.html`, `style.css` | Funcionamento e visual |
| `admin-server.js`, `EDITAR-APP.bat` | Editor do administrador (só roda no PC) |
| `manifest.json`, `sw.js`, `icons/` | Instalação e funcionamento offline |
| `privacidade.html` | Política de Privacidade (exigida pelas lojas) |
