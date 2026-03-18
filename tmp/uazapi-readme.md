# Content from https://unpkg.com/n8n-nodes-uazapi@1.0.4/README.md

\# n8n-nodes-uazapi

\[!\[NPM Version\](https://img.shields.io/npm/v/n8n-nodes-uazapi)\](https://www.npmjs.com/package/n8n-nodes-uazapi)
\[!\[License: MIT\](https://img.shields.io/badge/License-MIT-yellow.svg)\](https://opensource.org/licenses/MIT)
\[!\[Downloads\](https://img.shields.io/npm/dm/n8n-nodes-uazapi)\](https://www.npmjs.com/package/n8n-nodes-uazapi)
\[!\[GitHub Stars\](https://img.shields.io/github/stars/aifocusdev/n8n-nodes-uazapi?style=social)\](https://github.com/aifocusdev/n8n-nodes-uazapi)

\> \*\*Community node for n8n\*\* - Integração completa com UazAPI para automação WhatsApp

\*\*💝 Projeto Open Source Gratuito\*\* \| \[⭐ Dê uma Estrela\](#) \| \[💰 Apoie via PIX\](#-apoie-o-projeto)

\*\*Desenvolvido com ❤️ por \[AI Focus Company\](https://github.com/aifocusdev)\*\*

Este é um node da comunidade n8n que fornece integração completa com a \[UazAPI\](https://uazapi.com), permitindo automação avançada do WhatsApp Business com mais de 90 endpoints disponíveis.

\## 📋 Índice

\- \[Características\](#-características)
\- \[Instalação\](#-instalação)
\- \[Credenciais\](#-credenciais)
\- \[Operações Disponíveis\](#-operações-disponíveis)
\- \[Exemplos de Uso\](#-exemplos-de-uso)
\- \[Desenvolvimento\](#-desenvolvimento)
\- \[Contribuindo\](#-contribuindo)
\- \[Licença\](#-licença)

\## ✨ Características

\### 🖥️ \*\*Gerenciamento de Instâncias\*\*
\- Criar nova instância WhatsApp
\- Conectar ao WhatsApp (QR Code ou código de pareamento)
\- Verificar status da conexão
\- Desconectar e deletar instâncias
\- Listar todas as instâncias
\- Atualizar nome da instância

\### 💬 \*\*Mensagens\*\*
\- \*\*Texto:\*\* Envio simples com preview de links
\- \*\*Mídia:\*\* Imagens, vídeos, áudios, documentos, PTT, stickers
\- \*\*Contatos:\*\* Envio de vCard
\- \*\*Localização:\*\* Coordenadas geográficas
\- \*\*Menus Interativos:\*\* Botões, listas, enquetes
\- \*\*Stories/Status:\*\* Publicação de status
\- \*\*Ações:\*\* Reagir, editar, deletar, marcar como lida

\### 🚀 \*\*Campanhas em Massa\*\*
\- Disparo simples com mesma mensagem
\- Disparo avançado com personalização
\- Controle de campanhas (pausar, continuar, parar)
\- Delays aleatórios anti-ban
\- Agendamento de envios
\- Relatórios detalhados

\### 👥 \*\*Grupos WhatsApp\*\*
\- Criar e gerenciar grupos
\- Adicionar/remover participantes
\- Promover/rebaixar administradores
\- Atualizar nome e descrição
\- Gerenciar links de convite
\- Listar todos os grupos

\### 💬 \*\*Gestão de Chats\*\*
\- Arquivar/desarquivar conversas
\- Fixar chats importantes
\- Silenciar notificações
\- Deletar conversas
\- Marcar como lido
\- Buscar chats com filtros
\- Verificar números no WhatsApp

\### 📞 \*\*Contatos\*\*
\- Listar contatos da agenda
\- Adicionar novos contatos
\- Remover contatos
\- Obter detalhes completos

\### 🏷️ \*\*Etiquetas/Labels\*\*
\- Listar todas as etiquetas
\- Gerenciar etiquetas de chats
\- Editar etiquetas existentes

\### 🤖 \*\*Chatbot com IA\*\*
\- Configurar chatbot inteligente
\- Criar agentes de IA personalizados
\- Suporte a múltiplos provedores:
 \- \*\*OpenAI\*\* (GPT-4, GPT-4o-mini)
 \- \*\*Anthropic\*\* (Claude 3.5 Sonnet)
 \- \*\*Google\*\* (Gemini Pro)
 \- \*\*DeepSeek\*\*
\- Gerenciar base de conhecimento
\- Criar funções para APIs externas

\## 📦 Instalação

\### Via n8n Community Nodes (Recomendado)

1\. Acesse o n8n
2\. Vá em \*\*Settings\*\* → \*\*Community Nodes\*\*
3\. Clique em \*\*Install\*\*
4\. Digite: \`n8n-nodes-uazapi\`
5\. Clique em \*\*Install\*\*

\### Via NPM (Manual)

\`\`\`bash
npm install n8n-nodes-uazapi
\`\`\`

\### Via Docker

Adicione ao seu \`Dockerfile\`:

\`\`\`dockerfile
FROM n8nio/n8n

\# Instalar node da comunidade
RUN cd /usr/local/lib/node\_modules/n8n && \
 npm install n8n-nodes-uazapi
\`\`\`

\## 🔐 Credenciais

Para usar este node, você precisa configurar as credenciais da UazAPI:

\### 1\. Obter Credenciais

1\. Acesse \[seudominio.uazapi.com\](https://seudominio.uazapi.com)
2\. Crie uma conta ou faça login
3\. Obtenha seu \*\*Admin Token\*\*
4\. Ao criar uma instância, você receberá um \*\*Instance Token\*\*

\### 2\. Configurar no n8n

1\. No workflow, clique no node \*\*UazAPI\*\*
2\. Clique em \*\*Create New Credentials\*\*
3\. Preencha os campos:
 \- \*\*Base URL:\*\* \`https://seudominio.uazapi.com\` (padrão)
 \- \*\*Admin Token:\*\* Seu token de administrador (para criar/listar instâncias)
 \- \*\*Instance Token:\*\* Token da instância específica (opcional - para operações de mensagens)

\> \*\*💡 Dica:\*\* Você pode usar variáveis do n8n para gerenciar múltiplas instâncias:
\> \- Crie credenciais diferentes para cada instância
\> \- Use expressões para selecionar dinamicamente a credencial

\## 🎯 Operações Disponíveis

\### Instance (Instâncias)
\- ✅ Create - Criar nova instância
\- ✅ Connect - Conectar ao WhatsApp
\- ✅ Get Status - Verificar status
\- ✅ Disconnect - Desconectar
\- ✅ Delete - Deletar instância
\- ✅ List All - Listar todas
\- ✅ Update Name - Renomear instância

\### Message (Mensagens)
\- ✅ Send Text - Texto simples
\- ✅ Send Media - Imagem/vídeo/áudio/documento
\- ✅ Send Contact - Cartão vCard
\- ✅ Send Location - Localização GPS
\- ✅ Send Menu - Botões/listas/enquetes
\- ✅ Send Status - Story/Status
\- ✅ React to Message - Enviar emoji
\- ✅ Edit Message - Editar texto
\- ✅ Delete Message - Apagar para todos
\- ✅ Download Media - Baixar arquivo
\- ✅ Mark as Read - Marcar como lida

\### Campaign (Disparos em Massa)
\- ✅ Create Simple - Campanha básica
\- ✅ Create Advanced - Com personalização
\- ✅ Control Campaign - Pausar/continuar/parar
\- ✅ List Campaigns - Listar todas
\- ✅ List Messages - Mensagens da campanha
\- ✅ Clear Sent - Limpar antigas

\### Group (Grupos)
\- ✅ Create - Criar grupo
\- ✅ Get Info - Informações do grupo
\- ✅ List All - Listar grupos
\- ✅ Update Participants - Gerenciar membros
\- ✅ Update Name - Alterar nome
\- ✅ Update Description - Alterar descrição
\- ✅ Leave Group - Sair do grupo
\- ✅ Get Invite Link - Link de convite

\### Chat (Conversas)
\- ✅ Archive - Arquivar/desarquivar
\- ✅ Delete - Deletar chat
\- ✅ Mark as Read - Marcar como lido
\- ✅ Pin - Fixar/desafixar
\- ✅ Mute - Silenciar
\- ✅ Find - Buscar chats
\- ✅ Check Number - Verificar WhatsApp

\### Contact (Contatos)
\- ✅ List All - Listar contatos
\- ✅ Add - Adicionar contato
\- ✅ Remove - Remover contato
\- ✅ Get Details - Obter detalhes

\### Label (Etiquetas)
\- ✅ List All - Listar etiquetas
\- ✅ Manage Chat - Gerenciar por chat
\- ✅ Edit - Editar etiqueta

\### Chatbot (IA)
\- ✅ Update Settings - Configurar chatbot
\- ✅ Create Agent - Criar agente IA
\- ✅ List Agents - Listar agentes
\- ✅ Create Knowledge - Base de conhecimento
\- ✅ List Knowledge - Listar conhecimentos

\## 📖 Exemplos de Uso

\### Exemplo 1: Enviar Mensagem de Texto

\`\`\`javascript
// Configuração do node
Resource: Message
Operation: Send Text
Number: 5511999999999
Text: Olá! Esta é uma mensagem enviada via n8n + UazAPI
\`\`\`

\### Exemplo 2: Criar Campanha de Disparo

\`\`\`javascript
// Configuração do node
Resource: Campaign
Operation: Create Simple
Numbers: 5511999999999, 5511888888888, 5511777777777
Message Type: text
Message Text: Olá {{nome}}! Promoção especial para você!
Delay Min: 10
Delay Max: 30
\`\`\`

\### Exemplo 3: Criar Grupo e Adicionar Membros

\`\`\`javascript
// Node 1: Criar Grupo
Resource: Group
Operation: Create
Group Name: Meu Grupo Automático
Participants: 5511999999999, 5511888888888

// Node 2: Enviar Mensagem de Boas-vindas
Resource: Message
Operation: Send Text
Number: {{$node\["Criar Grupo"\].json\["groupJid"\]}}
Text: Bem-vindos ao grupo!
\`\`\`

\### Exemplo 4: Chatbot com IA (GPT-4)

\`\`\`javascript
// Node 1: Configurar Chatbot
Resource: Chatbot
Operation: Update Settings
OpenAI API Key: sk-...
Chatbot Enabled: true

// Node 2: Criar Agente
Resource: Chatbot
Operation: Create Agent
Agent Name: Atendente Virtual
AI Provider: openai
Model: gpt-4o-mini
System Prompt: Você é um assistente de atendimento amigável...
\`\`\`

\### Exemplo 5: Workflow Completo - Auto-Resposta

\`\`\`
Webhook Trigger (Recebe mensagem)
 ↓
IF (mensagem contém "oi" ou "olá")
 ↓
UazAPI - Send Text (Responde automaticamente)
 ↓
UazAPI - Mark as Read (Marca como lida)
\`\`\`

\### Exemplo 6: Disparos com CSV

\`\`\`
Read Binary File (CSV com contatos)
 ↓
Split In Batches (Lotes de 50)
 ↓
Loop Over Items (Para cada contato)
 ↓
UazAPI - Send Text (Personalizado)
 ↓
Wait (Delay aleatório 10-30s)
\`\`\`

\## 🛠️ Desenvolvimento

\### Requisitos

\- Node.js 18+
\- npm ou yarn
\- n8n instalado localmente

\### Setup do Projeto

\`\`\`bash
\# Clonar repositório
git clone https://github.com/seu-usuario/n8n-nodes-uazapi.git
cd n8n-nodes-uazapi

\# Instalar dependências
npm install

\# Build
npm run build

\# Linkar localmente para testes
npm link
cd ~/.n8n
npm link n8n-nodes-uazapi

\# Iniciar n8n
n8n start
\`\`\`

\### Scripts Disponíveis

\`\`\`bash
npm run build # Compilar TypeScript
npm run dev # Watch mode
npm run lint # Verificar código
npm run lintfix # Corrigir problemas
npm run format # Formatar código
npm test # Executar testes
\`\`\`

\### Estrutura do Projeto

\`\`\`
n8n-nodes-uazapi/
├── credentials/
│ └── UazApiApi.credentials.ts
├── nodes/
│ └── UazApi/
│ ├── UazApi.node.ts
│ └── uazapi.svg
├── package.json
├── tsconfig.json
├── gulpfile.js
└── README.md
\`\`\`

\## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1\. Fork o projeto
2\. Crie uma branch para sua feature (\`git checkout -b feature/MinhaFeature\`)
3\. Commit suas mudanças (\`git commit -m 'Adiciona MinhaFeature'\`)
4\. Push para a branch (\`git push origin feature/MinhaFeature\`)
5\. Abra um Pull Request

\### Diretrizes

\- Siga o estilo de código do projeto (ESLint + Prettier)
\- Adicione testes para novas funcionalidades
\- Atualize a documentação conforme necessário
\- Mantenha commits atômicos e descritivos

\## 🐛 Reportar Bugs

Encontrou um bug? Por favor, abra uma \[issue\](https://github.com/seu-usuario/n8n-nodes-uazapi/issues) com:

\- Descrição detalhada do problema
\- Passos para reproduzir
\- Versão do n8n e do node
\- Screenshots (se aplicável)

\## 📝 Changelog

\### v1.0.0 (2025-01-XX)

\*\*Adicionado:\*\*
\- ✨ Implementação inicial com 90+ endpoints
\- 🔐 Sistema de credenciais com admin token e instance token
\- 📱 Operações de instância (criar, conectar, status, deletar)
\- 💬 Envio de mensagens (texto, mídia, contato, localização)
\- 🚀 Sistema de campanhas em massa
\- 👥 Gerenciamento completo de grupos
\- 💬 Gestão de chats e conversas
\- 📞 Operações de contatos
\- 🏷️ Sistema de etiquetas
\- 🤖 Chatbot com IA (OpenAI, Claude, Gemini, DeepSeek)
\- 📚 Base de conhecimento para IA
\- 🎨 Interface visual intuitiva
\- 📖 Documentação completa

\## 🔗 Links Úteis

\- \[Documentação UazAPI\](https://docs.uazapi.com)
\- \[n8n Community Nodes\](https://docs.n8n.io/integrations/community-nodes/)
\- \[GitHub Repository\](https://github.com/seu-usuario/n8n-nodes-uazapi)
\- \[NPM Package\](https://www.npmjs.com/package/n8n-nodes-uazapi)

\## 💬 Suporte e Contato

\### 📧 Contato
\- \*\*Empresa:\*\* AI Focus Company
\- \*\*Desenvolvedor:\*\* Paulo Henrique
\- \*\*Email:\*\* aifocusdev@gmail.com
\- \*\*GitHub:\*\* \[@aifocusdev\](https://github.com/aifocusdev)

\### 🐛 Reportar Problemas
\- \*\*Issues:\*\* \[GitHub Issues\](https://github.com/aifocusdev/n8n-nodes-uazapi/issues)
\- \*\*Discussões:\*\* \[GitHub Discussions\](https://github.com/aifocusdev/n8n-nodes-uazapi/discussions)

\### 💡 Sugestões e Melhorias
Abra uma issue ou discussão no GitHub. Todas as contribuições são bem-vindas!

\-\-\-

\## 💰 Apoie o Projeto

Se este projeto foi útil para você ou sua empresa, considere apoiar o desenvolvimento!

\### ☕ Contribua via PIX

Sua contribuição ajuda a manter este projeto gratuito e open source!

\`\`\`
PIX (Celular): (99) 99229-1983
Favorecido: Paulo Henrique
Empresa: AI Focus Company
\`\`\`

\*\*Outras formas de apoiar:\*\*
\- ⭐ Dê uma estrela no GitHub
\- 🐛 Reporte bugs e sugira melhorias
\- 📝 Contribua com código
\- 📢 Compartilhe o projeto com outros desenvolvedores
\- 💬 Ajude outros usuários nas discussões

Toda contribuição, por menor que seja, faz diferença! 🙏

\-\-\-

\## 📜 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo \[LICENSE\](LICENSE) para detalhes.

\## 👏 Agradecimentos

\- Equipe \[n8n\](https://n8n.io) pela plataforma incrível
\- Equipe \[UazAPI\](https://uazapi.com) pela API robusta
\- Comunidade open source
\- A todos que contribuíram com doações e feedback

\-\-\-

\*\*Desenvolvido com ❤️ por \[AI Focus Company\](https://github.com/aifocusdev)\*\*

\*\*Paulo Henrique\*\* \| aifocusdev@gmail.com

Se este projeto foi útil, considere dar uma ⭐ no GitHub e contribuir via PIX!

\[!\[GitHub Stars\](https://img.shields.io/github/stars/aifocusdev/n8n-nodes-uazapi?style=social)\](https://github.com/aifocusdev/n8n-nodes-uazapi)
\[!\[NPM Version\](https://img.shields.io/npm/v/n8n-nodes-uazapi)\](https://www.npmjs.com/package/n8n-nodes-uazapi)
\[!\[License: MIT\](https://img.shields.io/badge/License-MIT-yellow.svg)\](https://opensource.org/licenses/MIT)