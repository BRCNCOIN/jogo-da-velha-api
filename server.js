
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // Permitir todos os frontends
    methods: ["GET", "POST"]
  }
});

const rooms = {};

io.on("connection", (socket) => {
  console.log("🔌 Usuário conectado:", socket.id);

  socket.on("joinRoom", ({ roomId, name }) => {
    socket.join(roomId);
    socket.username = name;
    socket.roomId = roomId;

    if (!rooms[roomId]) {
      rooms[roomId] = [];
    }

    if (rooms[roomId].length < 2) {
      rooms[roomId].push(socket.id);
      io.to(roomId).emit("systemMessage", \`\${name} entrou na sala!\`);
    }

    // Início do jogo se dois jogadores
    if (rooms[roomId].length === 2) {
      io.to(roomId).emit("startGame");
    }
  });

  socket.on("chatMessage", ({ roomId, name, text }) => {
    io.to(roomId).emit("chatMessage", { name, text });
  });

  socket.on("play", (data) => {
    socket.to(socket.roomId).emit("play", data);
  });

  socket.on("disconnect", () => {
    const room = rooms[socket.roomId];
    if (room) {
      rooms[socket.roomId] = room.filter(id => id !== socket.id);
      io.to(socket.roomId).emit("systemMessage", \`\${socket.username} saiu da sala.\`);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log("🚀 Servidor rodando na porta", PORT));
