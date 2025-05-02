# Jogo da Velha - Servidor WebSocket

Servidor backend em Node.js com Socket.IO para o jogo da velha multiplayer com salas protegidas por senha.

## Como usar

1. Instale dependências:
```bash
npm install
```

2. Inicie o servidor:
```bash
npm start
```

O servidor estará ouvindo na porta `3000` ou na porta definida em `process.env.PORT`.

## Funcionalidades

- Criação de salas com senha
- Jogadas em tempo real via WebSocket
- Placar persistente por sala
- Reinício de partidas
