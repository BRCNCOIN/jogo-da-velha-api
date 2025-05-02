const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const salas = {};

io.on("connection", (socket) => {
  socket.on("entrarNaSala", ({ sala, senha, nome }) => {
    if (!salas[sala]) {
      salas[sala] = { jogadores: {}, senha, estado: Array(9).fill(""), turno: "X" };
    }

    if (salas[sala].senha && salas[sala].senha !== senha) {
      socket.emit("erro", "Senha incorreta");
      return;
    }

    const jogadores = Object.keys(salas[sala].jogadores);
    if (jogadores.length >= 2) {
      socket.emit("erro", "Sala cheia");
      return;
    }

    const simbolo = jogadores.length === 0 ? "X" : "O";
    salas[sala].jogadores[socket.id] = { nome, simbolo };
    socket.join(sala);

    io.to(sala).emit("jogadores", Object.values(salas[sala].jogadores));
    socket.emit("simbolo", simbolo);
    socket.emit("estado", salas[sala].estado);
  });

  socket.on("jogada", ({ sala, index }) => {
    const s = salas[sala];
    if (!s) return;

    const jogador = s.jogadores[socket.id];
    if (!jogador || s.estado[index] || s.turno !== jogador.simbolo) return;

    s.estado[index] = jogador.simbolo;
    s.turno = s.turno === "X" ? "O" : "X";
    io.to(sala).emit("estado", s.estado);
  });

  socket.on("disconnect", () => {
    for (const sala in salas) {
      if (salas[sala].jogadores[socket.id]) {
        delete salas[sala].jogadores[socket.id];
        io.to(sala).emit("jogadores", Object.values(salas[sala].jogadores));
        if (Object.keys(salas[sala].jogadores).length === 0) {
          delete salas[sala];
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("Servidor no ar na porta", PORT));
