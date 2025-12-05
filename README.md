📦 Widget “Ajustes ALPHA DC” – Documentação Oficial
🧩 Sobre o Widget

O Ajustes ALPHA DC é um widget personalizado para o Kommo (amoCRM) que permite criar, editar, salvar e organizar ajustes visuais e scripts personalizados diretamente dentro do painel de integrações do CRM.

Ele funciona como uma interface interna onde o usuário pode cadastrar:

CSS personalizado

Código JavaScript (JQuery)

Regras de ajustes

Configurações com persistência local

O widget foi projetado para ser simples, eficiente e totalmente integrado ao ambiente do Kommo.

📁 Estrutura de Arquivos do Widget

O widget é composto por 4 arquivos obrigatórios, todos incluídos no pacote final:

manifest.json
script.js
styles.css
index.html

📝 manifest.json

Arquivo de configuração do widget para o Kommo.
Define:

Nome

Descrição

Versão

Local onde será exibido (settings)

Templates (index.html)

Scripts e CSS a serem carregados

🧠 script.js

Contém toda a lógica do widget e segue o padrão oficial do Kommo:

Usa RequireJS com define(['jquery'], function(){ ... })

Implementa callbacks obrigatórios:

init

render

bind_actions

settings

dpSettings

Exponibiliza funções globais para funcionar com os onclick do HTML

Faz persistência dos ajustes via localStorage

🎨 styles.css

Estilos próprios do widget.
Inclui o visual original da interface e elementos de edição.

🖥 index.html

Interface do widget que aparece dentro do Kommo na área:

Configurações → Integrações → Ajustes ALPHA DC

Interface inclui:

Lista de ajustes

Botões de criar, editar e excluir

Editor de CSS e JS

Navegação entre telas

🧪 Funcionalidades Principais
✔ Criar novos ajustes

Permite cadastrar ajustes contendo:

Nome do ajuste

Código CSS

Código JavaScript (JQuery)

✔ Editar ajustes existentes

Atualização de qualquer campo salvo anteriormente.

✔ Excluir ajustes

Remove completamente o item da lista.

✔ Persistência automática

Todos os ajustes são salvos em:

localStorage.alpha_dc_adjusts


Isso significa que os dados são persistidos enquanto o widget estiver hospedado no mesmo domínio.

✔ Interface responsiva e intuitiva

O layout mantém o design original enviado pelo cliente.

✔ Compatível com Kommo via RequireJS

Toda a lógica está adaptada ao ambiente sandbox do Kommo.

📤 Como Hospedar o Widget

O widget pode ser hospedado em qualquer ambiente web estático (HTTPS obrigatório):

Opções recomendadas:

GitHub Pages (100% gratuito)

Vercel (grátis e rápido)

Netlify

Servidor próprio HTTPS

Na raiz do servidor devem existir exatamente estes arquivos:

/
|-- manifest.json
|-- script.js
|-- styles.css
|-- index.html

🛠 Como Instalar no Kommo (Passo a Passo)

Acesse Kommo → Configurações (⚙️) → Integrações → Widgets.

Clique em Instalar por URL.

Cole o link HTTPS direto para o manifest.json, por exemplo:

https://seu-dominio.com/manifest.json


ou

https://seu-usuario.github.io/seu-repositorio/manifest.json


Clique em Instalar.

Se tudo estiver correto, o widget aparecerá em:

Configurações → Integrações → Ajustes ALPHA DC

📘 Detalhes Técnicos
✔ Callbacks implementados:

init() – Chamado quando o widget é inicializado

render() – Carrega o template (index.html)

bind_actions() – Gerencia ações internas

settings() – Exibe configurações gerais

dpSettings() – (não utilizado, mas necessário segundo Kommo)

✔ Como o index.html é carregado

O arquivo é renderizado dentro do painel de integrações com:

this.render_template({ body: './index.html' });

✔ Execução de funções inline

O HTML possui funções inline como:

<button onclick="newAdjust()">Novo Ajuste</button>


Portanto, o script expõe funções globalmente via:

window.newAdjust = function(){ ... }

✔ Salvamento local

Os ajustes são salvos como JSON:

[
  {
    "name": "Ajuste 01",
    "css": "body { background: red; }",
    "js": "$('.btn').hide();"
  }
]

🧯 Solução de Problemas
❗ O widget não aparece no Kommo

Verifique se manifest.json está acessível via HTTPS

Verifique se não há redirect no domínio

Abra o Console do navegador (F12 → Console)

❗ Botões não funcionam

Verifique se script.js foi carregado

Abra Network e confirme que o Kommo buscou o arquivo

❗ Ajustes não salvam

Certifique-se de que o domínio da hospedagem não muda

Verifique se o navegador está permitindo localStorage

📄 Permissões Necessárias

Nenhuma permissão especial do Kommo é necessária.
O widget se limita ao ambiente de configurações.

☎ Suporte / Manutenção

Caso deseje:

Criar versão com backend

Sincronizar ajustes entre usuários

Criar regras de permissões reais

Aplicar CSS/JS no front do Kommo

Injetar scripts diretamente no CRM

Podemos evoluir o widget facilmente.
