const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:3000" },
});

const rooms = {}; // In-memory store

io.on("connection", (socket) => {
  socket.on("createRoom", ({ roomCode, username, question, option1, option2 }) => {
    if (!rooms[roomCode]) {
      rooms[roomCode] = {
        expirationTime: Date.now() + 60000, // 60 seconds from now
        users: new Set([username]),
        votes: { option1: 0, option2: 0 },
        votedUsers: new Set(),
        question,
        option1,
        option2,
      };
    }
    socket.join(roomCode);
    io.to(roomCode).emit("roomData", {
      question,
      option1,
      option2,
      votes: rooms[roomCode].votes,
      expirationTime: rooms[roomCode].expirationTime,
    });
  });

  socket.on("joinRoom", ({ roomCode, username }) => {
    const room = rooms[roomCode];
    if (room) {
      room.users.add(username);
      socket.join(roomCode);
      io.to(socket.id).emit("roomData", {
        question: room.question,
        option1: room.option1,
        option2: room.option2,
        votes: room.votes,
        expirationTime: room.expirationTime,
      });
    }
  });

  socket.on("castVote", ({ roomCode, option, username }) => {
    const room = rooms[roomCode];
    if (room && Date.now() < room.expirationTime && !room.votedUsers.has(username)) {
      room.votes[option]++;
      room.votedUsers.add(username);
      io.to(roomCode).emit("voteUpdate", room.votes);
    } else {
      socket.emit("votingClosed");
    }
  });
});

server.listen(4000, () => console.log("Server running on http://localhost:4000"));