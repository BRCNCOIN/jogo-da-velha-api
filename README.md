# 🧠 Backend - Jogo da Velha Multiplayer

Este é o servidor WebSocket que permite partidas online em tempo real no Jogo da Velha Multiplayer.

## 🌐 Tecnologias usadas

- Node.js
- Express
- Socket.io
- Deploy gratuito via Render

## 🚀 Como executar localmente

1. Instale as dependências:

```bash
npm install
```

2. Inicie o servidor:

```bash
node server.js
```

Por padrão, o servidor roda na porta `3000`.  
Ajuste as permissões de CORS conforme necessário para permitir o acesso do frontend.

## ☁️ Deploy no Render

Para publicar este backend:

1. Crie um novo serviço **Web Service** em [Render](https://render.com/)
2. Conecte ao repositório deste projeto
3. Configure:

   - **Start command:** `node server.js`
   - **Environment:** Node
   - **Build command:** `npm install`
   - **Port:** 3000 (Render detecta automaticamente)
4. Ative **Auto Deploys** se desejar

## 🔐 Segurança

- As salas podem ser protegidas com senha
- Apenas dois jogadores podem entrar por sala
- Conexões inválidas ou duplicadas são rejeitadas

## 📁 Estrutura

- `server.js`: servidor principal com lógica de WebSocket
- `package.json`: configurações do Node.js e dependências
- `README.md`: este arquivo

---

💡 Projeto simples e funcional para suportar jogos multiplayer baseados em salas com autenticação básica.
