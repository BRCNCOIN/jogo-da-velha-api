const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const salas = {}; // Armazena estado, placar e senha por sala

io.on("connection", socket => {
  console.log("🟢 Novo cliente conectado");

  socket.on("entrar", ({ sala, nome, senha }) => {
    if (!salas[sala]) {
      salas[sala] = {
        estado: Array(9).fill(""),
        placar: { [nome]: 0 },
        senha,
        jogadores: []
      };
    } else {
      if (salas[sala].senha !== senha) {
        socket.emit("erro", "Senha incorreta");
        return;
      }
      if (!salas[sala].placar[nome]) salas[sala].placar[nome] = 0;
    }

    socket.join(sala);
    salas[sala].jogadores.push(nome);
    socket.data = { sala, nome };
    io.to(sala).emit("atualizar", {
      estado: salas[sala].estado,
      placar: salas[sala].placar
    });
  });

  socket.on("jogada", ({ index, simbolo }) => {
    const { sala } = socket.data;
    if (!sala || salas[sala].estado[index]) return;
    salas[sala].estado[index] = simbolo;
    io.to(sala).emit("atualizar", {
      estado: salas[sala].estado,
      placar: salas[sala].placar
    });
  });

  socket.on("vitoria", () => {
    const { sala, nome } = socket.data;
    if (!sala || !nome) return;
    salas[sala].placar[nome]++;
    io.to(sala).emit("atualizar", {
      estado: salas[sala].estado,
      placar: salas[sala].placar
    });
  });

  socket.on("reiniciar", () => {
    const { sala } = socket.data;
    if (!sala) return;
    salas[sala].estado = Array(9).fill("");
    io.to(sala).emit("atualizar", {
      estado: salas[sala].estado,
      placar: salas[sala].placar
    });
  });

  socket.on("disconnect", () => {
    console.log("🔴 Cliente desconectado");
  });
});

server.listen(process.env.PORT || 3000, () => {
  console.log("🚀 Servidor WebSocket rodando na porta 3000");
});
